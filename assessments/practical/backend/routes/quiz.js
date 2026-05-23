import express from "express";

import {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quiz.js";

import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

const router = express.Router();

router.post("/", jwtAuth, rbac("CREATOR"), createQuiz);
router.get("/", jwtAuth, getQuizzes);
router.get("/:id", jwtAuth, getQuiz);
router.put("/:id", jwtAuth, rbac("CREATOR"), updateQuiz);
router.delete("/:id", jwtAuth, rbac("CREATOR"), deleteQuiz);

export default router;
