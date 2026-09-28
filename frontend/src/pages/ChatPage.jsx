import TopNav from '../components/chat/TopNav';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => (
  <div className="flex h-screen w-full flex-col overflow-hidden">
    <TopNav />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden bg-paper">
        <ChatWindow />
      </div>
    </div>
  </div>
);

export default ChatPage;
