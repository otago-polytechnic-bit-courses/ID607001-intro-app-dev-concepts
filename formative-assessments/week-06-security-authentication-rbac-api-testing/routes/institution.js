import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

import jwtAuth from "../middleware/jwtAuth.js";

import rbac from "../middleware/rbac.js";

import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/",
  validatePostInstitution,
  jwtAuth,
  rbac("ADMIN"),
  createInstitution
);
router.get("/", rateLimiter, getInstitutions);
router.get("/:id", rateLimiter, getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
