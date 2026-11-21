/**
 * Venue series, part B: floral grotto on water, spot-lit easel gallery, olive
 * velvet arches, moonlit modern arcade, theatre envelope reveal and the ivory
 * ballroom with its ribboned gate.
 */
import * as THREE from 'three';
import { BuiltScene, ScenePalette, blossoms, glow, gold, ground, tree, v3 } from '../scene-kit';
import { chandelier } from './hall';
import {
  archFrame,
  candle,
  couple,
  drape,
  fabric,
  flicker,
  globeLamp,
  glassSlab,
  invitationPanel,
  mirror,
  swag,
} from './venue-kit';

const ramp = (p: number, from: number, to: number) => Math.max(0, Math.min(1, (p - from) / (to - from)));
const WHITES = ['#ffffff', '#f6f1ea', '#efe6da', '#e8dccb', '#fbf8f3'];

/** Spot light aimed at a point (the target is added to the scene too). */
function spot(root: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3, intensity = 80, angle = 0.38): THREE.SpotLight {
  const light = new THREE.SpotLight('#fff0d8', intensity, 22, angle, 0.6, 1.4);
  light.position.copy(from);
  light.target.position.copy(to);
  root.add(light, light.target);
  return light;
}

// ---------------------------------------------------------------------------
// 8 · Floral grotto over still water (white flower arches, twin tablets)
// ---------------------------------------------------------------------------
export function buildGrotto(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const water = mirror(90, 90, '#aab9c8', '#e8e2d8', 0.22);
  water.group.position.set(0, 0, -10);
  root.add(water.group);

  const walk = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 34), new THREE.MeshStandardMaterial({ color: '#f4efe7', roughness: 0.4 }));
  walk.position.set(0, 0.1, -6);
  root.add(walk);

  // Six flower-covered arches the guests pass under.
  for (let i = 0; i < 6; i++) {
    const z = 8 - i * 4.2;
    root.add(blossoms(520, WHITES, 0.24, (_, r) => {
      const a = r() * Math.PI;
      const radius = 5.2 + (r() - 0.5) * 1.4;
      return v3(Math.cos(a) * radius, Math.sin(a) * radius * 1.15, z + (r() - 0.5) * 1.6);
    }, 80 + i));
    const c = chandelier(p);
    c.scale.setScalar(0.7);
    c.position.set(0, 5.1, z);
    root.add(c);
  }
  // Flower bank in front of the tablets.
  root.add(blossoms(700, WHITES, 0.22, (_, r) => v3((r() - 0.5) * 7, 0.2 + r() * 0.7, -17.6 + (r() - 0.5) * 1.2), 88));

  const paper = { paper: '#f6f1ea', ink: '#3f3934', accent: '#a88f68' } as const;
  const left = invitationPanel(p, 1.9, 3.6, 'round', { ...paper, layout: 'monogram' });
  const right = invitationPanel(p, 1.9, 3.6, 'round', { ...paper, layout: 'full' });
  left.position.set(-1.02, 0.2, -18.6);
  right.position.set(1.02, 0.2, -18.6);
  root.add(left, right);
  for (const x of [-1.02, 1.02]) {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(2.02, 3.0, 0.14),
      new THREE.MeshStandardMaterial({ color: '#e9e2d6', roughness: 0.35 }),
    );
    slab.position.set(x, 1.6, -18.7);
    root.add(slab, archFrame('round', 1.9, 3.6, 0.07, 0.16, new THREE.MeshStandardMaterial({ color: '#efe8dc', roughness: 0.3 })).translateX(x).translateY(0.2).translateZ(-18.68));
  }

  return {
    root,
    sky: ['#9db6d6', '#c9d5e4', '#f2ebe1'],
    light: { key: 0.9, hemi: 1.1, exposure: 1.0, fog: [40, 140], bloom: 2.4 },
    cameraPosition: v3(0, 1.9, 15),
    cameraTarget: v3(0, 2.2, -18),
    journey: {
      positions: [v3(0, 1.9, 15), v3(0, 1.9, 6), v3(0, 2, -4), v3(0, 2.1, -12), v3(0, 2.1, -14.4)],
      targets: [v3(0, 2.6, -18), v3(0, 2.6, -18), v3(0, 2.3, -18.6), v3(0, 2.1, -18.6), v3(0, 2.1, -18.6)],
    },
    update() {},
    dispose: water.dispose,
  };
}

