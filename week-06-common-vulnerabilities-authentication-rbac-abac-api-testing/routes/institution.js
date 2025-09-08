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
import abac from "../middleware/abac.js";

const router = express.Router();

// router.post(
//   "/",
//   validatePostInstitution,
//   jwtAuth,
//   rbac("ADMIN"),
//   createInstitution
// );
router.post(
  "/",
  validatePostInstitution,
  jwtAuth,
  abac({ role: "ADMIN", department: "Information Technology Services" }),
  createInstitution
);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
