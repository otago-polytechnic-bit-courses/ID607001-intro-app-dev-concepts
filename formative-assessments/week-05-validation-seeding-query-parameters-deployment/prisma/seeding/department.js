import prisma from "../client.js";

import { validatePostDepartment } from "../../middleware/validation/department.js";

// Simulate an Express-like request and response for validation
const validateDepartment = (department) => {
  const req = { body: department };
  let validationError = null;
  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostDepartment(req, res, () => {});

  if (validationError) {
    const errorMessage = typeof validationError === 'object' 
      ? JSON.stringify(validationError) 
      : validationError;
    throw new Error(errorMessage);
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
      errors.push("No institutions found");
      return {
        resource: "Departments",
        count,
        time: ((Date.now() - startTime) / 1000).toFixed(1),
        errors,
      };
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

    const validatedData = [];
    for (const department of departmentData) {
      try {
        validateDepartment(department);
        validatedData.push(department);
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (validatedData.length > 0) {
      const result = await prisma.department.createMany({
        data: validatedData,
        skipDuplicates: true,
      });
      count = result.count;
    }
  } catch (err) {
    errors.push(err.message);
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