// ---------------------------------------------------------------------------
// 9 · Carved wooden gateway into a spot-lit gallery of invitation easels
// ---------------------------------------------------------------------------
export function buildEaselGallery(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const linen = fabric('#e7d9c3', 0.55);
  const wood = new THREE.MeshStandardMaterial({ color: '#5a3820', roughness: 0.55 });
  const brass = gold(p, 0.3);
  root.add(ground(120, '#d6c8b2', 0.35, 0.05));

  // Carved gateway with marigold-red garlands.
  const gate = archFrame('pointed', 3.2, 4.6, 0.9, 0.6, wood);
  gate.position.set(0, 0, 4);
  root.add(gate);
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 0.8), wood);
  lintel.position.set(0, 5.3, 4);
  root.add(lintel);
  root.add(blossoms(560, ['#9b1022', '#ffffff', '#c22a3c', '#f4d7a8'], 0.13, (i, r) => {
    if (i < 300) return v3((r() - 0.5) * 6, 5.65 + r() * 0.35, 4 + (r() - 0.5) * 0.8);
    const side = i % 2 ? -1 : 1;
    return v3(side * (2.6 + r() * 0.9), r() * 3.2, 4.6 + r() * 0.6);
  }, 91));
  for (const x of [-4, 4]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 0.6), wood);
    wing.position.set(x * 1.25, 3, 4);
    root.add(wing);
  }

  // Draped linen hall.
  for (const side of [-1, 1]) {
    const wall = drape(26, 8, linen, { folds: 22, depth: 0.2 });
    wall.rotation.y = (side * -Math.PI) / 2;
    wall.position.set(side * 6.5, 0, -8);
    root.add(wall);
  }
  const back = drape(14, 8, linen, { folds: 12, depth: 0.2 });
  back.position.set(0, 0, -19);
  root.add(back);

  // Three easels with framed invitations, each in its own pool of light.
  const easels: [number, number, number, 'monogram' | 'full' | 'names'][] = [
    [-3.4, -10, 0.45, 'monogram'],
    [0, -12.4, 0, 'full'],
    [3.4, -10, -0.45, 'names'],
  ];
  for (const [x, z, rot, layout] of easels) {
    const holder = new THREE.Group();
    holder.position.set(x, 0, z);
    holder.rotation.y = rot;
    const board = invitationPanel(p, 2, 2.9, 'rect', { paper: '#f8f3ea', ink: '#3b332b', accent: '#b29a70', layout });
    board.position.set(0, 1.1, 0.06);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.16, 3.06, 0.08), brass);
    frame.position.set(0, 2.55, 0);
    holder.add(frame, board);
    for (const lx of [-0.7, 0.7]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6, 8), wood);
      leg.position.set(lx, 1.25, -0.2);
      leg.rotation.x = 0.12;
      holder.add(leg);
    }
    // Draped pedestal with white flowers beside each easel.
    const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.3, 24), linen);
    urn.position.set(1.5, 0.65, 0.3);
    holder.add(urn, blossoms(120, WHITES, 0.12, (_, r) => v3(1.5 + (r() - 0.5) * 0.8, 1.4 + r() * 0.5, 0.3 + (r() - 0.5) * 0.6), 92));
    root.add(holder);
    spot(root, v3(x, 7.5, z + 3), v3(x, 2.4, z), 90, 0.33);
  }

  return {
    root,
    sky: ['#17110c', '#261d15', '#33281d'],
    light: { key: 0.1, hemi: 0.6, exposure: 1.15, fog: [18, 60], bloom: 2.2 },
    cameraPosition: v3(0, 1.8, 13),
    cameraTarget: v3(0, 2.4, -12),
    journey: {
      positions: [v3(0, 1.8, 13), v3(0, 1.8, 6.5), v3(-0.6, 1.8, -2), v3(0, 1.9, -6.6)],
      targets: [v3(0, 2.4, -12), v3(0, 2.4, -12), v3(-2, 2.4, -10), v3(0, 2.5, -12.4)],
    },
    update() {},
  };
}

