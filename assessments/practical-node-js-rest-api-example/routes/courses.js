import apiCache from "apicache";
import { Router } from "express";

const cache = apiCache.middleware;
const router = Router();

import {
  getCourse,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.js";

router.route("/:id").get(getCourse, cache("2 minutes"));
router.route("/").get(getCourses, cache("2 minutes"));
router.route("/").post(createCourse);
router.route("/:id").put(updateCourse);
router.route("/:id").delete(deleteCourse);

export default router;
