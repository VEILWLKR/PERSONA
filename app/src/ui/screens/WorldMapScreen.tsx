import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, MapPin, Navigation, Search, Sparkles, TentTree } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { getWorldRegion, WORLD_REGIONS } from '@/data/worldData';
import type { Region } from '@/types/game';

function MapDecorations() {
  return (
    <>
      <path d="M20 102 C145 38 245 91 356 48 S590 68 738 28 S926 72 1080 42" fill="none" stroke="#b68a50" strokeDasharray="3 10" strokeLinecap="round" strokeWidth="2" opacity=".34" />
      <path d="M92 465 C210 390 310 438 421 355 S640 304 754 370 S924 422 1055 342" fill="none" stroke="#b68a50" strokeDasharray="3 10" strokeLinecap="round" strokeWidth="2" opacity=".34" />
      <path d="M120 158 C210 238 230 285 283 390 S456 502 521 565" fill="none" stroke="#6f9b9a" strokeDasharray="4 9" strokeLinecap="round" strokeWidth="2" opacity=".42" />
      <path d="M760 126 C702 202 699 256 750 326 S824 450 789 568" fill="none" stroke="#6f9b9a" strokeDasharray="4 9" strokeLinecap="round" strokeWidth="2" opacity=".42" />
      <g fill="#775f46" opacity=".55">
        <path d="M150 125 l12 -22 12 22 -7 -4 7 18 h-24 l7 -18z" />
        <path d="M188 132 l12 -22 12 22 -7 -4 7 18 h-24 l7 -18z" />
        <path d="M315 130 l12 -22 12 22 -7 -4 7 18 h-24 l7 -18z" />
        <path d="M940 145 l12 -22 12 22 -7 -4 7 18 h-24 l7 -18z" />
        <path d="M944 485 l12 -22 12 22 -7 -4 7 18 h-24 l7 -18z" />
      </g>
      <g fill="none" stroke="#7a8c84" strokeWidth="1.2" opacity=".48">
        <path d="M90 330 q35 -24 72 0t72 0t72 0" />
        <path d="M846 238 q35 -24 72 0t72 0t72 0" />
        <path d="M570 510 q35 -24 72 0t72 0t72 0" />
      </g>
    </>
  );
}

