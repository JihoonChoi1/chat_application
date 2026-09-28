import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import TypingDots from '../ui/TypingDots';

const TYPING_TIMEOUT = 3000;

const Composer = ({ onSend, socket, chatId, isTyping }) => {
  const [value, setValue] = useState('');
  const typingRef = useRef(false);
  const lastTypedAtRef = useRef(0);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (!socket) return;

    lastTypedAtRef.current = Date.now();
    if (!typingRef.current) {
      typingRef.current = true;
      socket.emit('typing', chatId);
    }

    setTimeout(() => {
      if (typingRef.current && Date.now() - lastTypedAtRef.current >= TYPING_TIMEOUT) {
        socket.emit('stop typing', chatId);
        typingRef.current = false;
      }
    }, TYPING_TIMEOUT);
  };

  const submit = (e) => {
    e.preventDefault();
    const content = value.trim();
    if (!content) return;

    if (socket && typingRef.current) {
      socket.emit('stop typing', chatId);
      typingRef.current = false;
    }
    setValue('');
    onSend(content);
  };

  return (
    <div className="px-2 pb-2 pt-1">
      {isTyping && <div className="mb-2">{<TypingDots />}</div>}
      <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-ink bg-surface px-2 py-1.5">
        <input
          value={value}
          onChange={handleChange}
          placeholder="Write a message"
          className="flex-1 bg-transparent px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default Composer;
