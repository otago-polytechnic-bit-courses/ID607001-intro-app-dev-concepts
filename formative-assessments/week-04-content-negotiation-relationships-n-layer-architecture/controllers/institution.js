import institutionRepository from "../repositories/institution.js";
import STATUS_CODES from "../middleware/statusCodes.js";
import { clearCache } from "../middleware/cache.js";

const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;
    await institutionRepository.create({ name, region, country });
    const institutions = await institutionRepository.findAll();
    clearCache();
    return res.status(STATUS_CODES.CREATED).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll({
      departments: true,
    });
    if (!institutions) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "No institutions found" });
    }
    return res.status(STATUS_CODES.OK).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id, {
      departments: true,
    });
    if (!institution) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    return res.status(STATUS_CODES.OK).json({
      data: institution,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;
    let institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    institution = await institutionRepository.update(id, {
      name,
      region,
      country,
    });
    clearCache();
    return res.status(STATUS_CODES.OK).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    await institutionRepository.delete(id);
    clearCache();
    return res.status(STATUS_CODES.OK).json({
      message: `Institution with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
