/**
 * catalogService.js
 *
 * Fetches the product catalog from a published Google Sheets CSV.
 * Set VITE_SHEETS_CSV_URL in .env to enable live data.
 * Falls back to sampleProducts.js when the env var is absent or fetch fails.
 */

import { SAMPLE_PRODUCTS } from '../data/sampleProducts'

// ── Column name mapping ────────────────────────────────────────────────────
// Change only the VALUES (right side) to match your Google Sheet column headers.
// The KEYS (left side) are internal identifiers — do NOT rename them.
//
// Правило: значение = точное название колонки в первой строке таблицы.
// Регистр не важен: «Price» и «price» и «PRICE» — одно и то же.
//
// ┌─ ВАЖНО: каждый размер шины — отдельная строка в таблице ──────────────┐
// │  Например, модель DL15+ в 3 размерах = 3 строки в таблице.           │
// │  Все три строки объединяет поле family_id (одинаковое значение).      │
// │  Сайт использует family_id чтобы показать кнопки-размеры и таблицу   │
// │  Size Details со ссылками на каждый конкретный товар.                 │
// └───────────────────────────────────────────────────────────────────────┘
const COL = {

  // ── Основная информация о товаре ─────────────────────────────────────────

  id:           'id',
  // Уникальный ключ — используется в URL страницы товара (/product/ВАШ_ID).
  // Только латиница, цифры, дефис. Должен быть уникальным для каждой строки.
  // Пример: hankook-dl15-295-75r22-5

  name:         'name',
  // Полное название шины, отображается как заголовок страницы.
  // Пример: Hankook Smart Flex DL15+

  brand:        'brand',
  // Бренд строчными буквами, пробелы можно (сайт сам уберёт лишнее).
  // Пример: hankook   michelin   bridgestone

  price:        'price',
  // Цена продажи — только число, без знака $. Пример: 485

  retail_price: 'retail_price',
  // Розничная (обычная) цена — только число. Показывается как «retail price».
  // Пример: 795

  discount:     'discount',
  // Скидка в процентах — только число. Пример: 40  →  покажет «-40%»
  // Оставьте пустым, если скидки нет.

  badge:        'badge',
  // Текст бейджа на карточке каталога. Примеры: Best %   NEW   HOT
  // Оставьте пустым — бейдж не появится.

  badge_variant: 'badge_variant',
  // Цвет бейджа. Допустимые значения: red   blue
  // По умолчанию: red (если оставить пустым).

  image:        'image',
  // Путь к фото шины относительно папки public.
  // Пример: /images/tires/hankook-dl15.jpg
  // Если пусто — используется стандартное фото /images/tire-product.png

  size:         'size',
  // Размер ЭТОГО конкретного товара. Каждая строка = один размер.
  // Пример: 295/75R22.5   11R22.5   285/75R24.5

  family_id:    'family_id',
  // ID семейства — одинаковый для всех размеров одной модели.
  // Сайт использует его чтобы связать карточки разных размеров.
  // Пример: все размеры Hankook DL15+ получают значение  hankook-dl15
  // Правила те же, что для id: только латиница, цифры, дефис.

  tags:         'tags',
  // Теги через запятую (без пробелов вокруг запятой).
  // Пример: Long Haul,M+S,S3PMSF

  location:     'location',
  // Где продаётся. Допустимые значения:
  //   sacramento  — только склад в Сакраменто
  //   loves       — только Love's & Speedco
  //   all         — оба варианта

  brand_logo:   'brand_logo',
  // Путь к логотипу бренда относительно папки public.
  // Пример: /images/hankook-logo.png

  description:  'description',
  // Текст описания — показывается на вкладке Description.
  // Можно несколько предложений. Переносы строк не нужны.

  brand_text:   'brand_text',
  // Текст о бренде — показывается в блоке справа на вкладке Description.

  avail_sac_status:  'avail_sac_status',
  // Наличие на складе Сакраменто. Значения: in-stock   low   out

  avail_sac_label:   'avail_sac_label',
  // Подпись наличия Сакраменто, видна покупателю.
  // Пример: small quantity at Sacramento's warehouse

  avail_loves_status: 'avail_loves_status',
  // Наличие у Love's & Speedco. Значения: in-stock   low   out

  avail_loves_label:  'avail_loves_label',
  // Подпись наличия Love's, видна покупателю.
  // Пример: in stock at Love's & Speedco

  // ── Спецификации (вкладка Specifications) ────────────────────────────────
  // Описания столбца Description захардкожены в коде — менять не нужно.
  // Ваша задача: заполнить только значения (колонки ниже).

  spec_sidewall:      'spec_sidewall',
  // Тип боковины. Пример: BSW (Black Side Wall)   OWL (Outlined White Letters)

  spec_tread_pattern: 'spec_tread_pattern',
  // Рисунок протектора. Пример: Directional   Symmetrical   Asymmetrical

  spec_tread_depth:   'spec_tread_depth',
  // Глубина протектора. Пример: 6/32"   10/32"

  spec_load_index:    'spec_load_index',
  // Индекс нагрузки / грузоподъёмность. Пример: Load Range G   144/142L

  spec_speed_rating:  'spec_speed_rating',
  // Индекс скорости. Пример: H (130 mph)   L (75 mph)

  spec_aspect_ratio:  'spec_aspect_ratio',
  // Соотношение высоты к ширине (число). Пример: 75   60   80

  spec_diameter:      'spec_diameter',
  // Диаметр диска. Пример: 22.5 inches   17 inches

  spec_seasonality:   'spec_seasonality',
  // Сезонность. Пример: All-Season   Winter   Summer

  spec_warranty:      'spec_warranty',
  // Гарантия пробега. Пример: 60,000 miles   (пусто если нет)

  // ── Данные таблицы Size Details ───────────────────────────────────────────
  // Каждая строка таблицы = отдельный товар (отдельная строка в таблице).
  // Все строки одной модели объединяет family_id (см. выше).
  // Нажав на строку в таблице Size Details, покупатель перейдёт на страницу
  // именно этого размера.

  load_index:       'load_index',
  // Индекс нагрузки для этого конкретного размера.
  // Пример: 144/142L   148/145L

  load_range:       'load_range',
  // Нагрузочный диапазон / слойность.
  // Пример: G/14PLY   H/16PLY

  overall_diameter: 'overall_diameter',
  // Наружный диаметр в дюймах (число).
  // Пример: 41.7   43.2

  max_dual:         'max_dual',
  // Максимальная нагрузка в двойной ошиновке (lbs, только число).
  // Пример: 5840   6000

  mfg_number:       'mfg_number',
  // Артикул производителя (MFG #).
  // Пример: 3004004   3004005
}

