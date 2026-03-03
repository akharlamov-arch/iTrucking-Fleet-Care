import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { ROUTES } from './constants/routes'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path={ROUTES.HOME}     element={<Home />} />
          <Route path={ROUTES.CATALOG}  element={<Catalog />} />
          <Route path={ROUTES.PRODUCT}  element={<Product />} />
          <Route path={ROUTES.CART}     element={<Cart />} />
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
