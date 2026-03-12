// Place your images in client/public/images/
// e.g. tire-product.png → /images/tire-product.png

import { Link } from 'react-router-dom'
import { assetUrl } from '../../utils/assetUrl'
import styles from './TireCard.module.css'

/**
 * TireCard
 * Props:
 *   id                – product id for the Link
 *   badge             – { text: string, variant: 'red'|'blue' }
 *   price             – string  e.g. '$485.00'
 *   oldPrice          – string  e.g. '$795.00 retail price'
 *   discount          – string  e.g. '-40%'
 *   name              – string
 *   size              – string  e.g. '295/60R22.5'
 *   tags              – string[]
 *   image             – string  public path  e.g. '/images/hankook-dl15.png'
 *   onBuySacramento   – optional callback; if provided renders a <button> instead of <Link>
 *   onBuyLoves        – optional callback; if provided renders a <button> instead of <Link>
 */
export default function TireCard({
  id = '#', badge, price, oldPrice, discount, name, size, tags = [],
  image = '/images/tire-product.png',
  onBuySacramento, onBuyLoves,
}) {
  return (
    <article className={styles.card}>
      <Link to={`/product/${id}`} className={styles.imageWrapper}>
        {badge && (
          <span className={`${styles.badge} ${badge.variant === 'blue' ? styles.badgeBlue : styles.badgeRed}`}>
            {badge.text}
          </span>
        )}
        <img src={assetUrl(image)} alt={name} className={styles.image} loading="lazy" />
      </Link>

      <div className={styles.info}>
        <div className={styles.pricing}>
          <span className={styles.price}>{price}</span>
          {oldPrice && <span className={styles.oldPrice}>{oldPrice}</span>}
          {discount && <span className={styles.discount}>{discount}</span>}
        </div>

        <Link to={`/product/${id}`} className={styles.nameLink}>
          <h3 className={styles.name}>{name}</h3>
        </Link>

        <p className={styles.size}>{size}</p>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}

        <div className={styles.actions}>
          {onBuySacramento
            ? <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onBuySacramento}>Buy in Sacramento</button>
            : <Link to={`/product/${id}`} className={`${styles.btn} ${styles.btnPrimary}`}>Buy in Sacramento</Link>
          }
          {onBuyLoves
            ? <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onBuyLoves}>Buy at Love&apos;s</button>
            : <Link to={`/product/${id}`} className={`${styles.btn} ${styles.btnSecondary}`}>Buy at Love&apos;s</Link>
          }
        </div>
      </div>
    </article>
  )
}
