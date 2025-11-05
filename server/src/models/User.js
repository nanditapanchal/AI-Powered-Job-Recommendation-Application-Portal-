import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate' },
  skills: [String],
  experience_years: Number,
  education: String,
  location: String,

  // ✅ Cloudinary URLs & public IDs
  resume_url: String,
  resume_public_id: String,
  profile_pic_url: String,
  profile_pic_public_id: String,

  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;