// ---------------------------------------------------------------------------
// 10 · Olive velvet arches (curtained arcades, peonies, glowing monogram)
// ---------------------------------------------------------------------------
export function buildVelvetArches(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const velvet = fabric('#6b6a2c', 0.5);
  const plaster = new THREE.MeshStandardMaterial({ color: '#4a4820', roughness: 0.7 });
  const brass = gold(p, 0.3);
  root.add(ground(120, '#33331a', 0.2, 0.3));

  for (let i = 0; i < 6; i++) {
    const z = 4 - i * 4;
    for (const side of [-1, 1]) {
      const bay = new THREE.Group();
      bay.position.set(side * 4.6, 0, z);
      bay.rotation.y = (side * -Math.PI) / 2;
      bay.add(archFrame('round', 2.8, 5, 0.6, 0.5, plaster));
      const l = drape(1.6, 5, velvet, { gather: 'left', folds: 6, depth: 0.08 });
      const r = drape(1.6, 5, velvet, { gather: 'right', folds: 6, depth: 0.08 });
      l.position.set(-0.7, 0, -0.1);
      r.position.set(0.7, 0, -0.1);
      bay.add(l, r);
      bay.add(blossoms(90, ['#f2b7c4', '#f7d3da', '#ffffff', '#e48aa1'], 0.14, (_, rr) => v3((rr() - 0.5) * 1.6, 0.4 + rr() * 0.5, 0.5 + rr() * 0.4), 100 + i));
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.45, 20), brass);
      pot.position.set(0, 0.22, 0.7);
      bay.add(pot);
      root.add(bay);
    }
    // Pendant lamp over the aisle.
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.4, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#d9c98a', emissive: '#ffd98a', emissiveIntensity: 3, side: THREE.DoubleSide }));
    shade.position.set(0, 5.4, z);
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 3, 6), brass);
    cord.position.set(0, 7.1, z);
    root.add(shade, cord);
    if (i % 2 === 0) {
      const light = new THREE.PointLight('#ffd58a', 16, 10, 1.6);
      light.position.set(0, 4.8, z);
      root.add(light);
    }
  }

  // Floating glowing monogram mid-aisle.
  const monogram = invitationPanel(p, 2.2, 2.2, 'rect', { paper: 'glass', ink: '#fff3cf', accent: '#ffe7a8', layout: 'monogram', border: false });
  monogram.position.set(0, 1.4, -6);
  root.add(monogram);

  // End arch with velvet curtains and the glass invitation.
  const endWall = new THREE.Mesh(new THREE.BoxGeometry(12, 9, 0.5), plaster);
  endWall.position.set(0, 4.5, -21);
  root.add(endWall, archFrame('round', 3.4, 6, 0.6, 0.6, plaster).translateZ(-20.6));
  const l = drape(2, 6, velvet, { gather: 'left', folds: 7, depth: 0.1 });
  const r = drape(2, 6, velvet, { gather: 'right', folds: 7, depth: 0.1 });
  l.position.set(-0.8, 0, -20.4);
  r.position.set(0.8, 0, -20.4);
  root.add(l, r);
  const panel = invitationPanel(p, 2.3, 3.9, 'round', { paper: '#26260f', ink: '#f3ecd0', accent: '#e2cf86' });
  panel.position.set(0, 0.3, -19.36);
  const slab = glassSlab('round', 2.3, 3.9);
  slab.position.set(0, 0.3, -19.4);
  root.add(slab, panel);
  const endLight = new THREE.PointLight('#ffe2a0', 8, 10, 1.6);
  endLight.position.set(0, 4.5, -16);
  root.add(endLight);

  return {
    root,
    sky: ['#11110a', '#1f1f10', '#2a2915'],
    light: { key: 0.15, hemi: 0.8, exposure: 1.2, fog: [16, 55], bloom: 2.2 },
    cameraPosition: v3(0, 1.8, 11),
    cameraTarget: v3(0, 2.2, -20),
    journey: {
      positions: [v3(0, 1.8, 11), v3(0, 1.8, 0), v3(0, 1.8, -3.2), v3(0, 1.9, -10), v3(0, 2.2, -15)],
      targets: [v3(0, 2, -6), v3(0, 1.9, -6), v3(0, 2.2, -20), v3(0, 2.3, -20), v3(0, 2.3, -20)],
    },
    update(t) {
      monogram.position.y = 1.4 + Math.sin(t * 1.2) * 0.08;
      monogram.rotation.y = Math.sin(t * 0.5) * 0.25;
    },
  };
}

