import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

dotenv.config();
const router = express.Router();

// -------------------------------
// 🔧 Cloudinary Configuration
// -------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper — Upload file buffer to Cloudinary
async function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

// -------------------------------
// 📌 ROUTES
// -------------------------------

// ✅ GET all jobs (with optional search & filter)
router.get('/', async (req, res, next) => {
  try {
    const { search, location, type } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;

    const jobs = await Job.find(query).sort({ createdAt: -1 }).limit(200);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// ✅ GET job by ID
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// Get all applicants for a specific job
// backend/src/routes/job.routes.js
router.get('/candidates/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.recruiter_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job_id: req.params.jobId })
      .populate('user_id', 'name email profile_pic skills experience_years');

    const formattedApplicants = applications.map(app => ({
      _id: app._id,
      name: app.user_id.name,
      email: app.user_id.email,
      profilePic: app.user_id.profile_pic || null,
      resumeUrl: app.resume_url || null,
      skills: app.user_id.skills,
      experience_years: app.user_id.experience_years,
      status: app.status
    }));

    res.json(formattedApplicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch candidates', error: err.message });
  }
});

// ✅ GET jobs created by a recruiter
router.get('/recruiter/:id', async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter_id: req.params.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// ✅ Recruiter creates job
router.post('/', auth, async (req, res, next) => {
  try {
    const recruiterId = req.user.id; // recruiter authenticated
    const job = await Job.create({
      ...req.body,
      recruiter_id: recruiterId,
    });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// ✅ Candidate applies for a job (with resume upload)
router.post('/apply/:id', auth, upload.single('resume'), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Prevent duplicate applications
    const existing = await Application.findOne({ user_id: userId, job_id: jobId });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    let resumeResult = null;
    if (req.file) {
      resumeResult = await uploadToCloudinary(req.file.buffer, 'jobportal/resumes');
    }

    const application = await Application.create({
      user_id: userId,
      job_id: jobId,
      resume_url: resumeResult ? resumeResult.secure_url : null,
      resume_public_id: resumeResult ? resumeResult.public_id : null,
      status: 'Applied',
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
});

// ✅ Get applications of a candidate (for tracking)
router.get('/applications/me', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user_id: userId }).populate('job_id');
    res.json(applications);
  } catch (err) {
    next(err);
  }
});

// ✅ Get applications for a recruiter (to view who applied)
router.get('/applications/recruiter/:id', auth, async (req, res, next) => {
  try {
    const recruiterId = req.params.id;
    const jobs = await Job.find({ recruiter_id: recruiterId });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ job_id: { $in: jobIds } }).populate('user_id job_id');
    res.json(applications);
  } catch (err) {
    next(err);
  }
});

export default router;
