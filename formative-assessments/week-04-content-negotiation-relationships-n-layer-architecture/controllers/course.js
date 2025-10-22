import courseRepository from "../repositories/course.js";
import STATUS_CODES from "../middleware/statusCodes.js";
import { clearCache } from "../middleware/cache.js";

const createCourse = async (req, res) => {
  try {
    const { code, name, description, departmentId } = req.body;
    await courseRepository.create({ code, name, description, departmentId });
    clearCache();
    const newCourses = await courseRepository.findAll();
    return res.status(STATUS_CODES.CREATED).json({
      message: "Course successfully created",
      data: newCourses,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await courseRepository.findAll();
    if (!courses) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "No courses found" });
    }
    return res.status(STATUS_CODES.OK).json({
      data: courses,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseRepository.findById(id);
    if (!course) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No course with the id: ${id} found`,
      });
    }
    return res.status(STATUS_CODES.OK).json({
      data: course,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, departmentId } = req.body;
    let course = await courseRepository.findById(id);
    if (!course) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No course with the id: ${id} found`,
      });
    }
    course = await courseRepository.update(id, {
      code,
      name,
      description,
      departmentId,
    });
    clearCache();
    return res.status(STATUS_CODES.OK).json({
      message: `Course with the id: ${id} successfully updated`,
      data: course,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseRepository.findById(id);
    if (!course) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No course with the id: ${id} found`,
      });
    }
    await courseRepository.delete(id);
    clearCache();
    return res.status(STATUS_CODES.OK).json({
      message: `Course with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export { createCourse, getCourses, getCourse, updateCourse, deleteCourse };
