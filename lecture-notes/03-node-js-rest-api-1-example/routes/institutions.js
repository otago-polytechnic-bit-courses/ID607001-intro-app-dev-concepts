import { Router } from "express";
const router = Router(); // Create a new router object. This allows to handle various requests

// Importing the four functions
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institutions.js";

// Four routes that are mapped to the functions above
router.route("/").get(getInstitutions);
router.route("/").post(createInstitution);

router.route("/:id").put(updateInstitution);
router.route("/:id").delete(deleteInstitution);

// You can chain these if you wish. For example:
// router.route("/").get(getInstitution).post(createInstitution)
// router.route("/:id").put(updateInstitution).delete(deleteInstitution)

export default router; // You do not need to enclose router in curly braces
