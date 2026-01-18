import express from "express";
import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMembersByTeam,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  getAllTeams,
} from "../controllers/teamController.js";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllTeamMembers);
router.get("/teams/list", getAllTeams);
router.get("/by-team/:team", getTeamMembersByTeam);
router.get("/:id", getTeamMemberById);

// Admin only routes
router.post("/", authMiddleware, adminMiddleware, createTeamMember);
router.put("/:id", authMiddleware, adminMiddleware, updateTeamMember);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTeamMember);

export default router;
