import dotenv from "dotenv";

import Department from "../models/departments.js";
import Institution from "../models/institutions.js";
import Course from "../models/courses.js";

import { departments } from "../data/departments.js";
import { institutions } from "../data/institutions.js";
import { courses } from "../data/courses.js";

import conn from "./connection.js";

dotenv.config();

conn(process.env.MONGO_URI);

const createResources = async (model, data, type) => {
  try {
    await model.deleteMany();
    await model.insertMany(data);
    console.log(`${type} data successfully created`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteResources = async (model, type) => {
  try {
    await model.deleteMany();
    console.log(`${type} data successfully deleted`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

switch (process.argv[2]) {
  case "-c": {
    await createResources(Institution, institutions, "Institution");
    await createResources(Department, departments, "Department");
    await createResources(Course, courses, "Course");
    break;
  }
  case "-d": {
    await deleteResources(Institution, "Institution");
    await deleteResources(Department, "Department");
    await deleteResources(Course, "Course");
    break;
  }
  default: {
    console.log("Something went wrong while creating or deleting data");
  }
}

process.exit();

export { createResources, deleteResources };
