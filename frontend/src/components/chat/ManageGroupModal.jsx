import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import api, { errorMessage } from '../../lib/api';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { ChatState } from '../../context/ChatProvider';
import { useToast } from '../ui/Toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import UserChip from './UserChip';
import UserRow from './UserRow';
import Spinner from '../ui/Spinner';

const ManageGroupModal = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [busyUserId, setBusyUserId] = useState(null);
  const debouncedQuery = useDebouncedValue(query);
  const toast = useToast();

  const isAdmin = selectedChat.groupAdmin._id === user._id;

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    let active = true;
    setSearching(true);
    api
      .get(`/user?search=${encodeURIComponent(debouncedQuery)}`)
      .then(({ data }) => active && setResults(data))
      .finally(() => active && setSearching(false));
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const applyUpdatedChat = (updatedChat) => {
    setSelectedChat(updatedChat);
    setChats(chats.map((c) => (c._id === updatedChat._id ? updatedChat : c)));
  };

  const rename = async () => {
    if (!name) return;
    setRenaming(true);
    try {
      const { data } = await api.put('/chat/rename', { chatId: selectedChat._id, chatName: name });
      applyUpdatedChat(data);
      setName('');
      toast({ title: 'Group renamed', status: 'success' });
    } catch (error) {
      toast({ title: 'Could not rename group', description: errorMessage(error), status: 'error' });
    } finally {
      setRenaming(false);
    }
  };

  const addUser = async (candidate) => {
    if (!isAdmin) {
      toast({ title: 'Only the admin can add people', status: 'error' });
      return;
    }
    if (selectedChat.users.some((u) => u._id === candidate._id)) {
      toast({ title: 'Already in the group', status: 'warning' });
      return;
    }
    setBusyUserId(candidate._id);
    try {
      const { data } = await api.put('/chat/groupadd', { chatId: selectedChat._id, userId: candidate._id });
      applyUpdatedChat(data);
    } catch (error) {
      toast({ title: 'Could not add person', description: errorMessage(error), status: 'error' });
    } finally {
      setBusyUserId(null);
    }
  };

  const removeUser = async (member) => {
    const leavingSelf = member._id === user._id;
    if (!isAdmin && !leavingSelf) {
      toast({ title: 'Only the admin can remove people', status: 'error' });
      return;
    }
    setBusyUserId(member._id);
    try {
      const { data } = await api.put('/chat/groupremove', { chatId: selectedChat._id, userId: member._id });
      if (leavingSelf) {
        setChats(chats.filter((c) => c._id !== selectedChat._id));
        setSelectedChat(null);
        setOpen(false);
      } else {
        applyUpdatedChat(data);
      }
    } catch (error) {
      toast({ title: 'Could not remove person', description: errorMessage(error), status: 'error' });
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full p-2 text-text-muted hover:bg-black/5 hover:text-text"
        aria-label="Manage group"
      >
        <Settings className="h-5 w-5" />
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={selectedChat.chatName}
        footer={
          <Button variant="danger" onClick={() => removeUser(user)}>
            Leave group
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {selectedChat.users.map((u) => (
              <UserChip key={u._id} user={u} onRemove={isAdmin ? () => removeUser(u) : undefined} />
            ))}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Rename group" value={name} onChange={(e) => setName(e.target.value)} />
            <Button variant="outline" onClick={rename} loading={renaming}>
              Update
            </Button>
          </div>

          {isAdmin && (
            <>
              <Input placeholder="Add someone" value={query} onChange={(e) => setQuery(e.target.value)} />
              <div className="flex flex-col">
                {searching && (
                  <div className="flex justify-center py-4">
                    <Spinner size={5} />
                  </div>
                )}
                {!searching &&
                  results
                    .slice(0, 5)
                    .map((u) => (
                      <UserRow
                        key={u._id}
                        user={u}
                        onClick={() => (busyUserId ? null : addUser(u))}
                      />
                    ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ManageGroupModal;
