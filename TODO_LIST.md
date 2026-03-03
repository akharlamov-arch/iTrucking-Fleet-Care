# Fleet Care Site — TODO LIST
> Last updated: March 2, 2026

---

## STATUS LEGEND
- ⬜ Not started
- 🔄 In progress
- ✅ Completed
- ❌ Blocked / On hold

---

# ЧАСТЬ 1 — РАЗРАБОТКА (CODE)

## ✅ FRONTEND — React + Vite

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| F-01 | Инициализировать Vite + React проект (client/) | ✅ | React 18.3.1, Vite 6.4.1, порт 3000 |
| F-02 | Структура проекта (components, pages, hooks, services, context) | ✅ | |
| F-03 | styles/variables.css — дизайн-токены | ✅ | Цвета, типографика, отступы, тени, z-index |
| F-04 | constants/routes.js — все пути в одном месте | ✅ | ROUTES.HOME, ROUTES.CATALOG, etc. |
| F-05 | constants/config.js — конфиг приложения | ✅ | COMPANY, INVOICE, LOCATIONS, SOCIAL |
| F-06 | utils/format.js — утилиты форматирования | ✅ | formatPrice, formatInvoiceNumber, etc. |
| F-07 | services/api.js — Axios instance с interceptors | ✅ | JWT Bearer, 15s timeout, error handler |
| F-08 | services/products.js — Product API calls | ✅ | getProducts, getProductById, getFeatured |
| F-09 | services/orders.js — Orders/Invoice API calls | ✅ | createOrder, getOrderById, getInvoicePdfUrl |
| F-10 | context/CartContext.jsx + hooks/useCart.js | ✅ | useReducer + localStorage persistence |
| F-11 | hooks/useProducts.js — API-fetch hook | ✅ | DEV fallback к статике при отсутствии бэкенда |
| F-12 | LogoSVG.jsx — логотип компании | ✅ | |
| F-13 | Header.jsx — шапка сайта (sticky) | ✅ | Перемещён в components/layout/ |
| F-14 | Footer.jsx — подвал сайта (светлая тема) | ✅ | #F5F5F5 фон, #4D4D4D текст |
| F-15 | TireCard.jsx — карточка товара | ✅ | |
| F-16 | Breadcrumbs.jsx — хлебные крошки | ✅ | |
| F-17 | Home.jsx — главная страница (5 секций) | ✅ | Hero, Brands, About, Deals, Delivery |
| F-18 | Catalog.jsx — каталог с фильтрами | ✅ | Сайдбар, сетка, сортировка, мобильный оверлей |
| F-19 | Product.jsx — страница товара | ✅ | 3 колонки, 4 вкладки, добавление в корзину |
| F-20 | Cart.jsx — корзина | ✅ | Список, +/- кол-во, сводка заказа |
| F-21 | Checkout.jsx — оформление заказа (Invoice) | ✅ | Форма с валидацией, Net 30, экран успеха |
| F-22 | Сборка npx vite build — без ошибок | ✅ | 107 modules, 434ms |
| F-23 | Скопировать assets из docs/legacy/ в client/public/images/ | ✅ | SVG логотипы брендов + PNG плейсхолдеры. MP4 видео нужно добавить вручную |
| F-24 | Адаптивная вёрстка — мобильная версия (< 768px) | ⬜ | |
| F-25 | Страница 404 — Not Found | ⬜ | |
| F-26 | Страница Order Confirmation — детали заказа по invoiceId | ⬜ | |
| F-27 | Страница About — о компании | ⬜ | Опционально |
| F-28 | SEO — мета-теги, og:image, sitemap.xml | ⬜ | |

---

