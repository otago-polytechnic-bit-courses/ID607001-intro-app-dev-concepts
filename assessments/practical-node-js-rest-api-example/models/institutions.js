import mongoose from "mongoose";

const institutionsSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, "name is required"],
    unique: true,
    maxlength: [100, "name must be no longer than 100 characters"],
  },
  region: {
    type: mongoose.Schema.Types.String,
    required: [true, "region is required"],
    maxlength: [100, "region must be no longer than 100 characters"],
  },
  country: {
    type: mongoose.Schema.Types.String,
    required: [true, "country is required"],
    maxlength: [100, "country must be no longer than 100 characters"],
  },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Institution", institutionsSchema);
