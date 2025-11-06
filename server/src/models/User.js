import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false }, // excluded from queries by default

  role: { 
    type: String, 
    enum: ['candidate', 'recruiter', 'admin'], 
    default: 'candidate' 
  },

  // Optional profile details
  skills: [String],
  experience_years: Number,
  education: String,
  location: String,

  // ✅ Profile Picture (Cloudinary)
  profile_pic_url: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' // default avatar
  },
  profile_pic_public_id: String,

  // ✅ Resume (Cloudinary)
  resume_url: String,
  resume_public_id: String,

  // ✅ Admin controls
  isBlocked: {
    type: Boolean,
    default: false
  },

  // ✅ Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: { type: Date, default: Date.now },
});

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧩 Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔁 Generate password reset token
userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
