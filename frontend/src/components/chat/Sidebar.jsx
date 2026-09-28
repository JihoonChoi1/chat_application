import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../lib/api';
import { getSender } from '../../lib/chatLogics';
import { ChatState } from '../../context/ChatProvider';
import Avatar from '../ui/Avatar';
import ChatSkeleton from '../ui/ChatSkeleton';
import NewGroupModal from './NewGroupModal';
import { cn } from '../../lib/cn';

const Sidebar = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
  const [loading, setLoading] = useState(true);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get('/chat')
      .then(({ data }) => active && setChats(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const openChat = (chat) => {
    setSelectedChat(chat);
    setNotifications(notifications.filter((n) => n.chat._id !== chat._id));
  };

  return (
    <aside
      className={cn(
        'h-full w-full flex-col bg-ink text-text-on-ink md:flex md:w-80 md:shrink-0',
        selectedChat ? 'hidden' : 'flex'
      )}
    >
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h2 className="font-display text-2xl italic">Chats</h2>
        <button
          onClick={() => setGroupModalOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Group
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {loading ? (
          <ChatSkeleton />
        ) : chats.length === 0 ? (
          <p className="px-2 py-6 text-sm text-text-on-ink-muted">
            No conversations yet. Search for someone to start chatting.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {chats.map((chat) => {
              const isActive = selectedChat?._id === chat._id;
              const unread = notifications.some((n) => n.chat._id === chat._id);
              const title = chat.isGroupChat ? chat.chatName : getSender(user, chat.users);
              const preview = chat.latestMessage
                ? `${chat.latestMessage.sender._id === user._id ? 'You: ' : ''}${chat.latestMessage.content}`
                : 'No messages yet';

              return (
                <button
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    isActive ? 'bg-paper text-text' : 'hover:bg-white/5'
                  )}
                >
                  <Avatar name={title} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn('truncate text-sm font-medium', !isActive && 'text-text-on-ink')}>{title}</p>
                      {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-ember" />}
                    </div>
                    <p className={cn('truncate text-xs', isActive ? 'text-text-muted' : 'text-text-on-ink-muted')}>
                      {preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <NewGroupModal open={groupModalOpen} onClose={() => setGroupModalOpen(false)} />
    </aside>
  );
};

export default Sidebar;
