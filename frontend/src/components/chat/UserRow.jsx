import Avatar from '../ui/Avatar';

const UserRow = ({ user, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-paper"
  >
    <Avatar name={user.name} size="sm" />
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-text">{user.name}</p>
      <p className="truncate text-xs text-text-muted">{user.email}</p>
    </div>
  </button>
);

export default UserRow;
