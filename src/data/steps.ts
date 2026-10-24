export interface StepItem {
  number: number;
  title: string;
  description: string;
}

export function getSteps(): StepItem[] {
  return [
    {
      number: 1,
      title: 'Rozhovor a vyšetření',
      description:
        'Všechno začíná pečlivým rozhovorem – čím více mi povíte o svých potížích a cílech, tím snáze najdeme pravou příčinu. Následně zhodnotíme držení těla, rozsahy pohybu, svalovou sílu a specifickými testy zjistíme, co bude pro vaše tělo nejlepší.',
    },
    {
      number: 2,
      title: 'Cílená terapie',
      description:
        'Na základě vyšetření zvolím šetrné techniky přímo na míru – manuální uvolnění přetížených tkání, mobilizace kloubů a okamžitou úlevu od napětí.',
    },
    {
      number: 3,
      title: 'Nácvik pohybu a cvičení na doma',
      description:
        'Vše vám srozumitelně vysvětlím a naučím vás pár jednoduchých cviků, které zvládnete sami doma. Společně se domluvíme na dalším postupu.',
    },
  ];
}

export const WHAT_TO_BRING = [
  'Pohodlné oblečení, ve kterém se vám bude dobře pohybovat (např. kraťasy a tričko)',
  'Lékařské zprávy a výsledky vyšetření (RTG, MR), pokud je máte',
  'Doporučení od lékaře nepotřebujete – péče je hrazena přímo.',
];
