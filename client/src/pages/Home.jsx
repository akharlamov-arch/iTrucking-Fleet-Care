import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useCart } from '../hooks/useCart'
import { useCatalog } from '../hooks/useCatalog'
import TireCard from '../components/common/TireCard'
import Reveal from '../components/common/Reveal'
import { assetUrl } from '../utils/assetUrl'
import styles from './Home.module.css'

// ── inline SVG helpers ────────────────────────────────────────────────────────
const TruckIcon = () => (
  <svg width="24" height="15" viewBox="0 0 24 15" fill="none">
    <path d="M2.00329 9.67314L0 15H5.28649L7.28978 9.67314H2.00329Z" fill="currentColor"/>
    <path d="M13.0723 15H16.1582C17.4827 15 18.6692 14.1746 19.1385 12.9265L20.362 9.67314H15.0756L13.0723 15Z" fill="currentColor"/>
    <path d="M7.84153 0C6.51701 0 5.33055 0.825454 4.8612 2.0735L3.6377 5.32691H10.1739L6.5361 15H11.8226L15.4604 5.32691H21.9966L23.9999 0H7.84153Z" fill="currentColor"/>
  </svg>
)



const BRAND_OPTIONS = [
  { value: 'hankook',     label: 'Hankook' },
  { value: 'bridgestone', label: 'Bridgestone' },
  { value: 'continental', label: 'Continental' },
  { value: 'yokohama',    label: 'Yokohama' },
  { value: 'michelin',    label: 'Michelin' },
  { value: 'double-coin', label: 'Double Coin' },
  { value: 'ralson',      label: 'Ralson' },
  { value: 'retread',     label: 'Retread' },
]

const BRANDS = [
  { name: 'Hankook',     src: '/images/brands/hankook.svg' },
  { name: 'Double Coin', src: '/images/brands/double_Coin.svg' },
  { name: 'Continental', src: '/images/brands/continental.svg' },
  { name: 'Yokohama',    src: '/images/brands/yokohama.svg' },
  { name: 'Bridgestone', src: '/images/brands/bridgestone.svg' },
  { name: 'Michelin',    src: '/images/brands/michelin.svg' },
]

