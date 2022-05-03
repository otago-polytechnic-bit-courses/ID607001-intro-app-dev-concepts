import { isTokenValid } from "../utils/jwt.js";

const authRoute = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    res.status(401).send({ success: false, msg: "Invalid authentication" });
  }

  try {
    const { userId } = isTokenValid({ token });
    req.user = { userId: userId };
    next();
  } catch (error) {
    res.status(401).send({ success: false, msg: "Invalid authentication" });
  }
};

export default authRoute;
