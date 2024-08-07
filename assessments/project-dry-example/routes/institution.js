import createRouter from "./base.js";

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
} from "../middlewares/validation.js";

const institutionController = {
  get: getInstitutions,
  getById: getInstitution,
  create: createInstitution,
  update: updateInstitution,
  delete: deleteInstitution,
};

const institutionRouter = createRouter(
  institutionController,
  validatePostInstitution,
  validatePutInstitution
);

export default institutionRouter;