// ---------------------------------------------------------------------------
// 11 · Moonlit modern arcade (globe lamps, mirror floor, the couple walking)
// ---------------------------------------------------------------------------
export function buildMoonArcade(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const stoneLight = new THREE.MeshStandardMaterial({ color: '#cfc3b3', roughness: 0.55 });
  const brass = gold(p, 0.35);
  const floor = mirror(40, 50, '#8d8a86', '#2a2622', 0.55);
  floor.group.position.set(0, 0, -6);
  root.add(floor.group);

  const runner = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 30), new THREE.MeshStandardMaterial({ color: '#f4f0e8', roughness: 0.9 }));
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, 0.012, -4);
  root.add(runner);

  // Back colonnade: five tall arches with black drapes behind.
  const dark = fabric('#121214', 0.6, 0.4);
  const backDrape = drape(26, 10, dark, { folds: 20, depth: 0.2 });
  backDrape.position.set(0, 0, -19.5);
  root.add(backDrape);
  for (let i = -2; i <= 2; i++) {
    const frame = archFrame('round', 2.6, 6.4, 0.55, 0.8, stoneLight);
    frame.position.set(i * 3.7, 0, -18);
    root.add(frame);
  }
  // Planters with white flowers, olive trees and globe lamps on both sides.
  for (let i = 0; i < 8; i++) {
    const z = 8 - i * 3.2;
    for (const side of [-1, 1]) {
      const planter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.2), new THREE.MeshStandardMaterial({ color: '#3a3632', roughness: 0.6 }));
      planter.position.set(side * 3.2, 0.25, z);
      root.add(planter);
      const lamp = globeLamp(2.4 + (i % 2) * 0.6, brass);
      lamp.position.set(side * 2.1, 0, z + 0.8);
      root.add(lamp);
      if (i % 2 === 0) {
        const olive = tree(2.4, '#5a6e3c', i + side * 7 + 20);
        olive.position.set(side * 3.2, 0.5, z);
        root.add(olive);
      }
    }
  }
  root.add(blossoms(1300, WHITES, 0.12, (i, r) => {
    const side = i % 2 ? -1 : 1;
    return v3(side * (3.2 + (r() - 0.5) * 1.3), 0.55 + r() * 0.3, 8 - r() * 25);
  }, 112));
  for (const z of [4, -6, -14]) {
    const light = new THREE.PointLight('#ffe8c2', 9, 12, 1.6);
    light.position.set(0, 3.4, z);
    root.add(light);
  }

  // The couple walking towards the arches (they move with the scroll).
  const { groom, bride } = couple(p, { suit: '#151517', gown: '#fbf8f2', veil: true, back: true });
  const pair = new THREE.Group();
  groom.position.x = -0.42;
  bride.position.x = 0.42;
  pair.add(groom, bride);
  root.add(pair);

  const panel = invitationPanel(p, 2.4, 4, 'round', { paper: 'glass', ink: '#f6f1e8', accent: '#dbc79e' });
  panel.position.set(0, 0.2, -14.96);
  const slab = glassSlab('round', 2.4, 4);
  slab.position.set(0, 0.2, -15);
  root.add(slab, panel);

  return {
    root,
    sky: ['#060608', '#0f0f13', '#18181d'],
    light: { key: 0.15, hemi: 0.7, exposure: 1.0, fog: [18, 60], bloom: 2.2 },
    cameraPosition: v3(0, 1.8, 13),
    cameraTarget: v3(0, 2.2, -16),
    journey: {
      positions: [v3(0, 1.8, 13), v3(1.2, 1.8, 6), v3(-1, 1.8, -2), v3(0, 2, -8.5), v3(0, 2.1, -10.6)],
      targets: [v3(0, 1.6, 0), v3(0, 1.4, -2), v3(0, 2.2, -15), v3(0, 2.3, -15), v3(0, 2.3, -15)],
    },
    update(t, _d, progress) {
      // The couple stroll ahead of the guests and stop beside the invitation.
      const walk = Math.min(1, progress * 1.4);
      pair.position.z = 3 - walk * 15;
      pair.position.x = walk > 0.85 ? (walk - 0.85) * -14 : 0;
      const step = walk < 1 && walk > 0 ? Math.sin(t * 6) * 0.025 : 0;
      groom.position.y = Math.abs(step);
      bride.position.y = Math.abs(step) * 0.6;
    },
    dispose: floor.dispose,
  };
}

