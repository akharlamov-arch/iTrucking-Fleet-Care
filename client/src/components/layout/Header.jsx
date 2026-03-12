import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoSVG from '../common/LogoSVG'
import { useCart } from '../../hooks/useCart'
import styles from './Header.module.css'

const TruckIcon = () => (
  <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#hdr-cta)">
      <path d="M2.00329 9.67314L0 15H5.28649L7.28978 9.67314H2.00329Z" fill="#D42C00"/>
      <path d="M13.0723 15H16.1582C17.4827 15 18.6692 14.1746 19.1385 12.9265L20.362 9.67314H15.0756L13.0723 15Z" fill="#D42C00"/>
      <path d="M7.84153 1.62125e-05C6.51701 1.62125e-05 5.33055 0.825454 4.8612 2.0735L3.6377 5.32691H10.1739L6.5361 15H11.8226L15.4604 5.32691H21.9966L23.9999 1.62125e-05H7.84153Z" fill="#D42C00"/>
    </g>
    <defs><clipPath id="hdr-cta"><rect width="24" height="15" fill="white"/></clipPath></defs>
  </svg>
)

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.2847 2.5C17.691 2.50375 18.4047 2.51125 19.021 2.52875L19.2635 2.5375C19.5435 2.5475 19.8197 2.56 20.1535 2.575C21.4835 2.6375 22.391 2.8475 23.1872 3.15625C24.0122 3.47375 24.7072 3.90375 25.4022 4.5975C26.0381 5.22217 26.53 5.97809 26.8435 6.8125C27.1522 7.60875 27.3622 8.51625 27.4247 9.8475C27.4397 10.18 27.4522 10.4563 27.4622 10.7375L27.4697 10.98C27.4885 11.595 27.496 12.3088 27.4985 13.715L27.4997 14.6475V16.285C27.5028 17.1968 27.4932 18.1085 27.471 19.02L27.4635 19.2625C27.4535 19.5437 27.441 19.82 27.426 20.1525C27.3635 21.4837 27.151 22.39 26.8435 23.1875C26.53 24.0219 26.0381 24.7778 25.4022 25.4025C24.7776 26.0384 24.0216 26.5302 23.1872 26.8438C22.391 27.1525 21.4835 27.3625 20.1535 27.425L19.2635 27.4625L19.021 27.47C18.4047 27.4875 17.691 27.4963 16.2847 27.4988L15.3522 27.5H13.716C12.8038 27.5032 11.8916 27.4936 10.9797 27.4712L10.7372 27.4638C10.4405 27.4525 10.1438 27.4396 9.84723 27.425C8.51723 27.3625 7.60973 27.1525 6.81223 26.8438C5.97827 26.5301 5.22279 26.0382 4.59848 25.4025C3.96217 24.778 3.46987 24.022 3.15598 23.1875C2.84723 22.3912 2.63723 21.4837 2.57473 20.1525L2.53723 19.2625L2.53098 19.02C2.50794 18.1085 2.49752 17.1968 2.49973 16.285V13.715C2.49627 12.8033 2.50544 11.8915 2.52723 10.98L2.53598 10.7375C2.54598 10.4563 2.55848 10.18 2.57348 9.8475C2.63598 8.51625 2.84598 7.61 3.15473 6.8125C3.46935 5.97775 3.96251 5.2218 4.59973 4.5975C5.22368 3.96194 5.97872 3.47009 6.81223 3.15625C7.60973 2.8475 8.51598 2.6375 9.84723 2.575C10.1797 2.56 10.4572 2.5475 10.7372 2.5375L10.9797 2.53C11.8912 2.50779 12.803 2.49821 13.7147 2.50125L16.2847 2.5ZM14.9997 8.75C13.3421 8.75 11.7524 9.40848 10.5803 10.5806C9.40821 11.7527 8.74973 13.3424 8.74973 15C8.74973 16.6576 9.40821 18.2473 10.5803 19.4194C11.7524 20.5915 13.3421 21.25 14.9997 21.25C16.6573 21.25 18.247 20.5915 19.4192 19.4194C20.5913 18.2473 21.2497 16.6576 21.2497 15C21.2497 13.3424 20.5913 11.7527 19.4192 10.5806C18.247 9.40848 16.6573 8.75 14.9997 8.75ZM21.5635 6.875C21.1491 6.875 20.7517 7.03962 20.4586 7.33265C20.1656 7.62567 20.001 8.0231 20.001 8.4375C20.001 8.8519 20.1656 9.24933 20.4586 9.54235C20.7517 9.83538 21.1491 10 21.5635 10C21.9779 10 22.3753 9.83538 22.6683 9.54235C22.9614 9.24933 23.126 8.8519 23.126 8.4375C23.126 8.0231 22.9614 7.62567 22.6683 7.33265C22.3753 7.03962 21.9779 6.875 21.5635 6.875Z" fill="#8A8A8A"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.5 15C27.5 8.1 21.9 2.5 15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.05 6.8 26.0875 12.5 27.25V18.75H10V15H12.5V11.875C12.5 9.4625 14.4625 7.5 16.875 7.5H20V11.25H17.5C16.8125 11.25 16.25 11.8125 16.25 12.5V15H20V18.75H16.25V27.4375C22.5625 26.8125 27.5 21.4875 27.5 15Z" fill="#8A8A8A"/>
  </svg>
)

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const { items } = useCart()
  const positionCount = items.length

  // close menu on resize > 768
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  const navLinks = (
    <>
      <li><NavLink to="/#about" onClick={close}>About us</NavLink></li>
      <li><NavLink to="/catalog" onClick={close}>Catalog</NavLink></li>
      <li><NavLink to="/#how-it-works" onClick={close}>How it works?</NavLink></li>
      <li><NavLink to="/#contacts" onClick={close}>Contacts</NavLink></li>
    </>
  )

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="iTrucking Fleet Care">
          <LogoSVG height={40} />
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>{navLinks}</ul>

          <div className={styles.socialIcons}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
            {positionCount > 0 && (
              <Link to="/cart" className={styles.cartBtn} aria-label={`Cart (${positionCount} items)`}>
                <CartIcon />
                <span className={styles.cartBadge}>{positionCount > 99 ? '99+' : positionCount}</span>
              </Link>
            )}
          </div>

          <Link to="/catalog" className={styles.ctaButton}>
            <TruckIcon />
            Get Tire Savings
          </Link>
        </nav>

        {/* Mobile cart + hamburger group */}
        <div className={styles.mobileRight}>
          {positionCount > 0 && (
            <Link to="/cart" className={styles.headerMobileCart} aria-label={`Cart (${positionCount} items)`}>
              <CartIcon />
              <span className={styles.cartBadge}>{positionCount > 99 ? '99+' : positionCount}</span>
            </Link>
          )}
          <button
            className={`${styles.mobileMenuBtn} ${menuOpen ? styles.active : ''}`}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuActive : ''}`}>
        <ul className={styles.navLinks}>{navLinks}</ul>
        <div className={styles.socialIcons}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
        </div>
        {positionCount > 0 && (
          <Link to="/cart" className={styles.cartBtn} aria-label={`Cart (${positionCount} items)`} onClick={close}>
            <CartIcon />
            <span className={styles.cartBadge}>{positionCount > 99 ? '99+' : positionCount}</span>
            <span className={styles.cartLabel}>Cart ({positionCount})</span>
          </Link>
        )}
        <Link to="/catalog" className={styles.ctaButton} onClick={close}>
          <TruckIcon />
          Get Tire Savings
        </Link>
      </div>
    </header>
  )
}
