import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import Breadcrumbs from '../components/common/Breadcrumbs'
import TireCard from '../components/common/TireCard'
import styles from './Catalog.module.css'

// ── Static sample products ─────────────────────────────────────────────────
// Replace with API fetch once backend is ready
const SAMPLE_PRODUCTS = [
  { id: 'hankook-dl15',       brand: 'hankook',     location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$485.00', oldPrice: '$795.00 retail price', discount: '-40%', name: 'Hankook Smart Flex DL15+', size: 'Different Sizes', tags: ['Long Haul','Steer(All)','M+S','S3PMSF'], priceNum: 485, discountNum: 40, image: '/images/tire-product.png' },
  { id: 'bridgestone-r238',   brand: 'bridgestone', location: 'sacramento', badge: { text: 'NEW',    variant: 'blue' }, price: '$375.00', oldPrice: '$700.00 retail price', discount: '-46%', name: 'Bridgestone R238',          size: '295/75R22.5',  tags: ['Mixed Service','Drive','M+S','S3PMSF'],   priceNum: 375, discountNum: 46, image: '/images/tire-product.png' },
  { id: 'goodyear-endurance', brand: 'goodyear',    location: 'loves',      badge: { text: 'Best %', variant: 'red'  }, price: '$320.00', oldPrice: '$600.00 retail price', discount: '-47%', name: 'Goodyear Endurance',         size: 'Different Sizes', tags: ['Trailer','All Position','M+S','S3PMSF'], priceNum: 320, discountNum: 47, image: '/images/tire-product.png' },
  { id: 'michelin-xda5',      brand: 'michelin',    location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$550.00', oldPrice: '$900.00 retail price', discount: '-39%', name: 'Michelin XDA-5',            size: '11R22.5',      tags: ['Regional','Drive','M+S','S3PMSF'],       priceNum: 550, discountNum: 39, image: '/images/tire-product.png' },
  { id: 'michelin-xda5-2',    brand: 'michelin',    location: 'loves',      badge: { text: 'Best %', variant: 'red'  }, price: '$550.00', oldPrice: '$900.00 retail price', discount: '-39%', name: 'Michelin XDA-5',            size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],   priceNum: 550, discountNum: 39, image: '/images/tire-product.png' },
  { id: 'hankook-sf2',        brand: 'hankook',     location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$450.00', oldPrice: '$700.00 retail price', discount: '-35%', name: 'Hankook Smart Flex',        size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],   priceNum: 450, discountNum: 35, image: '/images/tire-product.png' },
  { id: 'continental-hdr',    brand: 'continental', location: 'loves',      badge: { text: 'NEW',    variant: 'blue' }, price: '$520.00', oldPrice: '$850.00 retail price', discount: '-38%', name: 'Continental HDR',           size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],   priceNum: 520, discountNum: 38, image: '/images/tire-product.png' },
  { id: 'yokohama-ry023',     brand: 'yokohama',    location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$480.00', oldPrice: '$830.00 retail price', discount: '-42%', name: 'Yokohama RY023',            size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],   priceNum: 480, discountNum: 42, image: '/images/tire-product.png' },
  { id: 'michelin-xda5-3',    brand: 'michelin',    location: 'sacramento', badge: { text: 'Best %', variant: 'red'  }, price: '$550.00', oldPrice: '$900.00 retail price', discount: '-39%', name: 'Michelin XDA-5',            size: 'Different Sizes', tags: ['Regional','Drive','M+S','S3PMSF'],   priceNum: 550, discountNum: 39, image: '/images/tire-product.png' },
]

const BRANDS = ['hankook','bridgestone','continental','yokohama','michelin','double-coin','ralson','retread','goodyear']

// collapsible filter groups config
const FILTER_GROUPS = [
  { id: 'brand',    label: 'Tire Brand',       defaultOpen: true  },
  { id: 'location', label: 'Pickup Location',  defaultOpen: true  },
  { id: 'size',     label: 'Tire Size',        defaultOpen: false },
  { id: 'category', label: 'Category',         defaultOpen: false },
  { id: 'style',    label: 'Tire Style',       defaultOpen: false },
  { id: 'attrs',    label: 'Attributes',       defaultOpen: false },
  { id: 'rating',   label: 'Customer Rating',  defaultOpen: false },
  { id: 'speed',    label: 'Speed Index',      defaultOpen: false },
  { id: 'load',     label: 'Load Index',       defaultOpen: false },
  { id: 'range',    label: 'Load Range/Ply',   defaultOpen: false },
]

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

// ── Main Component ─────────────────────────────────────────────────────────
export default function Catalog() {
  const [searchParams] = useSearchParams()
  const initBrand = searchParams.get('brand') || ''

  const [selectedBrands, setSelectedBrands] = useState(initBrand ? [initBrand] : [])
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  function toggleBrand(brand) {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const filtered = useMemo(() => {
    let list = [...SAMPLE_PRODUCTS]
    if (selectedBrands.length) list = list.filter(p => selectedBrands.includes(p.brand))
    if (selectedLocation !== 'all') list = list.filter(p => p.location === selectedLocation)
    if (sortBy === 'price-low')  list.sort((a, b) => a.priceNum - b.priceNum)
    if (sortBy === 'price-high') list.sort((a, b) => b.priceNum - a.priceNum)
    if (sortBy === 'discount')   list.sort((a, b) => b.discountNum - a.discountNum)
    return list
  }, [selectedBrands, selectedLocation, sortBy])

  const clearAll = () => { setSelectedBrands([]); setSelectedLocation('all') }

  const SidebarContent = () => (
    <>
      <FilterGroup id="brand" label="Tire Brand" defaultOpen>
        {BRANDS.map(b => {
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

      {['Tire Size','Category','Tire Style','Attributes','Customer Rating','Speed Index','Load Index','Load Range/Ply'].map(g => (
        <FilterGroup key={g} id={g} label={g} defaultOpen={false}>
          <p className={styles.comingSoon}>Available when catalog is connected</p>
        </FilterGroup>
      ))}

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

  return (
    <div className={styles.page}>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All Tires', href: '/catalog' }]} />

      {/* Mobile filter bar */}
      <div className={styles.mobileBar}>
        <button className={styles.mobileBtn} onClick={() => setMobileFiltersOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor"/></svg>
          Filters {selectedBrands.length + (selectedLocation !== 'all' ? 1 : 0) > 0 && `(${selectedBrands.length + (selectedLocation !== 'all' ? 1 : 0)})`}
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
          <SidebarContent />
        </div>
        <div className={styles.mobileSidebarFooter}>
          <button className={styles.clearBtn} onClick={clearAll}>Clear All</button>
          <button className={styles.applyBtn} onClick={() => setMobileFiltersOpen(false)}>Apply</button>
        </div>
      </aside>

      <section className={styles.catalog}>
        <div className={styles.catalogContainer}>
          {/* Desktop sidebar */}
          <aside className={styles.sidebar}>
            <SidebarContent />
          </aside>

          {/* Main */}
          <main className={styles.main}>
            <div className={styles.catalogHeader}>
              <button className={styles.clearFiltersLink} onClick={clearAll}>Clear all filters</button>
              <span className={styles.resultsCount}>
                Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
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

            {filtered.length === 0
              ? <div className={styles.empty}><p>No products match your filters. <button onClick={clearAll}>Clear filters</button></p></div>
              : (
                <div className={styles.productGrid}>
                  {filtered.map(p => <TireCard key={p.id} {...p} />)}
                </div>
              )
            }
          </main>
        </div>
      </section>
    </div>
  )
}
