import mongoose from "mongoose";

import Course from "../models/courses.js";
import Department from "../models/departments.js";

const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No course with the id ${id}`,
      });
    }

    const course = await Course.findById(id);
    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Something went wrong while getting a course",
    });
  }
};

const getCourses = async (req, res) => {
  const { limit = 10, page = 1, title, code, sort_by, order_by } = req.query;

  /**
   * Page courses
   * Default number of courses per page is 10
   */
  const limitRecords = parseInt(limit);
  const skip = (page - 1) * limit;

  /**
   * Filter courses
   */
  const query = {};
  title && (query.title = title);
  code && (query.code = code);
  console.log(query);

  /**
   * Sort courses
   */
  const sort = {};
  if (sort_by && order_by)
    sort[sort_by] =
      order_by === "asc" ? -1 : (sort[sort_by] = order_by === "desc" ? 1 : "");

  try {
    const courses = await Course.find(query)
      .populate("department", ["-courses", "-createdBy"])
      .limit(limitRecords)
      .sort(sort)
      .skip(skip);

    if (courses.length == 0) {
      return res.status(200).json({
        success: true,
        msg: "No courses found",
      });
    } else {
      return res.status(200).json({
        page: Number(page),
        limit: limitRecords,
        success: true,
        data: courses,
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while getting courses",
    });
  }
};

const createCourse = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;
    const course = new Course(req.body);
    await course.save();

    const department = await Department.findById({
      _id: course.department,
    });
    department.courses.push(course);
    await department.save();

    const newCourses = await Course.find({}); // Return all courses
    return res.status(201).json({
      success: true,
      data: newCourses,
      msg: "Course successfully created",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while creating a course",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No course with the id ${id}`,
      });
    }

    const course = await Course.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        msg: `No course with the id ${id}`,
      });
    }

    const newCourses = await Course.find({});
    return res.status(200).json({
      success: true,
      data: newCourses,
      msg: "Course successfully updated",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while updating an course",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No course with the id ${id}`,
      });
    }

    const course = await Course.findByIdAndRemove(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        msg: `No course with the id ${id}`,
      });
    }

    const newCourses = await Course.find({});
    return res.status(200).json({
      success: true,
      data: newCourses,
      msg: "Course successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while deleting an course",
    });
  }
};

export { getCourse, getCourses, createCourse, updateCourse, deleteCourse };
