import type { CharacterAppearance } from '@/types/game';

export const ILLUSTRATED_RENDER_SIZE = { width: 192, height: 288 } as const;

function shade(hex: string, amount: number) {
  const value = hex.replace('#', '');
  const number = Number.parseInt(value, 16);
  const red = Math.max(0, Math.min(255, (number >> 16) + amount));
  const green = Math.max(0, Math.min(255, ((number >> 8) & 0xff) + amount));
  const blue = Math.max(0, Math.min(255, (number & 0xff) + amount));
  return `rgb(${red}, ${green}, ${blue})`;
}

function ellipse(context: CanvasRenderingContext2D, color: string, x: number, y: number, rx: number, ry: number) {
  context.beginPath();
  context.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

function polygon(context: CanvasRenderingContext2D, color: string, points: [number, number][], stroke?: string, lineWidth = 1) {
  context.beginPath();
  points.forEach(([x, y], index) => index === 0 ? context.moveTo(x, y) : context.lineTo(x, y));
  context.closePath();
  context.fillStyle = color;
  context.fill();
  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.stroke();
  }
}

function roundedRect(context: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number, radius: number, stroke?: string) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fillStyle = color;
  context.fill();
  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = 2;
    context.stroke();
  }
}

function drawHair(context: CanvasRenderingContext2D, appearance: CharacterAppearance, hair: string, hairShadow: string, hairLight: string, outline: string, includeBack = true) {
  const swept = appearance.hairId === 'hair_swept_front';
  const spiky = appearance.hairId === 'hair_spiky_front';
  const long = appearance.hairId === 'hair_plain_front' && appearance.hairStyle === 1;

  if (includeBack) {
    polygon(context, hairShadow, [
      [48, 91], [42, 72], [52, 45], [77, 26], [112, 20], [141, 37], [155, 66], [148, 112],
      [135, 132], [54, 127],
    ], outline, 4);
    polygon(context, hair, [
      [52, 84], [49, 65], [62, 43], [84, 28], [113, 28], [137, 43], [148, 68], [142, 97],
      [126, 111], [63, 111],
    ]);
    polygon(context, hairLight, [[65, 55], [83, 36], [105, 32], [94, 48], [73, 66]]);
    polygon(context, shade(hair, 12), [[108, 32], [130, 46], [137, 62], [123, 55]]);

    if (long) {
      polygon(context, hairShadow, [[46, 78], [34, 98], [36, 166], [56, 183], [66, 112]], outline, 4);
      polygon(context, hair, [[49, 84], [42, 103], [45, 154], [57, 165], [62, 106]]);
      polygon(context, hairShadow, [[143, 80], [158, 103], [156, 165], [139, 181], [131, 108]], outline, 4);
      polygon(context, hair, [[141, 86], [151, 106], [148, 153], [139, 166], [134, 106]]);
    }
  }

  const fringe = spiky
    ? [[53, 73], [68, 49], [77, 73], [91, 42], [101, 74], [117, 44], [128, 78], [145, 61], [137, 101], [58, 101]] as [number, number][]
    : swept
      ? [[53, 71], [74, 43], [103, 47], [141, 64], [122, 80], [101, 74], [82, 99], [57, 96]] as [number, number][]
      : [[51, 67], [71, 45], [93, 53], [111, 42], [141, 69], [135, 94], [117, 82], [102, 98], [79, 82], [61, 98]] as [number, number][];
  polygon(context, hair, fringe, outline, 3);

  const strandStart = swept ? 76 : 62;
  for (let index = 0; index < 4; index += 1) {
    context.strokeStyle = index % 2 === 0 ? hairLight : hairShadow;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(strandStart + index * 16, 57 + (index % 2) * 5);
    context.quadraticCurveTo(strandStart + 5 + index * 16, 73, strandStart + index * 13, 91);
    context.stroke();
  }
}

