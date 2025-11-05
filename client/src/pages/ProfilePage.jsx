import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    skills: '',
    experience_years: '',
    education: '',
    location: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProfile(res.data);
        setFormData({
          skills: res.data.skills.join(', '),
          experience_years: res.data.experience_years || '',
          education: res.data.education || '',
          location: res.data.location || ''
        });
      })
      .catch(err => toast.error('Failed to fetch profile'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      };
      const res = await axios.put('/profile', payload, {
  baseURL: 'http://localhost:5000/api',
  headers: { Authorization: `Bearer ${token}` }
});

      setProfile(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    const form = new FormData();
    form.append(type, file);
    try {
      const res = await axios.post(`/profile/${type}`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.message);
      setProfile(prev => ({ ...prev, [`${type}_url`]: res.data[`${type}_url`] }));
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to upload ${type}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="flex items-center mb-6">
        {profile?.profile_pic_url ? (
          <img src={profile.profile_pic_url} alt="Profile" className="w-24 h-24 rounded-full mr-4" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 mr-4" />
        )}
        <input type="file" accept="image/*" onChange={e => setProfilePic(e.target.files[0])} />
        <Button onClick={() => handleFileUpload(profilePic, 'profile_pic')}>Upload</Button>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Experience (years)</label>
          <input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Education</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <Button type="submit">Update Profile</Button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Resume</h3>
        {profile?.resume_url ? (
  <a
    href={`https://docs.google.com/viewer?url=${encodeURIComponent(profile.resume_url)}&embedded=true`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
  >
    View Resume
  </a>
) : <p>No resume uploaded</p>}
        <input type="file" onChange={e => setResume(e.target.files[0])} />
        <Button onClick={() => handleFileUpload(resume, 'resume')}>Upload Resume</Button>
      </div>
    </div>
  );
}
