import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import { ROUTES } from '../constants/routes'
import Breadcrumbs from '../components/common/Breadcrumbs'
import styles from './Cart.module.css'

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
)

const LOCATION_LABELS = {
  sacramento: 'Sacramento',
  loves:      "Love's & Speedco",
}

export default function Cart() {
  const { items, itemCount, subtotal, tax, total, removeItem, updateQuantity } = useCart()

  const breadcrumbs = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Cart' },
  ]

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumbsWrap}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E2E2E2" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptyText}>Browse our tire catalog and add tires to get started.</p>
          <Link to={ROUTES.CATALOG} className={styles.emptyBtn}>Browse Catalog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbsWrap}>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className={styles.container}>
        <h1 className={styles.heading}>
          Cart <span className={styles.count}>{itemCount} {itemCount === 1 ? 'tire' : 'tires'}</span>
        </h1>

        <div className={styles.layout}>
          {/* Items list */}
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.key} className={styles.item}>
                <div className={styles.itemImage}>
                  <img src={item.image || '/images/tire-product.png'} alt={item.name} />
                </div>

                <div className={styles.itemInfo}>
                  <Link to={ROUTES.productById(item.productId)} className={styles.itemName}>
                    {item.name}
                  </Link>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemSize}>{item.size}</span>
                    <span className={styles.itemLocation}>
                      {LOCATION_LABELS[item.location] ?? item.location}
                    </span>
                  </div>
                  <span className={styles.itemUnitPrice}>{formatPrice(item.price)} / tire</span>
                </div>

                <div className={styles.itemQty}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon />
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon />
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.key)}
                  aria-label="Remove item"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({itemCount} tires)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (10%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <p className={styles.summaryNote}>
              Payment by invoice only. We will email your Net 30 invoice within 24 hours after order confirmation.
            </p>

            <Link to={ROUTES.CHECKOUT} className={styles.checkoutBtn}>
              Request Invoice
            </Link>

            <Link to={ROUTES.CATALOG} className={styles.continueLink}>
              ← Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
