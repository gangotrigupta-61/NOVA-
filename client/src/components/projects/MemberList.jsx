import { UserMinus, Crown } from 'lucide-react';
import Avatar from '../common/Avatar';

const MemberList = ({ members, ownerId, currentUserId, onRemove }) => {
  return (
    <ul className="space-y-3">
      {members.map((member) => {
        const isOwner = member._id === ownerId;
        const canRemove = currentUserId === ownerId && !isOwner;

        return (
          <li key={member._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar user={member} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-900">{member.name}</span>
                  {isOwner && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-amber-600 font-medium">
                      <Crown className="w-3 h-3" />
                      Owner
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{member.email}</span>
              </div>
            </div>

            {canRemove && (
              <button
                onClick={() => onRemove(member._id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                title={`Remove ${member.name}`}
              >
                <UserMinus className="w-4 h-4" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MemberList;
