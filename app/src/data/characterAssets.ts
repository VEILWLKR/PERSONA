export type CharacterAssetCategory =
  | 'body'
  | 'skin'
  | 'eyes'
  | 'eyebrows'
  | 'expression'
  | 'hairBack'
  | 'hairFront'
  | 'shirt'
  | 'pants'
  | 'shoes'
  | 'accessory'
  | 'headwear';

export interface PixelLayer {
  id: string;
  label: string;
  category: CharacterAssetCategory;
  pixels: { x: number; y: number; color: string }[];
  tags?: string[];
  paletteRoles?: string[];
  directions?: ('down' | 'up' | 'left' | 'right')[];
  frameCount?: number;
}

export const CHARACTER_SPRITE_SIZE = { width: 32, height: 64 } as const;
const SOURCE_WIDTH = 16;

function rowsAt(start: number, rows: string[]) {
  const result = Array.from({ length: CHARACTER_SPRITE_SIZE.height }, () => '.'.repeat(CHARACTER_SPRITE_SIZE.width));
  rows.forEach((row, index) => {
    const sourceRow = row.padEnd(SOURCE_WIDTH, '.').slice(0, SOURCE_WIDTH);
    const scaledRow = sourceRow.split('').map((symbol) => symbol.repeat(2)).join('');
    result[(start + index) * 2] = scaledRow;
    result[(start + index) * 2 + 1] = scaledRow;
  });
  return result;
}

function createLayer(
  id: string,
  label: string,
  category: CharacterAssetCategory,
  start: number,
  rows: string[],
  palette: Record<string, string>,
): PixelLayer {
  return {
    id,
    label,
    category,
    tags: [category],
    paletteRoles: [...new Set(Object.values(palette))],
    directions: ['down'],
    frameCount: 1,
    pixels: rowsAt(start, rows).flatMap((row, y) =>
      row.split('').flatMap((symbol, x) => {
        const color = palette[symbol];
        return color ? [{ x, y, color }] : [];
      }),
    ),
  };
}

const BODY_ROWS = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...OOOOOOO......',
  '..OOSSSSSOO.....',
  '..OSSSSSSSO.....',
  '..OSSSSSSSO.....',
  '.OOSSSSSSSOO....',
  '.OOSSSSSSSOO....',
  '..OSSSSSSSO.....',
  '..OOSSSSSOO.....',
  '...OSSSSSO......',
  '...OOOOOOO......',
  '..OO......OO....',
  '.OOSOOOOOO SOO..'.replace(' ', ''),
  '.OSOOOOOOOO SO...'.replace(' ', ''),
  '.OSOOOOOOOO SO...'.replace(' ', ''),
  '.OSOOOOOOOO SO...'.replace(' ', ''),
  '.OSOOOOOOOO SO...'.replace(' ', ''),
  '.OSOOOOOOOO SO...'.replace(' ', ''),
  '..OOSOOOOOSOO....',
  '...OOOOOOOO......',
  '...OO....OO......',
  '...OO....OO......',
  '...OO....OO......',
  '..OOO....OOO.....',
  '..OOO....OOO.....',
  '..OOOO..OOOO.....',
  '..OOOO..OOOO.....',
];

const body = createLayer('body_default', 'Balanced Body', 'body', 0, BODY_ROWS.map((row) => row.replace(/S/g, '.')), { O: 'outline' });

const skinLayer = createLayer('skin_warm', 'Warm Skin', 'skin', 0, BODY_ROWS.map((row) => row.replace(/O/g, '.')), { S: 'skin' });

const eyes = createLayer('eyes_round', 'Round Eyes', 'eyes', 0, [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....EE..EE.....',
  '.....EE..EE.....',
], { E: 'eye' });
const eyesNarrow = createLayer('eyes_narrow', 'Narrow Eyes', 'eyes', 0, [], {});
const eyesBright = createLayer('eyes_bright', 'Bright Eyes', 'eyes', 0, [], {});

const brows = createLayer('brows_soft', 'Soft Brows', 'eyebrows', 0, [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....BB..BB......',
], { B: 'outline' });

const browsSharp = createLayer('brows_sharp', 'Sharp Brows', 'eyebrows', 0, [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....BBB.BBB.....',
], { B: 'outline' });

const expressions = [
  createLayer('expression_smile', 'Small Smile', 'expression', 0, ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '......MM........'], { M: 'mouth' }),
  createLayer('expression_serious', 'Serious', 'expression', 0, ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '.....MMM........'], { M: 'outline' }),
];

