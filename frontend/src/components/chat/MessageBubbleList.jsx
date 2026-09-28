import { useEffect, useRef } from 'react';
import Avatar from '../ui/Avatar';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../lib/chatLogics';
import { ChatState } from '../../context/ChatProvider';
import { cn } from '../../lib/cn';

const MessageBubbleList = ({ messages }) => {
  const { user } = ChatState();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
      {messages.map((m, i) => {
        const mine = m.sender._id === user._id;
        const showAvatar = isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id);
        const marginLeft = isSameSenderMargin(messages, m, i, user._id);

        return (
          <div key={m._id} className={cn('flex items-end gap-2', mine && 'justify-end')}>
            {!mine && (
              <div className="w-7 shrink-0">
                {showAvatar && <Avatar name={m.sender.name} size="sm" />}
              </div>
            )}
            <div
              style={{ marginLeft: !mine ? marginLeft : undefined }}
              className={cn(
                'max-w-[75%] px-4 py-2 text-sm leading-relaxed',
                isSameUser(messages, m, i) ? 'mt-0.5' : 'mt-2.5',
                mine
                  ? 'rounded-2xl rounded-br-sm bg-accent text-white'
                  : 'rounded-2xl rounded-bl-sm border border-border bg-surface text-text'
              )}
            >
              {m.content}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageBubbleList;
