import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ Get all jobs created by the logged-in recruiter
router.get('/myjobs', auth, async (req, res, next) => {
  try {
    const recruiterId = req.user.id;
    const jobs = await Job.find({ recruiter_id: recruiterId });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// ✅ Create a new job (recruiter only)
router.post('/jobs', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }

    const jobData = {
      ...req.body,
      recruiter_id: req.user.id, // auto-link recruiter
      status: 'active',
    };

    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// ✅ Get all applicants for a specific job
router.get('/candidates/:jobId', auth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // ✅ handle undefined recruiter_id safely
    if (!job.recruiter_id || job.recruiter_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applicants' });
    }

    const applicants = await Application
      .find({ job_id: req.params.jobId })
      .populate('user_id', 'name email skills experience_years');

    res.json(applicants);
  } catch (err) {
    next(err);
  }
});

export default router;
