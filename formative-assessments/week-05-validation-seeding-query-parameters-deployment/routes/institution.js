import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import { cacheMiddleware } from "../middleware/cache.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

const router = express.Router();

const MAX_CACHE_DURATION = 5 * 60 * 1000;

router.post("/", validatePostInstitution, createInstitution);
router.get("/", cacheMiddleware(MAX_CACHE_DURATION), getInstitutions);
router.get("/:id", cacheMiddleware(MAX_CACHE_DURATION), getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

// Note: You can chain the routes like this -
// router.route("/").post(createInstitution).get(getInstitutions);

export default router;
