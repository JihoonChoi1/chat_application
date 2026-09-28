import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, MessageCircle, UserRound } from 'lucide-react';
import api, { errorMessage } from '../../lib/api';
import { getSender, getSenderFull } from '../../lib/chatLogics';
import { ChatState } from '../../context/ChatProvider';
import { useToast } from '../ui/Toast';
import Spinner from '../ui/Spinner';
import Avatar from '../ui/Avatar';
import ProfileModal from './ProfileModal';
import ManageGroupModal from './ManageGroupModal';
import MessageBubbleList from './MessageBubbleList';
import Composer from './Composer';

const ChatWindow = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, socket, notifications, setNotifications } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const selectedChatRef = useRef(selectedChat);
  const toast = useToast();

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/message/${selectedChat._id}`);
      setMessages(data);
      socket?.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({ title: 'Could not load messages', description: errorMessage(error), status: 'error' });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?._id, socket]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!socket) return undefined;

    const onTyping = () => setIsPeerTyping(true);
    const onStopTyping = () => setIsPeerTyping(false);
    const onMessageReceived = (newMessage) => {
      const current = selectedChatRef.current;
      if (current && current._id === newMessage.chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        setNotifications((prev) =>
          prev.some((n) => n._id === newMessage._id) ? prev : [newMessage, ...prev]
        );
      }
      setChats((prevChats) => {
        const exists = prevChats.some((c) => c._id === newMessage.chat._id);
        if (!exists) return prevChats;
        return [newMessage.chat, ...prevChats.filter((c) => c._id !== newMessage.chat._id)];
      });
    };

    socket.on('typing', onTyping);
    socket.on('stop typing', onStopTyping);
    socket.on('message received', onMessageReceived);

    return () => {
      socket.off('typing', onTyping);
      socket.off('stop typing', onStopTyping);
      socket.off('message received', onMessageReceived);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const sendMessage = async (content) => {
    try {
      const { data } = await api.post('/message', { content, chatId: selectedChat._id });
      setMessages((prev) => [...prev, data]);
      setChats((prev) => [data.chat, ...prev.filter((c) => c._id !== data.chat._id)]);
      socket?.emit('new message', data);
    } catch (error) {
      toast({ title: 'Message not sent', description: errorMessage(error), status: 'error' });
    }
  };

  if (!selectedChat) {
    return (
      <div className="hidden flex-1 flex-col items-center justify-center gap-3 text-text-muted md:flex">
        <MessageCircle className="h-10 w-10" />
        <p className="font-display text-xl italic">Pick a conversation to start chatting</p>
      </div>
    );
  }

  const title = selectedChat.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users);
  const peer = !selectedChat.isGroupChat ? getSenderFull(user, selectedChat.users) : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3.5">
        <button
          onClick={() => setSelectedChat(null)}
          className="rounded-full p-1.5 text-text-muted hover:bg-black/5 md:hidden"
          aria-label="Back to chats"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar name={title} size="sm" />
        <h2 className="flex-1 truncate font-medium text-text">{title}</h2>
        {peer ? (
          <ProfileModal
            user={peer}
            trigger={
              <button className="rounded-full p-2 text-text-muted hover:bg-black/5 hover:text-text" aria-label="View profile">
                <UserRound className="h-5 w-5" />
              </button>
            }
          />
        ) : (
          <ManageGroupModal />
        )}
      </header>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size={7} />
        </div>
      ) : (
        <MessageBubbleList messages={messages} />
      )}

      <Composer onSend={sendMessage} socket={socket} chatId={selectedChat._id} isTyping={isPeerTyping} />
    </div>
  );
};

export default ChatWindow;
