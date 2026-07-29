const getHealth = (req, res) => {
  return res.status(200).json({
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
};

export { getHealth };
