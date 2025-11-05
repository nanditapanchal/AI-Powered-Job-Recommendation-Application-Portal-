import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Card from '../../components/Card';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get('/admin/users'), axios.get('/jobs')])
      .then(([userRes, jobRes]) => {
        setUsers(userRes.data);
        setJobs(jobRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <Card key={user.id}>
              <p className="font-semibold">{user.name}</p>
              <p>{user.email}</p>
              <p>{user.role}</p>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <Card key={job.id}>
              <h3 className="font-bold">{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
