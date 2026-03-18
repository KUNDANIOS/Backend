const router = require("express").Router();
const authRoutes = require("./v1/auth.routes");
const taskRoutes = require("./v1/tasks.routes");

router.use("/v1/auth", authRoutes);
router.use("/v1/tasks", taskRoutes);

// Catch-all for undefined API routes
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

module.exports = router;