## ⬜ BACKEND — Node.js + Express

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| B-01 | Инициализировать server/ — npm init + зависимости | ⬜ | express, mysql2, cors, dotenv, nodemon |
| B-02 | server/src/index.js — Express сервер, порт 5000 | ⬜ | CORS для localhost:3000 |
| B-03 | server/src/db/connection.js — MySQL2 connection pool | ⬜ | Читает .env credentials |
| B-04 | GET /api/products — список с фильтрацией + пагинацией | ⬜ | brand, type, size, sort, page |
| B-05 | GET /api/products/:id — один товар | ⬜ | |
| B-06 | POST /api/orders — создать заказ + инвойс | ⬜ | Сохранить в MySQL, вернуть invoiceNumber |
| B-07 | GET /api/orders/:id — детали заказа | ⬜ | |
| B-08 | GET /api/orders/:id/invoice.pdf — PDF инвойса | ⬜ | pdfkit или puppeteer |
| B-09 | GET /api/orders?email=... — история заказов | ⬜ | |
| B-10 | Middleware: валидация (express-validator) | ⬜ | |
| B-11 | Middleware: rate limiting (express-rate-limit) | ⬜ | |
| B-12 | Vite proxy /api -> http://localhost:5000 | ⬜ | В vite.config.js |
| B-13 | .env.example — шаблон переменных окружения | ⬜ | DB_HOST, DB_USER, DB_PASS, DB_NAME, PORT |
| B-14 | Email при новом заказе (nodemailer) | ⬜ | Клиенту + менеджеру |
| B-15 | Admin API: GET /api/admin/orders | ⬜ | Требует JWT |
| B-16 | Admin API: PATCH /api/admin/orders/:id/status | ⬜ | Sent / Viewed / Paid / Overdue |
| B-17 | Admin API: POST /api/admin/products | ⬜ | |
| B-18 | Admin API: PUT /api/admin/products/:id | ⬜ | |
| B-19 | Admin API: DELETE /api/admin/products/:id | ⬜ | |
| B-20 | Admin API: POST /api/admin/import/csv | ⬜ | |
| B-21 | POST /api/auth/login — JWT + bcrypt | ⬜ | |

---

## ⬜ DATABASE — MySQL 8+

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| D-01 | migrations/001_create_products.sql | ⬜ | id, sku, brand, model, size, type, price, stock |
| D-02 | migrations/002_create_orders.sql | ⬜ | id, invoice_number, company, email, status, total |
| D-03 | migrations/003_create_order_items.sql | ⬜ | order_id FK, product_id FK, qty, unit_price |
| D-04 | migrations/004_create_admins.sql | ⬜ | id, email, password_hash, role |
| D-05 | migrations/005_create_locations.sql | ⬜ | Sacramento + Loves partner network |
| D-06 | seeds/sample_products.sql | ⬜ | Минимум 20 SKU для разработки |
| D-07 | seeds/sample_admins.sql | ⬜ | |

---

## ⬜ ADMIN PANEL

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| A-01 | Инициализировать admin/ — React + Vite, порт 3001 | ⬜ | |
| A-02 | Login страница (JWT) | ⬜ | |
| A-03 | Dashboard — статистика (заказы, выручка) | ⬜ | |
| A-04 | Orders список — фильтрация по статусу | ⬜ | |
| A-05 | Order detail — просмотр, смена статуса | ⬜ | |
| A-06 | Invoice PDF — просмотр / скачивание | ⬜ | |
| A-07 | Products список — CRUD | ⬜ | |
| A-08 | CSV Import — массовая загрузка каталога | ⬜ | |

---

## ⬜ DEVOPS & DEPLOY

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| V-01 | git init + первый коммит | ⬜ | .gitignore: node_modules, build/, .env |
| V-02 | Репозиторий на GitHub / GitLab (Private) | ⬜ | |
| V-03 | Деплой фронтенда на AWS S3 + CloudFront | ⬜ | npm run build -> upload build/ |
| V-04 | Деплой бэкенда на AWS EC2 (PM2) | ⬜ | |
| V-05 | AWS RDS (MySQL) для production | ⬜ | |
| V-06 | SSL — AWS ACM + CloudFront | ⬜ | |
| V-07 | CI/CD — GitHub Actions | ⬜ | Автодеплой при push в main |

---

# ЧАСТЬ 2 — ВНЕШНИЕ ЗАДАЧИ (вне VS Code)

## LOCAL ENVIRONMENT

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 1.1 | Установить Node.js (v20 LTS) | ✅ | v25.6.1 установлен |
| 1.2 | Установить npm | ✅ | v11.9.0 |
| 1.3 | Установить MySQL (v8+) | ⬜ | https://dev.mysql.com/downloads/mysql/ |
| 1.4 | Установить MySQL Workbench | ⬜ | https://dev.mysql.com/downloads/workbench/ |
| 1.5 | Установить Git | ⬜ | https://git-scm.com |
| 1.6 | Установить Postman | ⬜ | https://www.postman.com/downloads/ |

