import type { IconName } from '../components/ui/Icon.astro';

export interface ServiceItem {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'bolesti-zad',
    icon: 'activity',
    title: 'Bolesti zad',
    description:
      'Ať už vás trápí ztuhlost šíje, bolesti beder nebo vystřelující bolest do nohy, najdeme společně cestu k úlevě. Šetrně uvolníme přetížené svaly a naučím vás jednoduché cvičení na doma, aby se vašemu tělu dlouhodobě dařilo lépe.',
  },
  {
    id: 'bolesti-kloubu-a-koncetin',
    icon: 'hand',
    title: 'Bolesti kloubů a končetin',
    description:
      'Ať už vás trápí ramena, kolena nebo kyčle, podíváme se, jak kloubům ulevit. Zaměříme se na uvolnění napětí a obnovu správné hybnosti. Krok za krokem tělo posílíme, abychom vám zkusili vrátit pohyb bez zbytečné bolesti.',
  },
  {
    id: 'bolesti-hlavy-a-krcni-patere',
    icon: 'brain',
    title: 'Bolesti hlavy a krční páteře',
    description:
      'Když bolí hlava, je potřeba hledat souvislosti. Někdy stačí zaměřit pozornost na krční páteř nebo oblast čelistního kloubu. Při terapii se na tyto oblasti zaměříme a pokusíme se je šetrně uvolnit, abychom zjistili, zda vám to přinese úlevu.',
  },
  {
    id: 'sportovni-fyzioterapie',
    icon: 'dumbbell',
    title: 'Sportovní fyzioterapie',
    description:
      'Zastavila vás bolest při sportu nebo se vracíte k pohybu po operaci či zranění? Vyřešíme následky přetížení i úrazů. Zhodnotím vaše pohybové stereotypy, nastavím bezpečnou progresivní zátěž a sestavím cviky na míru. Připravím vaše tělo tak, abyste mohli znovu trénovat naplno.',
  },
  {
    id: 'kompenzace-sedaveho-zamestnani',
    icon: 'monitor',
    title: 'Kompenzace sedavého zaměstnání',
    description:
      'Sedavé zaměstnání představuje pro tělo obrovskou statickou zátěž, ze které pramení bolesti zad, krku či zápěstí. Společně vylepšíme ergonomii vašeho pracovního prostředí a ukážu vám rychlé cviky, díky kterým pocítíte okamžitou úlevu přímo u stolu.',
  },
  {
    id: 'pourazova-a-pooperacni-pece',
    icon: 'shield-check',
    title: 'Poúrazová a pooperační péče',
    description:
      'Návrat do běžného života po zlomeninách, výronech nebo ortopedických operacích (např. endoprotézy, operace vazů). Postupně a bezpečně obnovíme rozsah pohybu, svalovou sílu i stabilitu, abyste získali zpět jistotu a mohli se opět spolehnout na své tělo.',
  },
];

export const USED_METHODS = [
  'Kineziologický rozbor',
  'SM systém',
  'Měkké a mobilizační techniky',
  'Práce s fasciemi',
  'Reflexní masáž',
  'Léčebná tělesná výchova',
  'Kinezioterapie na neurofyziologickém podkladě',
  'Cvičení na doma',
];

export const MEDICAL_DISCLAIMER_NOTICE = {
  title: 'Kdy nejdřív k lékaři',
  text: 'Pokud máte náhlou silnou bolest po úrazu, horečku, necitlivost v oblasti třísel, potíže s močením nebo rychle postupující slabost končetin, vyhledejte prosím ihned lékaře nebo volejte 155. Fyzioterapie nenahrazuje lékařské vyšetření.',
};
