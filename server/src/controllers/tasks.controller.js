const Task = require("../models/Task");

// GET /api/v1/tasks
// Admin sees all tasks; users see only their own
exports.getTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };

    // Optional query filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter)
      .populate("owner", "name email role")
      .sort("-createdAt");

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    // Only owner or admin can view
    const isOwner = task.owner._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this task." });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      status,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    const isOwner = task.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task.",
      });
    }

    const allowed = ["title", "description", "status", "priority"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    const isOwner = task.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task.",
      });
    }

    await task.deleteOne();

    res.json({ success: true, message: "Task deleted successfully." });
  } catch (err) {
    next(err);
  }
};