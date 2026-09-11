import { useState } from 'react';
import { LayoutList } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailModal from './TaskDetailModal';
import EmptyState from '../common/EmptyState';

const COLUMNS = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'completed', label: 'Completed' },
];

const KanbanBoard = ({ tasks, members, projectId, onTaskCreated, onTaskUpdated, onTaskDeleted }) => {
  const [createModal, setCreateModal] = useState(null); // { defaultStatus }
  const [detailModal, setDetailModal] = useState(null); // task object

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div>
      {tasks.length === 0 && (
        <EmptyState
          icon={LayoutList}
          title="No tasks yet"
          description="Add your first task to get started."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map(({ status, label }) => (
          <KanbanColumn
            key={status}
            status={status}
            label={label}
            tasks={tasksByStatus(status)}
            members={members}
            onCardClick={(task) => setDetailModal(task)}
            onAddTask={(defaultStatus) => setCreateModal({ defaultStatus })}
          />
        ))}
      </div>

      {createModal && (
        <CreateTaskModal
          projectId={projectId}
          members={members}
          defaultStatus={createModal.defaultStatus}
          onClose={() => setCreateModal(null)}
          onCreated={(task) => {
            onTaskCreated(task);
            setCreateModal(null);
          }}
        />
      )}

      {detailModal && (
        <TaskDetailModal
          task={detailModal}
          members={members}
          onClose={() => setDetailModal(null)}
          onUpdated={(updatedTask) => {
            onTaskUpdated(updatedTask);
            setDetailModal(null);
          }}
          onDeleted={(taskId) => {
            onTaskDeleted(taskId);
            setDetailModal(null);
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
