import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * ✅ Apply for a job (Candidate only)
 * POST /api/applications/:jobId
 */
router.post('/:jobId', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply for jobs' });
    }

    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existing = await Application.findOne({
      job_id: jobId,
      user_id: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job_id: jobId,
      user_id: req.user.id,
      status: 'pending',
      cover_letter: req.body.cover_letter || '',
      resume_url: req.body.resume_url || '',
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ✅ Get all jobs the logged-in user has applied for
 * GET /api/applications/my
 */
router.get('/my', auth, async (req, res, next) => {
  try {
    const applications = await Application
      .find({ user_id: req.user.id })
      .populate('job_id', 'title company location status');
    res.json(applications);
  } catch (err) {
    next(err);
  }
});

export default router;
