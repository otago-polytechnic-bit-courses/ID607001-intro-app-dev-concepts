// Module
import { institutions } from "../data.js";

// CommonJS
// const institutions = require("../data.js");

const getInstitutions = (req, res) => {
    console.log(req.params)
  res.status(200).json({ success: true, data: institutions });
};

const createInstitution = (req, res) => {
  const { name } = req.body; // Payload

  if (!name) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a name" });
  }

  // Specifying an id - increment by getting the last id
  const id = institutions[institutions.length - 1].id + 1;

  institutions.push({
    id: id,
    name: name,
  });

  res.status(201).send({ success: true, data: institutions });
};

const updateInstitution = (req, res) => {
  const { id } = req.params;

  const institution = institutions.find(
    (institution) => institution.id === Number(id)
  );

  // Check if institution does exist
  if (!institution) {
    return res
      .status(404)
      .json({ success: false, msg: `No institution with the id ${id}` });
  }

  const newInstitutions = institutions.map((institution) => {
    if (institution.id === Number(id)) {
      // If institution does exist, update its name
      institution.name = req.body.name;

      // We are changing OP (institution.name) => Ara (req.body.name)
    }
    return institution;
  });

  res.status(200).json({ success: true, data: newInstitutions });
};


const deleteInstitution = (req, res) => {
  const { id } = req.params;

  const institution = institutions.find(
    (institution) => institution.id === Number(id)
  );

  // Check if institution does exist
  if (!institution) {
    return res
      .status(404)
      .json({ success: false, msg: `No institution with the id ${id}` });
  }

  const newInstitutions = institutions.filter(
    (institution) => institution.id !== Number(id) // If institution does exist, delete it
  );

  res.status(200).json({ success: true, data: newInstitutions });
};

export {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
