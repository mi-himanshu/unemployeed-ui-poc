import clsx from 'clsx'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export default function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md px-6 py-2 text-sm transition-all',
        variant === 'primary' &&
          'border border-white/20 hover:bg-[#223a45]',
        variant === 'ghost' &&
          'border border-white/20 hover:bg-white/10',
        className
      )}
      {...props}
    />
  )
}
