import {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
} from "./base.js";

const createDepartment = async (req, res) =>
  createResource(req, res, "department");

const getDepartments = async (req, res) => getResources(req, res, "department");

const getDepartment = async (req, res) => getResource(req, res, "department");

const updateDepartment = async (req, res) =>
  updateResource(req, res, "department");

const deleteDepartment = async (req, res) =>
  deleteResource(req, res, "department");

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
