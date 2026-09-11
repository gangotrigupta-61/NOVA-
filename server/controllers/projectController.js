const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// Helper: get task stats for a project
const getTaskStats = async (projectId) => {
  const tasks = await Task.find({ project: projectId });
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, progress };
};

// POST /api/projects — create project
const createProject = async (req, res) => {
  const { name, description, color } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Project name is required.' });
  }

  try {
    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || '',
      color: color || '#6366f1',
      owner: req.user._id,
      members: [req.user._id],
    });

    await project.populate('owner members', 'name email avatarColor');
    const stats = await getTaskStats(project._id);

    res.status(201).json({ ...project.toObject(), ...stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project.' });
  }
};

// GET /api/projects — list projects where user is owner or member
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('owner members', 'name email avatarColor')
      .sort({ updatedAt: -1 });

    // Attach task stats to each project
    const projectsWithStats = await Promise.all(
      projects.map(async (p) => {
        const stats = await getTaskStats(p._id);
        return { ...p.toObject(), ...stats };
      })
    );

    res.json(projectsWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
};

// GET /api/projects/:id — get single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'owner members',
      'name email avatarColor'
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check membership
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const stats = await getTaskStats(project._id);
    res.json({ ...project.toObject(), ...stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
};

// PUT /api/projects/:id — update name/description/color
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Only members can update
    const isMember = project.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { name, description, color } = req.body;
    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description.trim();
    if (color !== undefined) project.color = color;

    await project.save();
    await project.populate('owner members', 'name email avatarColor');
    const stats = await getTaskStats(project._id);

    res.json({ ...project.toObject(), ...stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project.' });
  }
};

// DELETE /api/projects/:id — delete project + cascade tasks (owner only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can delete this project.' });
    }

    // Cascade delete tasks
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project.' });
  }
};

// POST /api/projects/:id/members — add member by email
const addMember = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can add members.' });
    }

    const userToAdd = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userToAdd) {
      return res.status(404).json({ message: 'No user found with that email address.' });
    }

    const alreadyMember = project.members.some(
      (m) => m.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a project member.' });
    }

    project.members.push(userToAdd._id);
    await project.save();
    await project.populate('owner members', 'name email avatarColor');
    const stats = await getTaskStats(project._id);

    res.json({ ...project.toObject(), ...stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add member.' });
  }
};

// DELETE /api/projects/:id/members/:userId — remove member (owner only)
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can remove members.' });
    }

    if (req.params.userId === project.owner.toString()) {
      return res.status(400).json({ message: 'Cannot remove the project owner.' });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();
    await project.populate('owner members', 'name email avatarColor');
    const stats = await getTaskStats(project._id);

    res.json({ ...project.toObject(), ...stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove member.' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
