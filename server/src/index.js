import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import recommendRoutes from './routes/recommend.routes.js';
import recruiterRoutes from './routes/recruiter.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import applicationRoutes from './routes/application.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = [
  'https://ai-powered-job-recommendation-appli-five.vercel.app',
  'https://ai-powered-job-recommendation-application-portal-bkncd9kmt.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/recruiter/jobs', recruiterRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => res.json({ message: 'JobRec Server OK' }));

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('Missing MONGO_URI in env. Exiting.');
  process.exit(1);
}

mongoose.connect(MONGO)
  .then(() => app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`)))
  .catch(err => console.error('Mongo connect error', err));
