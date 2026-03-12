import { useEffect, useRef, useState } from 'react'
import styles from './Reveal.module.css'

/**
 * Reveal
 * Fades children into view as they enter the viewport (IntersectionObserver).
 * Animation fires once, then the observer disconnects.
 *
 * Props
 *   direction  'up' | 'left' | 'right' | 'scale' | 'fade'  (default 'up')
 *   delay      delay in ms before the animation starts
 *   threshold  0–1, portion of element visible before triggering (default 0.12)
 *   as         HTML tag to render, default 'div'
 *   className  extra CSS class forwarded to the wrapper
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.12,
  className = '',
  as: Tag = 'div',
}) {
  const ref     = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const dirClass = {
    up:    styles.revealUp,
    left:  styles.revealLeft,
    right: styles.revealRight,
    scale: styles.revealScale,
    fade:  styles.revealFade,
  }[direction] ?? styles.revealUp

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${dirClass} ${visible ? styles.visible : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
