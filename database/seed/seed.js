import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from /server folder
dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('❌ Please set MONGO_URI in environment.');
  process.exit(1);
}

// ✅ Define models on this same mongoose instance
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

// ✅ Main function
async function run() {
  try {
    await mongoose.connect(MONGO);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('🧹 Cleared old data');

    const pass = await bcrypt.hash('password123', 10);

    const candidate = await User.create({
      name: 'Alice Candidate',
      email: 'alice@example.com',
      password: pass,
      role: 'candidate',
      skills: ['python', 'ml'],
    });

    const recruiter = await User.create({
      name: 'Acme Hiring',
      email: 'acme.hr@example.com',
      password: pass,
      role: 'recruiter',
    });

    const jobs = [
      {
        title: 'Backend Developer',
        description: 'Python Django',
        skills_required: ['python', 'django'],
        location: 'Bengaluru',
        recruiter_id: recruiter._id,
        status: 'active',
      },
      {
        title: 'Frontend Developer',
        description: 'React Tailwind',
        skills_required: ['react', 'tailwind'],
        location: 'Remote',
        recruiter_id: recruiter._id,
        status: 'active',
      },
    ];

    await Job.insertMany(jobs);
    console.log('🌱 Seeded users and jobs successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
    process.exit(0);
  }
}

run();
