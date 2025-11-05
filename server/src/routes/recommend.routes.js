import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import auth from '../middleware/auth.js';

dotenv.config();
const router = express.Router();
// GET: Recommended jobs for candidate
router.get('/recommended', auth, async (req, res, next) => {
  try {
    const mlUrl = process.env.ML_API_URL || 'http://127.0.0.1:5000/recommend';

    // Send user info from req.user to ML API
    const resp = await axios.post(mlUrl, { userId: req.user.id }, { timeout: 10000 });

    res.json(resp.data); // expected: array of recommended jobs
  } catch (err) {
    console.error('❌ ML API request failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch recommended jobs' });
  }
});

// POST: Recommend jobs
router.post('/jobs', async (req, res, next) => {
  try {
    const mlUrl = process.env.ML_API_URL || 'http://127.0.0.1:5000/recommend';
    const resp = await axios.post(mlUrl, req.body, { timeout: 10000 });
    res.json(resp.data);
  } catch (err) {
    console.error('❌ ML API request failed:', err.message);
    res.status(500).json({ error: 'Failed to connect to ML API' });
  }
});

// Optional: Remove or disable GET /jobs unless your ML API supports GET
router.get('/jobs', (req, res) => {
  res.status(405).json({ message: 'Use POST /api/recommend/jobs instead.' });
});

export default router;
