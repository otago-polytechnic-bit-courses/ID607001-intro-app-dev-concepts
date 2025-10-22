import userRepository from "../repositories/institution.js";
import STATUS_CODES from "../middleware/statusCodes.js";

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress } = req.body;
    await userRepository.create({ firstName, lastName, emailAddress });
    const newUsers = await userRepository.findAll();
    return res.status(STATUS_CODES.CREATED).json({
      message: "User successfully created",
      data: newUsers,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    if (!users) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "No users found" });
    }
    return res.status(STATUS_CODES.OK).json({
      data: users,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No user with the id: ${id} found`,
      });
    }
    return res.status(STATUS_CODES.OK).json({
      data: user,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, emailAddress } = req.body;
    let user = await userRepository.findById(id);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No user with the id: ${id} found`,
      });
    }
    user = await userRepository.update(id, {
      firstName,
      lastName,
      emailAddress,
    });
    return res.status(STATUS_CODES.OK).json({
      message: `User with the id: ${id} successfully updated`,
      data: user,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `No user with the id: ${id} found`,
      });
    }
    await userRepository.delete(id);
    return res.status(STATUS_CODES.OK).json({
      message: `User with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
