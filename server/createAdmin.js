import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js'; // adjust path if needed

dotenv.config();

const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGO);
    console.log('✅ Connected to MongoDB');

    const email = 'nanditapanchalg@gmail.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️ Admin user already exists');
      return process.exit(0);
    }

    const password = '12345678';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: 'Nandita Panchal',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created:');
    console.log({ id: admin._id, email: admin.email, role: admin.role });
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
