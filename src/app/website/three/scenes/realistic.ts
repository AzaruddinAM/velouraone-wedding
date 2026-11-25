/**
 * Realistic series (W106 …): real-world HDR photos for light and backdrop,
 * physically based floors and fabrics, and real 3D furniture, chandeliers and
 * lanterns (CC0 GLB models). Every walk-through ends at an ornate gilded frame
 * holding the couple's invitation.
 */
import * as THREE from 'three';
import { HdriName, ModelName, Placement, SurfaceName, place, surface } from '../assets';
import { BuiltScene, ScenePalette, blossoms, v3 } from '../scene-kit';
import { PanelStyle, drape, invitationPanel } from './venue-kit';

const FLOWERS = ['#ffffff', '#fbeef0', '#f4d3da', '#fff4e3', '#efe2d0'];

interface Ceremony {
  hdri: HdriName;
  background?: boolean;
  blur?: number;
  rotation?: number;
  envIntensity?: number;
  backgroundIntensity?: number;
  floor: SurfaceName;
  floorRepeat?: number;
  floorTint?: string;
  runnerTint?: string;
  seats: 'chairs' | 'benches' | 'none';
  /** Hanging lights above the aisle. */
  chandelier?: ModelName;
  /** Lights standing beside the aisle. */
  aisleLights?: { model: ModelName; scale: number; glowY: number };
  /** Back of the stage: velvet drape colour (or none). */
  backdrop?: string;
  sofa?: boolean;
  plants?: boolean;
  vases?: ModelName;
  sky: readonly [string, string, string];
  light?: BuiltScene['light'];
  panel: { paper: string; ink: string; accent: string };
  extra?: (root: THREE.Group, jobs: Promise<unknown>[]) => void;
}

/** Lamp glass glows softly instead of flaring (keeps lamps below the bloom threshold). */
function softGlow(lamp: THREE.Object3D): void {
  lamp.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const m = mesh.material as THREE.MeshStandardMaterial | undefined;
    if (mesh.isMesh && m?.emissive && m.emissive.getHex() !== 0) {
      mesh.material = m.clone();
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.min(m.emissiveIntensity, 1.6);
    }
  });
}

/** Ornate gilded frame on an easel with the invitation inside. */
function framedInvitation(root: THREE.Group, p: ScenePalette, z: number, style: PanelStyle, jobs: Promise<unknown>[], x = 0, rotY = 0): void {
  const holder = new THREE.Group();
  holder.position.set(x, 0, z);
  holder.rotation.y = rotY;
  root.add(holder);
  const scale = 4.6;
  const centerY = 2.05;
  jobs.push(
    place(holder, 'ornate_mirror_01', [{ at: [0, centerY, 0], scale }]).then(([mirror]) =>
      // Antique-mirror finish: an even soft sheen, so chandeliers and lamps never flare in the glass.
      mirror.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const m = (mesh.material as THREE.MeshStandardMaterial).clone();
        m.roughnessMap = null;
        m.roughness = 0.34;
        // Slightly smoked antique glass: lets the lettering stand out.
        m.color.multiplyScalar(0.72);
        m.envMapIntensity = 0.55;
        m.userData = { perScene: true };
        mesh.material = m;
      }),
    ),
  );
  // The invitation is written straight onto the mirror glass (no card), with a soft glow behind the letters.
  const glass = invitationPanel(p, 0.38 * scale, 0.64 * scale, 'round', { ...style, paper: 'glass', border: false, halo: style.paper });
  glass.position.set(0, centerY - 0.36 * scale, 0.17);
  holder.add(glass);
  // Easel legs.
  const wood = new THREE.MeshStandardMaterial({ color: '#4a3020', roughness: 0.6 });
  for (const lx of [-0.55, 0.55]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 2.2, 10), wood);
    leg.position.set(lx, 1.05, -0.25);
    leg.rotation.x = 0.14;
    holder.add(leg);
  }
  const back = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 2.4, 10), wood);
  back.position.set(0, 1.1, -0.6);
  back.rotation.x = -0.32;
  holder.add(back);
}

