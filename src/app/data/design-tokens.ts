import { CategoryInfo, TemplateWording } from '../core/models/wedding-template.model';

/* Shared by card and website designs. */

/* ------------------------------------------------------------------ */
/*  Fonts (loaded from Google Fonts in index.html)                     */
/* ------------------------------------------------------------------ */
export const FONT = {
  greatVibes: "'Great Vibes', cursive",
  pinyon: "'Pinyon Script', cursive",
  parisienne: "'Parisienne', cursive",
  allura: "'Allura', cursive",
  sacramento: "'Sacramento', cursive",
  dancing: "'Dancing Script', cursive",
  caveat: "'Caveat', cursive",
  cinzel: "'Cinzel', serif",
  cinzelDeco: "'Cinzel Decorative', serif",
  cormorant: "'Cormorant Garamond', serif",
  playfair: "'Playfair Display', serif",
  marcellus: "'Marcellus', serif",
  lora: "'Lora', serif",
  italiana: "'Italiana', serif",
  abril: "'Abril Fatface', serif",
  limelight: "'Limelight', serif",
  poiret: "'Poiret One', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  josefin: "'Josefin Sans', sans-serif",
  poppins: "'Poppins', sans-serif",
  arefRuqaa: "'Aref Ruqaa', serif",
} as const;

/* ------------------------------------------------------------------ */
/*  Default wording per ceremony style                                 */
/* ------------------------------------------------------------------ */
export const WORDING = {
  hindu: {
    opening: '|| Shree Ganeshaya Namah ||',
    invitation: 'request the pleasure of your company at the auspicious wedding of',
  },
  kerala: {
    opening: 'Shubha Muhurtham',
    invitation: 'solicit your gracious presence at the wedding of',
  },
  christian: {
    opening: 'Love never fails · 1 Cor 13:8',
    invitation: 'request the honour of your presence at the Holy Matrimony of',
  },
  nikah: {
    opening: 'Bismillahir Rahmanir Raheem',
    invitation: 'cordially invite you to the blessed Nikah ceremony of',
  },
  nikahArabic: {
    opening: 'In the name of Allah, the Most Gracious, the Most Merciful',
    invitation: 'with the blessings of Allah, we joyfully invite you to the Nikah of',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  },
  nikahPairs: {
    opening: 'Nikah Mubarak',
    invitation: "Insha'Allah, we request the honour of your presence at the Nikah of",
    arabic: 'وَخَلَقْنَاكُمْ أَزْوَاجًا',
    arabicMeaning: '“And We created you in pairs” – Qur’an 78:8',
  },
  nikahLove: {
    opening: 'Bismillah',
    invitation: 'by the grace of Allah, two hearts become one – join us for the Nikah of',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  },
  general: {
    opening: 'Save the Date',
    invitation: 'invite you to celebrate the wedding of',
  },
} satisfies Record<string, TemplateWording>;

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */
export const TEMPLATE_CATEGORIES: readonly CategoryInfo[] = [
  { id: 'royal', label: 'Royal', description: 'Gold, jewel tones and palace grandeur' },
  { id: 'traditional', label: 'Traditional', description: 'Mandalas, torans and festive colours' },
  { id: 'kerala', label: 'Kerala', description: 'Kasavu gold and nilavilakku elegance' },
  { id: 'floral', label: 'Floral', description: 'Roses, leaves and garden romance' },
  { id: 'modern', label: 'Modern', description: 'Bold type and fresh colour' },
  { id: 'minimal', label: 'Minimal', description: 'Clean lines, lots of breathing room' },
  { id: 'christian', label: 'Christian', description: 'Graceful designs for church weddings' },
  { id: 'nikah', label: 'Nikah', description: 'Arches, crescents and emerald gold' },
  { id: 'destination', label: 'Destination', description: 'Beaches, palms and sunsets' },
  { id: 'vintage', label: 'Vintage', description: 'Scrolls, letters and old-world charm' },
];

