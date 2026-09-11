const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: check if user is a member of the project that owns the task
const getMemberProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const isMember = project.members.some((m) => m.toString() === userId.toString());
  return isMember ? project : null;
};

// POST /api/projects/:id/tasks — create task
const createTask = async (req, res) => {
  try {
    const project = await getMemberProject(req.params.id, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Project not found or access denied.' });
    }

    const { title, description, assignee, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    // Validate assignee is a project member
    if (assignee) {
      const isAssigneeMember = project.members.some((m) => m.toString() === assignee);
      if (!isAssigneeMember) {
        return res.status(400).json({ message: 'Assignee must be a project member.' });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      project: project._id,
      assignee: assignee || null,
      createdBy: req.user._id,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
    });

    await task.populate('assignee createdBy', 'name email avatarColor');
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

// GET /api/projects/:id/tasks — list all tasks for a project
const getTasks = async (req, res) => {
  try {
    const project = await getMemberProject(req.params.id, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Project not found or access denied.' });
    }

    const tasks = await Task.find({ project: req.params.id })
      .populate('assignee createdBy', 'name email avatarColor')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
};

// PUT /api/tasks/:taskId — update task fields
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const project = await getMemberProject(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { title, description, assignee, status, priority, dueDate } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    if (assignee !== undefined) {
      if (assignee === null || assignee === '') {
        task.assignee = null;
      } else {
        const isAssigneeMember = project.members.some((m) => m.toString() === assignee);
        if (!isAssigneeMember) {
          return res.status(400).json({ message: 'Assignee must be a project member.' });
        }
        task.assignee = assignee;
      }
    }

    await task.save();
    await task.populate('assignee createdBy', 'name email avatarColor');
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

// PATCH /api/tasks/:taskId/status — quick status update (Kanban)
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['todo', 'in_progress', 'completed'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const project = await getMemberProject(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    task.status = status;
    await task.save();
    await task.populate('assignee createdBy', 'name email avatarColor');
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task status.' });
  }
};

// DELETE /api/tasks/:taskId — delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const project = await getMemberProject(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};

module.exports = { createTask, getTasks, updateTask, updateTaskStatus, deleteTask };
