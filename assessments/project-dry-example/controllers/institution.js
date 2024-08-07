import {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
} from "./base.js";

const createInstitution = async (req, res) =>
  createResource(req, res, "institution");

const getInstitutions = async (req, res) =>
  getResources(req, res, "institution", { departments: true });

const getInstitution = async (req, res) => getResource(req, res, "institution");

const updateInstitution = async (req, res) =>
  updateResource(req, res, "institution");

const deleteInstitution = async (req, res) =>
  deleteResource(req, res, "institution");

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
