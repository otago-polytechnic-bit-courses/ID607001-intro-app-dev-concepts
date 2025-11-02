import express from "express";
import { cacheMiddleware } from "../middleware/cache.js";

import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.js";

const router = express.Router();

const MAX_CACHE_DURATION = 5 * 60 * 1000;

router.post("/", createCourse);
router.get("/", cacheMiddleware(MAX_CACHE_DURATION), getCourses);
router.get("/:id", cacheMiddleware(MAX_CACHE_DURATION), getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

// Note: You can chain the routes like this -
// router.route("/").post(createCourse).get(getCourses);

export default router;