/** Shared ceremony layout: floor, aisle, seating, lights, stage and the framed invitation. */
function ceremony(p: ScenePalette, c: Ceremony): BuiltScene {
  const root = new THREE.Group();
  const jobs: Promise<unknown>[] = [];

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), surface(c.floor, c.floorRepeat ?? 24, c.floorTint));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);
  // Ivory satin runner: the satin's weave (normal + roughness maps) with our own colour.
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 19), surface('crepe_satin', 3, c.runnerTint ?? '#f3ece2', { map: null, sheen: 0.8, sheenColor: new THREE.Color('#ffffff') }));
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, 0.006, -2.5);
  root.add(runner);

  // Guests' seating on both sides of the aisle (facing the stage).
  const seats: Placement[] = [];
  for (let row = 0; row < 6; row++) {
    const z = 5 - row * 1.7;
    if (c.seats === 'chairs') for (const x of [1.4, 2.0, 2.6]) for (const s of [-1, 1]) seats.push({ at: [s * x, 0, z], rotY: Math.PI });
    if (c.seats === 'benches') for (const s of [-1, 1]) seats.push({ at: [s * 1.9, 0, z], rotY: Math.PI });
  }
  if (c.seats !== 'none') jobs.push(place(root, c.seats === 'chairs' ? 'dining_chair_02' : 'painted_wooden_bench', seats));
  // Flowers on the aisle ends.
  root.add(blossoms(900, FLOWERS, 0.07, (i, r) => {
    const side = i % 2 ? -1 : 1;
    const row = Math.floor(r() * 6);
    return v3(side * (1.02 + r() * 0.16), 0.5 + r() * 0.35, 5.2 - row * 1.7 + (r() - 0.5) * 0.2);
  }, 301));
  if (c.vases) {
    const vases: Placement[] = [];
    for (let row = 0; row < 6; row++) for (const s of [-1, 1]) vases.push({ at: [s * 1.1, 0, 5.2 - row * 1.7], scale: 0.75 });
    jobs.push(place(root, c.vases, vases));
  }

  if (c.chandelier) {
    jobs.push(place(root, c.chandelier, [-1, 4.5, 10].map((z) => ({ at: [0, 5.2, 5 - z] as [number, number, number], scale: 1.9 }))));
    for (const z of [6, -5.5]) {
      const light = new THREE.PointLight('#ffdcae', 14, 14, 1.6);
      light.position.set(0, 3.6, z);
      root.add(light);
    }
  }
  if (c.aisleLights) {
    const { model, scale, glowY } = c.aisleLights;
    const lamps: Placement[] = [];
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) lamps.push({ at: [s * 3.4, 0, 5 - i * 3.4], scale });
    jobs.push(place(root, model, lamps).then((copies) => copies.forEach(softGlow)));
    for (let i = 0; i < 4; i += 2) {
      const light = new THREE.PointLight('#ffc98a', 4, 9, 1.8);
      light.position.set(0, Math.max(glowY, 1.6), 5 - i * 3.4);
      root.add(light);
    }
  }

  // Stage with velvet backdrop and the couple's sofa.
  const stage = new THREE.Mesh(new THREE.BoxGeometry(8, 0.35, 3.4), surface(c.floor, 3, c.floorTint));
  stage.position.set(0, 0.175, -14.2);
  stage.receiveShadow = true;
  root.add(stage);
  if (c.backdrop) {
    const velvet = surface('velour_velvet', 4, c.backdrop, { map: null, side: THREE.DoubleSide, sheen: 1, sheenColor: new THREE.Color('#ffffff'), sheenRoughness: 0.5 });
    const back = drape(9, 5.6, velvet, { folds: 14, depth: 0.14 });
    back.position.set(0, 0.35, -15.8);
    root.add(back);
    for (const s of [-1, 1]) {
      const side = drape(2.2, 5.6, velvet, { folds: 6, depth: 0.12, gather: s < 0 ? 'left' : 'right' });
      side.position.set(s * 3.6, 0.35, -15.5);
      root.add(side);
    }
  }
  if (c.sofa) jobs.push(place(root, 'chinese_sofa', [{ at: [0, 0.35, -15], scale: 1.05 }]));
  if (c.plants) jobs.push(place(root, 'potted_plant_02', [{ at: [-4.6, 0, -13], scale: 1.6 }, { at: [4.6, 0, -13], scale: 1.6 }, { at: [-3.2, 0, 7], scale: 1.4 }, { at: [3.2, 0, 7], scale: 1.4 }]));
  root.add(blossoms(900, FLOWERS, 0.09, (i, r) => {
    const side = i % 2 ? -1 : 1;
    return v3(side * (2.6 + r() * 1.4), 0.4 + r() * 0.5, -13 + (r() - 0.5) * 1);
  }, 302));

  framedInvitation(root, p, -11.4, c.panel, jobs);
  c.extra?.(root, jobs);

  return {
    root,
    sky: c.sky,
    hdri: { name: c.hdri, background: c.background ?? true, blur: c.blur, rotation: c.rotation, envIntensity: c.envIntensity, backgroundIntensity: c.backgroundIntensity },
    // Real photos contain the sun and bright windows: a very high glow threshold keeps them from flaring.
    light: { key: 0.7, hemi: 0.35, exposure: 1.0, fog: [90, 400], bloom: 8, ...c.light },
    ready: Promise.all(jobs),
    cameraPosition: v3(0, 1.7, 13),
    cameraTarget: v3(0, 2, -12),
    journey: {
      positions: [v3(0, 1.7, 13), v3(0, 1.7, 7), v3(-0.5, 1.7, 1), v3(0, 1.75, -4.5), v3(0, 1.85, -7.4)],
      targets: [v3(0, 2.2, -12), v3(0, 2.2, -12), v3(0, 2.1, -12), v3(0, 2, -11.4), v3(0, 1.85, -11.4)],
    },
    update() {},
  };
}

