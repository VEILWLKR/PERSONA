import type { Region } from '@/types/game';

export interface WorldRegion {
  id: Region;
  title: string;
  subtitle: string;
  description: string;
  terrain: string;
  accent: string;
  position: { left: number; top: number };
  landmarks: string[];
  route: string;
}

export const WORLD_REGIONS: WorldRegion[] = [
  { id: 'Aetheria', title: 'Aetheria', subtitle: 'The Crownlands', description: 'A highland of old roads, bell towers, and sky-borne ruins where the first legends were written.', terrain: 'Highland', accent: '#d7a94d', position: { left: 49, top: 26 }, landmarks: ['Crownspire City', 'The Sunken Archive', 'Pilgrim\'s Rise'], route: 'The royal road' },
  { id: 'Shadowmere', title: 'Shadowmere', subtitle: 'The Veiled Fen', description: 'A moonlit wetland threaded with blackwater channels and lanterns that remember the dead.', terrain: 'Wetland', accent: '#9d7bc4', position: { left: 77, top: 31 }, landmarks: ['Mournwater Ferry', 'The Glass Marsh', 'Witchlight Fen'], route: 'The lantern causeway' },
  { id: 'Ironhold', title: 'Ironhold', subtitle: 'The Red Bastion', description: 'A mountain fortress and the beating forge of the north, built into a scar of red stone.', terrain: 'Mountain', accent: '#cf735c', position: { left: 24, top: 27 }, landmarks: ['Ashgate Keep', 'The Emberfoundry', 'Colossus Pass'], route: 'The old trade road' },
  { id: 'Verdantia', title: 'Verdantia', subtitle: 'The Living Wilds', description: 'An ancient green sea where giant roots lift temples above the canopy and every path grows back.', terrain: 'Forest', accent: '#79ae72', position: { left: 27, top: 67 }, landmarks: ['Rootheart Grove', 'Mossglass Ruins', 'The Green Stair'], route: 'The druid\'s trail' },
  { id: 'Crystallis', title: 'Crystallis', subtitle: 'The Shard Coast', description: 'A bright coast of crystal beaches, tide caves, and observatories pointed toward distant stars.', terrain: 'Coast', accent: '#70b7c2', position: { left: 67, top: 73 }, landmarks: ['Prismwatch', 'The Singing Caves', 'Starfall Quay'], route: 'The saltway' },
  { id: 'Emberfall', title: 'Emberfall', subtitle: 'The Ashen Reach', description: 'A volcanic frontier where red snow falls over broken citadels and the earth still breathes heat.', terrain: 'Volcanic', accent: '#dc8054', position: { left: 84, top: 72 }, landmarks: ['Cinderwake', 'The Furnace Steps', 'Ashen Crown'], route: 'The lava bridges' },
  { id: 'Stormhaven', title: 'Stormhaven', subtitle: 'The Tempest Isles', description: 'Wind-cut islands scattered across a restless sea, joined by rope bridges and stormlight.', terrain: 'Islands', accent: '#6e9ed0', position: { left: 12, top: 52 }, landmarks: ['Galehold', 'The Thunderhead', 'Sailor\'s Rest'], route: 'The windward passage' },
  { id: 'Sunkenreach', title: 'Sunkenreach', subtitle: 'The Drowned Deep', description: 'A drowned kingdom below the western waves, reached by reefs, ruins, and very patient divers.', terrain: 'Drowned', accent: '#598f9e', position: { left: 51, top: 84 }, landmarks: ['Pearlgrave', 'The Drowned Court', 'Reef of Bells'], route: 'The submerged road' },
];

export function getWorldRegion(id: Region) {
  return WORLD_REGIONS.find((region) => region.id === id) ?? WORLD_REGIONS[0];
}
