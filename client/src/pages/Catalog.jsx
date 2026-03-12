import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useCart } from '../hooks/useCart'
import { useCatalog } from '../hooks/useCatalog'
import Breadcrumbs from '../components/common/Breadcrumbs'
import TireCard from '../components/common/TireCard'
import styles from './Catalog.module.css'

// ── Static sample products ─────────────────────────────────────────────────
// Replace with API fetch once backend is ready
const SAMPLE_PRODUCTS = [
  // ── batch 1 (initial 9) ───────────────────────────────────────────────────
  { id: 'hankook-dl15',          brand: 'hankook',     location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$485.00', oldPrice: '$795.00 retail price', discount: '-40%', name: 'Hankook Smart Flex DL15+',    size: 'Different Sizes', tags: ['Long Haul','Steer(All)','M+S','S3PMSF'],   priceNum: 485, discountNum: 40, image: '/images/tire-product.png' },
  { id: 'bridgestone-r238',      brand: 'bridgestone', location: 'sacramento', badge: { text: 'NEW',    variant: 'blue' }, price: '$375.00', oldPrice: '$700.00 retail price', discount: '-46%', name: 'Bridgestone R238',             size: '295/75R22.5',     tags: ['Mixed Service','Drive','M+S','S3PMSF'],    priceNum: 375, discountNum: 46, image: '/images/tire-product.png' },
  { id: 'goodyear-endurance',    brand: 'goodyear',    location: 'loves',      badge: { text: 'Best %', variant: 'red'  }, price: '$320.00', oldPrice: '$600.00 retail price', discount: '-47%', name: 'Goodyear Endurance',           size: 'Different Sizes', tags: ['Trailer','All Position','M+S','S3PMSF'],   priceNum: 320, discountNum: 47, image: '/images/tire-product.png' },
  { id: 'michelin-xda5',         brand: 'michelin',    location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$550.00', oldPrice: '$900.00 retail price', discount: '-39%', name: 'Michelin XDA-5',               size: '11R22.5',         tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 550, discountNum: 39, image: '/images/tire-product.png' },
  { id: 'michelin-xda5-2',       brand: 'michelin',    location: 'loves',      badge: { text: 'Best %', variant: 'red'  }, price: '$550.00', oldPrice: '$900.00 retail price', discount: '-39%', name: 'Michelin XDA-5',               size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 550, discountNum: 39, image: '/images/tire-product.png' },
  { id: 'hankook-sf2',           brand: 'hankook',     location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$450.00', oldPrice: '$700.00 retail price', discount: '-35%', name: 'Hankook Smart Flex',           size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 450, discountNum: 35, image: '/images/tire-product.png' },
  { id: 'continental-hdr',       brand: 'continental', location: 'loves',      badge: { text: 'NEW',    variant: 'blue' }, price: '$520.00', oldPrice: '$850.00 retail price', discount: '-38%', name: 'Continental HDR',              size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 520, discountNum: 38, image: '/images/tire-product.png' },
  { id: 'yokohama-ry023',        brand: 'yokohama',    location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$480.00', oldPrice: '$830.00 retail price', discount: '-42%', name: 'Yokohama RY023',               size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 480, discountNum: 42, image: '/images/tire-product.png' },
  { id: 'michelin-xda5-3',       brand: 'michelin',    location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$550.00', oldPrice: '$900.00 retail price', discount: '-39%', name: 'Michelin XDA-5',               size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 550, discountNum: 39, image: '/images/tire-product.png' },
  // ── batch 2 (+6) ─────────────────────────────────────────────────────────
  { id: 'double-coin-rt600',     brand: 'double-coin', location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$290.00', oldPrice: '$520.00 retail price', discount: '-44%', name: 'Double Coin RT600',            size: 'Different Sizes', tags: ['Long Haul','Trailer','M+S'],               priceNum: 290, discountNum: 44, image: '/images/tire-product.png' },
  { id: 'ralson-rrsa11',         brand: 'ralson',      location: 'loves',      badge: { text: 'NEW',    variant: 'blue' }, price: '$265.00', oldPrice: '$470.00 retail price', discount: '-43%', name: 'Ralson RRSA11 Steer',          size: '11R22.5',         tags: ['Long Haul','Steer(All)','M+S','S3PMSF'],   priceNum: 265, discountNum: 43, image: '/images/tire-product.png' },
  { id: 'retread-drive-22',      brand: 'retread',     location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$195.00', oldPrice: '$400.00 retail price', discount: '-51%', name: 'Retread Drive 22.5',           size: '295/75R22.5',     tags: ['Regional','Drive','Retread'],              priceNum: 195, discountNum: 51, image: '/images/tire-product.png' },
  { id: 'bridgestone-r250',      brand: 'bridgestone', location: 'loves',      badge: { text: 'NEW',    variant: 'blue' }, price: '$410.00', oldPrice: '$730.00 retail price', discount: '-43%', name: 'Bridgestone R250',             size: 'Different Sizes', tags: ['Mixed Service','Steer(All)','M+S','S3PMSF'],priceNum: 410, discountNum: 43, image: '/images/tire-product.png' },
  { id: 'goodyear-g182',         brand: 'goodyear',    location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$340.00', oldPrice: '$610.00 retail price', discount: '-44%', name: 'Goodyear G182 RSD',            size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 340, discountNum: 44, image: '/images/tire-product.png' },
  { id: 'continental-hsa3',      brand: 'continental', location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$500.00', oldPrice: '$860.00 retail price', discount: '-41%', name: 'Continental HSA3 Steer',       size: '295/75R22.5',     tags: ['Long Haul','Steer(All)','M+S','S3PMSF'],   priceNum: 500, discountNum: 41, image: '/images/tire-product.png' },
  // ── batch 3 (+6) ─────────────────────────────────────────────────────────
  { id: 'hankook-ah31',          brand: 'hankook',     location: 'loves',      badge: { text: 'NEW',    variant: 'blue' }, price: '$465.00', oldPrice: '$790.00 retail price', discount: '-41%', name: 'Hankook AH31 Highway',         size: 'Different Sizes', tags: ['Long Haul','Steer(All)','M+S','S3PMSF'],   priceNum: 465, discountNum: 41, image: '/images/tire-product.png' },
  { id: 'yokohama-ry527',        brand: 'yokohama',    location: 'loves',      badge: { text: 'Best %', variant: 'red'  }, price: '$510.00', oldPrice: '$860.00 retail price', discount: '-40%', name: 'Yokohama RY527',               size: 'Different Sizes', tags: ['Regional','Steer(All)','M+S','S3PMSF'],    priceNum: 510, discountNum: 40, image: '/images/tire-product.png' },
  { id: 'double-coin-rr688',     brand: 'double-coin', location: 'loves',      badge: { text: 'Best %', variant: 'red'  }, price: '$310.00', oldPrice: '$560.00 retail price', discount: '-44%', name: 'Double Coin RR688',            size: '11R22.5',         tags: ['Long Haul','Drive','M+S'],                 priceNum: 310, discountNum: 44, image: '/images/tire-product.png' },
  { id: 'michelin-xone',         brand: 'michelin',    location: 'sacramento', badge: { text: 'NEW',    variant: 'blue' }, price: '$620.00', oldPrice: '$990.00 retail price', discount: '-37%', name: 'Michelin X One Line Energy',   size: '445/50R22.5',     tags: ['Long Haul','Drive','M+S','S3PMSF'],        priceNum: 620, discountNum: 37, image: '/images/tire-product.png' },
  { id: 'ralson-rtl11',          brand: 'ralson',      location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$240.00', oldPrice: '$450.00 retail price', discount: '-46%', name: 'Ralson RTL11 Trailer',         size: '235/75R17.5',     tags: ['Trailer','All Position','S3PMSF'],         priceNum: 240, discountNum: 46, image: '/images/tire-product.png' },
  { id: 'bridgestone-m860',      brand: 'bridgestone', location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$395.00', oldPrice: '$680.00 retail price', discount: '-41%', name: 'Bridgestone M860 Drive',       size: 'Different Sizes', tags: ['Long Haul','Drive','M+S','S3PMSF'],        priceNum: 395, discountNum: 41, image: '/images/tire-product.png' },
  // ── batch 4 (+5) last ─────────────────────────────────────────────────────
  { id: 'goodyear-g670',         brand: 'goodyear',    location: 'loves',      badge: { text: 'NEW',    variant: 'blue' }, price: '$360.00', oldPrice: '$640.00 retail price', discount: '-43%', name: 'Goodyear G670 RV',             size: 'Different Sizes', tags: ['Regional','All Position','M+S'],           priceNum: 360, discountNum: 43, image: '/images/tire-product.png' },
  { id: 'retread-steer-225',     brand: 'retread',     location: 'loves',      badge: { text: 'Best %', variant: 'red'  }, price: '$175.00', oldPrice: '$380.00 retail price', discount: '-53%', name: 'Retread Steer 22.5',           size: '11R22.5',         tags: ['Long Haul','Steer(All)','Retread'],        priceNum: 175, discountNum: 53, image: '/images/tire-product.png' },
  { id: 'continental-ecoplus',   brand: 'continental', location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$490.00', oldPrice: '$830.00 retail price', discount: '-40%', name: 'Continental EcoPlus HAS2',     size: 'Different Sizes', tags: ['Long Haul','Steer(All)','M+S','S3PMSF'],   priceNum: 490, discountNum: 40, image: '/images/tire-product.png' },
  { id: 'yokohama-rb500',        brand: 'yokohama',    location: 'sacramento', badge: { text: 'NEW',    variant: 'blue' }, price: '$440.00', oldPrice: '$780.00 retail price', discount: '-43%', name: 'Yokohama RB500 Drive',         size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],         priceNum: 440, discountNum: 43, image: '/images/tire-product.png' },
  { id: 'double-coin-rr300',     brand: 'double-coin', location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$275.00', oldPrice: '$500.00 retail price', discount: '-45%', name: 'Double Coin RR300 Steer',      size: '295/75R22.5',     tags: ['Long Haul','Steer(All)','M+S'],            priceNum: 275, discountNum: 45, image: '/images/tire-product.png' },
]

const BRANDS = ['hankook','bridgestone','continental','yokohama','michelin','double-coin','ralson','retread','goodyear']

// Tags that belong to "Position" category
const POSITION_TAGS = ['Steer(All)', 'Drive', 'Trailer', 'All Position']
// Tags that belong to "Application" category
const APPLICATION_TAGS = ['Long Haul', 'Regional', 'Mixed Service']

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function FilterGroup({ id, label, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.filterGroup}>
      <button
        type="button"
        className={`${styles.filterHeader} ${open ? styles.filterHeaderOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {label} <ChevronIcon open={open} />
      </button>
      {open && <div className={styles.filterContent}>{children}</div>}
    </div>
  )
}

// ── Sidebar filter content (defined outside Catalog so its identity is stable ──
// across re-renders — prevents FilterGroup state from resetting on scroll)
function SidebarContent({
  brands, selectedBrands, toggleBrand, setSelectedBrands,
  selectedLocation, setSelectedLocation,
  sizes, selectedSizes, toggleSize,
  diameters, selectedDiameters, toggleDiameter,
  positions, selectedPositions, togglePosition,
  applications, selectedApplications, toggleApplication,
  attributes, selectedAttributes, toggleAttribute,
  loadRanges, selectedLoadRanges, toggleLoadRange,
  loadIndexes, selectedLoadIndexes, toggleLoadIndex,
  speedRatings, selectedSpeedRatings, toggleSpeedRating,
}) {
  return (
    <>
      <FilterGroup id="brand" label="Tire Brand" defaultOpen>
        <label className={styles.filterItem}>
          <input type="radio" name="brand" checked={selectedBrands.length === 0} onChange={() => setSelectedBrands([])} />
          All Brands
        </label>
        {brands.map(b => {
          const label = b.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
          return (
            <label key={b} className={styles.filterItem}>
              <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />
              {label}
            </label>
          )
        })}
      </FilterGroup>

      <FilterGroup id="location" label="Pickup Location" defaultOpen>
        {[['all','All Locations'],['sacramento','Sacramento Warehouse'],['loves',"Love's & Speedco"]].map(([val, lbl]) => (
          <label key={val} className={styles.filterItem}>
            <input type="radio" name="location" checked={selectedLocation === val} onChange={() => setSelectedLocation(val)} />
            {lbl}
          </label>
        ))}
      </FilterGroup>

      <FilterGroup id="diameter" label="Rim Diameter" defaultOpen={false}>
        {diameters.length > 0
          ? diameters.map(d => (
              <label key={d} className={styles.filterItem}>
                <input type="checkbox" checked={selectedDiameters.includes(d)} onChange={() => toggleDiameter(d)} />
                {d}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <FilterGroup id="size" label="Tire Size" defaultOpen={false}>
        {sizes.length > 0
          ? sizes.map(s => (
              <label key={s} className={styles.filterItem}>
                <input type="checkbox" checked={selectedSizes.includes(s)} onChange={() => toggleSize(s)} />
                {s}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <FilterGroup id="position" label="Position" defaultOpen={false}>
        {positions.length > 0
          ? positions.map(p => (
              <label key={p} className={styles.filterItem}>
                <input type="checkbox" checked={selectedPositions.includes(p)} onChange={() => togglePosition(p)} />
                {p}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <FilterGroup id="application" label="Application" defaultOpen={false}>
        {applications.length > 0
          ? applications.map(a => (
              <label key={a} className={styles.filterItem}>
                <input type="checkbox" checked={selectedApplications.includes(a)} onChange={() => toggleApplication(a)} />
                {a}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <FilterGroup id="attributes" label="Attributes" defaultOpen={false}>
        {attributes.length > 0
          ? attributes.map(a => (
              <label key={a} className={styles.filterItem}>
                <input type="checkbox" checked={selectedAttributes.includes(a)} onChange={() => toggleAttribute(a)} />
                {a}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <FilterGroup id="loadRange" label="Load Range/Ply" defaultOpen={false}>
        {loadRanges.length > 0
          ? loadRanges.map(lr => (
              <label key={lr} className={styles.filterItem}>
                <input type="checkbox" checked={selectedLoadRanges.includes(lr)} onChange={() => toggleLoadRange(lr)} />
                {lr}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <FilterGroup id="loadIndex" label="Load Index" defaultOpen={false}>
        {loadIndexes.length > 0
          ? loadIndexes.map(li => (
              <label key={li} className={styles.filterItem}>
                <input type="checkbox" checked={selectedLoadIndexes.includes(li)} onChange={() => toggleLoadIndex(li)} />
                {li}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <FilterGroup id="speed" label="Speed Rating" defaultOpen={false}>
        {speedRatings.length > 0
          ? speedRatings.map(s => (
              <label key={s} className={styles.filterItem}>
                <input type="checkbox" checked={selectedSpeedRatings.includes(s)} onChange={() => toggleSpeedRating(s)} />
                {s}
              </label>
            ))
          : <p className={styles.comingSoon}>Available when catalog is connected</p>
        }
      </FilterGroup>

      <div className={styles.dotBlock}>
        <p className={styles.dotText}>Present your DOT and receive automatic discounts at</p>
        <div className={styles.dotLogos}>
          <img src="/images/partners/loves.png"   alt="Love's"   />
          <img src="/images/partners/speedco.png" alt="Speedco"  />
        </div>
        <input className={styles.dotInput} type="text" placeholder="Company DOT" />
        <button className={styles.dotSubmit}>Submit DOT</button>
      </div>
    </>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
function formatPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0,3)}) ${d.slice(3)}`
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
}

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { products, loading } = useCatalog()

  const initBrands = searchParams.getAll('brand')

  const [selectedBrands, setSelectedBrands] = useState(initBrands.length ? initBrands : [])
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedDiameters, setSelectedDiameters] = useState([])
  const [selectedPositions, setSelectedPositions] = useState([])
  const [selectedApplications, setSelectedApplications] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [selectedLoadRanges, setSelectedLoadRanges] = useState([])
  const [selectedLoadIndexes, setSelectedLoadIndexes] = useState([])
  const [selectedSpeedRatings, setSelectedSpeedRatings] = useState([])
  const [sortBy, setSortBy] = useState('default')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(9)
  const sentinelRef = useRef(null)
  const mainRef = useRef(null)
  const sidebarWrapRef = useRef(null)

  // ── Love's modal state ──────────────────────────────────────────────────
  const LOVES_INIT = { fullName: '', companyName: '', phone: '', email: '' }
  const [lovesOpen,    setLovesOpen]    = useState(false)
  const [lovesProduct, setLovesProduct] = useState(null)
  const [lovesForm,    setLovesForm]    = useState(LOVES_INIT)
  const [lovesErrors,  setLovesErrors]  = useState({})
  const [lovesLoading, setLovesLoading] = useState(false)
  const [lovesSuccess, setLovesSuccess] = useState(false)

  function openLovesModal(product) {
    setLovesProduct(product)
    setLovesForm(LOVES_INIT)
    setLovesErrors({})
    setLovesSuccess(false)
    setLovesOpen(true)
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
    setLovesLoading(false)
    setLovesSuccess(true)
  }

  function handleBuySacramento(product) {
    addItem({
      productId: product.id,
      name:      product.name,
      brand:     product.brand,
      size:      product.size,
      location:  'sacramento',
      price:     product.priceNum,
      quantity:  1,
      image:     product.image,
    })
    navigate(ROUTES.CART)
  }

  const PAGE_SIZE = 6

  // Reset visible count and scroll to grid top whenever filters change
  useEffect(() => {
    setVisibleCount(9)
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedBrands, selectedLocation, selectedSizes, selectedDiameters, selectedPositions, selectedApplications, selectedAttributes, selectedLoadRanges, selectedLoadIndexes, selectedSpeedRatings, sortBy])


  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (loading) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(c => c + PAGE_SIZE)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loading, visibleCount])

  function makeToggle(setter) {
    return (val) => setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }
  const toggleBrand       = makeToggle(setSelectedBrands)
  const toggleSize        = makeToggle(setSelectedSizes)
  const toggleDiameter    = makeToggle(setSelectedDiameters)
  const togglePosition    = makeToggle(setSelectedPositions)
  const toggleApplication = makeToggle(setSelectedApplications)
  const toggleAttribute   = makeToggle(setSelectedAttributes)
  const toggleLoadRange   = makeToggle(setSelectedLoadRanges)
  const toggleLoadIndex   = makeToggle(setSelectedLoadIndexes)
  const toggleSpeedRating = makeToggle(setSelectedSpeedRatings)

  const filtered = useMemo(() => {
    let list = [...products]
    if (selectedBrands.length)       list = list.filter(p => selectedBrands.includes(p.brand))
    if (selectedLocation !== 'all')  list = list.filter(p => p.location === selectedLocation || p.location === 'all')
    if (selectedSizes.length)        list = list.filter(p => selectedSizes.includes(p.size))
    if (selectedDiameters.length)    list = list.filter(p => selectedDiameters.includes(p.diameter))
    if (selectedPositions.length)    list = list.filter(p => selectedPositions.some(pos  => p.tags.includes(pos)))
    if (selectedApplications.length) list = list.filter(p => selectedApplications.some(app => p.tags.includes(app)))
    if (selectedAttributes.length)   list = list.filter(p => selectedAttributes.every(attr => p.tags.includes(attr)))
    if (selectedLoadRanges.length)   list = list.filter(p => selectedLoadRanges.includes(p.loadRange))
    if (selectedLoadIndexes.length)  list = list.filter(p => selectedLoadIndexes.includes(p.loadIndex))
    if (selectedSpeedRatings.length) list = list.filter(p => selectedSpeedRatings.includes(p.speedRating))
    if (sortBy === 'price-low')  list.sort((a, b) => a.priceNum - b.priceNum)
    if (sortBy === 'price-high') list.sort((a, b) => b.priceNum - a.priceNum)
    if (sortBy === 'discount')   list.sort((a, b) => b.discountNum - a.discountNum)
    return list
  }, [products, selectedBrands, selectedLocation, selectedSizes, selectedDiameters, selectedPositions, selectedApplications, selectedAttributes, selectedLoadRanges, selectedLoadIndexes, selectedSpeedRatings, sortBy])

  const brands       = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products])
  const sizes        = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))].sort(), [products])
  const diameters    = useMemo(() => [...new Set(products.map(p => p.diameter).filter(Boolean))].sort(), [products])
  const positions    = useMemo(() => {
    const set = new Set()
    products.forEach(p => p.tags.forEach(t => { if (POSITION_TAGS.includes(t)) set.add(t) }))
    return [...set].sort((a, b) => POSITION_TAGS.indexOf(a) - POSITION_TAGS.indexOf(b))
  }, [products])
  const applications = useMemo(() => {
    const set = new Set()
    products.forEach(p => p.tags.forEach(t => { if (APPLICATION_TAGS.includes(t)) set.add(t) }))
    return [...set].sort((a, b) => APPLICATION_TAGS.indexOf(a) - APPLICATION_TAGS.indexOf(b))
  }, [products])
  const attributes   = useMemo(() => {
    const known = [...POSITION_TAGS, ...APPLICATION_TAGS]
    const set = new Set()
    products.forEach(p => p.tags.forEach(t => { if (!known.includes(t)) set.add(t) }))
    return [...set].sort()
  }, [products])
  const loadRanges   = useMemo(() => [...new Set(products.map(p => p.loadRange).filter(Boolean))].sort(), [products])
  const loadIndexes  = useMemo(() => [...new Set(products.map(p => p.loadIndex).filter(Boolean))].sort(), [products])
  const speedRatings = useMemo(() => [...new Set(products.map(p => p.speedRating).filter(Boolean))].sort(), [products])

  const clearAll = () => {
    setSelectedBrands([]); setSelectedLocation('all'); setSelectedSizes([])
    setSelectedDiameters([]); setSelectedPositions([]); setSelectedApplications([])
    setSelectedAttributes([]); setSelectedLoadRanges([]); setSelectedLoadIndexes([])
    setSelectedSpeedRatings([])
  }

  const sidebarProps = {
    brands, selectedBrands, toggleBrand, setSelectedBrands,
    selectedLocation, setSelectedLocation,
    sizes, selectedSizes, toggleSize,
    diameters, selectedDiameters, toggleDiameter,
    positions, selectedPositions, togglePosition,
    applications, selectedApplications, toggleApplication,
    attributes, selectedAttributes, toggleAttribute,
    loadRanges, selectedLoadRanges, toggleLoadRange,
    loadIndexes, selectedLoadIndexes, toggleLoadIndex,
    speedRatings, selectedSpeedRatings, toggleSpeedRating,
  }

  return (
    <div className={styles.page}>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All Tires', href: '/catalog' }]} />

      {/* Mobile filter bar */}
      <div className={styles.mobileBar}>
        <button className={styles.mobileBtn} onClick={() => setMobileFiltersOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor"/></svg>
          Filters {(() => { const n = selectedBrands.length + (selectedLocation !== 'all' ? 1 : 0) + selectedSizes.length + selectedDiameters.length + selectedPositions.length + selectedApplications.length + selectedAttributes.length + selectedLoadRanges.length + selectedLoadIndexes.length + selectedSpeedRatings.length; return n > 0 ? `(${n})` : '' })()}
        </button>
        <select className={styles.mobileSortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">Sort by</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="discount">Discount %</option>
        </select>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileFiltersOpen && (
        <div className={styles.overlay} onClick={() => setMobileFiltersOpen(false)} />
      )}
      <aside className={`${styles.mobileSidebar} ${mobileFiltersOpen ? styles.mobileSidebarOpen : ''}`}>
        <div className={styles.mobileSidebarHeader}>
          <span className={styles.mobileSidebarTitle}>Filters</span>
          <button className={styles.mobileSidebarClose} onClick={() => setMobileFiltersOpen(false)}>✕</button>
        </div>
        <div className={styles.mobileSidebarBody}>
          <SidebarContent {...sidebarProps} />
        </div>
        <div className={styles.mobileSidebarFooter}>
          <button className={styles.clearBtn} onClick={clearAll}>Clear All</button>
          <button className={styles.applyBtn} onClick={() => setMobileFiltersOpen(false)}>Apply</button>
        </div>
      </aside>

      <section className={styles.catalog}>
        <div className={styles.catalogContainer}>
          {/* Desktop sidebar */}
          <div ref={sidebarWrapRef} className={styles.sidebarWrap}>
            <aside className={styles.sidebar}>
              <SidebarContent {...sidebarProps} />
            </aside>
          </div>

          {/* Main */}
          <main ref={mainRef} className={styles.main}>
            <div className={styles.catalogHeader}>
              <button className={styles.clearFiltersLink} onClick={clearAll}>Clear all filters</button>
              <span className={styles.resultsCount}>
                <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''} found
              </span>
              <div className={styles.sortWrapper}>
                <label htmlFor="sort-select" className={styles.sortLabel}>Sort by</label>
                <select id="sort-select" className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="discount">Discount %</option>
                </select>
              </div>
            </div>

            {loading
              ? (
                <div className={styles.productGrid}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={styles.skeletonCard}>
                      <div className={styles.skeletonImage} />
                      <div className={styles.skeletonBody}>
                        <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                        <div className={`${styles.skeletonLine} ${styles.skeletonMed}`}   />
                        <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                        <div className={`${styles.skeletonLine} ${styles.skeletonLong}`}  />
                        <div className={styles.skeletonButtons}>
                          <div className={styles.skeletonBtn} />
                          <div className={styles.skeletonBtn} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
              : filtered.length === 0
                ? <div className={styles.empty}><p>No products match your filters. <button onClick={clearAll}>Clear filters</button></p></div>
                : (
                  <>
                    <div className={styles.productGrid}>
                      {filtered.slice(0, visibleCount).map((p, i) => (
                        <div
                          key={p.id}
                          className={styles.cardReveal}
                          style={{ animationDelay: `${Math.max(0, i - (visibleCount - PAGE_SIZE)) * 75}ms` }}
                        >
                          <TireCard
                            {...p}
                            onBuySacramento={() => handleBuySacramento(p)}
                            onBuyLoves={() => openLovesModal(p)}
                          />
                        </div>
                      ))}
                    </div>
                    {visibleCount < filtered.length && (
                      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
                    )}
                  </>
                )
            }
          </main>
        </div>
      </section>

      {/* ── Love's modal ───────────────────────────────────────────────── */}
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
    </div>
  )
}