export function renderCharacterSprite(canvas: HTMLCanvasElement, appearance: CharacterAppearance) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const { width, height } = ILLUSTRATED_RENDER_SIZE;
  context.imageSmoothingEnabled = true;
  context.clearRect(0, 0, width, height);

  const skin = appearance.skinTone;
  const skinShadow = shade(skin, -28);
  const skinLight = shade(skin, 24);
  const hair = appearance.hairColor;
  const hairShadow = shade(hair, -38);
  const hairLight = shade(hair, 34);
  const outfit = appearance.outfitColor;
  const outfitShadow = shade(outfit, -42);
  const outfitLight = shade(outfit, 30);
  const outline = '#291b25';
  const denim = '#314d9b';
  const denimShadow = '#1d2d68';
  const denimLight = '#5578d1';
  const boot = '#633728';
  const bootLight = '#9b5b37';
  const overalls = appearance.shirtId !== 'shirt_tunic' && appearance.shirtId !== 'shirt_jacket';
  const skirt = appearance.pantsId === 'pants_skirt';
  const shorts = appearance.pantsId === 'pants_shorts';

  // Soft stage shadow keeps the illustration grounded without flattening the character.
  ellipse(context, 'rgba(37, 30, 38, 0.18)', 96, 269, 52, 9);

  // Back hair is intentionally drawn first so the front locks can overlap the face later.
  drawHair(context, appearance, hair, hairShadow, hairLight, outline);

  // Neck, shoulders, torso, and arms.
  roundedRect(context, skinShadow, 77, 130, 38, 33, 9, outline);
  polygon(context, outfitShadow, [[55, 151], [78, 137], [114, 137], [140, 151], [153, 236], [41, 236]], outline, 5);
  polygon(context, outfit, [[61, 154], [80, 144], [112, 144], [133, 155], [140, 229], [52, 229]], undefined);
  polygon(context, outfitLight, [[70, 152], [83, 148], [89, 222], [69, 222]], undefined);

  // Sleeves and hands remain separate readable forms.
  roundedRect(context, outfitShadow, 42, 153, 26, 74, 12, outline);
  roundedRect(context, outfit, 47, 158, 18, 61, 9);
  roundedRect(context, outfitShadow, 124, 153, 26, 74, 12, outline);
  roundedRect(context, outfit, 127, 158, 18, 61, 9);
  ellipse(context, skinShadow, 54, 226, 15, 19);
  ellipse(context, skin, 56, 222, 12, 17);
  ellipse(context, skinShadow, 138, 226, 15, 19);
  ellipse(context, skin, 136, 222, 12, 17);
  context.strokeStyle = skinLight;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(52, 218);
  context.lineTo(57, 229);
  context.moveTo(134, 218);
  context.lineTo(139, 229);
  context.stroke();

  // Top layer: collar, seam, folds, and buttons.
  polygon(context, shade(outfit, 12), [[73, 146], [96, 163], [119, 146], [111, 190], [81, 190]], outline, 3);
  polygon(context, outfitShadow, [[78, 150], [96, 164], [96, 190], [83, 185]], undefined);
  if (appearance.shirtId === 'shirt_jacket') {
    context.strokeStyle = outfitLight;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(75, 151);
    context.lineTo(75, 199);
    context.moveTo(117, 151);
    context.lineTo(117, 199);
    context.stroke();
    context.fillStyle = outfitLight;
    context.fillRect(75, 178, 42, 3);
  }
  context.strokeStyle = outfitLight;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(67, 196);
  context.lineTo(84, 203);
  context.moveTo(108, 201);
  context.lineTo(126, 194);
  context.stroke();
  if (overalls) {
    context.strokeStyle = denimLight;
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(78, 151);
    context.lineTo(84, 205);
    context.moveTo(114, 151);
    context.lineTo(108, 205);
    context.stroke();
  }
  ellipse(context, '#e0b36b', 96, 175, 3, 3);
  ellipse(context, '#e0b36b', 96, 188, 3, 3);

  // Bottom clothing, belt, folds, and legs.
  if (skirt) {
    polygon(context, denimShadow, [[52, 204], [140, 204], [153, 253], [39, 253]], outline, 5);
    polygon(context, denim, [[60, 209], [132, 209], [143, 246], [49, 246]], undefined);
    context.strokeStyle = denimLight;
    context.lineWidth = 3;
    for (let x = 61; x < 135; x += 16) {
      context.beginPath();
      context.moveTo(x, 214);
      context.lineTo(x + 7, 244);
      context.stroke();
    }
  } else if (shorts) {
    polygon(context, denimShadow, [[53, 204], [139, 204], [132, 238], [104, 238], [96, 224], [87, 238], [59, 238]], outline, 5);
    polygon(context, denim, [[61, 207], [131, 207], [124, 232], [103, 232], [96, 220], [88, 232], [68, 232]], undefined);
  } else {
    polygon(context, denimShadow, [[53, 204], [139, 204], [132, 253], [104, 253], [96, 230], [87, 253], [59, 253]], outline, 5);
    polygon(context, denim, [[61, 207], [131, 207], [124, 246], [103, 246], [96, 224], [88, 246], [68, 246]], undefined);
    polygon(context, shade(denim, 28), [[67, 211], [88, 211], [87, 230], [70, 237]], undefined);
  }
  context.strokeStyle = denimShadow;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(96, 211);
  context.lineTo(96, 232);
  context.moveTo(74, 240);
  context.lineTo(88, 238);
  context.moveTo(103, 238);
  context.lineTo(120, 241);
  context.stroke();

  // Boots have their own material palette and sole highlights.
  const sneaker = appearance.shoesId === 'shoes_sneakers';
  roundedRect(context, outline, 57, 242, 38, 36, 10);
  roundedRect(context, sneaker ? '#e1d9d2' : boot, 62, 242, 29, 29, 8);
  roundedRect(context, outline, 97, 242, 38, 36, 10);
  roundedRect(context, sneaker ? '#e1d9d2' : boot, 102, 242, 29, 29, 8);
  roundedRect(context, sneaker ? outfit : bootLight, 64, 246, 9, 19, 4);
  roundedRect(context, sneaker ? outfit : bootLight, 104, 246, 9, 19, 4);
  context.fillStyle = sneaker ? '#ffffff' : '#2b202c';
  context.fillRect(61, 269, 31, 7);
  context.fillRect(101, 269, 31, 7);

  // Face, with shape variation, cheek shading, nose, mouth, brows, and expressive eyes.
  const faceWidth = appearance.faceType === 0 ? 54 : appearance.faceType === 2 ? 68 : 61;
  const faceX = 96 - faceWidth / 2;
  ellipse(context, outline, 96, 94, faceWidth / 2 + 7, 54);
  ellipse(context, skinShadow, 96, 96, faceWidth / 2, 48);
  ellipse(context, skin, 96, 91, faceWidth / 2 - 2, 45);
  ellipse(context, skinLight, 83, 79, 17, 14);
  ellipse(context, skinShadow, 111, 111, 15, 23);
  context.fillStyle = skinLight;
  context.fillRect(faceX + 5, 105, 5, 13);

  const eyeY = 94;
  const eyeRadius = appearance.eyesId === 'eyes_wide' ? 10 : appearance.eyesId === 'eyes_narrow' ? 6 : 8;
  for (const eyeX of [78, 114]) {
    ellipse(context, '#fff8ef', eyeX, eyeY, 12, eyeRadius);
    ellipse(context, appearance.eyeColor, eyeX + 1, eyeY + 1, 6, Math.max(4, eyeRadius - 1));
    ellipse(context, '#211b2a', eyeX + 2, eyeY + 1, 3, Math.max(3, eyeRadius - 2));
    ellipse(context, '#ffffff', eyeX + 4, eyeY - 2, 2, 2);
  }
  context.strokeStyle = appearance.faceType === 2 ? outline : hairShadow;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(67, 81);
  context.quadraticCurveTo(78, 75, 88, 81);
  context.moveTo(104, 81);
  context.quadraticCurveTo(115, 75, 126, 81);
  context.stroke();
  context.strokeStyle = skinShadow;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(96, 96);
  context.lineTo(91, 112);
  context.lineTo(98, 114);
  context.stroke();
  context.strokeStyle = appearance.expressionId === 'expression_serious' ? '#5a293a' : '#8c3e54';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(88, 127);
  context.quadraticCurveTo(96, appearance.expressionId === 'expression_serious' ? 129 : 138, 105, 127);
  context.stroke();

  // Front hair restores the chosen silhouette over the forehead without hiding the face.
  drawHair(context, { ...appearance, hairStyle: 0 }, hair, hairShadow, hairLight, outline, false);

  // Optional accessories are independent overlays.
  if (appearance.accessoryId === 'accessory_glasses' || appearance.accessory === 'glasses') {
    context.strokeStyle = '#40324d';
    context.lineWidth = 4;
    context.strokeRect(65, 87, 27, 20);
    context.strokeRect(100, 87, 27, 20);
    context.beginPath();
    context.moveTo(92, 94);
    context.lineTo(100, 94);
    context.stroke();
  }
  if (appearance.accessoryId === 'accessory_earrings' || appearance.accessory === 'earrings') {
    ellipse(context, '#e8b85d', 64, 119, 4, 7);
    ellipse(context, '#e8b85d', 128, 119, 4, 7);
  }
  if (appearance.accessoryId === 'accessory_pendant') {
    context.strokeStyle = '#e8b85d';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(96, 165, 17, Math.PI * 0.2, Math.PI * 0.8);
    context.stroke();
    polygon(context, '#e8b85d', [[96, 176], [103, 184], [96, 192], [89, 184]], outline, 2);
  }
  if (appearance.headwearId === 'headwear_cap' || appearance.accessory === 'cap') {
    polygon(context, '#5f4a88', [[51, 58], [67, 35], [117, 30], [145, 49], [144, 63], [88, 54]], outline, 4);
    polygon(context, '#8b72b3', [[63, 40], [94, 30], [122, 39], [103, 45]], undefined);
    polygon(context, '#493968', [[48, 56], [87, 53], [69, 65]], outline, 3);
  }
  if (appearance.accessoryId === 'accessory_scarf' || appearance.accessory === 'scarf') {
    roundedRect(context, '#c36d4b', 68, 135, 56, 22, 8, outline);
    roundedRect(context, '#e08a5b', 76, 138, 34, 6, 3);
    roundedRect(context, '#a5483e', 108, 148, 18, 43, 6, outline);
  }
}
