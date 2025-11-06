import express from 'express';
import User from '../models/User.js';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * ✅ Get all users (Admin only)
 */
router.get('/users', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * ✅ Get all jobs (Admin can see all)
 */
router.get('/jobs', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

/**
 * ✅ Approve or Reject a Job
 */
router.put('/jobs/:id/status', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    const { status } = req.body; // "approved" or "rejected"
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// ✅ Block/Unblock User
router.put('/users/:id/block', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied: Admins only' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked; // toggle block
    await user.save();

    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (err) {
    next(err);
  }
});

// ✅ Delete User
router.delete('/users/:id', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied: Admins only' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});


export default router;
