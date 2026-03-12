import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PageTransition from './components/common/PageTransition'
import { ROUTES } from './constants/routes'

// Scrolls to hash anchor after every navigation
function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Small delay to let the page render first
      const id = hash.replace('#', '')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname, hash])
  return null
}

function App() {
  return (
    <Router>
      <ScrollToHash />
      <Header />
      <main>
        <PageTransition>
          <Routes>
            <Route path={ROUTES.HOME}     element={<Home />} />
            <Route path={ROUTES.CATALOG}  element={<Catalog />} />
            <Route path={ROUTES.PRODUCT}  element={<Product />} />
            <Route path={ROUTES.CART}     element={<Cart />} />
            <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </Router>
  )
}

export default App
