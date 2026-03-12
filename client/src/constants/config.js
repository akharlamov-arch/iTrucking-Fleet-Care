/**
 * Application-wide configuration constants.
 * Values that differ per environment should come from import.meta.env.
 */

// ─── Company Info ───────────────────────────────────────────────────────────
export const COMPANY = {
  name:       'iTRUCKING Fleet Care',
  email:      'info@ifleetcare.com',
  phone:      '(916) 234-0257',
  phoneHref:  'tel:+19162340257',
  address:    '3951 Development Drive, Unit 4, Sacramento, CA 95838',
  warehouseAddress: '3951 Development Drive, Unit 4, Sacramento, CA 95838',
  warehouseHours:   '9 a.m. – 4 p.m.',
}

// ─── Social Links ───────────────────────────────────────────────────────────
export const SOCIAL = {
  instagram: 'https://instagram.com',
  facebook:  'https://facebook.com',
}

// ─── Invoice Settings ───────────────────────────────────────────────────────
export const INVOICE = {
  prefix:       'FC',          // FC-00001
  paymentTerms: 'Net 30',
  currency:     'USD',
  taxRate:      0.10,          // 10 %
}

// ─── Delivery ───────────────────────────────────────────────────────────────
export const DELIVERY = {
  freeThresholdMiles: 50,      // free delivery within 50 miles of Sacramento
  sacZipCodes: ['95811','95814','95815','95816','95817','95818','95819','95820','95821','95822','95823','95824','95825','95826','95827','95828','95829','95831','95832','95833','95834','95835','95838'],
}

// ─── Locations ──────────────────────────────────────────────────────────────
export const LOCATIONS = {
  sacramento: {
    id:      'sacramento',
    label:   "Sacramento's Warehouse",
    short:   'Sacramento',
    color:   'var(--color-warning)',   // orange dot
  },
  loves: {
    id:      'loves',
    label:   'Love\'s & Speedco Truck Stops',
    short:   'Love\'s',
    color:   'var(--color-success)',   // green dot
  },
}

// ─── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'
