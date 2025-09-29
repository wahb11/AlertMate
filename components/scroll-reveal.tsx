'use client'

import React, { useEffect, useRef, useState } from 'react'

type ScrollRevealProps = {
	children: React.ReactNode
	className?: string
	variant?: 'up' | 'fade' | 'scale'
	rootMargin?: string
	threshold?: number
	once?: boolean
}

export function ScrollReveal({
	children,
	className,
	variant = 'up',
	rootMargin = '0px 0px -10% 0px',
	threshold = 0.1,
	once = true,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [revealed, setRevealed] = useState(false)

	useEffect(() => {
		if (!ref.current) return
		const node = ref.current

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setRevealed(true)
						if (once) observer.unobserve(entry.target)
					}
				})
			},
			{ root: null, rootMargin, threshold }
		)

		observer.observe(node)
		return () => observer.disconnect()
	}, [rootMargin, threshold, once])

	const baseClass =
		variant === 'fade'
			? 'reveal-fade'
			: variant === 'scale'
			? 'reveal-scale'
			: 'reveal-up'

	return (
		<div ref={ref} className={[baseClass, className].filter(Boolean).join(' ')} data-revealed={revealed}>
			{children}
		</div>
	)
}