// ---------------------------------------------------------------------------
// 12 · Theatre: red curtains part, a black-and-gold envelope opens on stage
// ---------------------------------------------------------------------------
export function buildTheatre(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const red = fabric('#8c0e16', 0.5);
  const brass = gold(p, 0.25);
  root.add(ground(80, '#2a140e', 0.3, 0.15));

  // Stage, back curtain, valance.
  const stage = new THREE.Mesh(new THREE.BoxGeometry(16, 1, 8), new THREE.MeshStandardMaterial({ color: '#3a1d12', roughness: 0.4 }));
  stage.position.set(0, 0.5, -6);
  root.add(stage);
  const back = drape(18, 11, red, { folds: 18, depth: 0.3 });
  back.position.set(0, 1, -9.8);
  root.add(back);
  for (let i = 0; i < 4; i++) root.add(swag(v3(-8 + i * 4, 10, -2.2), v3(-4 + i * 4, 10, -2.2), 1.2, 0.35, red));
  const left = drape(8.4, 10, red, { folds: 10, depth: 0.22 });
  const right = drape(8.4, 10, red, { folds: 10, depth: 0.22 });
  left.position.set(-4.2, 1, -2.4);
  right.position.set(4.2, 1, -2.4);
  root.add(left, right);
  for (const x of [-8.6, 8.6]) {
    const column = new THREE.Mesh(new THREE.BoxGeometry(1.2, 12, 1.2), new THREE.MeshStandardMaterial({ color: '#2a0c0e', roughness: 0.6 }));
    column.position.set(x, 6, -2.4);
    root.add(column);
  }

  // Pedestal + envelope (back, invitation card, front pocket, opening flap, wax seal).
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.6, 1.2), new THREE.MeshStandardMaterial({ color: '#101010', roughness: 0.4 }));
  pedestal.position.set(0, 1.8, -6);
  root.add(pedestal);
  const envelope = new THREE.Group();
  envelope.position.set(0, 2.6, -6);
  root.add(envelope);
  const black = new THREE.MeshStandardMaterial({ color: '#141214', roughness: 0.45, metalness: 0.2 });
  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.4, 0.03), black);
  backPanel.position.set(0, 1.2, -0.06);
  envelope.add(backPanel);
  const card = invitationPanel(p, 3, 4.2, 'rect', { paper: '#f7efe1', ink: '#3a2a22', accent: '#b8893a' });
  card.position.set(0, -3.35, 0);
  envelope.add(card);
  const pocket = new THREE.Shape();
  pocket.moveTo(-1.7, 0);
  pocket.lineTo(-1.7, 1.5);
  pocket.lineTo(0, 0.9);
  pocket.lineTo(1.7, 1.5);
  pocket.lineTo(1.7, 0);
  pocket.closePath();
  const pocketMesh = new THREE.Mesh(new THREE.ShapeGeometry(pocket), black);
  pocketMesh.position.z = 0.05;
  envelope.add(pocketMesh);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(3.44, 0.04, 0.04), brass);
  edge.position.set(0, 0.02, 0.06);
  envelope.add(edge);
  const hinge = new THREE.Group();
  hinge.position.set(0, 2.4, -0.03);
  const flapShape = new THREE.Shape();
  flapShape.moveTo(-1.7, 0);
  flapShape.lineTo(0, -1.4);
  flapShape.lineTo(1.7, 0);
  flapShape.closePath();
  const flap = new THREE.Mesh(new THREE.ShapeGeometry(flapShape), new THREE.MeshStandardMaterial({ color: '#1b181a', roughness: 0.4, metalness: 0.25, side: THREE.DoubleSide }));
  flap.position.z = 0.12;
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 32), new THREE.MeshStandardMaterial({ color: '#c7a14f', metalness: 0.9, roughness: 0.3 }));
  seal.rotation.x = Math.PI / 2;
  seal.position.set(0, -1.3, 0.16);
  hinge.add(flap, seal);
  envelope.add(hinge);

  const spotlight = spot(root, v3(0, 11, 4), v3(0, 3, -6), 140, 0.32);
  const glowBall = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glow('#ffd9a0', 3));
  glowBall.position.copy(spotlight.position);
  root.add(glowBall);

  return {
    root,
    sky: ['#110204', '#220407', '#30060b'],
    light: { key: 0.08, hemi: 0.5, exposure: 1.2, fog: [20, 60], bloom: 2.2 },
    cameraPosition: v3(0, 2.6, 12),
    cameraTarget: v3(0, 3.2, -6),
    journey: {
      positions: [v3(0, 2.6, 12), v3(0, 2.7, 6), v3(0, 3, 1.5), v3(0, 3.8, -1.2), v3(0, 4.4, -1.6)],
      targets: [v3(0, 4, -6), v3(0, 3.6, -6), v3(0, 3.6, -6), v3(0, 4.6, -6), v3(0, 5.2, -6)],
    },
    update(_t, _d, progress) {
      const open = ramp(progress, 0.05, 0.3);
      left.scale.x = right.scale.x = 1 - open * 0.7;
      left.position.x = -4.2 - open * 3;
      right.position.x = 4.2 + open * 3;
      hinge.rotation.x = -ramp(progress, 0.32, 0.52) * Math.PI * 1.02;
      card.position.y = -3.35 + ramp(progress, 0.52, 0.85) * 4.4;
    },
  };
}

