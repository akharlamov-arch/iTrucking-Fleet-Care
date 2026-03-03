import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import TireCard from '../components/common/TireCard'
import styles from './Home.module.css'

// ── inline SVG helpers ────────────────────────────────────────────────────────
const TruckIcon = () => (
  <svg width="24" height="15" viewBox="0 0 24 15" fill="none">
    <path d="M2.00329 9.67314L0 15H5.28649L7.28978 9.67314H2.00329Z" fill="currentColor"/>
    <path d="M13.0723 15H16.1582C17.4827 15 18.6692 14.1746 19.1385 12.9265L20.362 9.67314H15.0756L13.0723 15Z" fill="currentColor"/>
    <path d="M7.84153 0C6.51701 0 5.33055 0.825454 4.8612 2.0735L3.6377 5.32691H10.1739L6.5361 15H11.8226L15.4604 5.32691H21.9966L23.9999 0H7.84153Z" fill="currentColor"/>
  </svg>
)

// ── Featured tire data ────────────────────────────────────────────────────────
const TIRE_DEALS = [
  { id: 'hankook-dl15',      badge: { text: 'Best %', variant: 'red'  }, price: '$485.00', oldPrice: '$795.00 retail price', discount: '-40%', name: 'Hankook Smart Flex DL15+', size: '295/60R22.5', tags: ['Long Haul','Steer(All)','M+S','S3PMSF'],    image: '/images/tire-product.png' },
  { id: 'bridgestone-r238',  badge: { text: 'NEW',    variant: 'blue' }, price: '$375.00', oldPrice: '$700.00 retail price', discount: '-46%', name: 'Bridgestone R238',          size: '295/75R22.5', tags: ['Mixed Service','Drive','M+S','S3PMSF'],   image: '/images/tire-product.png' },
  { id: 'goodyear-endurance',badge: { text: 'Best %', variant: 'red'  }, price: '$320.00', oldPrice: '$600.00 retail price', discount: '-47%', name: 'Goodyear Endurance',         size: '225/75R16',   tags: ['Trailer','All Position','M+S','S3PMSF'], image: '/images/tire-product.png' },
  { id: 'michelin-xda5',     badge: { text: 'Best %', variant: 'red'  }, price: '$550.00', oldPrice: '$900.00 retail price', discount: '-39%', name: 'Michelin XDA-5',            size: '11R22.5',     tags: ['Regional','Drive','M+S','S3PMSF'],       image: '/images/tire-product.png' },
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
export default function Home() {
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const params = new URLSearchParams()
    if (fd.get('width'))    params.set('width',    fd.get('width'))
    if (fd.get('ratio'))    params.set('ratio',    fd.get('ratio'))
    if (fd.get('diameter')) params.set('diameter', fd.get('diameter'))
    if (fd.get('position')) params.set('position', fd.get('position'))
    if (fd.get('brand'))    params.set('brand',    fd.get('brand'))
    navigate(ROUTES.CATALOG + '?' + params.toString())
  }

  return (
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
                  <div className={styles.formGroup}>
                    <select name="brand" className={styles.formSelect}>
                      <option value="">Brand (optional)</option>
                      {['Hankook','Bridgestone','Continental','Yokohama','Michelin','Double Coin','Ralson','Retread'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className={styles.searchButton}>Search</button>
                </div>
              </form>
            </div>
          </div>

          <div className={styles.heroImage}>
            <img src="/images/Tire_site.png" alt="Truck Tire" className={styles.tireImg} />
          </div>
        </div>
      </section>

      {/* ── TRUSTED BRANDS ───────────────────────────────────────── */}
      <section className={styles.brands}>
        <div className={styles.brandsContainer}>
          <h2 className={styles.brandsTitle}>Trusted Brands</h2>
          <div className={styles.brandsLogos}>
            {BRANDS.map(b => (
              <img key={b.name} src={b.src} alt={b.name} className={styles.brandLogo} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ─────────────────────────────────────────────── */}
      <section className={styles.about} id="about">
        <div className={styles.aboutContainer}>
          <div className={styles.aboutVideo}>
            <video autoPlay loop muted playsInline>
              <source src="/images/truck-video.mp4" type="video/mp4" />
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
                <img src="/images/partners/loves.png"   alt="Love's Travel Stops" className={styles.partnerLogo} />
                <img src="/images/partners/speedco.png" alt="Speedco"             className={styles.partnerLogo} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIRE DEALS ───────────────────────────────────────────── */}
      <section className={styles.tireDeals}>
        <div className={styles.tireDealsContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <span className={styles.bullet}>•</span> Trends Tires <span className={styles.bullet}>•</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Our Most Popular <span className={styles.highlight}>Tire Deals</span>
            </h2>
            <p className={styles.sectionDescription}>High-demand tires available with exclusive Fleet Care savings.</p>
          </div>

          <div className={styles.tireGrid}>
            {TIRE_DEALS.map(t => <TireCard key={t.id} {...t} />)}
          </div>

          <div className={styles.exploreMore}>
            <a href="/catalog" className={styles.exploreMoreBtn}>
              <TruckIcon /> Explore more tires
            </a>
          </div>
        </div>
      </section>

      {/* ── PICKUP & DELIVERY ────────────────────────────────────── */}
      <section className={styles.pickupDelivery} id="how-it-works">
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
              <source src="/images/delivery-van.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

    </div>
  )
}
