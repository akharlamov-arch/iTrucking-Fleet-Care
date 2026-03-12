import { useLocation } from 'react-router-dom'
import styles from './PageTransition.module.css'

/**
 * PageTransition
 * Wraps any page content and re-triggers the enter animation
 * on every navigation by keying the wrapper to location.key.
 */
export default function PageTransition({ children }) {
  const location = useLocation()
  return (
    <div key={location.key} className={styles.enter}>
      {children}
    </div>
  )
}
