import mongoose from "mongoose";

import Institution from "../models/institutions.js";

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No institution with the id ${id}`,
      });
    }

    const institution = await Institution.findById(id);
    return res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Something went wrong while getting an institution",
    });
  }
};

const getInstitutions = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    name,
    region,
    country,
    sort_by,
    order_by,
  } = req.query;

  /**
   * Page institutions
   * Default number of institutions per page is 10
   */
  const limitRecords = parseInt(limit);
  const skip = (page - 1) * limit;

  // Filter institutions
  const query = {};
  page && (query.page = page);
  name && (query.name = name);
  region && (query.region = region);
  country && (query.country = country);

  // Sort institutions
  const sort = {};
  if (sort_by && order_by)
    sort[sort_by] =
      order_by === "asc" ? -1 : (sort[sort_by] = order_by === "desc" ? 1 : "");

  try {
    const institutions = await Institution.find(query)
      .populate("departments", "-courses")
      .limit(limitRecords)
      .skip(skip)
      .sort(sort);

    if (institutions.length == 0) {
      return res.status(200).json({
        success: true,
        msg: "No institutions found",
      });
    } else {
      return res.status(200).json({
        page: Number(page),
        limit: limitRecords,
        success: true,
        data: institutions,
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while getting institutions",
    });
  }
};

const createInstitution = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;
    await Institution.create(req.body);
    const newInstitutions = await Institution.find({}); // Return all institutions
    return res.status(201).json({
      success: true,
      data: newInstitutions,
      msg: "Institution successfully created",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while creating an institution",
    });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No institution with the id ${id}`,
      });
    }

    const institution = await Institution.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (!institution) {
      return res.status(404).json({
        success: false,
        msg: `No institution with the id ${id}`,
      });
    }

    const newInstitutions = await Institution.find({});
    return res.status(200).json({
      success: true,
      data: newInstitutions,
      msg: "Institution successfully updated",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while updating an institution",
    });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        msg: `No institution with the id ${id}`,
      });
    }

    const institution = await Institution.findByIdAndRemove(id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        msg: `No institution with the id ${id}`,
      });
    }

    const newInstitutions = await Institution.find({});
    return res.status(200).json({
      success: true,
      data: newInstitutions,
      msg: "Institution successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while deleting an institution",
    });
  }
};

export {
  getInstitution,
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
