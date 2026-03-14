import institutionService from "../services/institution.js";

const createInstitution = async (req, res) => {
  try {
    const institutions = await institutionService.createInstitution(req.body);
    return res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionService.getInstitutions();
    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
};

const getInstitution = async (req, res) => {
  try {
    const institution = await institutionService.getInstitution(req.params.id);
    return res.status(200).json({
      data: institution,
    });
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const institution = await institutionService.updateInstitution(
      req.params.id,
      req.body,
    );
    return res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    await institutionService.deleteInstitution(req.params.id);
    return res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(404).json({
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
