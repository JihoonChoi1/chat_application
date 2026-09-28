import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo')) || null;
  } catch {
    return null;
  }
};

const ChatProvider = ({ children }) => {
  const [user, setUserState] = useState(readStoredUser);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  const setUser = (nextUser) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem('userInfo', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('userInfo');
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedChat(null);
    setChats([]);
    setNotifications([]);
  };

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
      return;
    }

    const socket = io();
    socketRef.current = socket;
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [user?._id]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      selectedChat,
      setSelectedChat,
      chats,
      setChats,
      notifications,
      setNotifications,
      socket: socketRef.current,
      socketConnected,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, selectedChat, chats, notifications, socketConnected]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
