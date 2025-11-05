// backend/src/routes/user.routes.js
import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Update user profile details
router.put('/auth/profile', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { skills, experience_years, education, location } = req.body;

    if (skills) user.skills = skills;
    if (experience_years !== undefined) user.experience_years = experience_years;
    if (education) user.education = education;
    if (location) user.location = location;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
});

export default router;