// ---------------------------------------------------------------------------
// The eight designs
// ---------------------------------------------------------------------------

export const buildRealBallroom = (p: ScenePalette) =>
  ceremony(p, {
    hdri: 'ballroom', floor: 'marble_tiles', floorRepeat: 10, seats: 'chairs', chandelier: 'Chandelier_03',
    backdrop: '#5c1020', sofa: true, plants: true, vases: 'brass_vase_01',
    sky: ['#3b2a20', '#5a4535', '#6e5643'], envIntensity: 1,
    panel: { paper: '#faf5ec', ink: '#3e3428', accent: '#a8843f' },
  });

export const buildRealTerrace = (p: ScenePalette) =>
  ceremony(p, {
    hdri: 'venice_sunset', floor: 'herringbone_parquet', floorRepeat: 16, seats: 'benches',
    aisleLights: { model: 'street_lamp_01', scale: 0.85, glowY: 3.2 }, plants: true, vases: 'ceramic_vase_01',
    sky: ['#6d7fa8', '#e5b68c', '#f2c79a'], rotation: Math.PI,
    panel: { paper: '#fbf4ea', ink: '#43352a', accent: '#b07a3c' },
  });

export const buildRealLanternNight = (p: ScenePalette) =>
  ceremony(p, {
    hdri: 'satara_night', floor: 'marble_tiles', floorRepeat: 10, floorTint: '#d8cfc4', seats: 'chairs',
    aisleLights: { model: 'Lantern_01', scale: 3, glowY: 0.6 }, backdrop: '#0f3d34', sofa: true, vases: 'brass_vase_01',
    sky: ['#05070f', '#0c1220', '#141a2a'], envIntensity: 0.9, backgroundIntensity: 1.3,
    light: { key: 0.25, hemi: 0.4, exposure: 1.15 },
    panel: { paper: '#0f3d34', ink: '#f4ead2', accent: '#e0bb63' },
    extra: (root, jobs) => {
      jobs.push(place(root, 'lantern_chandelier_01', [{ at: [-2.4, 5, -13.6], scale: 1.8 }, { at: [2.4, 5, -13.6], scale: 1.8 }]).then((c) => c.forEach(softGlow)));
      jobs.push(place(root, 'brass_diya_lantern', Array.from({ length: 10 }, (_, i) => ({ at: [(i % 2 ? -1 : 1) * 0.95, 0, 4.4 - Math.floor(i / 2) * 3.2] as [number, number, number], scale: 1.6 }))).then((c) => c.forEach(softGlow)));
      // Stage glow sits behind the mirror so it warms the velvet without flooding the glass.
      const glow = new THREE.PointLight('#ffb766', 10, 9, 1.6);
      glow.position.set(0, 3.8, -14.4);
      root.add(glow);
    },
  });

