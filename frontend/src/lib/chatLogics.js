export const getSender = (loggedUser, users) =>
  users[0]._id === loggedUser._id ? users[1].name : users[0].name;

export const getSenderFull = (loggedUser, users) =>
  users[0]._id === loggedUser._id ? users[1] : users[0];

export const isSameSender = (messages, m, i, userId) =>
  i < messages.length - 1 &&
  (messages[i + 1].sender._id !== m.sender._id ||
    messages[i + 1].sender._id === undefined) &&
  messages[i].sender._id !== userId;

export const isLastMessage = (messages, i, userId) =>
  i === messages.length - 1 &&
  messages[messages.length - 1].sender._id !== userId &&
  Boolean(messages[messages.length - 1].sender._id);

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;

  if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;

  return 'auto';
};

export const isSameUser = (messages, m, i) =>
  i > 0 && messages[i - 1].sender._id === m.sender._id;

const AVATAR_PALETTE = [
  '#4B3BE0',
  '#FF6A45',
  '#1FAA65',
  '#C23B7A',
  '#2E7DBF',
  '#B5852B',
];

export const colorForName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

export const initialsForName = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
