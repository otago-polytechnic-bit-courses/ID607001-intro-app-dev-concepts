import STATUS_CODES from "./statusCodes.js";

const isContentTypeApplicationJSON = (req, res, next) => {
  // Check if the request method is POST or PUT
  if (req.method === "POST" || req.method === "PUT") {
    // Check if the Content-Type header is application/json
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(STATUS_CODES.CONFLICT).json({
        message: "Content-Type must be application/json",
      });
    }
  }
  next();
};

export default isContentTypeApplicationJSON;
