import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

/**
 * Breadcrumbs
 * items: Array<{ label: string, href?: string }>
 * Last item is rendered as active (no link).
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <div className={styles.container}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <span key={i} className={styles.item}>
              {i > 0 && <span className={styles.sep} aria-hidden>/</span>}
              {isLast || !item.href
                ? <span className={isLast ? styles.current : ''} aria-current={isLast ? 'page' : undefined}>{item.label}</span>
                : <Link to={item.href}>{item.label}</Link>
              }
            </span>
          )
        })}
      </div>
    </nav>
  )
}
