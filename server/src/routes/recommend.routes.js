import express from "express";
import { getRecommendations } from "../controllers/recommend.controller.js";

const router = express.Router();
router.get("/:id", getRecommendations);

export default router;