export const buildRealEsplanade = (p: ScenePalette) =>
  ceremony(p, {
    hdri: 'royal_esplanade', blur: 0.3, floor: 'marble_tiles', floorRepeat: 8, seats: 'chairs',
    aisleLights: { model: 'street_lamp_01', scale: 0.9, glowY: 3.3 }, vases: 'brass_vase_01', plants: true,
    sky: ['#8aa6c8', '#c7d3e0', '#e7e2d6'],
    panel: { paper: '#f8f3ea', ink: '#2f3a4a', accent: '#9b7a3e' },
  });

export const buildRealBay = (p: ScenePalette) =>
  ceremony(p, {
    hdri: 'golden_bay', floor: 'herringbone_parquet', floorRepeat: 14, floorTint: '#e8dccb', seats: 'benches',
    aisleLights: { model: 'vintage_oil_lamp', scale: 1.4, glowY: 1.1 }, vases: 'ceramic_vase_01',
    sky: ['#7fa7d0', '#c3d6e6', '#f0e1c4'], rotation: -Math.PI / 2, backgroundIntensity: 0.55, envIntensity: 0.5,
    light: { exposure: 0.6, key: 0.5 },
    panel: { paper: '#fffaf2', ink: '#264257', accent: '#c28d4a' },
  });

/** Velvet lounge: a closed room of velvet walls, wall mirrors, oil lamps and chandeliers. */
export function buildRealLounge(p: ScenePalette): BuiltScene {
  const scene = ceremony(p, {
    hdri: 'ballroom', background: false, floor: 'herringbone_parquet', floorRepeat: 14, seats: 'none', chandelier: 'Chandelier_01',
    backdrop: '#4b0f2a', sofa: true, sky: ['#1a0d12', '#24121a', '#2d1620'], envIntensity: 0.8,
    light: { key: 0.15, hemi: 0.3, exposure: 1.2, fog: [30, 90] },
    panel: { paper: '#2b0c1c', ink: '#f3e1cf', accent: '#d9b066' },
    extra: (root, jobs) => {
      const velvet = surface('velour_velvet', 6, '#5a1430', { map: null, side: THREE.DoubleSide, sheen: 1, sheenColor: new THREE.Color('#ffffff') });
      for (const s of [-1, 1]) {
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(34, 7), velvet);
        wall.rotation.y = (-s * Math.PI) / 2;
        wall.position.set(s * 6, 3.5, -2);
        root.add(wall);
        jobs.push(place(root, 'ornate_mirror_01', [-6, -1, 4].map((z) => ({ at: [s * 5.95, 2.4, z] as [number, number, number], scale: 3, rotY: (-s * Math.PI) / 2 }))));
      }
      // Lounge tables with oil lamps and chairs instead of rows.
      const tables: Placement[] = [];
      const lamps: Placement[] = [];
      const chairs: Placement[] = [];
      for (const [x, z] of [[-3.4, 4], [3.4, 4], [-3.4, -1.5], [3.4, -1.5], [-3.4, -7], [3.4, -7]]) {
        tables.push({ at: [x, 0, z] });
        lamps.push({ at: [x, 1.01, z] });
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
          chairs.push({ at: [x + Math.cos(a) * 1.15, 0, z + Math.sin(a) * 1.15], rotY: -a - Math.PI / 2 });
        }
      }
      jobs.push(place(root, 'round_wooden_table_01', tables), place(root, 'vintage_oil_lamp', lamps), place(root, 'dining_chair_02', chairs));
      for (const [x, z] of [[-3.4, 1], [3.4, -4]]) {
        const glow = new THREE.PointLight('#ffbf78', 6, 7, 1.8);
        glow.position.set(x, 1.6, z);
        root.add(glow);
      }
    },
  });
  return scene;
}

