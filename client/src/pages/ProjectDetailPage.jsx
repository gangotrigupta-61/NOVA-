import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, UserPlus, Users, LayoutDashboard } from 'lucide-react';
import { getProject, deleteProject, removeMember } from '../api/projects';
import { getTasks } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/tasks/KanbanBoard';
import MemberList from '../components/projects/MemberList';
import EditProjectModal from '../components/projects/EditProjectModal';
import AddMemberModal from '../components/projects/AddMemberModal';
import ProgressBar from '../components/common/ProgressBar';
import Spinner from '../components/common/Spinner';

const TABS = ['board', 'members'];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('board');
  const [showEdit, setShowEdit] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, tasksRes] = await Promise.all([getProject(id), getTasks(id)]);
        setProject(projRes.data);
        setTasks(tasksRes.data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isOwner = project?.owner?._id === user?._id;

  // Compute live progress from tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleDeleteProject = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const { data } = await removeMember(id, userId);
      setProject(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  const handleTaskCreated = (task) => setTasks((prev) => [task, ...prev]);
  const handleTaskUpdated = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  const handleTaskDeleted = (taskId) =>
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Dashboard
      </button>

      {/* Project header */}
      <div className="card mb-6 overflow-hidden">
        <div className="h-3" style={{ backgroundColor: project.color }} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
              )}
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowEdit(true)}
                className="btn-secondary flex items-center gap-1.5 text-sm px-3 py-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              {isOwner && (
                confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDeleteProject}
                      className="btn-danger flex items-center gap-1.5 text-sm px-3 py-1.5"
                      disabled={deleting}
                    >
                      {deleting ? <Spinner size="sm" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <ProgressBar value={progress} />
            <p className="text-xs text-gray-400 mt-1">
              {completedTasks} of {totalTasks} task{totalTasks !== 1 ? 's' : ''} completed
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 mt-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-gray-200">
        <button
          onClick={() => setTab('board')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'board'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Board
        </button>
        <button
          onClick={() => setTab('members')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'members'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Members
          <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
            {project.members?.length || 0}
          </span>
        </button>
      </div>

      {/* Tab content */}
      {tab === 'board' && (
        <KanbanBoard
          tasks={tasks}
          members={project.members || []}
          projectId={id}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}

      {tab === 'members' && (
        <div className="card p-5 max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Team Members</h3>
            {isOwner && (
              <button
                onClick={() => setShowAddMember(true)}
                className="btn-primary flex items-center gap-1.5 text-sm px-3 py-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Member
              </button>
            )}
          </div>
          <MemberList
            members={project.members || []}
            ownerId={project.owner?._id}
            currentUserId={user?._id}
            onRemove={handleRemoveMember}
          />
        </div>
      )}

      {/* Modals */}
      {showEdit && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => {
            setProject(updated);
            setShowEdit(false);
          }}
        />
      )}
      {showAddMember && (
        <AddMemberModal
          projectId={id}
          onClose={() => setShowAddMember(false)}
          onAdded={(updated) => {
            setProject(updated);
            setShowAddMember(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;
