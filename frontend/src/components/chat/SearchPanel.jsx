import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import api, { errorMessage } from '../../lib/api';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { ChatState } from '../../context/ChatProvider';
import { useToast } from '../ui/Toast';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import UserRow from './UserRow';

const SearchPanel = ({ open, onClose }) => {
  const { chats, setChats, setSelectedChat } = ChatState();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [openingChatId, setOpeningChatId] = useState(null);
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

  const openChat = async (targetUser) => {
    setOpeningChatId(targetUser._id);
    try {
      const { data } = await api.post('/chat', { userId: targetUser._id });
      if (!chats.some((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setQuery('');
      setResults([]);
      onClose();
    } catch (error) {
      toast({ title: 'Could not open chat', description: errorMessage(error), status: 'error' });
    } finally {
      setOpeningChatId(null);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-surface shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-xl italic">Find people</h2>
              <button onClick={onClose} className="rounded-full p-1 text-text-muted hover:bg-black/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <Input
                autoFocus
                placeholder="Search by name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {searching && (
                <div className="flex justify-center py-6">
                  <Spinner size={6} />
                </div>
              )}
              {!searching &&
                results.map((u) => (
                  <div key={u._id} className="relative">
                    <UserRow user={u} onClick={() => openingChatId === null && openChat(u)} />
                    {openingChatId === u._id && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Spinner size={4} />
                      </div>
                    )}
                  </div>
                ))}
              {!searching && debouncedQuery && results.length === 0 && (
                <p className="px-3 py-4 text-sm text-text-muted">No one matches "{debouncedQuery}".</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SearchPanel;
