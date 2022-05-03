import mongoose from "mongoose";

const departmentsSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, "name is required"],
    maxlength: [100, "name must be no longer than 100 characters"],
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Department", departmentsSchema);
