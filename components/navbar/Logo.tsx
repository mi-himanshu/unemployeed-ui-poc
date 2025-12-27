import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 pl-4">
      <div className="leading-tight">
        <div className="text-lg font-semibold tracking-wide">
          unemploy<span className="text-red-500">e</span>d
        </div>
        <div className="text-[10px] tracking-widest text-white/50">
          FROM STUCK TO UNSTOPPABLE
        </div>
      </div>
    </Link>
  )
}
