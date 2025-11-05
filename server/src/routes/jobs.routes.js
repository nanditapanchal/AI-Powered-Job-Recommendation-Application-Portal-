import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file buffer to Cloudinary
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

// Get all jobs
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find().limit(200);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// Get job by ID
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// Apply to a job — Upload resume to Cloudinary
router.post('/apply/:id', auth, upload.single('resume'), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    let resumeResult = null;
    if (req.file) {
      resumeResult = await uploadToCloudinary(req.file.buffer, 'jobportal/resumes');
    }

    const application = await Application.create({
      user_id: userId,
      job_id: jobId,
      resume_url: resumeResult ? resumeResult.secure_url : null,
      resume_public_id: resumeResult ? resumeResult.public_id : null
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
});

// Recruiter creates job
router.post('/', async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

export default router;
