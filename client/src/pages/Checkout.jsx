import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import { ROUTES } from '../constants/routes'
import { COMPANY } from '../constants/config'
import { createOrder } from '../services/orders'
import Breadcrumbs from '../components/common/Breadcrumbs'
import styles from './Checkout.module.css'

const INITIAL_FORM = {
  companyName:    '',
  contactName:    '',
  email:          '',
  phone:          '',
  dotNumber:      '',
  billingAddress: '',
  notes:          '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, itemCount, subtotal, tax, total, clearCart } = useCart()
  const [form, setForm]         = useState(INITIAL_FORM)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(null) // { invoiceNumber, orderId }

  const breadcrumbs = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Cart', href: ROUTES.CART },
    { label: 'Checkout' },
  ]

  const validate = () => {
    const e = {}
    if (!form.companyName.trim())    e.companyName    = 'Company name is required'
    if (!form.contactName.trim())    e.contactName    = 'Contact name is required'
    if (!form.email.trim())          e.email          = 'Email is required'
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone.trim())          e.phone          = 'Phone is required'
    if (!form.dotNumber.trim())      e.dotNumber      = 'DOT number is required'
    if (!form.billingAddress.trim()) e.billingAddress = 'Billing address is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const result = await createOrder({
        customer: {
          companyName:    form.companyName,
          contactName:    form.contactName,
          email:          form.email,
          phone:          form.phone,
          dotNumber:      form.dotNumber,
          billingAddress: form.billingAddress,
        },
        items,
        notes: form.notes,
      })
      clearCart()
      setSuccess(result)
    } catch (err) {
      // Backend not connected yet — simulate success in development
      if (import.meta.env.DEV) {
        clearCart()
        setSuccess({ invoiceNumber: 'FC-00001', orderId: 1 })
      } else {
        setErrors({ submit: err.message ?? 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (!success && items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumbsWrap}><Breadcrumbs items={breadcrumbs} /></div>
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link to={ROUTES.CATALOG} className={styles.backBtn}>Browse Catalog</Link>
        </div>
      </div>
    )
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumbsWrap}><Breadcrumbs items={breadcrumbs} /></div>
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 className={styles.successTitle}>Invoice Requested!</h1>
          <p className={styles.successInvoice}>Invoice # <strong>{success.invoiceNumber}</strong></p>
          <p className={styles.successText}>
            Thank you! Your invoice will be emailed to <strong>{form.email}</strong> within 24 hours.
            Payment terms: <strong>Net 30</strong>.
          </p>
          <p className={styles.successContact}>
            Questions? Call us at <a href={COMPANY.phoneHref}>{COMPANY.phone}</a> or email{' '}
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
          </p>
          <Link to={ROUTES.HOME} className={styles.successBtn}>Back to Home</Link>
        </div>
      </div>
    )
  }

  // ── Checkout form ─────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbsWrap}><Breadcrumbs items={breadcrumbs} /></div>

      <div className={styles.container}>
        <h1 className={styles.heading}>Request Invoice</h1>

        <div className={styles.layout}>

          {/* ── Customer Form ─────────────────────────────────────────── */}
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Company Information</legend>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="companyName">Company Name *</label>
                <input id="companyName" name="companyName" className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                  value={form.companyName} onChange={handleChange} placeholder="ABC Trucking LLC" />
                {errors.companyName && <span className={styles.error}>{errors.companyName}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="dotNumber">DOT Number *</label>
                <input id="dotNumber" name="dotNumber" className={`${styles.input} ${errors.dotNumber ? styles.inputError : ''}`}
                  value={form.dotNumber} onChange={handleChange} placeholder="US DOT 1234567" />
                {errors.dotNumber && <span className={styles.error}>{errors.dotNumber}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="billingAddress">Billing Address *</label>
                <input id="billingAddress" name="billingAddress" className={`${styles.input} ${errors.billingAddress ? styles.inputError : ''}`}
                  value={form.billingAddress} onChange={handleChange} placeholder="123 Main St, Sacramento, CA 95814" />
                {errors.billingAddress && <span className={styles.error}>{errors.billingAddress}</span>}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Contact Person</legend>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contactName">Full Name *</label>
                <input id="contactName" name="contactName" className={`${styles.input} ${errors.contactName ? styles.inputError : ''}`}
                  value={form.contactName} onChange={handleChange} placeholder="John Smith" />
                {errors.contactName && <span className={styles.error}>{errors.contactName}</span>}
              </div>

              <div className={styles.twoCol}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={form.email} onChange={handleChange} placeholder="john@abctrucking.com" />
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">Phone *</label>
                  <input id="phone" name="phone" type="tel" className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    value={form.phone} onChange={handleChange} placeholder="(916) 555-0123" />
                  {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                </div>
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Additional Notes</legend>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="notes">Notes <span className={styles.optional}>(optional)</span></label>
                <textarea id="notes" name="notes" className={styles.textarea} rows={3}
                  value={form.notes} onChange={handleChange}
                  placeholder="Preferred pick-up time, special instructions…" />
              </div>
            </fieldset>

            {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending…' : 'Request Invoice'}
            </button>

            <p className={styles.terms}>
              By submitting you agree to our{' '}
              <Link to="/terms">Terms of Service</Link>.
              Invoice will be sent to your email. Payment due Net 30.
            </p>
          </form>

          {/* ── Order Summary ─────────────────────────────────────────── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.key} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>
                    {item.name}
                    <em className={styles.summaryItemSize}>{item.size}</em>
                  </span>
                  <span className={styles.summaryItemQty}>×{item.quantity}</span>
                  <span className={styles.summaryItemTotal}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
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

            <div className={styles.summaryPayment}>
              <strong>Payment terms:</strong> Net 30 days<br/>
              <strong>Method:</strong> Invoice only<br/>
              <strong>Invoice format:</strong> FC-XXXXX
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
