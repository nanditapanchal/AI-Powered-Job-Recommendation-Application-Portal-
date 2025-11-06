import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Users, Plus, BarChart3, FileText } from 'lucide-react';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState({ total: 0, active: 0, applicants: 0 });

  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // -------------------------------
  // Fetch recruiter jobs
  // -------------------------------
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/recruiter/jobs/my');
      const data = res.data;

      // Compute analytics
      const total = data.length;
      const active = data.filter(j => j.status === 'active').length;
      const applicants = data.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
      setAnalytics({ total, active, applicants });

      setJobs(data);
    } catch (err) {
      toast.error('Failed to fetch jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // -------------------------------
  // Add a new job
  // -------------------------------
  const addJob = async () => {
    if (!jobTitle.trim() || !jobLocation.trim()) {
      toast.error('Please provide both title and location');
      return;
    }

    try {
      await axios.post('/jobs', { title: jobTitle, location: jobLocation });
      toast.success('Job posted successfully!');
      setIsModalOpen(false);
      setJobTitle('');
      setJobLocation('');
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to post job');
    }
  };

  // -------------------------------
  // View applicants for a job
  // -------------------------------
  const viewApplicants = async (job) => {
    setApplicantsLoading(true);
    try {
      const res = await axios.get(`/jobs/candidates/${job._id}`);
      const applicants = res.data;

      if (!applicants || applicants.length === 0) {
        toast('No applicants yet for this job.');
        setApplicantsLoading(false);
        return;
      }

      setSelectedJob({
  ...job,
  applications: applicants  // already contains name, email, profilePic, resumeUrl
});

      setIsApplicantsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch applicants');
    } finally {
      setApplicantsLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="text-blue-600" /> My Job Posts
        </h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={18} /> Add Job
        </Button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-5 rounded-xl shadow-sm border flex flex-col items-center"
        >
          <BarChart3 className="text-blue-500 mb-2" size={26} />
          <h4 className="text-gray-500">Total Jobs</h4>
          <p className="text-2xl font-bold text-gray-800">{analytics.total}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-5 rounded-xl shadow-sm border flex flex-col items-center"
        >
          <Briefcase className="text-green-500 mb-2" size={26} />
          <h4 className="text-gray-500">Active Jobs</h4>
          <p className="text-2xl font-bold text-gray-800">{analytics.active}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-5 rounded-xl shadow-sm border flex flex-col items-center cursor-pointer"
          onClick={() => toast('Click on a job to view applicants')}
        >
          <Users className="text-purple-500 mb-2" size={26} />
          <h4 className="text-gray-500">Total Applicants</h4>
          <p className="text-2xl font-bold text-gray-800">{analytics.applicants}</p>
        </motion.div>
      </div>

      {/* Jobs List */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No jobs posted yet. Add one now!
          </div>
        ) : (
          jobs.map(job => (
            <motion.div
              key={job._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => viewApplicants(job)}
            >
              <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin size={16} className="mr-1" />
                <span>{job.location || 'N/A'}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>Status: <b className={job.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                  {job.status || 'unknown'}
                </b></span>
                <span>{job.applicantsCount || 0} Applicants</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Job Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Add a New Job</h3>
            <input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Location"
              value={jobLocation}
              onChange={e => setJobLocation(e.target.value)}
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </Button>
              <Button onClick={addJob} className="bg-blue-600 hover:bg-blue-700 text-white">
                Post
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Applicants Modal */}
{isApplicantsModalOpen && selectedJob && (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4"
  >
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
      <h3 className="text-xl font-bold mb-4">{selectedJob.title} - Applicants</h3>

      {applicantsLoading ? (
        <Loader />
      ) : selectedJob.applications.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {selectedJob.applications.map(app => {
            const ext = app.resumeUrl?.split('.').pop().toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png'].includes(ext);
            const isPDF = ext === 'pdf';

            return (
              <div
                key={app._id}
                className="border p-3 rounded-lg flex justify-between items-center hover:shadow-md transition"
              >
                {/* Profile Pic + Name + Email */}
                <div className="flex items-center gap-3">
                  {app.profilePic ? (
                    <img
                      src={app.profilePic}
                      alt={app.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      {app.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{app.name}</p>
                    <p className="text-gray-500 text-sm">{app.email}</p>
                  </div>
                </div>

                {/* Resume Buttons */}
                {app.resumeUrl ? (
                  <div className="flex items-center gap-3">
                    {/* View Resume */}
                    {isPDF && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <FileText size={16} /> View PDF
                      </a>
                    )}
                    {isImage && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-600 hover:underline"
                      >
                        <FileText size={16} /> View Image
                      </a>
                    )}
                    {!isPDF && !isImage && (
                      <span className="text-gray-500 text-sm">
                        <a
                          href={app.resumeUrl}
                          download
                          className="text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      </span>
                    )}

                    {/* Download button always available */}
                    <a
                      href={app.resumeUrl}
                      download={`${app.name}-resume.${ext}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No Resume</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          onClick={() => setIsApplicantsModalOpen(false)}
          className="bg-gray-300 hover:bg-gray-400 text-black"
        >
          Close
        </Button>
      </div>
    </div>
  </motion.div>
)}

    </div>
  );
}
