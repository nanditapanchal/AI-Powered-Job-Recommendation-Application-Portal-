import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// 🔒 Change Password (logged-in users)
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Fetch user WITH password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// 📨 Forgot Password (send reset link)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create JWT token valid for 15 min
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '15m' }
    );

    const encodedToken = encodeURIComponent(resetToken); // make URL-safe
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${encodedToken}`;

    // Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"JobRec App" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>Hi ${user.name},</p>
             <p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This link will expire in 15 minutes.</p>`
    });

    res.json({ message: 'Reset link sent to email' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🔑 Reset Password (using JWT token)
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(decodeURIComponent(token), process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(password, 10); // hash password
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token', error: err.message });
  }
};
