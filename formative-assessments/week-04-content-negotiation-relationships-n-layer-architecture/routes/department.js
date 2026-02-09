import express from "express";

import {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.js";

import { cacheMiddleware } from "../middleware/cache.js";

const router = express.Router();

const MAX_CACHE_DURATION = 5 * 60 * 1000;

router.post("/", createDepartment);
router.get("/", cacheMiddleware(MAX_CACHE_DURATION), getDepartments);
router.get("/:id", cacheMiddleware(MAX_CACHE_DURATION), getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
