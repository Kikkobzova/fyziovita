/**
 * Hlavný konfiguračný súbor webu FyzioVita.
 * JEDINÝ zdroj pravdy pre kontaktné údaje (NAP), ordinačné hodiny, ceny, URL a feature flagy.
 * Žiadna z týchto hodnôt nesmie byť natvrdo zakódovaná v komponentoch.
 */
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
  geo: {
    lat: 49.19147,
    lng: 16.6251786,
  },
  transit: 'Tramvajová zastávka Masná (linky 8, 9, 10) – přímo u budovy',

  phone: '+420732958692',
  phoneDisplay: '+420 732 958 692',
  email: 'kristyna@fyziovita.cz',
  emailResponse: 'obvykle do 2 pracovních dnů',

  hours: [
    { day: 'Pátek', dayCode: 'Friday', opens: '16:00', closes: '20:00' },
    { day: 'Sobota', dayCode: 'Saturday', opens: '08:00', closes: '13:00' },
  ],
  hoursNote: 'Pouze na objednání. Ostatní dny zavřeno.',

  price: {
    therapy: 1100,
    currency: 'CZK',
    duration: 55,
    packagePrice: 4800,
    packageCount: 5,
  },
  payment: ['hotově', 'QR platbou'],

  rehatabUrl: 'https://rezervace.rehatab.cz/fyziovita',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=K%C5%99enov%C3%A1+479%2F71%2C+602+00+Brno',
  googleMapsEmbed: 'https://www.google.com/maps?q=K%C5%99enov%C3%A1+479%2F71,+602+00+Brno&output=embed',
  googleReviewUrl: '', // [DOPLNIT] po založení Google Business Profile

  sameAs: [] as string[], // [DOPLNIT] Google Business Profile, Firmy.cz, Instagram, Facebook, Rehatab

  flags: {
    rehatabActive: true,          // online rezervace cez RehaTab je aktívna
    showReviews: false,           // true až budú skutočné recenzie
    showBlogInNav: false,         // true až bude publikovaný aspoň 1 článok
    showCollaborationNote: false, // zmienka o spolupráci s FyzioChalupou – len so súhlasom
    showContactForm: false,       // primárny je RehaTab iframe/odkaz
  },
} as const;

export type SiteConfig = typeof SITE;
