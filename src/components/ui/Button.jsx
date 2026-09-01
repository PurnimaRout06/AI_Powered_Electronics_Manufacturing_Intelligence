import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-white text-ink border border-surface-border hover:bg-slate-50',
  ghost: 'text-ink-muted hover:bg-slate-100 hover:text-ink',
  danger: 'bg-status-critical text-white hover:opacity-90'
}

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-sm'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} strokeWidth={2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} strokeWidth={2} />}
    </button>
  )
}
