/**
 * Health Controller
 * GET /api/health
 */
const getHealth = (req, res) => {
  res.status(200).json({
    ok: true,
    message: "SCHOLARO backend is running"
  });
};

module.exports = {
  getHealth
};
