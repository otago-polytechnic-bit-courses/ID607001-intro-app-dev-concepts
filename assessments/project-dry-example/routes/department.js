import createRouter from "./base.js";

import {
  getDepartment,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.js";

import {
  validatePostDepartment,
  validatePutDepartment,
} from "../middlewares/validation.js";

const departmentController = {
  get: getDepartments,
  getById: getDepartment,
  create: createDepartment,
  update: updateDepartment,
  delete: deleteDepartment,
};

const departmentRouter = createRouter(
  departmentController,
  validatePostDepartment,
  validatePutDepartment
);

export default departmentRouter;
