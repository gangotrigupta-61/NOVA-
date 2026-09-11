import { Link } from 'react-router-dom';
import { Users, CheckSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import ProgressBar from '../common/ProgressBar';

const ProjectCard = ({ project }) => {
  const { _id, name, description, color, members = [], total = 0, completed = 0, progress = 0 } = project;

  // Show up to 4 avatars
  const visibleMembers = members.slice(0, 4);
  const extraCount = members.length - 4;

  return (
    <Link to={`/projects/${_id}`} className="card hover:shadow-md transition-shadow block group">
      {/* Colour accent bar */}
      <div className="h-2 rounded-t-xl" style={{ backgroundColor: color }} />

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-1 mb-1">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>
        )}
        {!description && <div className="mb-4" />}

        {/* Progress */}
        <ProgressBar value={progress} showLabel={false} className="mb-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Member avatars */}
          <div className="flex items-center -space-x-1.5">
            {visibleMembers.map((m) => (
              <Avatar key={m._id} user={m} size="xs" className="ring-2 ring-white" />
            ))}
            {extraCount > 0 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center">
                <span className="text-xs text-gray-600 font-medium">+{extraCount}</span>
              </div>
            )}
          </div>

          {/* Task count */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{completed}/{total} tasks</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
