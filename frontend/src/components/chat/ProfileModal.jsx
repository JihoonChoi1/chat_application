import { useState } from 'react';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';

const ProfileModal = ({ user, trigger }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={user.name} size="sm">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <Avatar name={user.name} size="xl" />
          <p className="text-text-muted">{user.email}</p>
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;
