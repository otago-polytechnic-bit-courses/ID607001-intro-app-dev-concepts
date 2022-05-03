const notFound = async (req, res) =>
  res.status(404).json({ success: false, msg: `${req.baseUrl} is not found` });

export { notFound };
