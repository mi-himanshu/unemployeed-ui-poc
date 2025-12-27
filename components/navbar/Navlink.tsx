import Link from 'next/link'
import clsx from 'clsx'

interface NavLinkProps {
  href: string
  active?: boolean
  children: React.ReactNode
}

export default function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'text-sm uppercase tracking-wide transition-colors',
        active
          ? 'text-[#e6c79c]'
          : 'text-white/70 hover:text-white'
      )}
    >
      {children}
    </Link>
  )
}
