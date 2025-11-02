import express from "express";

import {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.js";

import { cacheMiddleware } from "../middleware/cache.js";

import {
  validatePostDepartment,
  validatePutDepartment,
} from "../middleware/validation/department.js";

const router = express.Router();

const MAX_CACHE_DURATION = 5 * 60 * 1000;

router.post("/", validatePostDepartment, createDepartment);
router.get("/", cacheMiddleware(MAX_CACHE_DURATION), getDepartments);
router.get("/:id", cacheMiddleware(MAX_CACHE_DURATION), getDepartment);
router.put("/:id", validatePutDepartment, updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
