const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { createTask, getTasks } = require('./tasks');

const router = express.Router();

// All project routes require authentication
router.use(verifyToken);

router.route('/').get(getProjects).post(createProject);

router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

// Task sub-routes scoped to a project
router.route('/:id/tasks').get(getTasks).post(createTask);

module.exports = router;
