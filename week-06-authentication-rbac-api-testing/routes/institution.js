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

const router = express.Router();

router.post("/", jwtAuth, validatePostInstitution, createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", jwtAuth, validatePutInstitution, updateInstitution);
router.delete("/:id", jwtAuth, deleteInstitution);

export default router;
