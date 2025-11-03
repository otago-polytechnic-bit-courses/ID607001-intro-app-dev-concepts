import prisma from "../client.js";

import { validatePostCourse } from "../../middleware/validation/course.js";

// Simulate an Express-like request and response for validation
const validateCourse = (course) => {
  const req = { body: course };
  const validationError = null;
  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostCourse(req, res, () => {}); // Pass an empty function since we are not using next()

  if (validationError) {
    throw new Error(validationError.message);
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
      throw new Error("No departments found");
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

    const data = await Promise.all(
      courseData.map(async (course) => {
        validateCourse(course);
        return { ...course };
      })
    );

    await prisma.course.createMany({
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
    resource: "Courses",
    count,
    time,
    errors,
  };
};
