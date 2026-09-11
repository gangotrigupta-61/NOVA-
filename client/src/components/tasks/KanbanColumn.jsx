import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import Badge from '../common/Badge';

const KanbanColumn = ({ status, label, tasks, members, onCardClick, onAddTask }) => {
  const colorMap = {
    todo: 'bg-gray-100',
    in_progress: 'bg-blue-100',
    completed: 'bg-green-100',
  };
  const dotMap = {
    todo: 'bg-gray-400',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
  };

  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-3 ${colorMap[status]}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotMap[status]}`} />
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span className="bg-white text-gray-500 text-xs font-medium px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task cards */}
      <div className="space-y-2.5 flex-1 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={() => onCardClick(task)} />
        ))}
      </div>

      {/* Add task button */}
      <button
        onClick={() => onAddTask(status)}
        className="mt-3 flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors px-3 py-2 rounded-lg w-full"
      >
        <Plus className="w-4 h-4" />
        Add task
      </button>
    </div>
  );
};

export default KanbanColumn;
