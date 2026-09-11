const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.use(verifyToken);

// Task routes scoped to a project (mounted at /api/projects/:id/tasks via projectRoutes)
// and standalone task routes
router.put('/:taskId', updateTask);
router.patch('/:taskId/status', updateTaskStatus);
router.delete('/:taskId', deleteTask);

module.exports = router;

// Also export create/list handlers for use by project router
module.exports.createTask = createTask;
module.exports.getTasks = getTasks;
