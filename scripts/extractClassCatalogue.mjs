import fs from 'node:fs';

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/extractClassCatalogue.mjs <input.md> <output.json>');
}

const lines = fs.readFileSync(inputPath, 'utf8').split(/\r?\n/);
const catalogue = {};
let current = null;
let section = null;

const sectionKeys = {
  'Attacks': 'attacks',
  'Skills': 'skills',
  'Spells': 'spells',
  'Abilities / Passives': 'abilities',
  'Out-of-Combat Skills': 'outOfCombat',
  'Signature Abilities': 'signatures',
  'Ultimate': 'ultimate',
};

function clean(value) {
  return value
    .replace(/^\s+|\s+$/g, '')
    .replace(/\\u2014/g, '—');
}

function isEmptyRow(value) {
  return !value || value === '-' || value === '—' || value === 'â€”';
}

function parseRow(line) {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => clean(cell));
}

function addTableRow(line) {
  if (!current || !section || !sectionKeys[section] || !line.startsWith('|')) return;
  const cells = parseRow(line);
  if (!cells.length || cells[0] === 'Level' || cells.every((cell) => /^[-:]+$/.test(cell))) return;

  const [level, name, description, target, type] = cells;
  if (isEmptyRow(name)) return;
  const item = {
    level: Number.isFinite(Number(level)) ? Number(level) : null,
    name,
    description,
  };
  if (target && !isEmptyRow(target)) item.target = target;
  if (type && !isEmptyRow(type)) item.type = type;
  catalogue[current][sectionKeys[section]].push(item);
}

for (const line of lines) {
  const classHeading = line.match(/^# (.+)$/);
  if (classHeading && classHeading[1] !== 'Persona-Inspired RPG — Class Ability Catalogue') {
    current = classHeading[1].trim();
    catalogue[current] = {
      identity: '',
      startingKit: [],
      attacks: [],
      skills: [],
      spells: [],
      abilities: [],
      outOfCombat: [],
      signatures: [],
      ultimate: [],
    };
    section = null;
    continue;
  }

  if (!current) continue;
  const sectionHeading = line.match(/^## (.+)$/);
  if (sectionHeading) {
    section = sectionHeading[1].trim();
    continue;
  }

  if (section === 'Class Identity' && line.trim()) {
    catalogue[current].identity = line.trim();
  }

  if (section === 'Level 1 Starting Kit') {
    const kitItem = line.match(/^[-*] \*\*(.+?)\*\* \((.+?)\)\s+[^A-Za-z0-9]+\s+(.+)$/);
    if (kitItem) {
      catalogue[current].startingKit.push({ name: kitItem[1], category: kitItem[2], description: clean(kitItem[3]) });
    }
  }

  addTableRow(line);
}

delete catalogue['Evolution Path Review'];
delete catalogue['Final Quality Check'];

fs.writeFileSync(outputPath, `${JSON.stringify(catalogue, null, 2)}\n`, 'utf8');
console.log(`Extracted ${Object.keys(catalogue).length} class entries.`);
