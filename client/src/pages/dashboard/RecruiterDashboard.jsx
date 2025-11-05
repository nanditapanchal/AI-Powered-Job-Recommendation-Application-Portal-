import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Card from '../../components/Card';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    axios.get('/jobs/my')
      .then(res => setJobs(res.data))
      .catch(err => toast.error('Error fetching jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async () => {
    try {
      await axios.post('/jobs', { title: jobTitle, location: jobLocation });
      toast.success('Job posted successfully');
      setIsModalOpen(false);
      setJobTitle('');
      setJobLocation('');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to post job');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />

      <div className="p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Job Posts</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add New Job</Button>
      </div>

      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Job</h3>
            <input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={jobLocation}
              onChange={e => setJobLocation(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsModalOpen(false)} className="bg-red-500 hover:bg-red-600">Cancel</Button>
              <Button onClick={addJob}>Post</Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <Card key={job.id}>
            <h3 className="font-bold text-lg">{job.title}</h3>
            <p>{job.location}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
