import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CandidateDashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    skills: '',
    experience_years: '',
    education: '',
    location: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);

  // Fetch profile & recommended jobs
  useEffect(() => {
    const fetchProfileAndJobs = async () => {
      try {
        // Fetch profile
        const profileRes = await axios.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);
        setFormData({
          skills: profileRes.data.skills?.join(', ') || '',
          experience_years: profileRes.data.experience_years || '',
          education: profileRes.data.education || '',
          location: profileRes.data.location || ''
        });

        // Fetch recommended jobs
        const jobsRes = await axios.post('/recommend/jobs', {}, {
  headers: { Authorization: `Bearer ${token}` }
});
const recommended = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.recommended_jobs || [];
setJobs(recommended);

      } catch (err) {
        toast.error('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndJobs();
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
      // Ensure backend has this route: PUT /auth/profile
      const res = await axios.put('/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      console.error(err);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const form = new FormData();
    form.append(type === 'profile_pic' ? 'profile_pic' : 'resume', file);

    const urlMap = {
      profile_pic: '/upload/profile-pic',
      resume: '/upload/resume'
    };

    try {
      const res = await axios.post(urlMap[type], form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      setProfile(prev => ({
        ...prev,
        [`${type}_url`]: res.data[`${type}_url`]
      }));

      toast.success(`${type.replace('_', ' ')} uploaded!`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to upload ${type}`);
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start bg-white rounded-2xl p-6 shadow-md mb-6">
          <img
            src={profile?.profile_pic_url || '/default-avatar.png'}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6"
          />

          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <Button onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
            <p className="text-gray-600 mb-2">{profile?.role}</p>

            {!editing ? (
              <>
                <p className="mb-1"><span className="font-semibold">Skills:</span> {profile?.skills?.join(', ') || 'N/A'}</p>
                <p className="mb-1"><span className="font-semibold">Experience:</span> {profile?.experience_years || 0} years</p>
                <p className="mb-1"><span className="font-semibold">Education:</span> {profile?.education || 'N/A'}</p>
                <p className="mb-1"><span className="font-semibold">Location:</span> {profile?.location || 'N/A'}</p>
              </>
            ) : (
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
                <Button type="submit">Save Changes</Button>
              </form>
            )}

            {/* Resume */}
            <div className="mt-4">
              {profile?.resume_url ? (
                <a
                  href={`${profile.resume_url}?fl=render`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              ) : <p>No resume uploaded</p>}
              <input
                type="file"
                className="mt-2"
                onChange={e => setResume(e.target.files[0])}
              />
              <Button onClick={() => handleFileUpload(resume, 'resume')}>Upload Resume</Button>
            </div>

            {/* Profile Pic Upload */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={e => setProfilePic(e.target.files[0])}
              />
              <Button onClick={() => handleFileUpload(profilePic, 'profile_pic')}>Upload Profile Pic</Button>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <h3 className="text-xl font-bold mb-4">Recommended Jobs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 && <p>No job recommendations available.</p>}
          {jobs.map(job => (
            <motion.div
              key={job.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl p-5 shadow-md"
            >
              <h4 className="font-bold text-lg mb-1">{job.title}</h4>
              <p className="text-gray-600 mb-1">{job.company}</p>
              <p className="text-gray-600 mb-2">{job.location}</p>
              <Button>Apply Now</Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
