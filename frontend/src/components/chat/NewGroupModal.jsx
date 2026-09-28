import { useEffect, useState } from 'react';
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

const NewGroupModal = ({ open, onClose }) => {
  const { chats, setChats, setSelectedChat } = ChatState();
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const debouncedQuery = useDebouncedValue(query);
  const toast = useToast();

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
      .catch(() => active && toast({ title: 'Search failed', status: 'error' }))
      .finally(() => active && setSearching(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const addUser = (user) => {
    if (selected.some((u) => u._id === user._id)) {
      toast({ title: 'Already added', status: 'warning' });
      return;
    }
    setSelected((prev) => [...prev, user]);
  };

  const removeUser = (user) => setSelected((prev) => prev.filter((u) => u._id !== user._id));

  const close = () => {
    setName('');
    setQuery('');
    setResults([]);
    setSelected([]);
    onClose();
  };

  const create = async () => {
    if (!name || selected.length < 2) {
      toast({ title: 'Name your group and add at least 2 people', status: 'warning' });
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post('/chat/group', {
        name,
        users: JSON.stringify(selected.map((u) => u._id)),
      });
      setChats([data, ...chats]);
      setSelectedChat(data);
      toast({ title: 'Group created', status: 'success' });
      close();
    } catch (error) {
      toast({ title: 'Could not create group', description: errorMessage(error), status: 'error' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={close}
      title="New group"
      footer={
        <Button onClick={create} loading={creating}>
          Create group
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Add people by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((u) => (
              <UserChip key={u._id} user={u} onRemove={() => removeUser(u)} />
            ))}
          </div>
        )}

        <div className="flex flex-col">
          {searching && (
            <div className="flex justify-center py-4">
              <Spinner size={5} />
            </div>
          )}
          {!searching && results.slice(0, 5).map((u) => <UserRow key={u._id} user={u} onClick={() => addUser(u)} />)}
        </div>
      </div>
    </Modal>
  );
};

export default NewGroupModal;
