import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' },
]

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function formatZip(value) {
  const digits = value.replace(/\D/g, '').slice(0, 9)
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return digits
}
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import { ROUTES } from '../constants/routes'
import { COMPANY } from '../constants/config'
import { createOrder } from '../services/orders'
import styles from './Checkout.module.css'

const INITIAL_FORM = {
  companyName: '',
  contactName: '',
  email:       '',
  phone:       '',
  dotNumber:   '',
  street:      '',
  city:        '',
  state:       '',
  zip:         '',
  notes:       '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, itemCount, subtotal, tax, total, clearCart } = useCart()
  const [form, setForm]         = useState(INITIAL_FORM)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(null) // { invoiceNumber, orderId }

  const validate = () => {
    const e = {}
    if (!form.companyName.trim())    e.companyName    = 'Company name is required'
    if (!form.contactName.trim())    e.contactName    = 'Contact name is required'
    if (!form.email.trim())          e.email          = 'Email is required'
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone.trim())  e.phone  = 'Phone is required'
    if (!form.street.trim())  e.street = 'Street address is required'
    if (!form.city.trim())    e.city   = 'City is required'
    if (!form.state)          e.state  = 'Please select a state'
    if (!form.zip.trim())     e.zip    = 'ZIP code is required'
    else if (!/^\d{5}(-\d{4})?$/.test(form.zip)) e.zip = 'Enter a valid ZIP (e.g. 95814 or 95814-1234)'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handlePhone = (e) => {
    const formatted = formatPhone(e.target.value)
    setForm((prev) => ({ ...prev, phone: formatted }))
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  const handleZip = (e) => {
    const formatted = formatZip(e.target.value)
    setForm((prev) => ({ ...prev, zip: formatted }))
    if (errors.zip) setErrors((prev) => ({ ...prev, zip: undefined }))
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
          billingAddress: `${form.street}, ${form.city}, ${form.state} ${form.zip}`,
          street:         form.street,
          city:           form.city,
          state:          form.state,
          zip:            form.zip,
        },
        items,
        notes: form.notes,
      })
      clearCart()
      setSuccess(result)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      // Backend not connected yet — simulate success in development
      if (import.meta.env.DEV) {
        clearCart()
        setSuccess({ invoiceNumber: 'FC-00001', orderId: 1 })
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
      <div className={styles.pageSuccess}>
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
            Thank you! Your invoice will be emailed to <strong>{form.email}</strong> within 60 seconds.
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
                <label className={styles.label} htmlFor="dotNumber">DOT Number <span className={styles.optional}>(optional)</span></label>
                <input id="dotNumber" name="dotNumber" className={styles.input}
                  value={form.dotNumber} onChange={handleChange} placeholder="US DOT 1234567" />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="street">Street Address *</label>
                <input id="street" name="street"
                  className={`${styles.input} ${errors.street ? styles.inputError : ''}`}
                  value={form.street} onChange={handleChange} placeholder="123 Main St, Suite 200" />
                {errors.street && <span className={styles.error}>{errors.street}</span>}
              </div>

              <div className={styles.twoCol}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="city">City *</label>
                  <input id="city" name="city"
                    className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                    value={form.city} onChange={handleChange} placeholder="Sacramento" />
                  {errors.city && <span className={styles.error}>{errors.city}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="zip">ZIP Code *</label>
                  <input id="zip" name="zip" inputMode="numeric"
                    className={`${styles.input} ${errors.zip ? styles.inputError : ''}`}
                    value={form.zip} onChange={handleZip} placeholder="95814" maxLength={10} />
                  {errors.zip && <span className={styles.error}>{errors.zip}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="state">State *</label>
                <select id="state" name="state"
                  className={`${styles.select} ${errors.state ? styles.inputError : ''}`}
                  value={form.state} onChange={handleChange}>
                  <option value="">Select state…</option>
                  {US_STATES.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
                {errors.state && <span className={styles.error}>{errors.state}</span>}
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
                  <input id="phone" name="phone" type="tel" inputMode="numeric"
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    value={form.phone} onChange={handlePhone} placeholder="(916) 555-0123" />
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
              {loading
                ? <><span className={styles.spinner} aria-hidden="true" /> Sending…</>
                : 'Request Invoice'
              }
            </button>

            <p className={styles.terms}>
              By submitting you agree to our{' '}
              <Link to="/terms">Terms of Service</Link>.
              Invoice will be sent to your email.
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
                <span>Est. Tax *</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <p className={styles.taxNote}>
              * Tax rate varies by delivery state. Exact amount will be confirmed on invoice.
            </p>

          </aside>

        </div>
      </div>
    </div>
  )
}
