import prisma from "../client.js";

import { validatePostDepartment } from "../../middleware/validation/department.js";

// Simulate an Express-like request and response for validation
const validateDepartment = (department) => {
  const req = { body: department };
  const validationError = null;
  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostDepartment(req, res, () => {}); // Pass an empty function since we are not using next()

  if (validationError) {
    throw new Error(validationError.message);
  }
};

export const seedDepartments = async () => {
  const startTime = Date.now();
  const errors = [];
  let count = 0;

  try {
    // Delete all existing departments
    await prisma.department.deleteMany();

    const institutionData = await prisma.institution.findMany();

    if (institutionData.length === 0) {
      throw new Error("No institutions found");
    }

    const departmentData = [
      {
        name: "Information Technology",
        institutionId: institutionData[0].id,
      },
      {
        name: "Nursing",
        institutionId: institutionData[1]?.id || institutionData[0].id,
      },
    ];

    const data = await Promise.all(
      departmentData.map(async (department) => {
        validateDepartment(department);
        return { ...department };
      })
    );

    await prisma.department.createMany({
      data: data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    count = result.count;
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  const time = ((Date.now() - startTime) / 1000).toFixed(1);

  return {
    resource: "Departments",
    count,
    time,
    errors,
  };
};
