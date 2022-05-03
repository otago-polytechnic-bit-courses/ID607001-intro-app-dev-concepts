import apiCache from "apicache";
import { Router } from "express";

const cache = apiCache.middleware;
const router = Router();

import {
  getInstitution,
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institutions.js";

router.route("/:id").get(getInstitution, cache("2 minutes"));
router.route("/").get(getInstitutions, cache("2 minutes"));
router.route("/").post(createInstitution);
router.route("/:id").put(updateInstitution);
router.route("/:id").delete(deleteInstitution);

export default router;
