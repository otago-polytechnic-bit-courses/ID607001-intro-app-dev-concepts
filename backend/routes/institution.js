import express from "express";
import { getInstitutions, getInstitution } from "../controllers/institution.js";

const router = express.Router();
router.get("/", getInstitutions);
router.get("/:id", getInstitution);

export default router;