// ── Module-level cache (shared across all renders) ─────────────────────────
let _data = null
let _ts   = 0
const TTL = 5 * 60 * 1000   // 5 minutes

// ── CSV parser ─────────────────────────────────────────────────────────────
function parseLine(line) {
  const cols = []
  let cur  = ''
  let inQ  = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
      else inQ = !inQ
    } else if (c === ',' && !inQ) {
      cols.push(cur); cur = ''
    } else {
      cur += c
    }
  }
  cols.push(cur)
  return cols
}

function rowToProduct(raw) {
  // Normalise: look up each internal key via COL mapping (case-insensitive)
  const r = {}
  Object.entries(COL).forEach(([internal, sheetCol]) => {
    const key = Object.keys(raw).find(k => k.toLowerCase() === sheetCol.toLowerCase())
    r[internal] = key !== undefined ? raw[key] : ''
  })

  const price       = parseFloat(String(r.price).replace(/[^0-9.]/g, ''))        || 0
  const retailPrice = parseFloat(String(r.retail_price).replace(/[^0-9.]/g, '')) || 0
  const discount    = parseInt(r.discount)       || 0
  const badge       = r.badge?.trim()

  return {
    id:          r.id,
    name:        r.name,
    brand:       r.brand?.toLowerCase().replace(/\s+/g, '-'),
    price:       `$${price.toFixed(2)}`,
    oldPrice:    retailPrice ? `$${retailPrice.toFixed(2)} retail price` : '',
    discount:    discount    ? `-${discount}%`                           : '',
    priceNum:    price,
    discountNum: discount,
    badge:       badge ? { text: badge, variant: r.badge_variant?.trim() || 'red' } : null,
    image:       r.image?.trim()    || '/images/tires/tire-product.png',
    size:        r.size?.trim()     || '',
    familyId:    r.family_id?.trim() || '',   // groups all sizes of the same model
    tags:        r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    location:    r.location?.trim() || 'all',

    // ── Product detail fields ─────────────────────────────────────────────
    brandLogo:        r.brand_logo?.trim()          || '',
    description:      r.description?.trim()         || '',
    brandText:        r.brand_text?.trim()           || '',
    availSacStatus:   r.avail_sac_status?.trim()    || '',
    availSacLabel:    r.avail_sac_label?.trim()      || '',
    availLovesStatus: r.avail_loves_status?.trim()   || '',
    availLovesLabel:  r.avail_loves_label?.trim()    || '',

    // ── Specifications ─────────────────────────────────────────────────────
    specifications: [
      { key: 'sidewall',      value: r.spec_sidewall?.trim()      || '' },
      { key: 'treadPattern',  value: r.spec_tread_pattern?.trim() || '' },
      { key: 'treadDepth',    value: r.spec_tread_depth?.trim()   || '' },
      { key: 'loadIndex',     value: r.spec_load_index?.trim()    || '' },
      { key: 'speedRating',   value: r.spec_speed_rating?.trim()  || '' },
      { key: 'aspectRatio',   value: r.spec_aspect_ratio?.trim()  || '' },
      { key: 'diameter',      value: r.spec_diameter?.trim()      || '' },
      { key: 'seasonality',   value: r.spec_seasonality?.trim()   || '' },
      { key: 'warranty',      value: r.spec_warranty?.trim()      || '' },
    ].filter(s => s.value),   // skip empty specs

    // ── Size Details row data (this product = one size) ───────────────────
    // Size Details table is built from ALL products sharing the same familyId.
    loadIndex:       r.load_index?.trim()       || '',
    loadRange:       r.load_range?.trim()        || '',
    overallDiameter: r.overall_diameter?.trim()  || '',
    maxDual:         r.max_dual?.trim()          || '',
    mfgNumber:       r.mfg_number?.trim()        || '',
    diameter:        r.spec_diameter?.trim()     || '',
    speedRating:     r.spec_speed_rating?.trim() || '',
  }
}

function csvToProducts(text) {
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseLine(lines[0]).map(h => h.trim().toLowerCase())

  return lines.slice(1).map(line => {
    const vals = parseLine(line)
    const r    = {}
    headers.forEach((h, i) => { r[h] = (vals[i] ?? '').trim() })
    return rowToProduct(r)
  }).filter(p => p.id)   // skip rows without an id (e.g. empty trailing rows)
}

// ── Public API ─────────────────────────────────────────────────────────────
/**
 * Returns the product array.
 * - If VITE_SHEETS_CSV_URL is not set → returns null (caller uses fallback)
 * - If fetch fails                    → throws (caller catches and uses fallback)
 */
export async function fetchCatalog() {
  const url = import.meta.env.VITE_SHEETS_CSV_URL
  if (!url) return null   // signal: "no URL configured, use sample data"

  const now = Date.now()
  if (_data && now - _ts < TTL) return _data

  const res = await fetch(url, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`)

  const text = await res.text()
  _data = csvToProducts(text)
  _ts   = now
  return _data
}

/** Force-clears the in-memory cache (useful after you update the sheet) */
export function clearCatalogCache() {
  _data = null
  _ts   = 0
}

export { SAMPLE_PRODUCTS as FALLBACK_PRODUCTS }
