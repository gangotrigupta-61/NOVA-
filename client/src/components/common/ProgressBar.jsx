const ProgressBar = ({ value = 0, showLabel = true, className = '' }) => {
  const clamped = Math.min(100, Math.max(0, value));
  const color = clamped === 100 ? 'bg-green-500' : 'bg-indigo-500';

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-xs font-medium text-gray-500">Progress</span>
        )}
        {showLabel && (
          <span className="text-xs font-semibold text-gray-700">{clamped}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
