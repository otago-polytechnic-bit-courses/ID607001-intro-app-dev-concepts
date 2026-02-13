import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userRepository from "../repositories/UserRepository.js";

const register = async (req, res) => {
  try {
    const {
      userType,
      firstName,
      lastName,
      emailAddress,
      password,
      departmentId,
      phoneNumber,
      officeNumber,
      studentNumber,
    } = req.body;

    const existingUser = await userRepository.findByEmail(emailAddress);
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Validate user type
    if (!["lecturer", "student"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type. Must be 'lecturer' or 'student'",
      });
    }

    // Role-specific validation
    if (userType === "lecturer" && !departmentId) {
      return res.status(400).json({
        message: "Department ID is required for lecturers",
      });
    }

    if (userType === "student" && !studentNumber) {
      return res.status(400).json({
        message: "Student number is required for students",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;

    if (userType === "lecturer") {
      user = await userRepository.createLecturer({
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        departmentId,
        phoneNumber,
        officeNumber,
      });
    }

    if (userType === "student") {
      user = await userRepository.createStudent({
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        studentNumber,
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

    const user = await userRepository.findByEmail(emailAddress);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const userType = user.lecturer
      ? "lecturer"
      : user.student
        ? "student"
        : null;

    const token = jwt.sign(
      {
        id: user.id,
        permissionLevel: user.permissionLevel,
        userType,
        ...(user.lecturer && { lecturerId: user.lecturer.id }),
        ...(user.student && { studentId: user.student.id }),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME },
    );

    return res.status(200).json({
      message: "User successfully logged in",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        permissionLevel: user.permissionLevel,
        userType,
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
