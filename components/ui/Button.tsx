import clsx from 'clsx'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export default function Button({
  variant = 'primary',
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md px-6 py-2 text-sm transition-all text-[#f6f6f6]',
        variant === 'primary' &&
          'border border-white/20 hover:bg-[#223a45]',
        variant === 'ghost' &&
          'border border-white/20 hover:bg-white/10',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
}
