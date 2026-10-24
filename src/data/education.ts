export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  period: string;
  thesis: string;
}

export interface CareerItem {
  title: string;
  period?: string;
  note?: string;
}

export const EDUCATION_LIST: EducationItem[] = [
  {
    degree: 'Mgr.',
    field: 'Aplikovaná fyzioterapie',
    institution: 'Fakulta tělesné kultury, Univerzita Palackého v Olomouci',
    period: '2023–2025',
    thesis:
      'Vliv plyometrického programu na svalovou tuhost dolních končetin u sportujících adolescentů různé úrovně biologického zrání.',
  },
  {
    degree: 'Bc.',
    field: 'Fyzioterapie',
    institution: 'Fakulta sportovních studií, Masarykova univerzita, Brno',
    period: '2020–2023',
    thesis:
      'Možnosti fyzioterapie a komplexní přístup u bolestí hlavy vertebrogenního původu.',
  },
];

export const COURSES_LIST: string[] = [
  'Dynamická neuromuskulární stabilizace podle Koláře (DNS) – Úroveň A (Rehabilitation Prague School)',
  'Úvod do fyzioterapie fasciálních tkání (RehaEduca)',
  'Posturálně–zátěžová fyzioterapie: Část A – Myofasciální bolestivý syndrom (3SB FYZIO)',
  'Posturálně–zátěžová fyzioterapie: Část B – Rehabilitace trupu a hlavy (3SB FYZIO)',
  'Prevence a rekondice ramenního kloubu a návrat k tréninku/sportu (Core Training)',
  'Fyzioterapie ve sportu (3FYZIO)',
  'Kinesiotaping – intenzivní kurz: šíje, záda, velké klouby',
  'Sestavování fitness tréninku (webinář; Fitness institut)',
  'Bolesti hlavy v klinické praxi (CKP Dobřichovice)',
  'SM systém (1A + 1B)',
];

export const CONFERENCES_LIST: string[] = [
  'Moderní fyzioterapie (Fitness Institut & Svět fyzioterapie, LF MUNI Brno, 2025)',
  '32. sjezd a konference UNIFY ČR – Pohybem k nezávislosti (Praha, 2023)',
  'Aktuality ve fyzioterapii (Katedra fyzioterapie FTK UP v Olomouci, 2023 & 2025)',
  'XI. Absolventská konference Katedry fyzioterapie FTK UP (Olomouc, 2026)',
];

export const PRACTICE_LIST: CareerItem[] = [
  {
    title: 'Fyzioterapeutka v ambulantní praxi v Brně',
    period: 'od 2024',
    note: 'MUDr. Antonín Koukal, spol. s r.o.',
  },
  {
    title: 'Klinika Vital, Modřice',
    period: '2023–2024',
  },
  {
    title: 'Absolventská stáž v Isokinetic Verona (Itálie)',
  },
  {
    title: 'Lekce „Zdravý pohyb“',
    note: 'Kulturní středisko Omega',
  },
  {
    title: 'Odborné praxe během studia',
    note: 'FN Brno (rehabilitace, spinální jednotka, neurologie, kardiologie, gynekologie a porodnictví, popáleninové centrum), Lázně Klimkovice, Lázně Velké Losiny, Rehabilitační ústav Hrabyně, Paracentrum Fénix',
  },
];
