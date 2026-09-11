const variants = {
  // Priority
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
  // Status
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const labels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const Badge = ({ type, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[type] || 'bg-gray-100 text-gray-600'} ${className}`}
    >
      {labels[type] || type}
    </span>
  );
};

export default Badge;
