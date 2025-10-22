import departmentRepository from "../repositories/department.js";
import STATUS_CODES from "../middleware/statusCodes.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;
    await departmentRepository.create({ name, institutionId });
    const newDepartments = await departmentRepository.findAll();
    return res.status(STATUS_CODES.CREATED).json({
      message: "Department successfully created",
      data: newDepartments,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await departmentRepository.findAll();
    if (!departments) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: "No departments found" });
    }
    return res.status(STATUS_CODES.OK).json({
      data: departments,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentRepository.findById(id);
    if (!department) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No department with the id: ${id} found`,
      });
    }
    return res.status(STATUS_CODES.OK).json({
      data: department,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, institutionId } = req.body;
    let department = await departmentRepository.findById(id);
    if (!department) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No department with the id: ${id} found`,
      });
    }
    department = await departmentRepository.update(id, { name, institutionId });
    return res.status(STATUS_CODES.OK).json({
      message: `Department with the id: ${id} successfully updated`,
      data: department,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentRepository.findById(id);
    if (!department) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No department with the id: ${id} found`,
      });
    }
    await departmentRepository.delete(id);
    return res.status(STATUS_CODES.OK).json({
      message: `Department with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
