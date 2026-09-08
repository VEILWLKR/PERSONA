import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Palette, Shirt, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { CHARACTER_ASSETS, type CharacterAssetCategory, type PixelLayer } from '@/data/characterAssets';
import { ILLUSTRATED_RENDER_SIZE, renderCharacterSprite } from '@/engines/characterRenderer';
import { useGameStore } from '@/stores/gameStore';
import type { CharacterAppearance } from '@/types/game';

const DEFAULT_APPEARANCE: CharacterAppearance = {
  skinId: 'skin_warm',
  eyesId: 'eyes_round',
  eyebrowsId: 'brows_soft',
  hairId: 'hair_plain_front',
  shirtId: 'shirt_overalls',
  pantsId: 'pants_denim',
  shoesId: 'shoes_boots',
  accessoryId: 'accessory_none',
  headwearId: 'headwear_none',
  expressionId: 'expression_smile',
  direction: 'down',
  frame: 0,
  gender: 'NonBinary',
  hairStyle: 0,
  hairColor: '#DAA520',
  skinTone: '#EAC086',
  eyeColor: '#4682B4',
  faceType: 1,
  outfitColor: '#4a2c2a',
  accessory: 'none',
};

const SKIN_TONES = ['#FFE0BD', '#FFCD94', '#EAC086', '#C68642', '#8D5524', '#523620'];
const HAIR_COLORS = ['#1a1a2e', '#4a2c2a', '#8B4513', '#DAA520', '#C0C0C0', '#DC143C'];
const EYE_COLORS = ['#4B3621', '#228B22', '#4682B4', '#4B0082', '#808080', '#00CED1'];
const OUTFIT_COLORS = ['#1a1a2e', '#4a2c2a', '#1a3a2c', '#2a1a3a', '#3a1a1a', '#1a2a3a'];

function PixelPreview({ appearance }: { appearance: CharacterAppearance }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) renderCharacterSprite(canvasRef.current, appearance);
  }, [appearance]);

  return (
    <div className="pixel-stage mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-lg border border-amber-300/20 bg-[#f7f3ea] p-6 shadow-inner">
      <canvas
        ref={canvasRef}
        width={ILLUSTRATED_RENDER_SIZE.width}
        height={ILLUSTRATED_RENDER_SIZE.height}
        className="h-full w-auto max-w-[210px]"
        aria-label="Illustrated composited character preview"
        role="img"
      />
    </div>
  );
}

function AssetChoices({ category, value, onChange }: { category: CharacterAssetCategory; value: string | undefined; onChange: (asset: PixelLayer) => void }) {
  const assets = CHARACTER_ASSETS[category];
  return (
    <div className="grid grid-cols-2 gap-2">
      {assets.map((asset) => (
        <button
          key={asset.id}
          type="button"
          onClick={() => onChange(asset)}
          className={`rounded border px-2 py-2 text-xs fantasy-heading transition-colors ${value === asset.id ? 'border-amber-400/70 bg-amber-400/15 text-amber-300' : 'border-amber-400/15 bg-black/20 text-amber-200/60 hover:border-amber-400/45'}`}
        >
          {asset.label}
        </button>
      ))}
    </div>
  );
}

