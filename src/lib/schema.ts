import { SITE } from '../config/site';
import type { FaqItem } from '../data/faq';

/**
 * Generuje JSON-LD schému pre MedicalBusiness / Physiotherapy (Local SEO, NAP, ordinačné hodiny).
 */
export function getPhysiotherapySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physiotherapy',
    '@id': `${SITE.url}/#clinic`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE.url}/og-image.jpg`,
    logo: `${SITE.url}/icon-512.png`,
    priceRange: `${SITE.price.therapy} CZK`,
    currenciesAccepted: 'CZK',
    paymentAccepted: 'Cash, QR code',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: 'Jihomoravský kraj',
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    openingHoursSpecification: SITE.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${h.dayCode}`,
      opens: h.opens,
      closes: h.closes,
    })),
    founder: {
      '@type': 'Person',
      name: SITE.personName,
      jobTitle: 'Fyzioterapeutka',
      alumniOf: [
        'Masarykova univerzita',
        'Univerzita Palackého v Olomouci',
      ],
    },
    ...(SITE.sameAs.length > 0 ? { sameAs: SITE.sameAs } : {}),
  };
}

/**
 * Generuje FAQPage schému pre zobrazenie rozšírených výsledkov vo vyhľadávači Google.
 */
export function getFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
