import apiCache from "apicache";
import { Router } from "express";

const cache = apiCache.middleware;
const router = Router();

import {
  getDepartment,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departments.js";

router.route("/:id").get(getDepartment, cache("2 minutes"));
router.route("/").get(getDepartments, cache("2 minutes"));
router.route("/").post(createDepartment);
router.route("/:id").put(updateDepartment);
router.route("/:id").delete(deleteDepartment);

export default router;
