import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ Get all jobs created by the logged-in recruiter
router.get('/my', auth, async (req, res) => {
  try {
    const recruiterId = req.user.id;

    if (!recruiterId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user info' });
    }

    const jobs = await Job.find({ recruiter_id: recruiterId }).lean();

    const jobIds = jobs.map((job) => job._id);
    const applicationCounts = await Application.aggregate([
      { $match: { job_id: { $in: jobIds } } },
      { $group: { _id: '$job_id', count: { $sum: 1 } } }
    ]);

    const countsMap = Object.fromEntries(
      applicationCounts.map((a) => [a._id.toString(), a.count])
    );

    const jobsWithCounts = jobs.map((job) => ({
      ...job,
      applicantsCount: countsMap[job._id.toString()] || 0
    }));

    res.json(jobsWithCounts);
  } catch (err) {
    console.error('❌ Error fetching recruiter jobs:', err);
    res.status(500).json({ message: 'Failed to fetch recruiter jobs', error: err.message });
  }
});

// ✅ Get all applicants for a specific job
router.get('/candidates/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.recruiter_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applicants' });
    }

    const applicants = await Application
      .find({ job_id: req.params.jobId })
      .populate('user_id', 'name email skills experience_years');

    res.json(applicants);
  } catch (err) {
    console.error('❌ Error fetching candidates:', err);
    res.status(500).json({ message: 'Failed to fetch candidates', error: err.message });
  }
});

// ✅ Create a new job (recruiter only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }

    const jobData = {
      ...req.body,
      recruiter_id: req.user.id,
      status: 'active',
    };

    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    console.error('❌ Error creating job:', err);
    res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
});

// ✅ Delete a job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter_id.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this job' });

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting job:', err);
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
});

export default router;
