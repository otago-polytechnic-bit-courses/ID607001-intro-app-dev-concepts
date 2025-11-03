import prisma from "../client.js";

import { validatePostCourse } from "../../middleware/validation/course.js";

// Simulate an Express-like request and response for validation
const validateCourse = (course) => {
  const req = { body: course };
  let validationError = null;
  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostCourse(req, res, () => {});

  if (validationError) {
    const errorMessage =
      typeof validationError === "object"
        ? JSON.stringify(validationError)
        : validationError;
    throw new Error(errorMessage);
  }
};

export const seedCourses = async () => {
  const startTime = Date.now();
  const errors = [];
  let count = 0;

  try {
    // Delete all existing courses
    await prisma.course.deleteMany();

    const departmentData = await prisma.department.findMany();

    if (departmentData.length === 0) {
      errors.push("No departments found");
      return {
        resource: "Courses",
        count,
        time: ((Date.now() - startTime) / 1000).toFixed(1),
        errors,
      };
    }

    const courseData = [
      {
        code: "ID510001",
        name: "Programming 1",
        description: "A course in the BIT at Otago Polytechnic",
        departmentId: departmentData[0].id,
      },
      {
        code: "ID511002",
        name: "Programming 2",
        description: "A course in the BIT at Otago Polytechnic",
        departmentId: departmentData[0].id,
      },
    ];

    const validatedData = [];
    for (const course of courseData) {
      try {
        validateCourse(course);
        validatedData.push(course);
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (validatedData.length > 0) {
      const result = await prisma.course.createMany({
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
    resource: "Courses",
    count,
    time,
    errors,
  };
};
