import express from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: upload to Cloudinary folder
async function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

// ✅ Upload or update profile picture
router.post('/profile-pic', auth, upload.single('profile_pic'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old Cloudinary image if exists
    if (user.profile_pic_public_id) {
      await cloudinary.uploader.destroy(user.profile_pic_public_id);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'jobportal/profile_pics');
    user.profile_pic_url = result.secure_url;
    user.profile_pic_public_id = result.public_id;
    await user.save();

    res.json({ message: 'Profile picture uploaded', profile_pic_url: result.secure_url });
  } catch (err) {
    next(err);
  }
});

// ✅ Upload or update resume
router.post('/resume', auth, upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old resume if exists
    if (user.resume_public_id) {
      await cloudinary.uploader.destroy(user.resume_public_id);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'jobportal/resumes');
    user.resume_url = result.secure_url;
    user.resume_public_id = result.public_id;
    await user.save();

    res.json({ message: 'Resume uploaded', resume_url: result.secure_url });
  } catch (err) {
    next(err);
  }
});

// ✅ Update profile picture (PUT)
router.put('/profile-pic', auth, upload.single('profile_pic'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = await uploadToCloudinary(req.file.buffer, 'jobportal/profile_pics');
    user.profile_pic_url = result.secure_url;
    user.profile_pic_public_id = result.public_id;
    await user.save();

    res.json({ message: 'Profile picture updated', profile_pic_url: result.secure_url });
  } catch (err) {
    next(err);
  }
});

// ✅ Update resume (PUT)
router.put('/resume', auth, upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = await uploadToCloudinary(req.file.buffer, 'jobportal/resumes');
    user.resume_url = result.secure_url;
    user.resume_public_id = result.public_id;
    await user.save();

    res.json({ message: 'Resume updated', resume_url: result.secure_url });
  } catch (err) {
    next(err);
  }
});
export default router;