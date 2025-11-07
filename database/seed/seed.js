import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from /server folder
dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('❌ Please set MONGO_URI in environment.');
  process.exit(1);
}

// ✅ Define models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  skills: [String],
});
const User = mongoose.model('User', userSchema);

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  skills_required: [String],
  location: String,
  recruiter_id: mongoose.Schema.Types.ObjectId,
  status: String,
});
const Job = mongoose.model('Job', jobSchema);

// ✅ Main seeding function
async function run() {
  try {
    await mongoose.connect(MONGO);
    console.log('✅ Connected to MongoDB');

    const pass = await bcrypt.hash('password123', 10);

    // 🧑 Candidate
    let candidate = await User.findOne({ email: 'alice@example.com' });
    if (!candidate) {
      candidate = await User.create({
        name: 'Alice Candidate',
        email: 'alice@example.com',
        password: pass,
        role: 'candidate',
        skills: ['python', 'ml'],
      });
      console.log('🌱 Candidate added:', candidate.email);
    } else {
      console.log('✅ Candidate already exists:', candidate.email);
    }

    // 🧑‍💼 Recruiter
    let recruiter = await User.findOne({ email: 'acme.hr@example.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Acme Hiring',
        email: 'acme.hr@example.com',
        password: pass,
        role: 'recruiter',
      });
      console.log('🌱 Recruiter added:', recruiter.email);
    } else {
      console.log('✅ Recruiter already exists:', recruiter.email);
    }

    // 💼 Jobs
    const jobsData = [
      {
        title: 'Backend Developer',
        description: 'Python Django Developer required',
        skills_required: ['python', 'django'],
        location: 'Bengaluru',
        recruiter_id: recruiter._id,
        status: 'active',
      },
      {
        title: 'Frontend Developer',
        description: 'React Tailwind Developer required',
        skills_required: ['react', 'tailwind'],
        location: 'Remote',
        recruiter_id: recruiter._id,
        status: 'active',
      },
    ];

    for (const job of jobsData) {
      const existingJob = await Job.findOne({ title: job.title, recruiter_id: recruiter._id });
      if (!existingJob) {
        await Job.create(job);
        console.log('🌱 Added job:', job.title);
      } else {
        console.log('✅ Job already exists:', job.title);
      }
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
    process.exit(0);
  }
}

run();
