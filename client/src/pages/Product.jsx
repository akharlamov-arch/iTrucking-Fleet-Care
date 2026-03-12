import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useCatalog } from '../hooks/useCatalog'
import { formatPrice } from '../utils/format'
import { ROUTES } from '../constants/routes'
import { INVOICE } from '../constants/config'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { assetUrl } from '../utils/assetUrl'
import styles from './Product.module.css'

const PRODUCT_DATA = {
  id: 1,
  name: 'Hankook Smart Flex DL15+',
  brand: 'Hankook',
  brandLogo: '/images/hankook-logo.png',
  image: '/images/tire-product.png',
  price: 485,
  retailPrice: 795,
  discount: 40,
  tags: ['Long Haul', 'Steer (All)', 'M+S', 'S3PMSF'],
  sizes: ['295/60R22.5', '285/75R24.5', '315/80R22.5'],
  availability: {
    sacramento: { status: 'low', label: 'small quantity at Sacramento\'s warehouse' },
    loves: { status: 'in-stock', label: 'in stock at Love\'s & Speedco' },
  },
  description: {
    text: [
      'The Hankook Smart Flex DL15+ 295/75R22.5 G/14PLY Tires is a Commercial Truck — Drive tire. Manufacturer part number: 3003870.',
      'The Hankook Smart Flex DL15+ is a premium drive axle tire engineered for long and regional haul applications. This tire delivers exceptional fuel efficiency and optimized traction performance, contributing to cost savings and reliable operation. Built with Hankook\'s Smartec TBR technology, the Smart Flex DL15+ provides a balance of safety, mileage, and resistance to chipping and cutting. Its advanced design minimizes tire deformation and enhances energy dispersion, promoting even wear and extended tread life. The 3-Dimensional sipes contribute to excellent mileage and traction. M+S Rated.',
    ],
    brandText: 'Hankook Tires, founded in 1941 and headquartered in South Korea, is one of the world\'s leading and fastest-growing tire manufacturers. Operating in over 160 countries, Hankook is acclaimed for its cutting-edge technology and unwavering commitment to innovation, providing high-performance and eco-friendly tire solutions that enhance safety, comfort, and driving pleasure for a wide range of vehicles, including passenger cars, SUVs, trucks, and buses.',
  },
  specifications: [
    { spec: 'Sidewall', value: 'Not available', description: 'Describes the sidewall appearance. Examples: BSW = Black Side Wall, WSW = White Side Wall, OWL = Outlined White Letters.' },
    { spec: 'Tread Pattern', value: 'Available', description: 'The design of the tire\'s tread which affects traction and handling. Examples: Symmetrical, Asymmetrical, Directional.' },
    { spec: 'Tread Depth', value: '6/32"', description: 'Indicates the remaining depth of the tire\'s tread. Affects performance and safety.' },
    { spec: 'Load Index', value: 'Load Range C', description: 'Indicates the maximum load the tire can support at a specified inflation pressure.' },
    { spec: 'Speed Rating', value: 'H (130 mph)', description: 'Indicates the maximum speed the tire can safely sustain.' },
    { spec: 'Aspect Ratio', value: '55', description: 'The ratio of the tire\'s sidewall height to its width, affecting handling and comfort.' },
    { spec: 'Diameter', value: '17 inches', description: 'The rim diameter that the tire is designed to fit.' },
    { spec: 'Seasonality', value: 'All-Season', description: 'Indicates if the tire is suitable for use in various weather conditions.' },
    { spec: 'Warranty', value: '60,000 miles', description: 'The manufacturer\'s guarantee regarding the tire\'s lifespan and performance.' },
  ],
  sizeDetails: [
    { size: '11R22.5', loadIndex: '144/142L', loadRange: 'G/14PLY', diameter: '41.7', maxDual: '5840', mfg: '3004004' },
    { size: '12R22.5', loadIndex: '145/143L', loadRange: 'H/14PLY', diameter: '43.2', maxDual: '6000', mfg: '3004005' },
    { size: '13R22.5', loadIndex: '146/144L', loadRange: 'G/14PLY', diameter: '44.5', maxDual: '6200', mfg: '3004006' },
    { size: '14R22.5', loadIndex: '147/145L', loadRange: 'H/14PLY', diameter: '45.9', maxDual: '6400', mfg: '3004007' },
    { size: '15R22.5', loadIndex: '148/146L', loadRange: 'G/14PLY', diameter: '47.3', maxDual: '6600', mfg: '3004008' },
    { size: '16R22.5', loadIndex: '149/147L', loadRange: 'H/14PLY', diameter: '48.7', maxDual: '6800', mfg: '3004009' },
    { size: '17R22.5', loadIndex: '150/148L', loadRange: 'G/14PLY', diameter: '50.1', maxDual: '7000', mfg: '3004010' },
    { size: '18R22.5', loadIndex: '151/149L', loadRange: 'H/14PLY', diameter: '51.5', maxDual: '7200', mfg: '3004011' },
    { size: '19R22.5', loadIndex: '152/150L', loadRange: 'G/14PLY', diameter: '52.9', maxDual: '7400', mfg: '3004012' },
  ],
}

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { products, getFamily } = useCatalog()

  // Merge catalog sheet data (name, price, image, description…)
  // with static detail data (specs table, size chart) as fallback
  const product = useMemo(() => {
    const cp = products.find(p => p.id === id)
    if (!cp) return PRODUCT_DATA
    const capBrand = cp.brand
      ? cp.brand.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
      : PRODUCT_DATA.brand

    // Build specs: use PRODUCT_DATA rows as template (preserves spec name + description),
    // replace value with catalog value if present
    const specKeyMap = {
      sidewall:     0, treadPattern: 1, treadDepth: 2, loadIndex:   3,
      speedRating:  4, aspectRatio:  5, diameter:   6, seasonality: 7, warranty: 8,
    }
    const specifications = PRODUCT_DATA.specifications.map((row, i) => {
      const catalogSpec = cp.specifications?.find(s => specKeyMap[s.key] === i)
      return catalogSpec?.value ? { ...row, value: catalogSpec.value } : row
    })

    return {
      ...PRODUCT_DATA,
      name:           cp.name,
      brand:          capBrand,
      brandLogo:      cp.brandLogo  || PRODUCT_DATA.brandLogo,
      image:          cp.image      || PRODUCT_DATA.image,
      price:          cp.priceNum   || PRODUCT_DATA.price,
      retailPrice:    cp.discountNum > 0
        ? Math.round(cp.priceNum / (1 - cp.discountNum / 100))
        : PRODUCT_DATA.retailPrice,
      discount:       cp.discountNum || PRODUCT_DATA.discount,
      tags:           cp.tags.length ? cp.tags : PRODUCT_DATA.tags,
      // currentSize = the actual size of THIS product page (used in Add to Cart)
      currentSize:    cp.size       || PRODUCT_DATA.sizes[0],
      specifications,
      description: {
        text:      cp.description ? [cp.description] : PRODUCT_DATA.description.text,
        brandText: cp.brandText   || PRODUCT_DATA.description.brandText,
      },
      availability: {
        sacramento: {
          status: cp.availSacStatus  || PRODUCT_DATA.availability.sacramento.status,
          label:  cp.availSacLabel   || PRODUCT_DATA.availability.sacramento.label,
        },
        loves: {
          status: cp.availLovesStatus || PRODUCT_DATA.availability.loves.status,
          label:  cp.availLovesLabel  || PRODUCT_DATA.availability.loves.label,
        },
      },
    }
  }, [products, id])

  // All products that share the same family_id as the current product.
  // Each sibling = one tire size. Used for the size selector and Size Details table.
  const siblings = useMemo(() => {
    const cp = products.find(p => p.id === id)
    if (!cp?.familyId) return []
    return getFamily(cp.familyId)
  }, [products, id, getFamily])

  // For size selector: when siblings exist navigate to that product page;
  // otherwise fall back to local state (PRODUCT_DATA fallback mode)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])

  const sizeOptions = siblings.length > 0
    ? siblings.map(s => s.size)
    : product.sizes

  const activeSizeValue = siblings.length > 0 ? product.currentSize : selectedSize

  function handleSizeChange(e) {
    const chosen = e.target.value
    if (siblings.length > 0) {
      const target = siblings.find(s => s.size === chosen)
      if (target) navigate(ROUTES.productById(target.id))
    } else {
      setSelectedSize(chosen)
    }
  }
  const [quantity, setQuantity] = useState(4)
  const [activeTab, setActiveTab] = useState('description')

  // ── Love's modal ──────────────────────────────────────────────────────────
  const LOVES_FORM_INIT = { fullName: '', companyName: '', phone: '', email: '' }
  const [lovesOpen,    setLovesOpen]    = useState(false)
  const [lovesForm,    setLovesForm]    = useState(LOVES_FORM_INIT)
  const [lovesErrors,  setLovesErrors]  = useState({})
  const [lovesLoading, setLovesLoading] = useState(false)
  const [lovesSuccess, setLovesSuccess] = useState(false)
  const modalRef = useRef(null)

  // Close on Escape / outside click
  useEffect(() => {
    if (!lovesOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lovesOpen])

  function openLovesModal() { setLovesOpen(true); setLovesSuccess(false); setLovesForm(LOVES_FORM_INIT); setLovesErrors({}) }
  function closeModal()     { setLovesOpen(false) }

  function formatPhone(v) {
    const d = v.replace(/\D/g, '').slice(0, 10)
    if (d.length < 4) return d
    if (d.length < 7) return `(${d.slice(0,3)}) ${d.slice(3)}`
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
  }

  function handleLovesChange(e) {
    const { name, value } = e.target
    const next = name === 'phone' ? formatPhone(value) : value
    setLovesForm(p => ({ ...p, [name]: next }))
    if (lovesErrors[name]) setLovesErrors(p => ({ ...p, [name]: undefined }))
  }

  async function handleLovesSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!lovesForm.fullName.trim())    errs.fullName    = 'Required'
    if (!lovesForm.companyName.trim()) errs.companyName = 'Required'
    if (!lovesForm.phone.trim())       errs.phone       = 'Required'
    if (!lovesForm.email.trim())       errs.email       = 'Required'
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(lovesForm.email)) errs.email = 'Invalid email'
    if (Object.keys(errs).length) { setLovesErrors(errs); return }

    setLovesLoading(true)
    // Backend not connected yet — simulate success
    await new Promise(r => setTimeout(r, 900))
    setLovesLoading(false)
    setLovesSuccess(true)
  }

  const pricing = useMemo(() => {
    const totalRetail = product.retailPrice * quantity
    const priceTotal = product.price * quantity
    const totalDiscount = totalRetail - priceTotal
    const totalTax = +(priceTotal * INVOICE.taxRate).toFixed(2)
    const totalWithDiscounts = +(priceTotal + totalTax).toFixed(2)
    return { totalRetail, totalDiscount, totalTax, totalWithDiscounts }
  }, [quantity, product.price, product.retailPrice])

  const handleBuy = (location) => {
    addItem({
      productId: product.id,
      name:      product.name,
      brand:     product.brand,
      size:      activeSizeValue,
      location,
      price:     product.price,
      quantity,
      image:     product.image,
    })
    navigate(ROUTES.CART)
  }

  const breadcrumbs = [
    { label: 'Home',      href: ROUTES.HOME },
    { label: 'All Tires', href: ROUTES.CATALOG },
    { label: product.name },
  ]

  return (
    <div className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      {/* Product layout */}
      <section className={styles.productSection}>
        <div className={styles.productContainer}>
          <div className={styles.productLayout}>

            {/* Column 1 — Media */}
            <div className={styles.productImageWrap}>
              <img src={assetUrl(product.image)} alt={product.name} className={styles.productImage} />
            </div>

            {/* Column 2 — Info */}
            <div className={styles.productInfo}>
              <h1 className={styles.productTitle}>{product.name}</h1>

              {/* Size select */}
              <div className={styles.selectWrap}>
                <span className={styles.selectLabel}>Tire Size</span>
                <select
                  className={styles.productSelect}
                  value={activeSizeValue}
                  onChange={handleSizeChange}
                >
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Price block */}
              <div className={styles.priceBlock}>
                <span className={styles.perTireLabel}>per tire</span>
                <div className={styles.priceRow}>
                  <span className={styles.priceCurrent}>{formatPrice(product.price)}</span>
                  <span className={styles.priceRetail}>{formatPrice(product.retailPrice)} retail price</span>
                  <span className={styles.priceDiscount}>-{product.discount}%</span>
                </div>
              </div>

              {/* Quantity + Availability row */}
              <div className={styles.qtyAvailRow}>
                {/* Quantity stepper */}
                <div className={styles.selectWrap}>
                  <span className={styles.selectLabel}>Quantity</span>
                  <div className={styles.qtyStepper}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                    >−</button>
                    <span className={styles.qtyValue}>
                      {quantity} {quantity === 1 ? 'tire' : 'tires'}
                    </span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQuantity(q => q + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>

                {/* Availability */}
                <div className={styles.availabilityRow}>
                  <span className={styles.availabilityLabel}>Availability</span>
                  <div className={styles.availabilityItems}>
                    <div className={styles.availabilityItem}>
                      <span className={`${styles.availabilityDot} ${styles.dotOrange}`}></span>
                      {product.availability.sacramento.label}
                    </div>
                    <div className={styles.availabilityItem}>
                      <span className={`${styles.availabilityDot} ${styles.dotGreen}`}></span>
                      {product.availability.loves.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className={styles.productButtons}>
                <button className={styles.btnPrimary} onClick={() => handleBuy('sacramento')}>
                  Buy in Sacramento's Warehouse
                </button>
                <button className={styles.btnSecondary} onClick={openLovesModal}>
                  Buy at any Love's &amp; Speedco truck stops
                </button>
              </div>

              {/* Price summary */}
              <div className={styles.priceSummary}>
                <div className={`${styles.summaryRow} ${styles.summaryRetail}`}>
                  <span>Retail price ×{quantity}</span>
                  <span>{formatPrice(pricing.totalRetail)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                  <span>Total discount</span>
                  <span>-{formatPrice(pricing.totalDiscount)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Total tax</span>
                  <span>{formatPrice(pricing.totalTax)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total with discounts</span>
                  <span>{formatPrice(pricing.totalWithDiscounts)}</span>
                </div>
              </div>
            </div>

            {/* Column 3 — Tags + Brand */}
            <div className={styles.productMeta}>
              <div className={styles.brandLogo}>
                <img src={assetUrl(product.brandLogo)} alt={product.brand} />
              </div>
              <div className={styles.productTags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.productTag}>{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs section */}
      <section className={styles.tabsSection}>
        <div className={styles.tabsContainer}>

          {/* Tab nav */}
          <nav className={styles.tabsNav}>
            {[
              { key: 'description', label: 'Description' },
              { key: 'specifications', label: 'Specifications' },
              { key: 'shipping', label: 'Shipping & Payment' },
              { key: 'size-details', label: 'Size Details' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`${styles.tabBtn} ${activeTab === key ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className={styles.tabPanel}>
              <div className={styles.descriptionLayout}>
                <div className={styles.descriptionContent}>
                  <h2 className={styles.tabHeading}>Description</h2>
                  {product.description.text.map((p, i) => (
                    <p key={i} className={styles.descriptionText}>{p}</p>
                  ))}
                </div>
                <div className={styles.brandCard}>
                  <div className={styles.brandCardLogo}>
                    <img src={assetUrl(product.brandLogo)} alt={product.brand} />
                  </div>
                  <p className={styles.brandCardText}>{product.description.brandText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className={styles.tabPanel}>
              <h2 className={styles.tabHeading}>Specifications</h2>
              <div className={styles.tableWrap}>
                <table className={styles.specsTable}>
                  <thead>
                    <tr>
                      <th>Specs</th>
                      <th>Value</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specifications.map((row) => (
                      <tr key={row.spec}>
                        <td data-label="Specs">{row.spec}</td>
                        <td data-label="Value">{row.value}</td>
                        <td data-label="Description">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Shipping & Payment Tab */}
          {activeTab === 'shipping' && (
            <div className={styles.tabPanel}>
              <div className={styles.shippingSection}>
                <div className={styles.shippingBlock}>
                  <h2 className={styles.tabHeading}>Shipping</h2>
                  <div className={styles.shippingCols}>
                    <div className={styles.shippingCol}>
                      <h3 className={styles.shippingColTitle}>Love's &amp; Speedco Truck Stops</h3>
                      <p className={styles.shippingColText}>With Love's &amp; Speedco Truck Stops option, you will receive detailed instructions on how to redeem our generous company discount on any tire model, at any time you need. This ensures that you can take full advantage of our offers, making your tire purchases more affordable and convenient.</p>
                    </div>
                    <div className={styles.shippingCol}>
                      <h3 className={styles.shippingColTitle}>Sacramento's Warehouse</h3>
                      <p className={styles.shippingColText}>You can conveniently pick up your tires at our Sacramento warehouse, which is situated at 3951 Development Drive, Unit 4, Sacramento, CA 95838. Our warehouse is open for pickups from 9 a.m. to 4 p.m., ensuring you have ample time to collect your order. We look forward to serving you!</p>
                    </div>
                  </div>
                </div>
                <div className={styles.shippingBlock}>
                  <h2 className={styles.tabHeading}>Payment</h2>
                  <div className={styles.shippingCols}>
                    <div className={styles.shippingCol}>
                      <h3 className={styles.shippingColTitle}>Love's &amp; Speedco Truck Stops</h3>
                      <p className={styles.shippingColText}>With Love's &amp; Speedco Truck Stops, you can pay directly at the location using either cash or card.</p>
                    </div>
                    <div className={styles.shippingCol}>
                      <h3 className={styles.shippingColTitle}>Sacramento's Warehouse</h3>
                      <p className={styles.shippingColText}>You can pay for your tires online on the website or at our Sacramento warehouse using either cash or card.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Size Details Tab */}
          {activeTab === 'size-details' && (
            <div className={styles.tabPanel}>
              <h2 className={styles.tabHeading}>Size Details</h2>
              <div className={styles.tableWrap}>
                <table className={styles.specsTable}>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Load Index</th>
                      <th>Load Range / Ply Rating</th>
                      <th>Overall Diameter</th>
                      <th>Max Dual Load</th>
                      <th>MFG #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siblings.length > 0
                      ? siblings.map((s) => {
                          const isCurrent = s.id === id
                          return (
                            <tr
                              key={s.id}
                              className={isCurrent ? styles.sizeRowCurrent : styles.sizeRowLink}
                              onClick={() => !isCurrent && navigate(ROUTES.productById(s.id))}
                              title={isCurrent ? 'Currently viewing' : `Open ${s.size}`}
                            >
                              <td data-label="Size"><strong>{s.size}</strong></td>
                              <td data-label="Load Index">{s.loadIndex}</td>
                              <td data-label="Load Range/Ply Rating">{s.loadRange}</td>
                              <td data-label="Overall Diameter">{s.overallDiameter}</td>
                              <td data-label="Max Dual Load">{s.maxDual}</td>
                              <td data-label="MFG #">{s.mfgNumber}</td>
                            </tr>
                          )
                        })
                      : product.sizeDetails.map((row) => (
                          <tr key={row.size}>
                            <td data-label="Size"><strong>{row.size}</strong></td>
                            <td data-label="Load Index">{row.loadIndex}</td>
                            <td data-label="Load Range/Ply Rating">{row.loadRange}</td>
                            <td data-label="Overall Diameter">{row.diameter}</td>
                            <td data-label="Max Dual Load">{row.maxDual}</td>
                            <td data-label="MFG #">{row.mfg}</td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── Love's & Speedco modal ─────────────────────────────────────── */}
      {lovesOpen && createPortal(
        <div className={styles.lovesOverlay} onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className={styles.lovesModal} ref={modalRef}>
            <button className={styles.lovesClose} aria-label="Close" onClick={closeModal}>&times;</button>

            {lovesSuccess ? (
              <div className={styles.lovesSuccess}>
                <div className={styles.lovesCheckCircle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className={styles.lovesSuccessTitle}>Instructions sent!</h2>
                <p className={styles.lovesSuccessText}>
                  We've sent discount instructions to <strong>{lovesForm.email}</strong>.<br/>
                  Show them at any Love's or Speedco location to redeem your fleet discount.
                </p>
                <button className={styles.lovesDoneBtn} onClick={closeModal}>Done</button>
              </div>
            ) : (
              <>
                <h2 className={styles.lovesTitle}>Get discount instructions</h2>
                <p className={styles.lovesSubtitle}>
                  Fill in your details and we'll send step-by-step instructions on how to use
                  your fleet discount at any Love's &amp; Speedco truck stop.
                </p>

                <form className={styles.lovesForm} onSubmit={handleLovesSubmit} noValidate>
                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Full Name *</label>
                    <input
                      className={`${styles.lovesInput}${lovesErrors.fullName ? ' ' + styles.lovesInputErr : ''}`}
                      name="fullName" value={lovesForm.fullName} onChange={handleLovesChange}
                      placeholder="John Smith"
                    />
                    {lovesErrors.fullName && <span className={styles.lovesErr}>{lovesErrors.fullName}</span>}
                  </div>

                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Company Name *</label>
                    <input
                      className={`${styles.lovesInput}${lovesErrors.companyName ? ' ' + styles.lovesInputErr : ''}`}
                      name="companyName" value={lovesForm.companyName} onChange={handleLovesChange}
                      placeholder="ABC Trucking LLC"
                    />
                    {lovesErrors.companyName && <span className={styles.lovesErr}>{lovesErrors.companyName}</span>}
                  </div>

                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Phone *</label>
                    <input
                      className={`${styles.lovesInput}${lovesErrors.phone ? ' ' + styles.lovesInputErr : ''}`}
                      name="phone" value={lovesForm.phone} onChange={handleLovesChange}
                      placeholder="(555) 000-0000" type="tel"
                    />
                    {lovesErrors.phone && <span className={styles.lovesErr}>{lovesErrors.phone}</span>}
                  </div>

                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Email *</label>
                    <input
                      className={`${styles.lovesInput}${lovesErrors.email ? ' ' + styles.lovesInputErr : ''}`}
                      name="email" value={lovesForm.email} onChange={handleLovesChange}
                      placeholder="john@company.com" type="email"
                    />
                    {lovesErrors.email && <span className={styles.lovesErr}>{lovesErrors.email}</span>}
                    <span className={styles.lovesHint}>Instructions will be sent to this email address</span>
                  </div>

                  <button
                    type="submit"
                    className={styles.lovesSubmit}
                    disabled={lovesLoading}
                  >
                    {lovesLoading
                      ? <><span className={styles.lovesSpinner} aria-hidden="true"/> Sending…</>
                      : 'Send Instructions'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>,
      document.body
      )}
    </div>
  )
}
