import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const usersSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: [true, "first name is required"],
      maxlength: [100, "first name must be no longer than 100 characters"],
      minlength: [3, "first name must be no shorter than 3 characters"],
    },
    last: {
      type: String,
      required: [true, "last name is required"],
      maxlength: [100, "last name must be no longer than 100 characters"],
      minlength: [1, "last name must be no shorter than 1 characters"],
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    match: /.+\@.+\..+/,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password must be no shorter than 3 characters"],
  },
});

usersSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

usersSchema.methods.comparePassword = function (password) {
  const isMatch = bcryptjs.compare(password, this.password);
  return isMatch;
};

export default mongoose.model("User", usersSchema);
