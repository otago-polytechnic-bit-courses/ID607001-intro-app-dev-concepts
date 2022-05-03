import User from "../models/users.js";
import getTokenUserData from "../utils/getTokenUserData.js";
import { attachCookiesToResponse } from "../utils/jwt.js";

const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const tokenUser = getTokenUserData(user);
    return res.status(201).json({
      success: true,
      data: tokenUser,
      msg: "User successfully registered",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while registering a user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid email" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, msg: "Invalid password" });
    }

    const tokenUser = getTokenUserData(user);
    attachCookiesToResponse({ res, user: tokenUser });
    return res.status(201).json({
      success: true,
      data: tokenUser,
      msg: "User successfully logged in",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while logging in a user",
    });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  return res
    .status(200)
    .json({ success: true, msg: "User successfully logged out" });
};

export { register, login, logout };
