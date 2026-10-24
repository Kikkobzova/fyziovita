export interface PricingItem {
  id: string;
  name: string;
  duration: number; // v minutách
  price: number; // v CZK
  description: string;
  features: string[];
  highlight?: boolean;
}

export const PRICING_ITEMS: PricingItem[] = [
  {
    id: 'fyzioterapie',
    name: 'Individuální fyzioterapie',
    duration: 55,
    price: 1100,
    description: 'Vstupní vyšetření nebo navazující kontrolní terapie přizpůsobená vašim potížím.',
    features: [
      'Vstupní vyšetření nebo navazující terapie',
      'Manuální ošetření a instruktáž cvičení na míru',
      'Plná individuální péče 1:1 po dobu 55 minut',
      'Doporučení pro domácí režim a prevenci',
    ],
    highlight: true,
  },
];

export const PRICING_DETAILS = {
  paymentNotice: 'Platba: hotově nebo QR platbou na místě.',
  packagesNotice: 'Dlouhodobější spolupráce: Možnost individuální permanentky dle domluvy při osobní návštěvě.',
  vatNotice: 'Nejsem plátce DPH.',
  cancellationPolicy:
    'Termín prosím zrušte nejpozději 24 hodin předem. Při pozdějším zrušení (méně než 24 hodin) je storno poplatek 50 % z ceny terapie.',
};
