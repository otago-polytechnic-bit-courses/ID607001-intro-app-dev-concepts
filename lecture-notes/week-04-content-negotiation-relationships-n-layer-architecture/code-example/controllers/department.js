import departmentRepository from "../repositories/department.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;
    const department = await departmentRepository.create({ name, institutionId });
    return res.status(201).json({
      message: "Department successfully created",
      data: department,
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
    if (!departments) {
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
    const { id } = req.params;
    const department = await departmentRepository.findById(id);
    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
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
    const { id } = req.params;
    const { name, institutionId } = req.body;
    let department = await departmentRepository.findById(id);
    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }
    const updatedDepartment = await departmentRepository.update(id, { name, institutionId });
    return res.status(200).json({
      message: `Department with the id: ${id} successfully updated`,
      data: updatedDepartment,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentRepository.findById(id);
    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }
    await departmentRepository.delete(id);
    return res.status(200).json({
      message: `Department with the id: ${id} successfully deleted`,
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
