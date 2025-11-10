import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
  Menu,
  X,
} from 'lucide-react';

export default function CandidateDashboard() {
  const navigate = useNavigate();
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

  // NEW: mobile sidebar toggle
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Sidebar items used by Sidebar component below
  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Grid },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'recommended', label: 'Jobs', icon: Briefcase },
    { key: 'ai', label: 'AI Recommended', icon: Sparkles },
    { key: 'applications', label: 'Applications', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      {/* Mobile top bar with menu */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
        <h2 className="text-lg font-bold">Candidate Dashboard</h2>
        <button onClick={() => setMenuOpen(true)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 hidden md:block bg-white border-r">
          <SidebarInline
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            items={sidebarItems}
          />
        </aside>

        {/* Mobile Sidebar (slide-in) */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-black md:hidden"
                onClick={() => setMenuOpen(false)}
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween' }}
                className="fixed inset-y-0 left-0 z-50 bg-white w-64 border-r shadow-lg md:hidden"
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-bold">Menu</h3>
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <SidebarInline
                  profile={profile}
                  activeTab={activeTab}
                  setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setMenuOpen(false); // auto-close on mobile selection
                  }}
                  onLogout={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  items={sidebarItems}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
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
  <p className="text-sm text-gray-600">
    {job.company_name || job.company} • {job.location}
  </p>

  {/* 💰 Salary Info */}
  {job.salary && (
    <p className="text-sm text-gray-700 mt-1">
      💰 <span className="font-medium">{job.salary}</span>
    </p>
  )}

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
                        {/* <button
  className="text-sm text-gray-500 hover:underline"
  onClick={() => navigate(`/jobs/${job._id}`)}
>
  View
</button> */}

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
  const { job, jobId, similarity } = rec;
  const applied = isApplied({ _id: jobId });

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
          Skills: {(job.skills_required || []).join(", ")}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Similarity Score: {similarity}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {applied ? (
          <span className="inline-flex items-center gap-2 text-green-700 font-medium">
            <CheckCircle className="w-5 h-5" /> Applied
          </span>
        ) : (
          <Button onClick={() => openApplyModal({ _id: jobId, ...job })}>
            Apply
          </Button>
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
              {/* Header */}
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

              {/* View Mode */}
              {!editing ? (
                <>
                  <p><strong>Skills:</strong> {profile?.skills?.join(', ') || 'N/A'}</p>
                  <p><strong>Experience:</strong> {profile?.experience_years || 0} years</p>
                  <p><strong>Education:</strong> {profile?.education || 'N/A'}</p>
                  <p><strong>Location:</strong> {profile?.location || 'N/A'}</p>

                  {profile?.resume_url && (
                    <p className="mt-2">
                      <a
                        href={profile.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
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
                /* Edit Mode */
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  {/* Skills with Tag Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Skills</label>
                    <div
                      className="flex flex-wrap items-center gap-2 p-2 border rounded min-h-[48px] cursor-text"
                      onClick={() => document.getElementById('skillsInput').focus()}
                    >
                      {formData.skills
                        .split(',')
                        .map((skill) => skill.trim())
                        .filter((s) => s)
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.skills
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter((s) => s && s !== skill);
                                setFormData({ ...formData, skills: updated.join(', ') });
                              }}
                              className="text-indigo-700 hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      <input
                        id="skillsInput"
                        type="text"
                        placeholder="Type a skill and press Enter"
                        className="flex-1 outline-none p-1 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const newSkill = e.target.value.trim();
                            if (newSkill) {
                              const skills = formData.skills
                                ? formData.skills.split(',').map((s) => s.trim())
                                : [];
                              if (!skills.includes(newSkill)) {
                                skills.push(newSkill);
                                setFormData({ ...formData, skills: skills.join(', ') });
                              }
                            }
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (years)</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                      className="w-full p-2 border rounded"
                      min="0"
                    />
                  </div>

                  {/* Education Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Education</label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Education</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Location Dropdown + Custom */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <select
                      name="location"
                      value={
                        ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Remote'].includes(formData.location)
                          ? formData.location
                          : 'Custom'
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'Custom') setFormData({ ...formData, location: '' });
                        else setFormData({ ...formData, location: value });
                      }}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Location</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Remote">Remote</option>
                      <option value="Custom">Other / Custom</option>
                    </select>

                    {/* Show custom input */}
                    {!(
                      ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Remote'].includes(formData.location)
                    ) && (
                      <input
                        type="text"
                        placeholder="Enter your location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-2 w-full p-2 border rounded"
                      />
                    )}
                  </div>

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

/* Inline Sidebar component (keeps everything in one file) */
function SidebarInline({ profile, activeTab, setActiveTab, onLogout, items = [] }) {
  return (
    <nav className="p-4 space-y-2">
      <div className="p-4">
        <h3 className="text-lg font-bold">Candidate</h3>
        <p className="text-sm text-gray-500 mt-1">{profile?.name}</p>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
              activeTab === item.key ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab(item.key)}
          >
            <Icon className="w-5 h-5" /> {item.label}
          </button>
        );
      })}
      <button
        className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-100 text-red-600 mt-4"
        onClick={onLogout}
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </nav>
  );
}
