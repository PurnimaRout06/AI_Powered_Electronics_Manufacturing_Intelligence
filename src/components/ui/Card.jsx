import clsx from 'clsx'

export default function Card({ children, className, padding = true, hover = false, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={clsx(
        'bg-surface-card border border-surface-border rounded-card shadow-card',
        padding && 'p-5',
        hover && 'transition-shadow duration-200 hover:shadow-raised',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
