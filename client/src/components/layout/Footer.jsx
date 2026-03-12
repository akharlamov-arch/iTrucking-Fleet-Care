import { Link } from 'react-router-dom'
import LogoSVG from '../common/LogoSVG'
import styles from './Footer.module.css'

const brands = ['Hankook','Bridgestone','Continental','Yokohama','Michelin','Double Coin','Ralson','Retread']

export default function Footer() {
  return (
    <footer className={styles.footer} id="contacts">
      <div className={styles.container}>

        {/* Top */}
        <div className={styles.top}>
          <p className={styles.tagline}>Our team is ready to support your goals.</p>
          <a href="mailto:info@ifleetcare.com" className={styles.emailLarge}>info@ifleetcare.com</a>
        </div>

        {/* Main */}
        <div className={styles.main}>
          {/* Logo */}
          <div className={`${styles.column} ${styles.logoCol}`}>
            <Link to="/" aria-label="iTrucking Fleet Care">
              <LogoSVG height={60} />
            </Link>
          </div>

          {/* Contacts */}
          <div className={`${styles.column} ${styles.contactCol}`}>
            <a href="mailto:info@ifleetcare.com" className={styles.contactItem}>
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M18 0H2C0.9 0 0.01.9 0.01 2L0 14C0 15.1.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 .9 19.1 0 18 0ZM18 4L10 9 2 4V2L10 7 18 2V4Z" fill="#D42C00"/></svg>
              info@ifleetcare.com
            </a>
            <a href="tel:+19162340257" className={styles.contactItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.62 7.79C5.06 10.62 7.38 12.93 10.21 14.38L12.41 12.18C12.68 11.91 13.08 11.82 13.43 11.94C14.55 12.31 15.76 12.51 17 12.51C17.55 12.51 18 12.96 18 13.51V17C18 17.55 17.55 18 17 18C7.61 18 0 10.39 0 1C0 .45.45 0 1 0H4.5C5.05 0 5.5.45 5.5 1C5.5 2.25 5.7 3.45 6.07 4.57C6.18 4.92 6.1 5.31 5.82 5.59L3.62 7.79Z" fill="#D42C00"/></svg>
              (916) 234-0257
            </a>
            <a href="https://maps.google.com/?q=3951+Development+Drive,+Unit+4,+Sacramento,+CA+95838" target="_blank" rel="noreferrer" className={styles.contactItem}>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 0C3.58 0 0 3.58 0 8C0 14 8 20 8 20C8 20 16 14 16 8C16 3.58 12.42 0 8 0ZM8 10.5C6.62 10.5 5.5 9.38 5.5 8C5.5 6.62 6.62 5.5 8 5.5C9.38 5.5 10.5 6.62 10.5 8C10.5 9.38 9.38 10.5 8 10.5Z" fill="#D42C00"/></svg>
              3951 Development Drive, Unit 4, Sacramento, CA 95838
            </a>
            <div className={styles.social}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.instagram}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#D42C00"/></svg>
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.facebook}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>
                Facebook
              </a>
            </div>
          </div>

          {/* Catalog links */}
          <div className={`${styles.column} ${styles.catalogCol}`}>
            <h3 className={styles.colTitle}>Catalog</h3>
            <nav className={styles.catalogNav}>
              {brands.map(b => (
                <Link key={b} to={`/catalog?brand=${b.toLowerCase().replace(' ','-')}`}>{b}</Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>iTrucking Fleet Care Inc. All Rights Reserved.</p>
          <div className={styles.legalLinks}>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