export function WorldMapScreen() {
  const { character, setScreen } = useGameStore();
  const homeRegion = character?.region ?? 'Aetheria';
  const [selectedId, setSelectedId] = useState<Region>(homeRegion);
  const [discovered, setDiscovered] = useState<Region[]>([homeRegion]);
  const selected = useMemo(() => getWorldRegion(selectedId), [selectedId]);
  const isHome = selected.id === homeRegion;
  const isDiscovered = discovered.includes(selected.id);

  const discoverRegion = () => {
    if (!discovered.includes(selected.id)) setDiscovered((current) => [...current, selected.id]);
  };

  return (
    <div className="min-h-screen px-3 py-4 text-[#302b25] sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <button type="button" onClick={() => setScreen(character ? 'summary' : 'title')} className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#78654b] transition-colors hover:text-[#302b25]">
              <ArrowLeft className="h-4 w-4" /> Return
            </button>
            <div className="flex items-center gap-3">
              <Compass className="h-8 w-8 text-[#a66a37]" />
              <div><p className="font-serif text-xs uppercase tracking-[0.24em] text-[#9c744d]">The known world</p><h1 className="fantasy-title text-3xl font-bold text-[#3c3026] sm:text-4xl">The Atlas of Vaelith</h1></div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#a67b4e]/30 bg-[#f5e8c8]/70 px-3 py-2 text-xs font-semibold text-[#70583e] shadow-sm"><Navigation className="h-4 w-4 text-[#ad6b3e]" /> Home: {homeRegion}</div>
        </header>

        <main className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
          <section className="relative overflow-hidden rounded-[5px] border-[10px] border-[#725338] bg-[#d9c18e] shadow-[0_20px_50px_rgba(47,34,21,.3)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,247,210,.55),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(100,75,48,.13),transparent_40%)]" />
            <svg viewBox="0 0 1100 620" className="relative block h-auto min-h-[520px] w-full" role="img" aria-label="Illustrated world map of Vaelith">
              <defs>
                <filter id="mapNoise"><feTurbulence baseFrequency=".8" numOctaves="3" stitchTiles="stitch" type="fractalNoise" /><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .08 0" /></filter>
                <pattern id="waves" width="52" height="26" patternUnits="userSpaceOnUse"><path d="M0 13 Q13 3 26 13 T52 13" fill="none" stroke="#6f9b9a" strokeWidth="1" opacity=".28" /></pattern>
              </defs>
              <rect width="1100" height="620" fill="#c5d1c1" />
              <rect width="1100" height="620" fill="url(#waves)" />
              <path d="M0 0 H1100 V620 H0Z" fill="#d6c28f" opacity=".12" filter="url(#mapNoise)" />
              <path d="M90 38 C178 7 245 66 319 41 C394 16 448 73 535 54 C638 30 672 75 752 54 C845 30 891 3 1000 44 L1061 119 C1024 180 1029 222 1072 288 C1029 348 1054 419 1020 483 C964 507 939 576 854 550 C780 580 723 547 660 585 C576 560 536 594 459 554 C387 578 323 528 256 552 C194 526 157 556 92 518 C112 461 73 412 105 350 C71 295 109 250 81 196 C118 139 72 96 90 38Z" fill="#ddc994" stroke="#8b6849" strokeWidth="5" />
              <path d="M90 38 C178 7 245 66 319 41 C394 16 448 73 535 54 C638 30 672 75 752 54 C845 30 891 3 1000 44 L1061 119 C1024 180 1029 222 1072 288 C1029 348 1054 419 1020 483 C964 507 939 576 854 550 C780 580 723 547 660 585 C576 560 536 594 459 554 C387 578 323 528 256 552 C194 526 157 556 92 518 C112 461 73 412 105 350 C71 295 109 250 81 196 C118 139 72 96 90 38Z" fill="none" stroke="#f6e8bd" strokeWidth="10" opacity=".42" />
              <MapDecorations />
              <text x="500" y="315" fill="#7c684e" fontFamily="serif" fontSize="27" fontStyle="italic" letterSpacing="5" opacity=".58">VAELITH</text>
              <text x="500" y="345" fill="#7c684e" fontFamily="serif" fontSize="12" letterSpacing="3" opacity=".5">A WORLD BETWEEN TIDES AND STARS</text>
              <g transform="translate(952 78)" fill="none" stroke="#806342" strokeWidth="3" opacity=".68"><circle r="39" /><path d="M0 -32 L8 0 0 32 -8 0Z M-32 0 L0 8 32 0 0 -8Z" /><text x="-5" y="-49" fill="#806342" stroke="none" fontSize="12">N</text></g>
            </svg>
            {WORLD_REGIONS.map((region) => {
              const active = region.id === selected.id;
              const home = region.id === homeRegion;
              const known = discovered.includes(region.id);
              return <button key={region.id} type="button" onClick={() => setSelectedId(region.id)} className={`absolute -translate-x-1/2 -translate-y-1/2 text-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f5c35] ${active ? 'z-20 scale-110' : 'z-10'}`} style={{ left: `${region.position.left}%`, top: `${region.position.top}%` }} aria-label={`View ${region.title}`}>
                <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-4 shadow-[0_3px_8px_rgba(55,37,20,.35)] ${active ? 'border-[#fff2c5]' : 'border-[#e9d7a9]'}`} style={{ backgroundColor: known ? region.accent : '#6b685d' }}><MapPin className="h-5 w-5 text-[#fff6d1]" /></span>
                <span className={`mt-1 block whitespace-nowrap rounded-sm px-1.5 py-0.5 font-serif text-[11px] font-bold shadow-sm ${active ? 'bg-[#fff1c8] text-[#3e3025]' : 'bg-[#efe0b6]/80 text-[#655039]'}`}>{region.title}{home ? ' · HOME' : ''}</span>
              </button>;
            })}
          </section>

          <aside className="rounded-[5px] border border-[#b99462]/60 bg-[#f0dfb6]/90 p-4 shadow-[0_14px_30px_rgba(47,34,21,.16)] sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-[#a77b4e]/25 pb-4"><div><p className="font-serif text-xs uppercase tracking-[.2em] text-[#9c744d]">Region dossier</p><h2 className="fantasy-title mt-1 text-2xl font-bold text-[#3c3026]">{selected.title}</h2><p className="font-serif text-sm italic text-[#856a4c]">{selected.subtitle}</p></div><span className="rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: selected.accent, borderColor: `${selected.accent}80` }}>{selected.terrain}</span></div>
            <p className="font-serif text-sm leading-6 text-[#5f4d39]">{selected.description}</p>
            <div className="mt-5"><p className="mb-2 flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wider text-[#8b6849]"><TentTree className="h-4 w-4" /> Landmark routes</p><ul className="space-y-2">{selected.landmarks.map((landmark) => <li key={landmark} className="flex items-center gap-2 font-serif text-sm text-[#5f4d39]"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: selected.accent }} />{landmark}</li>)}</ul></div>
            <div className="mt-5 rounded-sm border border-[#a77b4e]/25 bg-[#fff1c8]/45 p-3"><p className="font-serif text-xs uppercase tracking-wider text-[#9c744d]">Known route</p><p className="mt-1 font-serif text-sm text-[#5f4d39]">{selected.route}</p></div>
            <button type="button" onClick={discoverRegion} disabled={isDiscovered} className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm border border-[#9e6637] bg-[#a96d3d] px-4 py-3 font-serif text-sm font-bold text-[#fff4d1] transition-colors hover:bg-[#8f582f] disabled:cursor-default disabled:border-[#aa8b61] disabled:bg-[#c5ad7e]"><Search className="h-4 w-4" />{isHome ? 'Starting region' : isDiscovered ? 'Region discovered' : 'Survey this region'}</button>
            <div className="mt-4 flex items-center justify-between text-xs font-serif text-[#806648]"><span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> {discovered.length} of {WORLD_REGIONS.length} charted</span><span>{isHome ? 'Your homeland' : isDiscovered ? 'On the atlas' : 'Uncharted'}</span></div>
          </aside>
        </main>
      </div>
    </div>
  );
}
