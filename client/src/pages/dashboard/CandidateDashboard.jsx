import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Card from '../../components/Card';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

export default function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/jobs/recommended')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <Card key={job.id}>
            <h3 className="font-bold text-lg">{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
