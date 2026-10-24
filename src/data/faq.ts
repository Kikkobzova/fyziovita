import { SITE } from '../config/site';

export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqList(): FaqItem[] {
  return [
    {
      question: 'Potřebuji doporučení od lékaře?',
      answer:
        'Ne. Ke mně se můžete objednat přímo, bez doporučení. Pokud máte lékařské zprávy nebo výsledky vyšetření (RTG, MR), vezměte je prosím s sebou.',
    },
    {
      question: 'Hradí terapii zdravotní pojišťovna?',
      answer: `Ne, jde o samoplátecké služby. Terapie (${SITE.price.duration} minut) stojí ${SITE.price.therapy} Kč a platíte na místě hotově nebo QR platbou. K dispozici je také zvýhodněný balíček 5 terapií za ${SITE.price.packagePrice} Kč.`,
    },
    {
      question: 'Jak se objednám?',
      answer: SITE.flags.rehatabActive
        ? 'Nejlépe a nejrychleji přes online rezervační systém RehaTab, kde máte okamžitý přehled o všech volných termínech (zabere to nejméně času a práce). Případně mi můžete napsat e-mail.'
        : `Nejlépe a nejrychleji přes online rezervační systém RehaTab, kde vidíte všechny volné termíny. Do jeho spuštění mi prosím napište e-mail na ${SITE.email} a domluvíme se na termínu.`,
    },
    {
      question: 'Kolik návštěv budu potřebovat?',
      answer:
        'Záleží na vašich obtížích. Po první návštěvě vám řeknu, co od terapie očekávat. Velkou část práce odvedete sami cvičením doma – mým cílem je, abyste byli co nejdříve soběstační.',
    },
    {
      question: 'Mohu přijít i při akutní bolesti?',
      answer:
        'Fyzioterapie dokáže efektivně ulevit od většiny akutních bolestí zad či krku. Pokud se však bolest objevila po úrazu, provází ji horečka, náhlá slabost či necitlivost končetin, nebo potíže s močením a vyprazdňováním, fyzioterapie není vhodná – v takovém případě prosím vyhledejte bezodkladně lékařskou péči. U běžných funkčních obtíží a blokád jste v bezpečných rukou.',
    },
  ];
}
