import User from "../models/User.js";
import Job from "../models/Job.js";
import { recommendJobs } from "../recommend/recommendEngine.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.id;
    const candidate = await User.findById(userId);

    if (!candidate) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobs = await Job.find({ status: "active" }).lean(); // ensure plain JSON

    if (!jobs.length) {
      return res.status(404).json({ message: "No active jobs found" });
    }

    const recommended = recommendJobs(candidate, jobs);

    // ✅ include jobId explicitly
    const formatted = recommended.map(r => ({
      jobId: r.job._id, // <-- crucial for frontend
      job: {
        _id: r.job._id,
        title: r.job.title,
        company_name: r.job.company_name,
        location: r.job.location,
        skills_required: r.job.skills_required,
        description: r.job.description,
      },
      similarity: r.score.toFixed(3)
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error in recommendation:", err);
    res
      .status(500)
      .json({ message: "Error generating recommendations", error: err.message });
  }
};
