import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prisma/db.js";

const register = async (req, res) => {
  try {
    const {
      userType,

      // User fields
      firstName,
      lastName,
      emailAddress,
      password,

      // Lecturer fields
      departmentId,
      phoneNumber,
      officeNumber,

      // Student fields
      studentNumber,
    } = req.body;

    // Check if user already exists by email address
    let user = await prisma.user.findUnique({ where: { emailAddress } });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const userTypes = ["lecturer", "student"];
    if (!userTypes.includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type. Must be 'lecturer' or 'student'",
      });
    }

    if (userType === "lecturer" && !departmentId) {
      return res
        .status(400)
        .json({ message: "Department ID is required for lecturers" });
    }

    if (userType === "student" && !studentNumber) {
      return res
        .status(400)
        .json({ message: "Student number is required for students" });
    }

    if (userType === "student") {
      const existingStudent = await prisma.student.findUnique({
        where: { studentNumber },
      });

      if (existingStudent) {
        return res
          .status(409)
          .json({ message: "Student with this student number already exists" });
      }
    }

    // Generate a random salt to make the password hash unique
    const salt = await bcryptjs.genSalt();

    // Hash the password with the generated salt
    const hashedPassword = await bcryptjs.hash(password, salt);

    if (userType === "lecturer") {
      user = await prisma.lecturer.create({
        data: {
          firstName,
          lastName,
          emailAddress,
          password: hashedPassword,
          permissionLevel: "STAFF",
          lecturer: {
            // Create an associated lecturer record
            create: {
              departmentId,
              phoneNumber,
              officeNumber,
            },
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          emailAddress: true,
          lecturer: {
            select: {
              deppartment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              phoneNumber: true,
              officeNumber: true,
            },
          },
        },
      });
    } else if (userType === "student") {
      user = await prisma.student.create({
        data: {
          firstName,
          lastName,
          emailAddress,
          password: hashedPassword,
          permissionLevel: "STUDENT",
          student: {
            // Create an associated student record
            create: {
              studentNumber,
            },
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          emailAddress: true,
          student: {
            select: {
              studentNumber: true,
            },
          },
        },
      });
    }

    return res.status(201).json({
      message: "User successfully registered",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    // Find user by email address
    const user = await prisma.user.findUnique({
      where: { emailAddress },
      include: {
        lecturer: {
          include: {
            department: true,
          },
        },
        student: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    const userType = user.lecturer
      ? "lecturer"
      : user.student
        ? "student"
        : null;

    // Create a JWT token with the user's ID and role
    const token = jwt.sign(
      {
        id: user.id,
        permissionLevel: user.permissionLevel,
        userType: userType,

        // Include lecturerId or studentId based on user type
        ...(user.lecturer && { lecturerId: user.lecturer.id }),
        ...(user.student && { studentId: user.student.id }),
      },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME },
    );

    return res.status(200).json({
      message: "User successfully logged in",
      token: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        permissionLevel: user.permissionLevel,
        userType: userType,
        ...(user.lecturer && { lecturer: user.lecturer }),
        ...(user.student && { student: user.student }),
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export { register, login };
