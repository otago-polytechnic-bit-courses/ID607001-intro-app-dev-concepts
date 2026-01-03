import prisma from "../prisma/db.js";

const createDepartment = async (req, res) => {
  // Try/catch blocks are used to handle exceptions
  try {
    const { name, institutionId } = req.body;
    // Create a new department
    await prisma.department.create({
      // Data to be inserted
      data: {
        name,
        institutionId,
      },
    });

    // Get all departments from the department table
    const newDepartments = await prisma.department.findMany();

    // Send a JSON response
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
    const departments = await prisma.department.findMany();

    // Check if there are no departments
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
    const department = await prisma.department.findUnique({
      where: { id },
    });

    // Check if there is no department
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
    // Find the department by id
    let department = await prisma.department.findUnique({
      where: { id },
    });

    // Check if there is no department
    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    // Update the department
    department = await prisma.department.update({
      where: { id },
      data: {
        // Data to be updated
        name,
        institutionId,
      },
    });

    return res.status(200).json({
      message: `Department with the id: ${id} successfully updated`,
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
    const { id } = req.params;
    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    await prisma.department.delete({
      where: { id },
    });

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
