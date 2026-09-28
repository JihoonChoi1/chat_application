import { colorForName, initialsForName } from '../../lib/chatLogics';
import { cn } from '../../lib/cn';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-28 w-28 text-3xl',
};

const Avatar = ({ name, size = 'md', ring = false, className }) => (
  <div
    className={cn(
      'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
      SIZES[size],
      ring && 'ring-2 ring-surface',
      className
    )}
    style={{ backgroundColor: colorForName(name) }}
    aria-hidden="true"
  >
    {initialsForName(name)}
  </div>
);

export default Avatar;
