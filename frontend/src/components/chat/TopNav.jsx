import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { ChatState } from '../../context/ChatProvider';
import { getSender } from '../../lib/chatLogics';
import Avatar from '../ui/Avatar';
import { Menu, MenuDivider, MenuItem } from '../ui/Menu';
import ProfileModal from './ProfileModal';
import SearchPanel from './SearchPanel';
import { cn } from '../../lib/cn';

const TopNav = () => {
  const { user, logout, notifications, setNotifications, setSelectedChat } = ChatState();
  const [searchOpen, setSearchOpen] = useState(false);

  const openNotification = (message) => {
    setSelectedChat(message.chat);
    setNotifications(notifications.filter((n) => n._id !== message._id));
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-text-muted hover:border-ink hover:text-text"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search people</span>
      </button>

      <p className="font-display text-lg italic text-text">Talkative</p>

      <div className="flex items-center gap-1">
        <Menu
          trigger={
            <button className="relative rounded-full p-2 text-text-muted hover:bg-black/5 hover:text-text" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] font-semibold text-white">
                  {notifications.length}
                </span>
              )}
            </button>
          }
        >
          {notifications.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-muted">No new messages</p>
          ) : (
            notifications.map((n) => (
              <MenuItem key={n._id} onClick={() => openNotification(n)}>
                {n.chat.isGroupChat ? `New message in ${n.chat.chatName}` : `New message from ${getSender(user, n.chat.users)}`}
              </MenuItem>
            ))
          )}
        </Menu>

        <Menu
          trigger={
            <button className={cn('rounded-full p-0.5', 'hover:ring-2 hover:ring-border')}>
              <Avatar name={user.name} size="sm" />
            </button>
          }
        >
          <ProfileModal user={user} trigger={<MenuItem>My profile</MenuItem>} />
          <MenuDivider />
          <MenuItem onClick={logout} className="text-ember">
            Log out
          </MenuItem>
        </Menu>
      </div>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default TopNav;
