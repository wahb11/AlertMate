import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Logo({ href = '/' }: { href?: string }) {
  const [showImage, setShowImage] = useState(true)
  return (
    <Link href={href} className="flex items-center gap-2 select-none">
      {showImage && (
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded">
          <Image
            src="/alertmate-logo.png"
            alt="Alert Mate logo"
            fill
            sizes="32px"
            priority
            onError={() => setShowImage(false)}
          />
        </div>
      )}
      <div className="leading-tight">
        <div className="text-base font-bold tracking-[0.3em]">ALERT MATE</div>
        <div className="text-[10px] text-muted-foreground">Drowsiness Detection</div>
      </div>
    </Link>
  )
}