---

## INVOICE & PAYMENT

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 3.1 | Согласовать шаблон инвойса с бухгалтерией | ⬜ | Логотип, реквизиты, налог CA, условия |
| 3.2 | Срок оплаты | ✅ | Net 30 — уже в config.js |
| 3.3 | Нумерация инвойсов | ✅ | FC-00001 — уже в config.js |
| 3.4 | Способы оплаты | ⬜ | ACH, Check, Wire |
| 3.5 | Реквизиты компании в .env | ⬜ | TAX_ID, LEGAL_ADDRESS |

---

## EMAIL SERVICE

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 4.1 | Выбрать email-провайдер | ⬜ | Resend.com или SendGrid |
| 4.2 | Настроить корпоративный email | ⬜ | orders@itruckingfleetcare.com |
| 4.3 | SMTP credentials / API key | ⬜ | Занести в .env |
| 4.4 | Верифицировать домен (SPF/DKIM) | ⬜ | DNS TXT-запись |

---

## CLOUD HOSTING (AWS)

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 5.1 | Создать аккаунт AWS | ⬜ | https://aws.amazon.com |
| 5.2 | S3 Bucket для изображений | ⬜ | Регион: us-west-2 |
| 5.3 | IAM User (S3 + EC2) | ⬜ | Access Key + Secret |
| 5.4 | AWS credentials в .env | ⬜ | |
| 5.5 | EC2 instance для бэкенда | ⬜ | |
| 5.6 | RDS (MySQL) для production | ⬜ | |
| 5.7 | CloudFront CDN | ⬜ | |

---

## DOMAIN & SSL

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 6.1 | Зарегистрировать домен | ⬜ | GoDaddy, Namecheap, AWS Route 53 |
| 6.2 | DNS на EC2 (A-record) | ⬜ | |
| 6.3 | SSL (Let Encrypt / AWS ACM) | ⬜ | |
| 6.4 | HTTPS redirect | ⬜ | |

---

## КАТАЛОГ (CSV)

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 7.1 | Согласовать формат CSV | ⬜ | SKU, Brand, Model, Size, Type, Price, Image URL |
| 7.2 | Тестовый CSV (20+ позиций) | ⬜ | |
| 7.3 | Правила ценообразования | ⬜ | Собственный склад vs партнёры |

---

## BUSINESS / LEGAL

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 8.1 | Terms & Conditions | ⬜ | Условия доставки, возврата |
| 8.2 | Privacy Policy | ⬜ | California CCPA |
| 8.3 | Порог бесплатной доставки по Сакраменто | ⬜ | Например: от $500 |
| 8.4 | Список сотрудников для доступа к админ-панели | ⬜ | Email + роль |

---

## PRE-LAUNCH CHECKLIST

| # | Задача | Статус | Заметки |
|---|--------|--------|---------|
| 9.1 | Тестовый заказ — генерация инвойса | ⬜ | |
| 9.2 | Email с инвойсом | ⬜ | |
| 9.3 | CSV-импорт с реальными данными | ⬜ | |
| 9.4 | Google Analytics | ⬜ | |
| 9.5 | Google Search Console | ⬜ | |
| 9.6 | Мобильная версия (iOS + Android) | ⬜ | |
| 9.7 | Статусы инвойсов в админ-панели | ⬜ | Sent / Viewed / Paid / Overdue |
| 9.8 | Backup БД перед запуском | ⬜ | |

---

## БЛИЖАЙШИЕ ШАГИ (Next Up)

1. Добавить реальные MP4 видео: truck-video.mp4, delivery-van.mp4, tire-hankook-dl15.mp4 в client/public/images/
2. V-01 — git init + .gitignore + первый коммит
3. B-01..B-03 — server/, Express + MySQL connection
4. D-01..D-06 — SQL миграции + seed-данные
5. B-04..B-09 — REST API endpoints
6. F-25 — Страница 404
