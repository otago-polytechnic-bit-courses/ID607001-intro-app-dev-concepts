import express from "express";

import {
  getInstitution,
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation.js";

const router = express.Router();

router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.post("/", validatePostInstitution, createInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
