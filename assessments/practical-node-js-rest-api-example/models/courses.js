import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: [true, "title is required"],
    maxlength: [50, "title must be no longer than 50 characters"],
  },
  code: {
    type: mongoose.Schema.Types.String,
    required: [true, "code is required"],
    maxlength: [50, "code must be no longer than 50 characters"],
  },
  additional_information: {
    efts: {
      type: mongoose.Schema.Types.Number,
      get: (v) => v.toFixed(2),
      required: [true, "efts is required"],
    },
    points: {
      type: mongoose.Schema.Types.Number,
      required: [true, "points is required"],
    },
    fees: {
      type: mongoose.Schema.Types.Number,
      get: (v) => v.toFixed(2),
      required: [true, "fees is required"],
    },
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Course", coursesSchema);
