import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Grid,
  User,
  Briefcase,
  FileText,
  LogOut,
  Edit2,
  CheckCircle,
  Send,
  Search,
  Sparkles,
} from 'lucide-react';

export default function CandidateDashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]); // <-- AI recommended jobs
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    experience_years: '',
    education: '',
    location: '',
  });

  const [applyModal, setApplyModal] = useState({ open: false, job: null });
  const [applyCover, setApplyCover] = useState('');
  const [applyFile, setApplyFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const profileRes = await axios.get('/auth/profile', authHeaders());
        setProfile(profileRes.data);
        setFormData({
          skills: (profileRes.data.skills || []).join(', '),
          experience_years: profileRes.data.experience_years || '',
          education: profileRes.data.education || '',
          location: profileRes.data.location || '',
        });

        // Load all jobs
        const jobsRes = await axios.get('/jobs', authHeaders());
        setJobs(jobsRes.data || []);
        setFilteredJobs(jobsRes.data || []);

        // Fetch applications
        await fetchApplications();

        // Fetch AI-based recommendations
        if (profileRes.data?._id) await fetchRecommendations(profileRes.data._id);
      } catch (err) {
        console.error('Failed to load data', err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/applications/my', authHeaders());
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  const fetchRecommendations = async (candidateId) => {
    try {
      const res = await axios.get(`/recommend/${candidateId}`, authHeaders());
      setRecommendedJobs(res.data || []);
      console.log('AI Recommendations:', res.data);
    } catch (err) {
      console.error('Failed to fetch AI recommendations', err);
      toast.error('Error fetching recommendations');
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchTerm(val);
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(val) ||
          job.company?.toLowerCase().includes(val) ||
          job.location?.toLowerCase().includes(val)
      )
    );
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()),
      };
      const res = await axios.put('/auth/profile', payload, authHeaders());
      setProfile(res.data.user || res.data);
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) return;
    const form = new FormData();
    form.append(type, file);
    const url = type === 'profile_pic' ? '/upload/profile-pic' : '/upload/resume';
    try {
      setUploading(true);
      const res = await axios.post(url, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setProfile((p) => ({ ...p, ...res.data }));
      toast.success('Uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const openApplyModal = (job) => setApplyModal({ open: true, job });
  const closeApplyModal = () => setApplyModal({ open: false, job: null });

  const applyToJob = async () => {
    if (!applyModal.job) return;
    const jobId = applyModal.job._id || applyModal.job.id;
    try {
      setUploading(true);
      const form = new FormData();
      if (applyFile) form.append('resume', applyFile);
      if (applyCover) form.append('cover_letter', applyCover);
      const res = await axios.post(`/applications/${jobId}`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Applied!');
      setApplications((prev) => [res.data, ...prev]);
      closeApplyModal();
    } catch (err) {
      toast.error('Apply failed');
    } finally {
      setUploading(false);
    }
  };

  const isApplied = (job) => {
    const jobId = job._id || job.id;
    return applications.some((app) => String(app.job_id?._id || app.job_id) === String(jobId));
  };

  if (loading) return <Loader />;

  const appliedCount = applications.length;
  const recommendedCount = filteredJobs.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block bg-white border-r">
          <div className="p-4">
            <h3 className="text-lg font-bold">Candidate</h3>
            <p className="text-sm text-gray-500 mt-1">{profile?.name}</p>
          </div>
          <nav className="p-4 space-y-2">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Grid },
              { key: 'profile', label: 'Profile', icon: User },
              { key: 'recommended', label: 'Jobs', icon: Briefcase },
              { key: 'ai', label: 'AI Recommended', icon: Sparkles }, // <-- New tab
              { key: 'applications', label: 'Applications', icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === item.key ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  <Icon className="w-5 h-5" /> {item.label}
                </button>
              );
            })}
            <button
              className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-100 text-red-600 mt-4"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Dashboard cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { title: 'Available Jobs', value: recommendedCount, icon: Briefcase, color: 'text-indigo-600' },
              { title: 'Applied', value: appliedCount, icon: Send, color: 'text-green-600' },
              {
                title: 'Profile Completeness',
                value: (() => {
                  const keys = ['skills', 'experience_years', 'education', 'location', 'profile_pic_url', 'resume_url'];
                  const filled = keys.reduce((acc, k) => acc + (profile?.[k] ? 1 : 0), 0);
                  return `${Math.round((filled / keys.length) * 100)}%`;
                })(),
                icon: User,
                color: 'text-yellow-600',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-xl shadow flex flex-col">
                  <span className="text-sm text-gray-500">{card.title}</span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{card.value}</h3>
                    <Icon className={card.color} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Existing Jobs Section */}
          {(activeTab === 'dashboard' || activeTab === 'recommended') && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Find Your Perfect Job</h2>
                <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, company, or location"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="ml-2 outline-none w-60 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length === 0 && <p>No jobs found.</p>}
                {filteredJobs.map((job) => {
                  const applied = isApplied(job);
                  return (
                    <motion.div
                      key={job._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-5 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-lg">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                        <p className="text-gray-700 mt-2 line-clamp-3">{job.description}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        {applied ? (
                          <span className="inline-flex items-center gap-2 text-green-700 font-medium">
                            <CheckCircle className="w-5 h-5" /> Applied
                          </span>
                        ) : (
                          <Button onClick={() => openApplyModal(job)}>Apply</Button>
                        )}
                        <button
                          className="text-sm text-gray-500 hover:underline"
                          onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
                        >
                          View
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {/* 🧠 AI Recommended Jobs Section */}
          {activeTab === 'ai' && (
            <>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="text-indigo-600" /> AI Recommended Jobs
              </h2>
              {recommendedJobs.length === 0 ? (
                <p>No AI recommendations available yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedJobs.map((rec, idx) => {
                    const job = rec.jobId || rec;
                    const applied = isApplied(job);
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl p-5 shadow-md flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-lg">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.location}</p>
                          <p className="text-gray-700 mt-2">
                            Skills: {(job.skills_required || []).join(', ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Similarity Score: {rec.similarity || '0.000'}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          {applied ? (
                            <span className="inline-flex items-center gap-2 text-green-700 font-medium">
                              <CheckCircle className="w-5 h-5" /> Applied
                            </span>
                          ) : (
                            <Button onClick={() => openApplyModal(job)}>Apply</Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Profile Section */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={profile?.profile_pic_url || '/default-avatar.png'}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{profile?.name}</h3>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                </div>
                <Button onClick={() => setEditing(!editing)}>
                  <Edit2 className="w-4 h-4 mr-2" /> {editing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
              {!editing ? (
                <>
                  <p><strong>Skills:</strong> {profile?.skills?.join(', ') || 'N/A'}</p>
                  <p><strong>Experience:</strong> {profile?.experience_years || 0} years</p>
                  <p><strong>Education:</strong> {profile?.education || 'N/A'}</p>
                  <p><strong>Location:</strong> {profile?.location || 'N/A'}</p>
                  {profile?.resume_url && (
                    <p className="mt-2">
                      <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        View Resume
                      </a>
                    </p>
                  )}
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Profile Picture</label>
                      <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                      <Button onClick={() => handleUpload(profilePic, 'profile_pic')}>Upload</Button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Resume</label>
                      <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} />
                      <Button onClick={() => handleUpload(resumeFile, 'resume')}>Upload</Button>
                    </div>
                  </div>
                </>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {['skills', 'experience_years', 'education', 'location'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium capitalize">{field.replace('_', ' ')}</label>
                      <input
                        type={field === 'experience_years' ? 'number' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}
                  <Button type="submit">Save</Button>
                </form>
              )}
            </div>
          )}

          {/* Applications Section */}
          {activeTab === 'applications' && (
            <>
              <h3 className="text-lg font-semibold mb-3">My Applications</h3>
              {applications.length === 0 ? (
                <p>No applications yet.</p>
              ) : (
                applications.map((app) => {
                  const job = app.job_id || {};
                  return (
                    <div
                      key={app._id}
                      className="bg-white p-4 rounded-xl shadow flex justify-between items-center mb-3"
                    >
                      <div>
                        <h4 className="font-bold">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <p className="text-xs text-gray-500">
                          Applied: {new Date(app.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          app.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {app.status || 'pending'}
                      </span>
                    </div>
                  );
                })
              )}
            </>
          )}
        </main>
      </div>

      {/* Apply Modal */}
      {applyModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-3">Apply for {applyModal.job?.title}</h3>
            <textarea
              className="w-full p-2 border rounded mb-3"
              rows="4"
              placeholder="Cover Letter (optional)"
              value={applyCover}
              onChange={(e) => setApplyCover(e.target.value)}
            />
            <input type="file" onChange={(e) => setApplyFile(e.target.files[0])} className="mb-3" />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={closeApplyModal}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={applyToJob}
                disabled={uploading}
              >
                {uploading ? 'Applying...' : 'Submit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