/** Cake salon: a centre table with a tiered strawberry cake beside the invitation. */
export const buildRealCake = (p: ScenePalette) =>
  ceremony(p, {
    hdri: 'ballroom', blur: 0.25, floor: 'marble_tiles', floorRepeat: 10, seats: 'none', chandelier: 'Chandelier_02',
    backdrop: '#e9d9c8', plants: true, sky: ['#3b2a20', '#5a4535', '#6e5643'],
    panel: { paper: '#fdf6f2', ink: '#4a2f33', accent: '#c06a7d' },
    extra: (root, jobs) => {
      const cloth = surface('crepe_satin', 2, '#fbf4ee');
      const table = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.05, 0.9, 48), cloth);
      table.position.set(-1.9, 0.45, -10.8);
      root.add(table);
      // Three tiers: real cake model, scaled per tier.
      jobs.push(place(root, 'strawberry_chocolate_cake', [
        { at: [-1.9, 0.9, -10.8], scale: 3.4 },
        { at: [-1.9, 1.17, -10.8], scale: 2.5 },
        { at: [-1.9, 1.37, -10.8], scale: 1.6 },
      ]));
      jobs.push(place(root, 'Lantern_01', [-0.55, 0.55].map((dx) => ({ at: [-1.9 + dx, 0.9, -10.3] as [number, number, number], scale: 1.4 }))));
      const tables: Placement[] = [];
      const chairs: Placement[] = [];
      for (const [x, z] of [[-3.6, 3], [3.6, 3], [-3.6, -2.5], [3.6, -2.5]]) {
        tables.push({ at: [x, 0, z] });
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
          chairs.push({ at: [x + Math.cos(a) * 1.15, 0, z + Math.sin(a) * 1.15], rotY: -a - Math.PI / 2 });
        }
      }
      jobs.push(place(root, 'round_wooden_table_01', tables), place(root, 'dining_chair_02', chairs));
      const spot = new THREE.SpotLight('#fff1dd', 50, 14, 0.5, 0.6, 1.4);
      spot.position.set(-1.9, 6, -7);
      spot.target.position.set(-1.9, 1, -10.8);
      root.add(spot, spot.target);
    },
  });

/** Golden frame gallery: three framed invitations on easels under chandeliers. */
export const buildRealGallery = (p: ScenePalette) =>
  ceremony(p, {
    hdri: 'ballroom', blur: 0.45, floor: 'herringbone_parquet', floorRepeat: 16, seats: 'none', chandelier: 'Chandelier_02',
    plants: true, vases: 'brass_vase_01', sky: ['#3b2a20', '#5a4535', '#6e5643'],
    panel: { paper: '#f9f3e8', ink: '#3a3026', accent: '#a5833f' },
    extra: (root, jobs) => {
      const style = { paper: '#f9f3e8', ink: '#3a3026', accent: '#a5833f' };
      framedInvitation(root, p, -9.6, { ...style, layout: 'monogram' }, jobs, -3.1, 0.45);
      framedInvitation(root, p, -9.6, { ...style, layout: 'names' }, jobs, 3.1, -0.45);
    },
  });
