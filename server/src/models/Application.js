import mongoose from 'mongoose';

const appSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  status: { 
  type: String, 
  enum: ['pending', 'applied', 'reviewing', 'accepted', 'rejected'], 
  default: 'pending' 
}
,
  resume_url: String,
  applied_on: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', appSchema);
export default Application;
