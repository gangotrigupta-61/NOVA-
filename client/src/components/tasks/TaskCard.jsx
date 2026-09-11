import { Calendar } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && true;
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
};

const TaskCard = ({ task, onClick }) => {
  const { title, priority, dueDate, assignee } = task;
  const overdue = isOverdue(dueDate);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-3.5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
    >
      {/* Priority badge */}
      <div className="mb-2">
        <Badge type={priority} />
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2 mb-3">
        {title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Due date */}
        {dueDate ? (
          <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
            <Calendar className="w-3 h-3" />
            <span>{formatDate(dueDate)}</span>
          </div>
        ) : (
          <div />
        )}

        {/* Assignee */}
        {assignee ? (
          <Avatar user={assignee} size="xs" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-200" />
        )}
      </div>
    </div>
  );
};

export default TaskCard;
