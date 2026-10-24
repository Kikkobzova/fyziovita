# SPEC.md – Web FyzioVita (fyziovita.cz)

> **Pro kódovací model:** Tento dokument je jediný zdroj pravdy. Implementuj ho **přesně a po fázích** (kap. 13). Nic si nevymýšlej – žádné tituly, recenze, ceny ani služby navíc. Vše označené `[DOPLNIT]` nebo `[OVĚŘIT]` implementuj jako hodnotu v konfiguraci / datovém souboru (ne natvrdo v komponentě), aby šla později změnit na jednom místě. Veškerý viditelný text webu je **česky**, oslovení **vykáním**.

---

## 0. Kontext projektu

| Položka | Hodnota |
|---|---|
| Značka | **FyzioVita** |
| Fyzioterapeutka | **Mgr. Kristýna Kobzová** |
| Provozovatel | Mgr. Kristýna Kobzová (OSVČ), **IČO 23165391**, není plátce DPH |
| Adresa ambulance (veřejná, NAP) | **Křenová 479/71, 602 00 Brno** (Brno-Trnitá), 2. NP |
| Sídlo (pouze v patičce / právní údaje, NE ve schématu) | Karáskovo náměstí 2569/8, 615 00 Brno |
| Telefon | +420 732 958 692 (preferován e-mail; volat/SMS jen v nutnosti) |
| E-mail | kikkobzova@gmail.com `[DOPLNIT později info@fyziovita.cz]` |
| Doména | https://fyziovita.cz (bez www, s HTTPS) |
| Ordinační doba | pátek 16:00–22:00, sobota 6:00–12:00 – **pouze na objednání** |
| Cena | Terapie 50 min = **1 000 Kč** (hotově nebo QR platbou) |
| Rezervace | Rehatab (https://www.rehatab.cz/) – **profil zatím neaktivní** → feature flag |
| MHD | Tramvajová zastávka **Masná** (linky 8, 9, 10) – přímo u budovy |
| GPS | 49.19147, 16.6251786 |
| Hosting | Netlify (statický build) |

**Cíl webu:** (1) přivést pacienta k online rezervaci přes Rehatab během max. 2 kliknutí z jakéhokoli místa, (2) vybudovat důvěru (E-E-A-T – YMYL zdravotní obor), (3) rankovat lokálně na „fyzioterapie Brno“, „fyzioterapeut Brno střed / Trnitá“, „bolest zad Brno fyzioterapie“, „sportovní fyzioterapie Brno“.

**Cílové skupiny:** lidé se sedavým zaměstnáním (bolesti zad, krku, hlavy), rekreační i výkonnostní sportovci, běžná veřejnost s bolestmi pohybového aparátu.

---

## 1. Tech stack a zdůvodnění

| Vrstva | Volba | Proč |
|---|---|---|
| Framework | **Astro (nejnovější stabilní, ≥ 5.x)**, `output: 'static'` | Generuje čisté HTML s **nulovým JS ve výchozím stavu** → reálně 100/100 PageSpeed. Nativní podpora Markdown/MDX článků přes Content Collections, typově bezpečný frontmatter (Zod). Netlify nepotřebuje adaptér. |
| Styly | **Tailwind CSS v4** přes `@tailwindcss/vite` | Utility CSS, při buildu se ořízne jen použité třídy (typicky < 15 kB). Tokeny v `@theme` v CSS. |
| Typografie článků | `@tailwindcss/typography` (plugin přes `@plugin` v CSS) | Hezky vysázený Markdown bez ruční práce. |
| Obrázky | `astro:assets` (`<Picture>` / `<Image>`) | Automaticky AVIF + WebP, `srcset`, `width/height` (nulový CLS), lazy loading. |
| Font | **Plus Jakarta Sans Variable** přes `@fontsource-variable/plus-jakarta-sans` | Self-hosted (žádné Google Fonts = GDPR + rychlost), podpora české diakritiky (latin-ext). Jediná rodina písma. |
| Sitemap | `@astrojs/sitemap` | Automatická sitemap-index.xml. |
| Formulář | **Netlify Forms** (bez JS, honeypot) | Žádný backend, zdarma 100 odeslání/měsíc. |
| Mapa | Statický náhled + **klik pro načtení** Google Maps iframe | Žádné cookies třetích stran před souhlasem → **není potřeba cookie lišta**. |
| Analytika | Žádná ve v1 (volitelně později cookieless: Netlify Analytics / Plausible / Umami) | Bez cookies, bez banneru. |
| JS | Pouze malý inline skript pro mobilní menu + načtení mapy (< 1 kB) | Žádný React/Vue. |
| Node | **Node.js LTS (≥ 20.x, doporučeno 22.x)** | Pozn.: na počítači majitele **Node zatím není nainstalován** – nainstalovat z nodejs.org před prvním spuštěním. |

**Proč ne čisté HTML:** každý nový článek by znamenal ruční kopírování hlavičky, patičky, schémat a sitemap. V Astru stačí přidat jeden `.md` soubor do `src/content/clanky/` a vše ostatní (stránka, výpis, sitemap, schema, drobečková navigace) se vygeneruje samo.

**Proč ne WordPress/Next.js:** WordPress = server, databáze, pluginy, údržba a bezpečnost; Next.js = zbytečný JS runtime. Astro statika je pro tento účel nejrychlejší a nejlevnější (Netlify free tier).

### 1.1 Instalace (příkazy)

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git --install
npx astro add sitemap
npm i tailwindcss @tailwindcss/vite @tailwindcss/typography @fontsource-variable/plus-jakarta-sans
```

### 1.2 `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://fyziovita.cz',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/dekujeme/') && !page.includes('/404'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
```

> `inlineStylesheets: 'always'` vloží CSS přímo do HTML → odpadá render-blocking request (klíčové pro 100/100).

---

## 2. Struktura repozitáře

Kořen projektu = složka `FyzioVita-web/`. **Existující složku `assets/` přesuň do `src/assets/`** (obsah je již připraven, nepřejmenovávej soubory).

```
FyzioVita-web/
├─ SPEC.md
├─ netlify.toml
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
├─ public/
│  ├─ favicon.ico                 ← z src/assets/logo/processed/favicon.ico (zkopírovat)
│  ├─ icon-192.png, icon-512.png  ← zkopírovat z processed/
│  ├─ apple-touch-icon.png        ← zkopírovat z processed/
│  ├─ og-image.jpg                ← zkopírovat z src/assets/og-image.jpg (1200×630)
│  ├─ site.webmanifest
│  └─ robots.txt
├─ src/
│  ├─ assets/
│  │  ├─ logo/processed/          ← logo-symbol-header.png, logo-full-transparent.png, …
│  │  ├─ physio-vita-photos/      ← 7 připravených fotografií (viz kap. 7)
│  │  └─ og-image.jpg
│  ├─ config/
│  │  └─ site.ts                  ← JEDINÝ zdroj NAP, hodin, cen, URL, feature flagů
│  ├─ data/
│  │  ├─ services.ts
│  │  ├─ pricing.ts
│  │  ├─ faq.ts
│  │  ├─ education.ts             ← vzdělání, kurzy, praxe
│  │  └─ steps.ts                 ← průběh návštěvy
│  ├─ content/
│  │  └─ clanky/                  ← Markdown články (zatím jen 1 ukázkový s draft: true)
│  ├─ content.config.ts
│  ├─ lib/
│  │  └─ schema.ts                ← generátory JSON-LD
│  ├─ styles/
│  │  └─ global.css
│  ├─ layouts/
│  │  ├─ BaseLayout.astro
│  │  └─ ArticleLayout.astro
│  ├─ components/
│  │  ├─ layout/   Header.astro, MobileMenu.astro, Footer.astro, SkipLink.astro
│  │  ├─ ui/       Button.astro, BookingButton.astro, SectionHeading.astro, Icon.astro, SpineDots.astro, Container.astro
│  │  ├─ sections/ Hero.astro, TrustBar.astro, Services.astro, Process.astro, Pricing.astro,
│  │  │            About.astro, Reviews.astro, Faq.astro, Contact.astro, CtaBand.astro
│  │  ├─ contact/  MapFacade.astro, ContactForm.astro, Directions.astro
│  │  ├─ blog/     ArticleCard.astro, AuthorBox.astro, MedicalDisclaimer.astro, Breadcrumbs.astro
│  │  └─ seo/      SEO.astro, JsonLd.astro
│  └─ pages/
│     ├─ index.astro
│     ├─ clanky/index.astro
│     ├─ clanky/[slug].astro
│     ├─ ochrana-osobnich-udaju.astro
│     ├─ dekujeme.astro
│     └─ 404.astro
```

---

## 3. Konfigurace – `src/config/site.ts`

Všechny komponenty berou údaje **odsud**. Nikde jinde nesmí být adresa, telefon, cena ani URL Rehatabu natvrdo.

```ts
export const SITE = {
  name: 'FyzioVita',
  legalName: 'Mgr. Kristýna Kobzová',
  personName: 'Mgr. Kristýna Kobzová',
  personShort: 'Kristýna Kobzová',
  url: 'https://fyziovita.cz',
  locale: 'cs_CZ',
  lang: 'cs',

  ico: '23165391',
  vatPayer: false,
  registeredOffice: 'Karáskovo náměstí 2569/8, 615 00 Brno',

  address: {
    street: 'Křenová 479/71',
    floor: '2. NP',
    city: 'Brno',
    district: 'Brno-Trnitá',
    zip: '602 00',
    country: 'CZ',
    doorbell: '106',
  },
  geo: { lat: 49.19147, lng: 16.6251786 },
  transit: 'Tramvajová zastávka Masná (linky 8, 9, 10) – přímo u budovy',

  phone: '+420732958692',
  phoneDisplay: '+420 732 958 692',
  email: 'kikkobzova@gmail.com', // [DOPLNIT] později pravdepodobnei info@fyziovita.cz
  emailResponse: 'obvykle do 2 pracovních dnů', //

  hours: [
    { day: 'Pátek', dayCode: 'Friday', opens: '16:00', closes: '22:00' },
    { day: 'Sobota', dayCode: 'Saturday', opens: '06:00', closes: '12:00' },
  ],
  hoursNote: 'Pouze na objednání. Ostatní dny zavřeno.',

  price: { therapy: 1000, currency: 'CZK', duration: 50 },
  payment: ['hotově', 'QR platbou'],

  rehatabUrl: 'https://www.rehatab.cz/', // [DOPLNIT] přesná URL profilu po aktivaci
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=K%C5%99enov%C3%A1+479%2F71%2C+602+00+Brno',
  googleMapsEmbed: 'https://www.google.com/maps?q=K%C5%99enov%C3%A1+479%2F71,+602+00+Brno&output=embed',
  googleReviewUrl: '', // [DOPLNIT] po založení Google Business Profile

  sameAs: [] as string[], // [DOPLNIT] Google Business Profile, Firmy.cz, Instagram, Facebook, Rehatab

  flags: {
    rehatabActive: false,      // přepnout na true po aktivaci profilu na Rehatab
    showReviews: false,        // true až budou skutečné recenze
    showBlogInNav: false,      // true až bude publikován alespoň 1 článek
    showCollaborationNote: false, // zmínka o spolupráci s FyzioChalupou – jen se souhlasem
    showContactForm: true,
  },
} as const;
```

### 3.1 Chování rezervačního CTA (`BookingButton.astro`)

| `rehatabActive` | Text tlačítka | Cíl | Atributy |
|---|---|---|---|
| `true` | **Rezervovat termín online** | `SITE.rehatabUrl` | `target="_blank" rel="noopener"` + vizuálně skrytý text „(otevře se v novém okně)“ + ikona šipky ven |
| `false` | **Objednat se e-mailem** | `mailto:{email}?subject=Objednávka%20na%20fyzioterapii` | pod hlavními CTA (Hero, Kontakt) drobný text: „Online rezervace přes Rehatab bude spuštěna již brzy.“ |

Props: `variant: 'primary' | 'secondary' | 'onDark'`, `size: 'md' | 'lg'`, `class?`, `location: string` (pro `data-cta` atribut – pozdější měření).

---

## 4. Design systém

### 4.1 Koncept

Odlišit se od FyzioChalupy (šedá, serif, tmavé překryvy fotek). FyzioVita = **světlý, vzdušný, „zdravý“** vzhled: teplá off-white a šalvějová plocha, hluboká petrolejová (teal) jako hlavní barva, zaoblené rámy fotek, dekorativní motiv **„páteřních teček“** odvozený z loga (3–5 svisle seřazených barevných teček – modrá, zelená, teal) jako oddělovač sekcí a akcent u nadpisů. Žádné stockové fotky, jen vlastní fotografie.

### 4.2 Barvy (`src/styles/global.css`)

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';
@import '@fontsource-variable/plus-jakarta-sans';

@theme {
  --font-sans: 'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif;

  --color-primary: #1D6B67;       /* tlačítka, odkazy, ikony */
  --color-primary-hover: #154F4C;
  --color-ink: #1B2B2A;           /* hlavní text */
  --color-muted: #51605F;         /* sekundární text (kontrast AA na bílé i surface-alt) */
  --color-surface: #FFFFFF;
  --color-surface-alt: #F5F8F3;   /* střídání sekcí */
  --color-tint: #E8F1EF;          /* karty, chipy */
  --color-line: #DCE4E0;          /* rámečky, oddělovače */

  /* POUZE dekorativní (nesplňují kontrast pro text) */
  --color-deco-blue: #7DA5CF;
  --color-deco-green: #93BD55;
  --color-deco-teal: #2E9490;

  /* Textově bezpečné akcenty */
  --color-blue-ink: #2F5F8F;
  --color-green-ink: #4A7A1F;

  --radius-card: 1.25rem;
  --radius-img: 1.75rem;
}

html { scroll-behavior: smooth; scroll-padding-top: 5.5rem; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *{ transition: none !important; animation: none !important; } }
body { @apply bg-surface text-ink font-sans antialiased; }
:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 3px; border-radius: 4px; }
```

> Kontrast: primary #1D6B67 na bílé ≈ 6,3 : 1 (AA i pro malý text), bílý text na primary taktéž. Dekorativní barvy nikdy nepoužívej na text.

### 4.3 Typografie (fluidní)

| Prvek | Třídy Tailwind |
|---|---|
| H1 (jen 1× na stránce) | `text-[clamp(2.1rem,1.4rem+3vw,3.6rem)] font-extrabold leading-[1.08] tracking-tight` |
| H2 | `text-[clamp(1.75rem,1.3rem+1.8vw,2.6rem)] font-bold leading-tight tracking-tight` |
| H3 | `text-xl md:text-2xl font-semibold` |
| Eyebrow (nad H2) | `text-sm font-semibold uppercase tracking-[0.14em] text-primary` |
| Odstavec | `text-base md:text-lg leading-relaxed text-muted` (max. šířka `max-w-prose`) |

### 4.4 Komponentní styly

- **Container:** `mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8`.
- **Sekce:** `py-16 md:py-24`; střídat pozadí `bg-surface` / `bg-surface-alt`.
- **Primary tlačítko:** `inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-primary-hover transition min-h-12`.
- **Secondary tlačítko:** `rounded-full border-2 border-primary text-primary px-6 py-3 hover:bg-tint`.
- **Karta:** `rounded-[var(--radius-card)] bg-white border border-line p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,.04)] hover:shadow-md transition`.
- **Fotky:** `rounded-[var(--radius-img)] object-cover`; u Hero a O mně za fotkou posunutý dekorativní blok `bg-tint` (offset 16–24 px) + `SpineDots`.
- **Ikony:** inline SVG (Lucide styl, stroke 1.75, 24 px) v `Icon.astro` – nevkládat celou ikonovou knihovnu. Potřebné: `calendar-check, clock, map-pin, phone, mail, tram, check, arrow-right, external-link, chevron-down, menu, x, activity, dumbbell, brain, hand, scan-search, monitor, graduation-cap, award, shield-check, banknote, qr-code, info`.

### 4.5 Logo v hlavičce

- `src/assets/logo/processed/logo-symbol-header.png` (400×539) zobrazit přes `<Image>` ve výšce 40 px (mobil 36 px), `alt=""` (dekorativní, protože vedle je text).
- Vedle živý HTML text: `<span class="font-extrabold text-xl"><span class="text-blue-ink">Fyzio</span><span class="text-green-ink">Vita</span></span>` a pod tím (od `sm`) drobně `text-xs text-muted`: „Mgr. Kristýna Kobzová“.
- Celý blok je odkaz na `/` s `aria-label="FyzioVita – úvodní stránka"`.
- V patičce: `logo-full-transparent.png` šířka 180 px.

> Logo je dočasné. Až dorazí finální (ideálně SVG), vymění se pouze soubory – komponenty zůstanou.


---

## 5. Hlavní stránka – wireframe a kompletní copywriting

Pořadí sekcí v `src/pages/index.astro`:

```
Header (sticky)
└─ <main id="obsah">
   1. Hero                 (bez kotvy, bg-surface)
   2. TrustBar             (bg-surface, pás ikon)
   3. #sluzby  Services    (bg-surface-alt)
   4. #prubeh  Process     (bg-surface)
   5. #cenik   Pricing     (bg-surface-alt)
   6. #o-mne   About       (bg-surface)
   7. Reviews              (jen pokud flags.showReviews)
   8. #faq     Faq         (bg-surface-alt)
   9. CtaBand              (bg-primary, bílý text)
  10. #kontakt Contact     (bg-surface)
Footer
```

### 5.1 Header (sticky)

**Wireframe (desktop ≥ lg):**
```
[logo FyzioVita / Mgr. Kristýna Kobzová]   Služby  Ceník  O mně  FAQ  Kontakt  (Články*)   [Rezervovat termín ▸]
```
**Mobil (< lg):** `[logo]  ……  [Rezervovat]  [☰]` – CTA tlačítko je **vždy viditelné** i na mobilu (zkrácený text „Rezervovat“, při `rehatabActive=false` „Objednat se“).

- `position: sticky; top: 0; z-index: 50`, pozadí `bg-white/90 backdrop-blur border-b border-line`, výška 64 px (mobil) / 76 px (desktop).
- Navigační odkazy: `/#sluzby`, `/#cenik`, `/#o-mne`, `/#faq`, `/#kontakt` (absolutní s `/`, aby fungovaly i z podstránek). „Články“ → `/clanky/` jen pokud `flags.showBlogInNav`.
- Mobilní menu: `<button aria-expanded aria-controls="mobile-menu" aria-label="Otevřít menu">`, panel přes celou šířku pod hlavičkou, odkazy velké (min. 48 px výška), dole velké CTA + telefon + e-mail. Zavřít po kliknutí na odkaz a klávesou Esc. Při otevření `overflow-hidden` na `<body>`.
- Aktivní sekce není nutné zvýrazňovat (bez IntersectionObserveru = méně JS).

### 5.2 Hero

**Wireframe:**
```
┌──────────────────────────────────────────┬───────────────────────────┐
│ FYZIOTERAPIE BRNO · KŘENOVÁ 71 (eyebrow)  │                           │
│ H1 Fyzioterapie v Brně, která vás         │   [foto terapie-cviceni-  │
│    vrátí do pohybu                         │    s-valcem.jpg, zaoblené,│
│ Perex …                                    │    tint blok + tečky]     │
│ ✓ bod  ✓ bod  ✓ bod                        │                           │
│ [Rezervovat termín online ▸] [Služby a ceny]│  plovoucí štítek:        │
│ drobně: Pátky a soboty · 50 min · 1 000 Kč │  „50 min · 1:1 péče“      │
└──────────────────────────────────────────┴───────────────────────────┘
```
Mobil: text nahoře, fotka pod tlačítky (poměr 4:3). Desktop: grid `lg:grid-cols-[1.1fr_1fr] gap-12 items-center`.

**Copy:**
- Eyebrow: **Fyzioterapie Brno · Křenová 71**
- H1: **Fyzioterapie v Brně, která vás vrátí do pohybu**
- Perex: „Jsem Mgr. Kristýna Kobzová, fyzioterapeutka s magisterským vzděláním. Pomáhám lidem s bolestmi zad, krční páteře a hlavy, sportovcům po přetížení i všem, kdo se chtějí znovu hýbat bez omezení. Každá terapie začíná pečlivým vyšetřením a končí jasným plánem, co dělat dál.“
- Odrážky (ikona `check` v teal kroužku):
  - „Individuální terapie 50 minut – jen vy a já“
  - „Vyšetření, ošetření i cvičení na doma“
  - „Kousek od centra, tram Masná přímo u domu“
- Primární CTA: `BookingButton size="lg" location="hero"`
- Sekundární CTA: **Služby a ceny** → `#sluzby`
- Mikrotext pod tlačítky: „Termíny: pátek odpoledne a sobota dopoledne · 50 min / 1 000 Kč“ (hodnoty z `SITE`).
- Plovoucí štítek na fotce (jen ≥ sm): ikona `clock` + „50 min · péče 1:1“.
- Foto alt: „Fyzioterapeutka Kristýna Kobzová vede klienta při cvičení s masážním válcem v ordinaci FyzioVita v Brně“.

### 5.3 TrustBar

Pás 4 položek (`grid grid-cols-2 lg:grid-cols-4 gap-6`, ikona + tučný řádek + muted řádek):

| Ikona | Tučně | Pod tím |
|---|---|---|
| graduation-cap | **Mgr. Aplikovaná fyzioterapie** | Univerzita Palackého v Olomouci |
| award | **10+ klinických pracovišť** | FN Brno, lázně, rehabilitační ústavy |
| activity | **Specializované kurzy** | SM systém, fascie, bolesti hlavy, sport |
| map-pin | **Brno-Trnitá** | Křenová 71, tram Masná |

### 5.4 Služby (`#sluzby`)

- Eyebrow: **Služby**
- H2: **S čím vám mohu pomoci**
- Perex: „Fyzioterapie není jen o úlevě od bolesti. Hledám, proč obtíže vznikají, a společně je řešíme tak, aby se nevracely. Terapii vždy přizpůsobím vašemu tělu, cílům i každodennímu režimu.“

Data v `src/data/services.ts` (`{ id, icon, title, text, image?, imageAlt? }`). Grid `sm:grid-cols-2 lg:grid-cols-3 gap-6`. Karty 1–3 mají nahoře fotku (poměr 4:3), karty 4–6 jen ikonu – **nebo** všechny jen ikony, pokud by grid působil nevyváženě (preferuj: první tři s fotkou).

| # | Ikona | H3 | Text | Foto |
|---|---|---|---|---|
| 1 | activity | **Bolesti zad a beder** | „Bolest v kříži, ztuhlá záda po celém dni v sedě nebo vystřelující bolest do nohy. Zjistím, které struktury bolest způsobují, uvolním přetížené tkáně a naučím vás pohyby, které záda skutečně podpoří.“ | `terapie-bederni-pateze.jpg` – alt „Fyzioterapeutka ošetřuje bederní páteř pacienta na lehátku“ |
| 2 | brain | **Krční páteř a bolesti hlavy** | „Bolesti hlavy často vycházejí z krční páteře a napětí v ramenou. Tomuto tématu jsem věnovala bakalářskou práci i specializovaný kurz – zaměřím se na šíji, horní část zad i držení těla.“ | – |
| 3 | dumbbell | **Sportovní fyzioterapie** | „Přetížení, opakovaná zranění nebo návrat ke sportu po pauze. Rozeberu vaši techniku a pohybové stereotypy, upravím zátěž a připravím cviky, které vás udrží v tréninku.“ | `sportovni-fyzioterapie-mrtvy-tah.jpg` – alt „Fyzioterapeutka kontroluje techniku mrtvého tahu u sportovce“ |
| 4 | hand | **Svalové napětí a spoušťové body** | „Bolestivé body ve svalech, ztuhlost a omezený pohyb. Pracuji měkkými a mobilizačními technikami, technikami pro fascie a s reflexními změnami v tkáních.“ | – |
| 5 | scan-search | **Vyšetření pohybového aparátu** | „Podrobný kineziologický rozbor: držení těla, rozsah pohybu, svalová síla a pohybové vzorce. Dostanete srozumitelné vysvětlení, co se ve vašem těle děje, a plán další péče.“ | – |
| 6 | monitor | **Ergonomie a pohyb pro kancelář** | „Sedavá práce zatěžuje krk, záda i zápěstí. Poradím s nastavením pracovního místa a dám vám krátké cviky, které zvládnete i během pracovního dne.“ | `korekce-drepu-kettlebell.jpg` **nepoužívat zde** (viz kap. 7) – karta bez fotky |

> Pokud chceš 3 fotky v řadě, použij u karty 6 místo fotky `korekce-drepu-kettlebell.jpg` **jen pokud** ji přesuneš ke kartě 3 a mrtvý tah do sekce Průběh. Výchozí: karty 1 a 3 s fotkou, karta 2 také bez fotky → **jednodušeji: všech 6 karet jen s ikonou** a fotky použít v sekcích Průběh/O mně. **Rozhodnutí pro implementaci: všech 6 karet s ikonou, bez fotek** (čistší, rychlejší). Fotky 1 a 3 jsou použity v sekci Průběh (5.5).

**Pod kartami – „Používané metody“** (chipy `rounded-full bg-tint px-4 py-1.5 text-sm text-ink`):
„Kineziologický rozbor“ · „SM systém“ · „Měkké a mobilizační techniky“ · „Práce s fasciemi“ · „Reflexní masáž“ · „Léčebná tělesná výchova“ · „Kinezioterapie na neurofyziologickém podkladě“ · „Cvičení na doma“

**Upozornění (box `bg-white border-l-4 border-primary`, ikona `info`):**
„**Kdy nejdřív k lékaři:** Pokud máte náhlou silnou bolest po úrazu, horečku, necitlivost v oblasti třísel, potíže s močením nebo rychle postupující slabost končetin, vyhledejte prosím ihned lékaře nebo volejte 155. Fyzioterapie nenahrazuje lékařské vyšetření.“

### 5.5 Jak probíhá návštěva (`#prubeh`)

- Eyebrow: **Průběh terapie**
- H2: **Co vás čeká na první návštěvě**
- Layout: vlevo 4 kroky (číslované kroužky `bg-primary text-white`, svislá linka mezi nimi), vpravo dvě fotky přes sebe (desktop) – `terapie-bederni-pateze.jpg` (větší) a `sportovni-fyzioterapie-mrtvy-tah.jpg` (menší, posunutá). Mobil: jen první fotka pod kroky.

Kroky (`src/data/steps.ts`):
1. **Rezervace online** – „Vyberte si volný termín v online kalendáři. Potvrzení vám přijde e-mailem.“ (při `rehatabActive=false`: „Napište mi e-mail s krátkým popisem obtíží a navrhnu vám termín.“)
2. **Rozhovor a vyšetření** – „Probereme vaše obtíže, jejich historii a cíle. Následuje vyšetření držení těla, pohybu a svalové funkce.“
3. **Terapie** – „Na základě vyšetření zvolím vhodné techniky – manuální ošetření, mobilizace nebo cílené cvičení.“
4. **Plán a cvičení na doma** – „Odcházíte s vysvětlením, co se děje, a s několika cviky na doma. Domluvíme se, zda a kdy je vhodná další návštěva.“

**Box „Co si vzít s sebou“** (karta `bg-tint`):
- „Pohodlné oblečení, ve kterém se dobře hýbete (kraťasy, tílko nebo sportovní podprsenka)“
- „Lékařské zprávy a výsledky vyšetření (RTG, MR), pokud je máte“
- „Doporučení od lékaře nepotřebujete – terapie je hrazena přímo.“

Foto alty: viz kap. 7.

### 5.6 Ceník (`#cenik`)

- Eyebrow: **Ceník**
- H2: **Přehledné ceny bez překvapení**
- Perex: „Platíte pouze za čas, který věnuji vám. Péče není hrazena ze zdravotního pojištění.“

Data `src/data/pricing.ts`: `{ name, duration, price, description, highlight? }[]`. Ve v1 jedna položka – zobrazit jako **jednu výraznou kartu** uprostřed (`max-w-xl mx-auto`), komponenta ale musí umět vykreslit seznam (tabulkový layout řádků `název … minuty … cena`), až přibudou další položky.

**Karta:**
```
Fyzioterapie – vyšetření a terapie
50 minut                                   1 000 Kč
✓ Vstupní i kontrolní terapie
✓ Vyšetření, ošetření a cvičení na doma
✓ Individuální přístup 1:1
[Rezervovat termín online ▸]
```

Pod kartou (muted, menší):
- „Platba: **hotově nebo QR platbou** na místě.“ (ikony banknote + qr-code)
- „Nejsem plátce DPH.“
- „Storno podmínky: termín prosím zrušte nejpozději **24 hodin předem**.“ → v `pricing.ts` pole `cancellationPolicy: ''` – zobrazit jen když není prázdné.
- „Balíčky terapií připravuji.“ → **nezobrazovat** (nedávat sliby).

### 5.7 O mně (`#o-mne`) – klíčové pro E-E-A-T

**Wireframe:**
```
┌──────────────────────┬──────────────────────────────────────────┐
│ [portrét, 3:4,        │ O MNĚ                                     │
│  zaoblený, tint blok] │ H2 Mgr. Kristýna Kobzová                  │
│                        │ Fyzioterapeutka · FyzioVita Brno           │
│                        │ Odstavce …                                 │
│                        │ „Citát“                                    │
└──────────────────────┴──────────────────────────────────────────┘
[ Vzdělání ]   [ Kurzy ]   [ Praxe ]      ← 3 karty v gridu lg:grid-cols-3
```

- Eyebrow: **O mně**
- H2: **Mgr. Kristýna Kobzová**
- Podtitul (`text-lg text-primary font-semibold`): „Fyzioterapeutka · FyzioVita Brno“
- Odstavce:
  1. „Fyzioterapii jsem vystudovala na Masarykově univerzitě v Brně a navázala magisterským studiem aplikované fyzioterapie na Univerzitě Palackého v Olomouci. Během studia jsem prošla více než desítkou klinických pracovišť – od Fakultní nemocnice Brno přes rehabilitační ústavy a lázně až po sportovně zaměřená centra.“
  2. „Dnes pracuji jako fyzioterapeutka v ambulantní praxi a ve FyzioVitě se plně věnuji jednomu klientovi po celou dobu terapie. Zajímá mě, proč bolest vzniká – proto kombinuji pečlivé vyšetření, manuální techniky a cvičení, které dává smysl ve vašem běžném životě.“
  3. „Sama běhám, jezdím na kole, cvičím kalisteniku a silový trénink. Vím, jak frustrující je, když vás tělo zastaví – a jak dobrý je pocit, když se zase můžete naplno hýbat.“
- Citát (`blockquote`, velké uvozovky v deco-teal, `text-xl italic`): „Mým cílem není, abyste ke mně chodili pořád. Chci, abyste rozuměli svému tělu a věděli, jak se o něj postarat.“ - Jazyky (drobně): „Domluvíme se česky i anglicky.“

**Karta Vzdělání** (ikona graduation-cap), `src/data/education.ts`:
- **Mgr. – Aplikovaná fyzioterapie**, Fakulta tělesné kultury, Univerzita Palackého v Olomouci (2023–2025). Diplomová práce: *Vliv plyometrického programu na svalovou tuhost dolních končetin u sportujících adolescentů různé úrovně biologického zrání.*
- **Bc. – Fyzioterapie**, Fakulta sportovních studií, Masarykova univerzita, Brno (2020–2023). Bakalářská práce: *Možnosti fyzioterapie a komplexní přístup u bolestí hlavy vertebrogenního původu.*

**Karta Kurzy** (ikona award):
- SM systém 1A + 1B
- Úvod do fyzioterapie fasciálních tkání (REHAEDUCA)
- Myofasciální bolestivý syndrom – metody práce s reflexními změnami (3SB)
- Komplexní pohled na rehabilitaci v oblasti trupu a hlavy (3SB)
- Bolesti hlavy v klinické praxi (CKP Dobřichovice)
- Fyzioterapie ve sportu (3fyzio)

**Karta Praxe** (ikona activity):
- Fyzioterapeutka v ambulantní praxi v Brně (od 2024 – dosud) `[uvádět jméno zaměstnavatele MUDr. Antonín Koukal, spol. s r.o.]`
- Klinika Vital, Brno (2023–2024)
- Workshopy ergonomie a fyzioterapie pro firemní klienty (Multisport, 2025)
- Lekce „Zdravý pohyb“, Kulturní středisko Omega
- Klinické stáže: FN Brno (rehabilitace, spinální jednotka, neurologie, kardiologie, gynekologie a porodnictví, popáleninové centrum), Lázně Klimkovice, Lázně Velké Losiny, Rehabilitační ústav Hrabyně, Paracentrum Fénix a další

Pod kartami malý odkaz (secondary): **Rezervovat termín u Kristýny** (`BookingButton variant="secondary" location="about"`).

**Spolupráce** (jen `flags.showCollaborationNote`): „Ordinace FyzioVita sídlí ve stejné budově jako FyzioChalupa.“

Foto alt: „Mgr. Kristýna Kobzová, fyzioterapeutka FyzioVita Brno“.

### 5.8 Reviews (skryto, `flags.showReviews=false`)

Připravená komponenta: H2 **Zkušenosti klientů**, 3 karty `{ text, author (jméno + iniciála příjmení), source: 'Google' }` z `src/data/reviews.ts` (prázdné pole) + tlačítko „Zobrazit všechny recenze na Google“ (`SITE.googleReviewUrl`). Pokud je pole prázdné, sekce se **nevykreslí vůbec**. **Nikdy nevkládat smyšlené recenze. Nepřidávat `aggregateRating` do schématu.**

### 5.9 FAQ (`#faq`)

- Eyebrow: **Časté dotazy**
- H2: **Na co se klienti často ptají**
- Implementace: nativní `<details><summary>` (bez JS), ikona chevron se otáčí přes `group-open:rotate-180`. Data `src/data/faq.ts` – stejná data generují **FAQPage JSON-LD** (texty musí být v HTML i ve schématu identické).

| Otázka | Odpověď |
|---|---|
| **Potřebuji doporučení od lékaře?** | Ne. Ke mně se můžete objednat přímo, bez doporučení. Pokud máte lékařské zprávy nebo výsledky vyšetření (RTG, MR), vezměte je prosím s sebou. |
| **Hradí terapii zdravotní pojišťovna?** | Ne, jde o samoplátecké služby. Terapie (50 minut) stojí 1 000 Kč a platíte na místě hotově nebo QR platbou. |
| **Jak se objednám?** | Nejrychleji online přes rezervační systém Rehatab, kde vidíte všechny volné termíny. Případně mi napište e-mail. *(při `rehatabActive=false`: „Napište mi e-mail na {email} s krátkým popisem obtíží a ozvu se vám s návrhem termínu. Online rezervace bude brzy spuštěna.“)* |
| **Kdy ordinujete?** | Na objednání v pátek 16:00–22:00 a v sobotu 6:00–12:00. |
| **Jak dlouho trvá terapie a co si mám vzít?** | Terapie trvá 50 minut. Vezměte si pohodlné oblečení, ve kterém se můžete volně hýbat, a případně lékařské zprávy. |
| **Kolik návštěv budu potřebovat?** | Záleží na vašich obtížích. Po první návštěvě vám řeknu, co od terapie očekávat. Velkou část práce odvedete sami cvičením doma – mým cílem je, abyste byli co nejdříve soběstační. |
| **Kde ordinace sídlí a jak se tam dostanu?** | Na adrese Křenová 479/71, Brno, ve 2. patře. Tramvajová zastávka Masná (linky 8, 9, 10) je přímo u budovy. Zazvoňte na zvonek 106. |
| **Mohu přijít i při akutní bolesti?** | Ano, fyzioterapie často pomáhá i u akutních bolestí zad nebo krku. Pokud ale máte bolest po úrazu, horečku, necitlivost nebo slabost končetin, vyhledejte nejprve lékaře. |

### 5.10 CtaBand (před kontaktem)

Pás `bg-primary text-white`, centrovaný, s dekorativními tečkami po stranách.
- H2 (bílá): **Udělejte první krok k životu bez bolesti**
- Text: „Volné termíny najdete v online kalendáři. Rezervace zabere méně než minutu.“ (při neaktivním Rehatabu: „Napište mi a domluvíme termín, který vám vyhovuje.“)
- `BookingButton variant="onDark" size="lg" location="cta-band"` (bílé tlačítko s teal textem).

### 5.11 Kontakt a rezervace (`#kontakt`)

- Eyebrow: **Kontakt**
- H2: **Rezervace a kontakt**
- Perex: „Nejrychleji se objednáte online – vidíte všechny volné termíny a rezervaci máte hotovou za minutu.“

**Layout desktop:** `lg:grid-cols-[1.15fr_1fr] gap-10`
```
┌──────────────────────────────────────┬────────────────────────────┐
│ ★ VELKÁ KARTA REZERVACE (bg-tint,     │ Kontaktní údaje             │
│   border-2 border-primary)            │ 📍 Křenová 479/71, 2. NP    │
│  H3 Online rezervace                  │    602 00 Brno-Trnitá       │
│  „Nejrychlejší cesta…“                │ 🚋 Tram Masná (8, 9, 10)    │
│  [Rezervovat termín online ▸] (lg)    │ ✉ e-mail (preferováno)     │
│  ✓ okamžité potvrzení                 │ ☎ telefon – jen v nutnosti │
│  ✓ připomenutí e-mailem               │ 🕑 Pá 16–22, So 6–12        │
├──────────────────────────────────────┤    pouze na objednání       │
│ Mapa (MapFacade)                       │ Fakturační údaje (drobně)  │
├──────────────────────────────────────┴────────────────────────────┤
│ Jak nás najdete (Directions) – foto vchodu + kroky                  │
├────────────────────────────────────────────────────────────────────┤
│ Kontaktní formulář (sekundární, flags.showContactForm)              │
└────────────────────────────────────────────────────────────────────┘
```
Mobil: pořadí = karta rezervace → kontaktní údaje → mapa → cesta → formulář.

**Karta rezervace – copy:**
- H3: **Online rezervace** (ikona calendar-check)
- „Nejrychlejší cesta k termínu. Vyberte si čas, který vám vyhovuje – volné termíny jsou hlavně v pátek.“
- Odrážky: „Okamžité potvrzení termínu“, „Připomenutí e-mailem před návštěvou“, „Bez telefonování“
- Při `rehatabActive=false`: H3 **Objednání e-mailem**, text „Online rezervace přes Rehatab bude spuštěna již brzy. Do té doby mi prosím napište e-mail s krátkým popisem obtíží a preferovaným časem – ozvu se s návrhem termínu.“ Tlačítko = mailto.

**Kontaktní údaje – copy:** (vše jako `<address class="not-italic">`)
- Adresa: „Křenová 479/71, 2. NP, 602 00 Brno-Trnitá“ + odkaz „Navigovat (Google Mapy)“ → `SITE.googleMapsUrl`
- „Tramvajová zastávka **Masná** (linky 8, 9, 10) – přímo u budovy“
- E-mail: odkaz `mailto:` + štítek „preferovaný kontakt“ + „Odpovídám {emailResponse}.“
- Telefon: odkaz `tel:+420732958692` + poznámka „Během terapie nemohu telefonovat. Prosím volejte či pište SMS jen v naléhavých případech, jinak preferuji e-mail.“
- Ordinační doba: tabulka (`<dl>`) Pátek 16:00–22:00, Sobota 6:00–12:00, Po–Čt, Ne: zavřeno; poznámka „Pouze na objednání.“
- Parkování: Je možné po pustení fyzioterapeuta `Bezbariérovost: `[DOPLNIT]` – nezobrazovat, dokud je prázdné.
- Drobně: „Provozovatel: Mgr. Kristýna Kobzová, IČO 23165391“

**MapFacade:** viz 9.4.

**Directions („Jak k nám trefíte“)** – H3, vlevo foto `vchod-krenova-71.jpg` (alt „Vchod do budovy Křenová 71 v Brně, kde sídlí ordinace FyzioVita“), vpravo očíslovaný seznam:
1. „Vstupte hlavním vchodem s označením Křenová 71 a zazvoňte na zvonek **106** pak sluchátko – otevřu vám.“
2. „Vyjděte po schodech nahoru a pokračujte rovne do chodby pak dveřmi vlevo.“
3. „Znovu po schodech nahoru a hned první dveře vlevo.“
4. „Projděte doprava prostornou chodbou až na konec – ordinace FyzioVita je vlevo, vedle masérny.“
- Tip: „Přijďte prosím 5 minut před začátkem terapie.“

**ContactForm:** viz 9.5. Nadpis H3 **Máte dotaz?** + text „Pro objednání prosím použijte online rezervaci. Formulář slouží pro obecné dotazy.“

### 5.12 Footer

`bg-ink text-white/80`, 4 sloupce (`md:grid-cols-2 lg:grid-cols-4`), mobil pod sebou:
1. Logo (`logo-full-transparent.png` na světlém podkladu – **pozor**: patička je tmavá → logo vložit na bílý zaoblený štítek `bg-white rounded-2xl p-3`, nebo použít světlou variantu, pokud bude). Pod ním: „Fyzioterapie v Brně – Mgr. Kristýna Kobzová“.
2. **Navigace:** Služby, Ceník, O mně, Časté dotazy, Kontakt, (Články).
3. **Kontakt:** adresa, e-mail, telefon, ordinační doba (zkráceně).
4. **Rezervace:** `BookingButton variant="onDark"`.

Spodní lišta (`border-t border-white/10 text-sm`):
„© {aktuální rok} FyzioVita · Provozovatel: Mgr. Kristýna Kobzová, IČO 23165391, sídlo Karáskovo náměstí 2569/8, 615 00 Brno · Nejsem plátce DPH · [Ochrana osobních údajů](/ochrana-osobnich-udaju/)“
Pod tím: „Informace na tomto webu mají vzdělávací charakter a nenahrazují vyšetření lékařem.“