function Swatches({ label, colors, value, onChange }: { label: string; colors: string[]; value: string; onChange: (color: string) => void }) {
  return (
    <fieldset>
      <legend className="fantasy-heading mb-2 text-xs text-amber-200/75">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`${label}: ${color}`}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            className={`h-7 w-7 rounded border-2 transition-transform hover:scale-110 ${value === color ? 'border-white ring-2 ring-amber-400' : 'border-transparent'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function AppearanceScreen() {
  const { pendingCharacter, setPendingCharacter, setScreen } = useGameStore();
  const [appearance, setAppearance] = useState<CharacterAppearance>(pendingCharacter?.appearance ?? DEFAULT_APPEARANCE);

  if (!pendingCharacter) return null;

  const updateAppearance = (changes: Partial<CharacterAppearance>) => {
    setAppearance((current) => ({ ...current, ...changes }));
  };

  const continueToClassPaths = () => {
    setPendingCharacter(pendingCharacter.name, appearance);
    setScreen('classChoice');
  };

  return (
    <div className="min-h-screen px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <motion.header className="mb-6 text-center" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
          <Palette className="mx-auto mb-2 h-8 w-8 text-amber-400" />
          <p className="fantasy-heading text-xs uppercase tracking-[0.22em] text-amber-200/60">Shape your vessel</p>
          <h2 className="fantasy-title mt-2 text-3xl text-amber-300 sm:text-4xl">Create Your Appearance</h2>
          <p className="fantasy-text mx-auto mt-2 max-w-xl text-sm text-amber-200/60">Build a character from aligned pixel-art layers. Every choice can be replaced independently.</p>
        </motion.header>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.section className="panel-fantasy p-5 sm:p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-amber-400" />
              <h3 className="fantasy-heading text-sm text-amber-200">Live Composite</h3>
            </div>
            <PixelPreview appearance={appearance} />
            <p className="fantasy-text mt-4 text-center text-xs text-amber-200/55">{pendingCharacter.name}</p>
            <p className="fantasy-text mt-2 text-center text-[11px] text-amber-200/40">Layered illustrated RPG preview</p>
          </motion.section>

          <motion.section className="panel-fantasy space-y-5 p-5 sm:p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div>
              <p className="fantasy-heading mb-2 text-xs text-amber-200/75">Body</p>
              <div className="grid grid-cols-3 gap-2">
                {(['Male', 'Female', 'NonBinary'] as const).map((gender) => (
                  <button key={gender} type="button" onClick={() => updateAppearance({ gender })} className={`rounded border px-2 py-2 text-xs fantasy-heading transition-colors ${appearance.gender === gender ? 'border-amber-400/70 bg-amber-400/15 text-amber-300' : 'border-amber-400/15 bg-black/20 text-amber-200/60 hover:border-amber-400/45'}`}>
                    {gender === 'NonBinary' ? 'Other' : gender}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Swatches label="Skin Palette" colors={SKIN_TONES} value={appearance.skinTone} onChange={(skinTone) => updateAppearance({ skinTone })} />
              <Swatches label="Eye Palette" colors={EYE_COLORS} value={appearance.eyeColor} onChange={(eyeColor) => updateAppearance({ eyeColor })} />
              <Swatches label="Hair Palette" colors={HAIR_COLORS} value={appearance.hairColor} onChange={(hairColor) => updateAppearance({ hairColor })} />
              <Swatches label="Shirt Palette" colors={OUTFIT_COLORS} value={appearance.outfitColor} onChange={(outfitColor) => updateAppearance({ outfitColor })} />
            </div>

            <div>
              <p className="fantasy-heading mb-2 text-xs text-amber-200/75">Hair Front</p>
              <AssetChoices category="hairFront" value={appearance.hairId} onChange={(asset) => updateAppearance({ hairId: asset.id })} />
            </div>

            <div>
              <p className="fantasy-heading mb-2 text-xs text-amber-200/75">Eye Shape</p>
              <AssetChoices category="eyes" value={appearance.eyesId} onChange={(asset) => updateAppearance({ eyesId: asset.id })} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div><p className="fantasy-heading mb-2 text-xs text-amber-200/75">Eyebrows</p><AssetChoices category="eyebrows" value={appearance.eyebrowsId} onChange={(asset) => updateAppearance({ eyebrowsId: asset.id })} /></div>
              <div><p className="fantasy-heading mb-2 text-xs text-amber-200/75">Expression</p><AssetChoices category="expression" value={appearance.expressionId} onChange={(asset) => updateAppearance({ expressionId: asset.id })} /></div>
              <div><p className="fantasy-heading mb-2 text-xs text-amber-200/75">Top</p><AssetChoices category="shirt" value={appearance.shirtId} onChange={(asset) => updateAppearance({ shirtId: asset.id })} /></div>
              <div><p className="fantasy-heading mb-2 text-xs text-amber-200/75">Bottom</p><AssetChoices category="pants" value={appearance.pantsId} onChange={(asset) => updateAppearance({ pantsId: asset.id })} /></div>
              <div><p className="fantasy-heading mb-2 text-xs text-amber-200/75">Shoes</p><AssetChoices category="shoes" value={appearance.shoesId} onChange={(asset) => updateAppearance({ shoesId: asset.id })} /></div>
              <div><p className="fantasy-heading mb-2 text-xs text-amber-200/75">Headwear</p><AssetChoices category="headwear" value={appearance.headwearId} onChange={(asset) => updateAppearance({ headwearId: asset.id })} /></div>
              <div><p className="fantasy-heading mb-2 text-xs text-amber-200/75">Accessories</p><AssetChoices category="accessory" value={appearance.accessoryId} onChange={(asset) => updateAppearance({ accessoryId: asset.id })} /></div>
            </div>

            <div className="flex items-center justify-end border-t border-amber-200/10 pt-4">
              <button type="button" onClick={continueToClassPaths} className="btn-fantasy flex items-center gap-2 rounded px-5 py-3 text-sm">
                Continue <Shirt className="h-4 w-4" /> <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
