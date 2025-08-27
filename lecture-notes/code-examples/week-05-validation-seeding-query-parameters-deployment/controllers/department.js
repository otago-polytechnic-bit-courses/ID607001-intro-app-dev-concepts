import departmentRepository from "../repositories/department.js";

const createDepartment = async (req, res) => {
  try {
    await departmentRepository.create(req.body);
    const newDepartments = await departmentRepository.findAll();
    return res.status(201).json({
      message: "Department successfully created",
      data: newDepartments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await departmentRepository.findAll();
    if (departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }
    return res.status(200).json({
      data: departments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const department = await departmentRepository.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${req.params.id} found`,
      });
    }
    return res.status(200).json({
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    let department = await departmentRepository.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${req.params.id} found`,
      });
    }
    department = await departmentRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Department with the id: ${req.params.id} successfully updated`,
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await departmentRepository.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${req.params.id} found`,
      });
    }
    await departmentRepository.delete(req.params.id);
    return res.status(200).json({
      message: `Department with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
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