// ── Component ─────────────────────────────────────────────────────────────────
function formatPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0,3)}) ${d.slice(3)}`
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
}

export default function Home() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { products } = useCatalog()

  // Show up to 4 products with a badge first, then fill with any products
  const tireDeals = useMemo(() => {
    const withBadge = products.filter(p => p.badge)
    const rest = products.filter(p => !p.badge)
    return [...withBadge, ...rest].slice(0, 4)
  }, [products])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [brandOpen, setBrandOpen] = useState(false)
  const brandRef = useRef(null)

  // ── Love's modal ──────────────────────────────────────────────────────────
  const LOVES_INIT = { fullName: '', companyName: '', phone: '', email: '' }
  const [lovesOpen,    setLovesOpen]    = useState(false)
  const [lovesProduct, setLovesProduct] = useState(null)
  const [lovesForm,    setLovesForm]    = useState(LOVES_INIT)
  const [lovesErrors,  setLovesErrors]  = useState({})
  const [lovesLoading, setLovesLoading] = useState(false)
  const [lovesSuccess, setLovesSuccess] = useState(false)

  function openLovesModal(product) {
    setLovesProduct(product); setLovesForm(LOVES_INIT)
    setLovesErrors({}); setLovesSuccess(false); setLovesOpen(true)
  }
  function closeLovesModal() { setLovesOpen(false) }

  useEffect(() => {
    if (!lovesOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeLovesModal() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lovesOpen])

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
    await new Promise(r => setTimeout(r, 900))
    setLovesLoading(false); setLovesSuccess(true)
  }

  function handleBuySacramento(t) {
    addItem({
      productId: t.id,
      name:      t.name,
      brand:     t.id.split('-')[0],
      size:      t.size,
      location:  'sacramento',
      price:     parseFloat(t.price.replace(/[^\d.]/g, '')),
      quantity:  1,
      image:     t.image,
    })
    navigate(ROUTES.CART)
  }

  useEffect(() => {
    function handleOutside(e) {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function toggleBrand(val) {
    setSelectedBrands(prev =>
      prev.includes(val) ? prev.filter(b => b !== val) : [...prev, val]
    )
  }

  function handleSearch(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const params = new URLSearchParams()
    if (fd.get('width'))    params.set('width',    fd.get('width'))
    if (fd.get('ratio'))    params.set('ratio',    fd.get('ratio'))
    if (fd.get('diameter')) params.set('diameter', fd.get('diameter'))
    if (fd.get('position')) params.set('position', fd.get('position'))
    selectedBrands.forEach(b => params.append('brand', b))
    navigate(ROUTES.CATALOG + '?' + params.toString())
  }

  return (
    <>
    <div className={styles.page}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Nationwide <span className={styles.highlight}>Tire</span> Support. Save Big Today!
              </h1>
              <p className={styles.heroDescription}>
                Designed with durability in mind, our products are built to withstand the test of time and perform reliably under pressure.
              </p>
            </div>

            <div className={styles.heroFormWrapper}>
              <form className={styles.heroForm} onSubmit={handleSearch}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <select name="width" className={styles.formSelect}>
                      <option value="">Select Width</option>
                      {['185','195','205','215','225','235','245','255','265','275','285','295','305','315','325','385'].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <select name="ratio" className={styles.formSelect}>
                      <option value="">Ratio</option>
                      {['55','60','65','70','75','80','85'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <select name="diameter" className={styles.formSelect}>
                      <option value="">Diameter</option>
                      {['16','17','19.5','22.5','24.5'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <select name="position" className={styles.formSelect}>
                      <option value="">Position (optional)</option>
                      {['Steer','Drive','Trailer','All Position'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup} ref={brandRef}>
                    <button
                      type="button"
                      className={`${styles.formSelect} ${styles.brandTrigger} ${brandOpen ? styles.brandTriggerOpen : ''}`}
                      onClick={() => setBrandOpen(v => !v)}
                    >
                      <span className={selectedBrands.length ? styles.brandTriggerActive : styles.brandTriggerPlaceholder}>
                        {selectedBrands.length === 0
                          ? 'Brand (optional)'
                          : selectedBrands.length === 1
                            ? BRAND_OPTIONS.find(b => b.value === selectedBrands[0])?.label
                            : `${selectedBrands.length} brands`}
                      </span>
                    </button>
                    {brandOpen && (
                      <div className={styles.brandDropdown}>
                        {BRAND_OPTIONS.map(({ value, label }) => (
                          <label key={value} className={styles.brandOption}>
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(value)}
                              onChange={() => toggleBrand(value)}
                              className={styles.brandCheckbox}
                            />
                            {label}
                            {selectedBrands.includes(value) && <span className={styles.brandCheck}>✓</span>}
                          </label>
                        ))}
                        {selectedBrands.length > 0 && (
                          <button type="button" className={styles.brandClear} onClick={() => setSelectedBrands([])}>
                            Clear selection
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button type="submit" className={styles.searchButton}>Search</button>
                </div>
              </form>
            </div>
          </div>

          <div className={styles.heroImage}>
            <img src={assetUrl('/images/Tire_site.png')} alt="Truck Tire" className={styles.tireImg} />
          </div>
        </div>
      </section>

      {/* ── TRUSTED BRANDS ───────────────────────────────────────── */}
      <section className={styles.brands}>
        <div className={styles.brandsContainer}>
          <Reveal><h2 className={styles.brandsTitle}>Trusted Brands</h2></Reveal>
          <div className={styles.brandsLogos}>
            {BRANDS.map((b, i) => (
              <Reveal key={b.name} delay={i * 80} direction="scale" as="span">
                <img src={b.src} alt={b.name} className={styles.brandLogo} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ─────────────────────────────────────────────── */}
      <section className={styles.about} id="about">
        <Reveal threshold={0.08}>
          <div className={styles.aboutContainer}>
            <div className={styles.aboutVideo}>
              <video autoPlay loop muted playsInline>
                <source src={assetUrl('/images/truck-video.mp4')} type="video/mp4" />
              </video>
            </div>

            <div className={styles.aboutContent}>
              <div className={styles.aboutBadge}>
                <span className={styles.bullet}>•</span> About us <span className={styles.bullet}>•</span>
              </div>
              <h2 className={styles.aboutTitle}>
                iTrucking <span className={styles.highlight}>Fleet Care</span> is a nationwide tire support company built for truckers and fleets.
              </h2>
              <p className={styles.aboutText}>
                As an official partner of Love&apos;s Travel Stops and Speedco, our customers can access tire discounts and services at any Love&apos;s or Speedco location across the US. We also operate our own warehouse in Sacramento,&nbsp;CA, helping us provide fast, reliable tire solutions when drivers need them most.
              </p>
              <div className={styles.aboutPartners}>
                <a href="/catalog" className={styles.exploreButton}>
                  <TruckIcon /> Explore catalog
                </a>
                <div className={styles.partnerLogos}>
            <img src={assetUrl('/images/partners/loves.png')}   alt="Love's Travel Stops" className={styles.partnerLogo} />
              <img src={assetUrl('/images/partners/speedco.png')} alt="Speedco"             className={styles.partnerLogo} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── TIRE DEALS ───────────────────────────────────────────── */}
      <section className={styles.tireDeals}>
        <div className={styles.tireDealsContainer}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <span className={styles.bullet}>•</span> Trends Tires <span className={styles.bullet}>•</span>
              </div>
              <h2 className={styles.sectionTitle}>
                Our Most Popular <span className={styles.highlight}>Tire Deals</span>
              </h2>
              <p className={styles.sectionDescription}>High-demand tires available with exclusive Fleet Care savings.</p>
            </div>
          </Reveal>

          <div className={styles.tireGrid}>
            {tireDeals.map((t, i) => (
              <Reveal key={t.id} delay={i * 100} direction="up" className={styles.cardRevealOuter}>
                <TireCard
                  {...t}
                  onBuySacramento={() => handleBuySacramento(t)}
                  onBuyLoves={() => openLovesModal(t)}
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className={styles.exploreMore}>
              <a href="/catalog" className={styles.exploreMoreBtn}>
                <TruckIcon /> Explore more tires
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PICKUP & DELIVERY ────────────────────────────────────── */}
      <section className={styles.pickupDelivery} id="how-it-works">
        <Reveal threshold={0.08}>
          <div className={styles.pickupDeliveryContainer}>
            <div className={styles.pickupContent}>
              <div className={styles.sectionBadge}>
                <span className={styles.bullet}>•</span> How it works? <span className={styles.bullet}>•</span>
              </div>
              <h2 className={styles.sectionTitle}>
                Flexible Tire <span className={styles.highlight}>Pickup &amp; Delivery</span> Options
              </h2>
              <p className={styles.pickupText}>
                Get discounted tires your way — pick up from our <strong>Sacramento</strong> warehouse, enjoy free local delivery on orders over $1,000, or collect at any Love&apos;s &amp; Speedco nationwide.
              </p>
              <a href="tel:+19162340257" className={styles.callButton}>
                <TruckIcon /> Call us to know more
              </a>
            </div>

            <div className={styles.pickupVideo}>
              <video autoPlay loop muted playsInline>
                <source src={assetUrl('/images/delivery-van.mp4')} type="video/mp4" />
              </video>
            </div>
          </div>
        </Reveal>
      </section>

    </div>

      {/* ── Love's modal ──────────────────────────────────────────────────── */}
      {lovesOpen && createPortal(
        <div className={styles.lovesOverlay} onClick={(e) => { if (e.target === e.currentTarget) closeLovesModal() }}>
          <div className={styles.lovesModal}>
            <button className={styles.lovesClose} aria-label="Close" onClick={closeLovesModal}>&times;</button>
            {lovesSuccess ? (
              <div className={styles.lovesSuccessWrap}>
                <div className={styles.lovesCheckCircle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className={styles.lovesTitle}>Instructions sent!</h2>
                <p className={styles.lovesSubtitle}>
                  We've sent discount instructions to <strong>{lovesForm.email}</strong>.<br/>
                  Show them at any Love's or Speedco to redeem your fleet discount.
                </p>
                <button className={styles.lovesDoneBtn} onClick={closeLovesModal}>Done</button>
              </div>
            ) : (
              <>
                <h2 className={styles.lovesTitle}>
                  Get discount instructions{lovesProduct ? ` — ${lovesProduct.name}` : ''}
                </h2>
                <p className={styles.lovesSubtitle}>
                  Fill in your details and we'll send step-by-step instructions on how to use
                  your fleet discount at any Love's &amp; Speedco truck stop.
                </p>
                <form className={styles.lovesForm} onSubmit={handleLovesSubmit} noValidate>
                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Full Name *</label>
                    <input className={`${styles.lovesInput}${lovesErrors.fullName ? ' ' + styles.lovesInputErr : ''}`}
                      name="fullName" value={lovesForm.fullName} onChange={handleLovesChange} placeholder="John Smith" />
                    {lovesErrors.fullName && <span className={styles.lovesErr}>{lovesErrors.fullName}</span>}
                  </div>
                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Company Name *</label>
                    <input className={`${styles.lovesInput}${lovesErrors.companyName ? ' ' + styles.lovesInputErr : ''}`}
                      name="companyName" value={lovesForm.companyName} onChange={handleLovesChange} placeholder="ABC Trucking LLC" />
                    {lovesErrors.companyName && <span className={styles.lovesErr}>{lovesErrors.companyName}</span>}
                  </div>
                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Phone *</label>
                    <input className={`${styles.lovesInput}${lovesErrors.phone ? ' ' + styles.lovesInputErr : ''}`}
                      name="phone" value={lovesForm.phone} onChange={handleLovesChange} placeholder="(555) 000-0000" type="tel" />
                    {lovesErrors.phone && <span className={styles.lovesErr}>{lovesErrors.phone}</span>}
                  </div>
                  <div className={styles.lovesField}>
                    <label className={styles.lovesLabel}>Email *</label>
                    <input className={`${styles.lovesInput}${lovesErrors.email ? ' ' + styles.lovesInputErr : ''}`}
                      name="email" value={lovesForm.email} onChange={handleLovesChange} placeholder="john@company.com" type="email" />
                    {lovesErrors.email && <span className={styles.lovesErr}>{lovesErrors.email}</span>}
                    <span className={styles.lovesHint}>Instructions will be sent to this email address</span>
                  </div>
                  <button type="submit" className={styles.lovesSubmit} disabled={lovesLoading}>
                    {lovesLoading ? <><span className={styles.lovesSpinner} aria-hidden="true"/> Sending…</> : 'Send Instructions'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>,
      document.body
      )}
    </>
  )
}
