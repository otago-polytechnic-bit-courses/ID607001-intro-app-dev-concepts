import prisma from "../prisma/prisma.js";
import STATUS_CODES from "../utils/statusCode.js";

const capitaliseFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const createResource = async (req, res, model) => {
  try {
    await prisma[model].create({
      data: { ...req.body },
    });

    const newResources = await prisma[model].findMany();

    return res.status(STATUS_CODES.CREATED).json({
      msg: `${capitaliseFirstLetter(model)} successfully created`,
      data: newResources,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const getResources = async (req, res, model, include) => {
  try {
    const resources = await prisma[model].findMany({
      include: include,
    });

    if (resources.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model}s found` });
    }

    return res.json({ data: resources });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const getResource = async (req, res, model) => {
  try {
    const resource = await prisma[model].findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!resource) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model} with the id: ${req.params.id} found` });
    }

    return res.json({
      data: resource,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const updateResource = async (req, res, model) => {
  try {
    let resource = await prisma[model].findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!resource) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model} with the id: ${req.params.id} found` });
    }

    resource = await prisma[model].update({
      where: { id: Number(req.params.id) },
      data: { ...req.body },
    });

    return res.json({
      msg: `${capitaliseFirstLetter(model)} with the id: ${
        req.params.id
      } successfully updated`,
      data: resource,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const deleteResource = async (req, res, model) => {
  try {
    const resource = await prisma[model].findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!resource) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model} with the id: ${req.params.id} found` });
    }

    await prisma[model].delete({
      where: { id: Number(req.params.id) },
    });

    return res.json({
      msg: `${capitaliseFirstLetter(model)} with the id: ${
        req.params.id
      } successfully deleted`,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

export {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};
