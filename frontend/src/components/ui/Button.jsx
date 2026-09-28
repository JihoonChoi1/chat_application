import { cn } from '../../lib/cn';

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover disabled:bg-accent/50',
  ghost: 'bg-transparent text-text hover:bg-black/5 disabled:opacity-50',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-paper disabled:opacity-50',
  danger: 'bg-transparent text-ember border border-ember hover:bg-ember hover:text-white disabled:opacity-50',
  onInk: 'bg-white/10 text-text-on-ink hover:bg-white/20 disabled:opacity-50',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed',
      VARIANTS[variant],
      SIZES[size],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
    )}
    {children}
  </button>
);

export default Button;
