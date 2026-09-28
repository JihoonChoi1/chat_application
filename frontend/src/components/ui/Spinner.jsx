import { cn } from '../../lib/cn';

const Spinner = ({ size = 8, className }) => (
  <span
    className={cn('inline-block animate-spin rounded-full border-2 border-ink/20 border-t-accent', className)}
    style={{ width: size * 4, height: size * 4 }}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
