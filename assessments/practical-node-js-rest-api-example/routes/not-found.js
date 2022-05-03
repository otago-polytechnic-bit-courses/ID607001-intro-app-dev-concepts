import { Router } from "express";

const router = Router();

import { notFound } from "../controllers/not-found.js";

router.route("/").get(notFound);

export default router;