// ---------------------------------------------------------------------------
// 13 · Ivory ballroom: floral aisle, couple, then a ribboned gate swings open
// ---------------------------------------------------------------------------
export function buildIvoryBallroom(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const ivory = new THREE.MeshStandardMaterial({ color: '#f3ebdf', roughness: 0.45 });
  const brass = gold(p, 0.25);
  const floor = mirror(40, 50, '#cfc6b9', '#efe6d8', 0.5);
  floor.group.position.set(0, 0, -6);
  root.add(floor.group);

  for (let i = 0; i < 7; i++) {
    const z = 10 - i * 4;
    for (const side of [-1, 1]) {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 6.5, 24), ivory);
      column.position.set(side * 6, 3.25, z);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.35, 0.4, 24), brass);
      cap.position.set(side * 6, 6.6, z);
      root.add(column, cap);
      // Reception table beyond the columns.
      if (i % 2 === 1) {
        const table = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 0.78, 32), fabric('#fbf7f0', 0.8, 0.5));
        table.position.set(side * 8.6, 0.39, z);
        const c = candle(0.35, 0.05);
        c.position.set(side * 8.6, 0.78, z);
        root.add(table, c, blossoms(40, WHITES, 0.07, (_, r) => v3(side * 8.6 + (r() - 0.5) * 0.4, 0.9 + r() * 0.2, z + (r() - 0.5) * 0.4), 130 + i));
      }
    }
    if (i < 6) root.add(swag(v3(-6, 6.4, z), v3(6, 6.4, z), 1.6, 0.25, fabric('#f6eee2', 0.5)));
  }
  for (const z of [7, 0, -7]) {
    const c = chandelier(p);
    c.position.set(0, 6.6, z);
    root.add(c);
  }
  // Floral aisle with hurricane candles.
  root.add(blossoms(1500, [...WHITES, '#f3dfe0'], 0.15, (i, r) => {
    const side = i % 2 ? -1 : 1;
    return v3(side * (1.7 + r() * 0.9), 0.2 + r() * 0.6, 10 - r() * 20);
  }, 131));
  for (let i = 0; i < 9; i++) {
    for (const side of [-1, 1]) {
      const c = candle(0.5, 0.06);
      c.position.set(side * 1.4, 0, 9.5 - i * 2.2);
      root.add(c);
    }
  }

  // The couple walking away down the aisle.
  const { groom, bride } = couple(p, { suit: '#131316', gown: '#fdfaf4', veil: true, back: true });
  const pair = new THREE.Group();
  groom.position.x = -0.42;
  bride.position.x = 0.42;
  pair.add(groom, bride);
  root.add(pair);

  // Ornate gate with a satin bow; behind it the invitation arch.
  const iron = new THREE.MeshStandardMaterial({ color: '#efe4cf', metalness: 0.7, roughness: 0.3 });
  const makeLeaf = (side: -1 | 1) => {
    const hinge = new THREE.Group();
    hinge.position.set(side * 1.8, 0, -11);
    const leaf = new THREE.Group();
    for (let k = 0; k < 7; k++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4, 8), iron);
      bar.position.set(-side * (0.1 + k * 0.27), 2, 0);
      leaf.add(bar);
    }
    for (const y of [0.15, 2, 3.9]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.07, 0.07), iron);
      rail.position.set(-side * 0.9, y, 0);
      leaf.add(rail);
    }
    for (let k = 0; k < 3; k++) {
      const scroll = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 8, 32), iron);
      scroll.position.set(-side * (0.35 + k * 0.55), 2.95, 0);
      leaf.add(scroll);
      const low = scroll.clone();
      low.position.y = 1.05;
      leaf.add(low);
    }
    // Half of the satin bow travels with each leaf.
    const satin = fabric('#f5eee4', 0.35);
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.1, 12, 32), satin);
    loop.scale.set(1.3, 0.8, 0.5);
    loop.position.set(-side * 1.55, 2.3, 0.12);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, 0.04), satin);
    tail.position.set(-side * 1.7, 1.6, 0.12);
    tail.rotation.z = side * 0.25;
    leaf.add(loop, tail);
    hinge.add(leaf);
    root.add(hinge);
    return hinge;
  };
  const gateL = makeLeaf(-1);
  const gateR = makeLeaf(1);
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), fabric('#f5eee4', 0.35));
  knot.position.set(0, 2.3, -10.86);
  root.add(knot);
  for (const x of [-2.1, 2.1]) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.6, 0.6), ivory);
    pier.position.set(x, 2.3, -11);
    root.add(pier);
  }
  root.add(blossoms(700, [...WHITES, '#e9d9c4'], 0.18, (_, r) => {
    const a = r() * Math.PI;
    return v3(Math.cos(a) * 2.4, 4.4 + Math.sin(a) * 1.4 + (r() - 0.5) * 0.4, -11 + (r() - 0.5) * 0.8);
  }, 132));

  const panel = invitationPanel(p, 2.6, 4.4, 'round', { paper: '#faf5ec', ink: '#4a3f33', accent: '#b89660' });
  panel.position.set(0, 0.2, -16);
  root.add(panel, archFrame('round', 2.6, 4.4, 0.16, 0.18, brass).translateY(0.2).translateZ(-16.02));
  root.add(blossoms(400, WHITES, 0.17, (_, r) => {
    const side = r() > 0.5 ? -1 : 1;
    return v3(side * (1.7 + r() * 0.8), 0.2 + r() * 3.2, -16 + (r() - 0.5) * 0.6);
  }, 133));
  const endLight = new THREE.PointLight('#fff0d6', 20, 10, 1.5);
  endLight.position.set(0, 3.5, -13);
  root.add(endLight);

  const flames = flicker(root);
  return {
    root,
    sky: ['#e6dccd', '#efe6da', '#f6efe5'],
    light: { key: 0.5, hemi: 1.0, exposure: 1.0, fog: [26, 80], bloom: 2 },
    cameraPosition: v3(0, 1.8, 14),
    cameraTarget: v3(0, 2.4, -11),
    journey: {
      positions: [v3(0, 1.8, 14), v3(0, 1.8, 6), v3(0, 1.8, -2), v3(0, 1.9, -8), v3(0, 2.1, -11.6)],
      targets: [v3(0, 2.2, -11), v3(0, 2, -11), v3(0, 2.4, -11), v3(0, 2.4, -16), v3(0, 2.4, -16)],
    },
    update(t, _d, progress) {
      flames(t);
      const walk = Math.min(1, progress * 1.6);
      pair.position.z = 3 - walk * 11;
      pair.position.x = 0;
      const bob = walk > 0 && walk < 1 ? Math.abs(Math.sin(t * 6)) * 0.025 : 0;
      groom.position.y = bob;
      bride.position.y = bob * 0.6;
      // Couple steps aside before the gate opens.
      if (walk >= 1) pair.position.x = Math.min(1, (progress - 0.625) * 4) * -2.8;
      const open = ramp(progress, 0.6, 0.82) * 1.7;
      gateL.rotation.y = open;
      gateR.rotation.y = -open;
      knot.visible = open < 0.05; // the bow unties as the gate opens
    },
    dispose: floor.dispose,
  };
}
