import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef(({ label, className, ...props }, ref) => (
  <label className="flex w-full flex-col gap-1.5">
    {label && <span className="text-sm font-medium text-text-muted">{label}</span>}
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted/70',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent',
        className
      )}
      {...props}
    />
  </label>
));
Input.displayName = 'Input';

export default Input;
