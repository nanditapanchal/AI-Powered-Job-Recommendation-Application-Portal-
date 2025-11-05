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


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', userRoutes);
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
