import prisma from "../prisma/client.js";

const createInstitution = async (req, res) => {
  // Try/catch blocks are used to handle exceptions
  try {
    const { name, region, country } = req.body;
    // Create a new institution
    await prisma.institution.create({
      // Data to be inserted
      data: {
        name,
        region,
        country,
      },
    });

    // Get all institutions from the institution table
    const newInstitutions = await prisma.institution.findMany();

    // Send a JSON response
    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany();

    // Check if there are no institutions
    if (!institutions) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    // Check if there is no institution
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    return res.status(200).json({
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;
    // Find the institution by id
    let institution = await prisma.institution.findUnique({
      where: { id },
    });

    // Check if there is no institution
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${req.params.id} found`,
      });
    }

    // Update the institution
    institution = await prisma.institution.update({
      where: { id },
      data: {
        // Data to be updated
        name,
        region,
        country,
      },
    });

    return res.status(200).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    await prisma.institution.delete({
      where: { id },
    });

    return res.status(200).json({
      message: `Institution with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
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
