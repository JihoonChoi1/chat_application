import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export const Menu = ({ trigger, children, align = 'right' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'absolute top-full z-40 mt-2 min-w-[14rem] overflow-hidden rounded-2xl border border-ink bg-surface py-1.5 shadow-xl',
              align === 'right' ? 'right-0' : 'left-0'
            )}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MenuItem = ({ children, className, ...props }) => (
  <button
    className={cn(
      'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-text hover:bg-paper',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const MenuDivider = () => <div className="my-1.5 h-px bg-border" />;
