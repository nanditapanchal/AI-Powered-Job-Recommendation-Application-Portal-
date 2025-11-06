import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Briefcase, Mail, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ViewApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/jobs/candidates/${jobId}`);
        setApplicants(res.data);

        // Fetch job info (optional if not included in candidate data)
        const jobRes = await axios.get(`/jobs/my`);
        const job = jobRes.data.find(j => j._id === jobId);
        setJobTitle(job?.title || 'Job Details');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error loading applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 flex justify-between items-center bg-white shadow-sm border-b">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="text-blue-600" />
            {jobTitle} – Applicants
          </h2>
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg">
          No applicants yet for this job.
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map(app => (
            <motion.div
              key={app._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <User className="text-blue-600" size={28} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{app.user_id?.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Mail size={14} className="mr-1" />
                    {app.user_id?.email}
                  </div>
                </div>
              </div>

              <div className="text-gray-700 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-500" />
                  <span><b>Skills:</b> {app.user_id?.skills || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-green-500" />
                  <span><b>Experience:</b> {app.user_id?.experience_years || 0} years</span>
                </div>
              </div>

              <div className="mt-4 text-right">
                <button
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition"
                  onClick={() => toast.success(`Shortlisted ${app.user_id?.name}`)}
                >
                  Shortlist
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
