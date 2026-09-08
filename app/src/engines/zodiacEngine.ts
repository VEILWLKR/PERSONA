import type { ChineseZodiac, ZodiacSign } from '@/types/game';

const CHINESE_ZODIAC: ChineseZodiac[] = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
];

export function calculateZodiac(month: number, day: number): ZodiacSign {
  const boundaries: { month: number; day: number; sign: ZodiacSign }[] = [
    { month: 1, day: 20, sign: 'Aquarius' },
    { month: 2, day: 19, sign: 'Pisces' },
    { month: 3, day: 21, sign: 'Aries' },
    { month: 4, day: 20, sign: 'Taurus' },
    { month: 5, day: 21, sign: 'Gemini' },
    { month: 6, day: 21, sign: 'Cancer' },
    { month: 7, day: 23, sign: 'Leo' },
    { month: 8, day: 23, sign: 'Virgo' },
    { month: 9, day: 23, sign: 'Libra' },
    { month: 10, day: 23, sign: 'Scorpio' },
    { month: 11, day: 22, sign: 'Sagittarius' },
    { month: 12, day: 22, sign: 'Capricorn' },
  ];

  for (let index = boundaries.length - 1; index >= 0; index -= 1) {
    const boundary = boundaries[index];
    if (month > boundary.month || (month === boundary.month && day >= boundary.day)) {
      return boundary.sign;
    }
  }

  return 'Capricorn';
}

export function calculateChineseZodiac(year: number): ChineseZodiac {
  return CHINESE_ZODIAC[(year - 2020 + CHINESE_ZODIAC.length) % CHINESE_ZODIAC.length];
}
