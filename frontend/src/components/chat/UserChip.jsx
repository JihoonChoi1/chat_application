import { X } from 'lucide-react';

const UserChip = ({ user, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
    {user.name}
    {onRemove && (
      <button onClick={onRemove} className="rounded-full hover:bg-accent/20" aria-label={`Remove ${user.name}`}>
        <X className="h-3 w-3" />
      </button>
    )}
  </span>
);

export default UserChip;