const hairBack = [
  createLayer('hair_short_back', 'Short', 'hairBack', 0, ['................', '....HHHH........', '...HHHHHH.......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '...HHHHHH.......', '................'], { H: 'hairShadow' }),
  createLayer('hair_long_back', 'Long', 'hairBack', 0, ['................', '....HHHH........', '...HHHHHH.......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHHHH......', '...HHHHHH.......', '...HHHHHH.......'], { H: 'hairShadow' }),
];

const hairFront = [
  createLayer('hair_plain_front', 'Plain Fringe', 'hairFront', 0, ['................', '....HHHH........', '...HHHHHH.......', '..HHHHHHHH......', '..HHHHHHHH......', '...HHHHHH.......', '...HHHHHH.......', '....HHHH........', '................'], { H: 'hair' }),
  createLayer('hair_swept_front', 'Swept Fringe', 'hairFront', 0, ['................', '....HHHH........', '...HHHHHH.......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHH........', '...HHHH.........', '....HH..........', '................'], { H: 'hair' }),
  createLayer('hair_spiky_front', 'Spiky Fringe', 'hairFront', 0, ['...H............', '....HHHH........', '...HHHHHH.......', '..HHHHHHHH......', '..HHHHHHHH......', '..HHHHHH........', '...HHHH.........', '....HH..........', '................'], { H: 'hair' }),
];

const shirts = [
  createLayer('shirt_tunic', 'Tunic', 'shirt', 16, ['..OOOOOOOO....', '.OOOTTTTOOO...', '.OOTTTTTTOO...', '.OOTTTTTTOO...', '.OOTTTTTTOO...', '.OOOTTTTOOO...', '..OOTTTTOO....'], { O: 'outline', T: 'shirt' }),
  createLayer('shirt_overalls', 'Overalls', 'shirt', 16, ['..OOOOOOOO....', '.OOOTTTTOOO...', '.OOTTTTTTOO...', '.OOTTTTTTOO...', '.OOTTTTTTOO...', '.OOTTTTTTOO...', '..OOTTTTOO....'], { O: 'outline', T: 'shirt' }),
  createLayer('shirt_jacket', 'Short Jacket', 'shirt', 16, [], {}),
];

const pants = createLayer('pants_denim', 'Denim Pants', 'pants', 22, ['..OOOOOOOO....', '..OOPP PPOO...'.replace(/ /g, ''), '..OOPPPPOO....', '..OOPPPPOO....', '..OOPPPPOO....', '..OO....OO....', '..OO....OO....', '..OO....OO....'], { O: 'outline', P: 'pants' });
const pantsSkirt = createLayer('pants_skirt', 'Pleated Skirt', 'pants', 22, [], {});
const pantsShorts = createLayer('pants_shorts', 'Shorts', 'pants', 22, [], {});

const shoes = createLayer('shoes_boots', 'Leather Boots', 'shoes', 26, ['..OOO..OOO.....', '..OBB..OBB.....', '..OBB..OBB.....', '..OBBB.OBBB....'], { O: 'outline', B: 'shoes' });
const shoesSneakers = createLayer('shoes_sneakers', 'Sneakers', 'shoes', 26, [], {});

const accessories = [
  createLayer('accessory_none', 'None', 'accessory', 0, [], {}),
  createLayer('accessory_glasses', 'Glasses', 'accessory', 0, ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '....GGGG.GGGG...', '....G..GG..G....'], { G: 'outline' }),
  createLayer('accessory_earrings', 'Earrings', 'accessory', 0, ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '...AA......AA...'], { A: 'metal' }),
  createLayer('accessory_pendant', 'Pendant', 'accessory', 0, [], {}),
];

const headwear = [
  createLayer('headwear_none', 'None', 'headwear', 0, [], {}),
  createLayer('headwear_cap', 'Cap', 'headwear', 0, ['................', '...CCCCCC.......', '..CCCCCCCC......', '..CCCCC C......'.replace(' ', ''), '................'], { C: 'headwear' }),
];

export const CHARACTER_ASSETS = {
  body: [body],
  skin: [skinLayer],
  eyes: [eyes, eyesNarrow, eyesBright],
  eyebrows: [brows, browsSharp],
  expression: expressions,
  hairBack,
  hairFront,
  shirt: shirts,
  pants: [pants, pantsSkirt, pantsShorts],
  shoes: [shoes, shoesSneakers],
  accessory: accessories,
  headwear,
} satisfies Record<CharacterAssetCategory, PixelLayer[]>;

export const CHARACTER_LAYER_ORDER: CharacterAssetCategory[] = [
  'hairBack', 'body', 'skin', 'pants', 'shoes', 'shirt', 'eyes', 'eyebrows', 'expression', 'hairFront', 'accessory', 'headwear',
];

export function findCharacterAsset(category: CharacterAssetCategory, id: string | undefined) {
  return CHARACTER_ASSETS[category].find((asset) => asset.id === id) ?? CHARACTER_ASSETS[category][0];
}
