import mongoose from "mongoose";

import Department from "../models/departments.js";
import Institution from "../models/institutions.js";

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No department with the id ${id}`,
      });
    }

    const department = await Department.findById(id);
    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Something went wrong while getting a department",
    });
  }
};

const getDepartments = async (req, res) => {
  const { limit = 10, page = 1, name, sort_by, order_by } = req.query;

  /**
   * Page departments
   * Default number of departments per page is 10
   */
  const limitRecords = parseInt(limit);
  const skip = (page - 1) * limit;

  /**
   * Filter departments
   */
  const query = {};
  page && (query.page = page); // Equivalent to: if (page) query.page = page
  name && (query.name = name);

  /**
   * Sort departments
   */
  const sort = {};
  if (sort_by && order_by)
    sort[sort_by] =
      order_by === "asc" ? -1 : (sort[sort_by] = order_by === "desc" ? 1 : "");

  try {
    const departments = await Department.find(query)
      .populate("courses", [
        "-additional_information",
        "-department",
        "-createdBy",
      ])
      .limit(limitRecords)
      .sort(sort)
      .skip(skip);

    if (departments.length == 0) {
      return res.status(200).json({
        success: true,
        msg: "No departments found",
      });
    } else {
      return res.status(200).json({
        page: Number(page),
        limit: limitRecords,
        success: true,
        data: departments,
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while getting departments",
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;
    const department = new Department(req.body);
    await department.save();

    const institution = await Institution.findById({
      _id: department.institution,
    });
    institution.departments.push(department);
    await institution.save();

    const newDepartments = await Department.find({}); // Return all departments
    return res.status(201).json({
      success: true,
      data: newDepartments,
      msg: "Department successfully created",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while creating a department",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No department with the id ${id}`,
      });
    }

    const department = await Department.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        msg: `No department with the id ${id}`,
      });
    }

    const newDepartments = await Department.find({});
    return res.status(200).json({
      success: true,
      data: newDepartments,
      msg: "Department successfully updated",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while updating an department",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No department with the id ${id}`,
      });
    }

    const department = await Department.findByIdAndRemove(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        msg: `No department with the id ${id}`,
      });
    }

    const newDepartments = await Department.find({});
    return res.status(200).json({
      success: true,
      data: newDepartments,
      msg: "Department successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while deleting an department",
    });
  }
};

export {
  getDepartment,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
