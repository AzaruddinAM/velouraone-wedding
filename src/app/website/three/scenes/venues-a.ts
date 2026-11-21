/**
 * Venue series, part A: moonlit palace stairs, portal valley, floral door,
 * gothic rose corridor, pearl & satin, storybook waterfall, mirror hall.
 * Every walk-through ends in front of an invitation panel with the couple's names.
 */
import * as THREE from 'three';
import { BuiltScene, ScenePalette, blossoms, glow, gold, ground, halo, makeLantern, seeded, starField, stringLights, tree, v3 } from '../scene-kit';
import { chandelier } from './hall';
import {
  archFrame,
  candle,
  cloud,
  couple,
  drape,
  fabric,
  flicker,
  flowTexture,
  invitationPanel,
  mirror,
  pearls,
  roundArch,
  swag,
} from './venue-kit';

const ramp = (p: number, from: number, to: number) => Math.max(0, Math.min(1, (p - from) / (to - from)));
const ROSES = ['#8e1525', '#b3263a', '#ffffff', '#f6d7dc'];

// ---------------------------------------------------------------------------
// 1 · Moonlit palace stairs (night, red carpet, chhatri pavilion, curtains part)
// ---------------------------------------------------------------------------
export function buildMoonStairs(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const marble = new THREE.MeshStandardMaterial({ color: '#efe3cc', roughness: 0.35, metalness: 0.05 });
  const carpet = new THREE.MeshStandardMaterial({ color: '#7d0f1d', roughness: 0.9 });
  const brass = gold(p, 0.25);

  root.add(ground(160, '#cdb995', 0.6));
  root.add(starField(500, 140, '#ffffff', 0.55, 4));
  const moon = new THREE.Mesh(new THREE.SphereGeometry(3.2, 32, 32), glow('#fff4d6', 1.6));
  moon.position.set(-22, 30, -80);
  const moonHalo = halo('#fff1cc', 26);
  moonHalo.position.copy(moon.position).add(v3(0, 0, -1));
  root.add(moon, moonHalo);

  // Grand staircase (24 steps) with a red carpet.
  const steps = 24;
  const rise = 0.25;
  const run = 0.66;
  for (let i = 0; i < steps; i++) {
    const h = (i + 1) * rise;
    const z = 4 - i * run;
    const step = new THREE.Mesh(new THREE.BoxGeometry(9, h, run), marble);
    step.position.set(0, h / 2, z);
    const runner = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, run), carpet);
    runner.position.set(0, h + 0.01, z);
    root.add(step, runner);
    if (i % 3 === 0) {
      for (const x of [-4.2, 4.2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), marble);
        post.position.set(x, h + 0.45, z);
        const c = candle(0.3, 0.07);
        c.position.set(x, h + 0.9, z);
        root.add(post, c);
      }
    }
  }
  // Roses and white blooms spilling along both sides of the stairs.
  root.add(
    blossoms(700, ROSES, 0.12, (i, r) => {
      const side = i % 2 ? -1 : 1;
      const k = r() * steps;
      return v3(side * (3.6 + r() * 0.9), (k + 1) * rise + 0.15 + r() * 0.35, 4 - k * run);
    }, 11),
  );

  // Upper terrace and the domed pavilion (chhatri).
  const topY = steps * rise;
  const terrace = new THREE.Mesh(new THREE.BoxGeometry(16, topY, 12), marble);
  terrace.position.set(0, topY / 2, -17.6);
  root.add(terrace);
  const pavilion = new THREE.Group();
  pavilion.position.set(0, topY, -17.5);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 4.2, 16), marble);
    column.position.set(Math.cos(a) * 3.4, 2.1, Math.sin(a) * 3.4);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.22, 0.3, 16), brass);
    cap.position.set(column.position.x, 4.2, column.position.z);
    pavilion.add(column, cap);
  }
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 3.9, 0.5, 48), marble);
  ring.position.y = 4.5;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(3.6, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), marble);
  dome.scale.y = 0.9;
  dome.position.y = 4.75;
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.2, 16), brass);
  finial.position.y = 8.6;
  pavilion.add(ring, dome, finial);
  // Garland around the dome base.
  pavilion.add(blossoms(420, ROSES, 0.13, (_, r) => {
    const a = r() * Math.PI * 2;
    const droop = Math.abs(Math.sin(a * 4)) * 0.5;
    return v3(Math.cos(a) * 4.0, 4.3 - droop + r() * 0.2, Math.sin(a) * 4.0);
  }, 12));
  const warm = new THREE.PointLight('#ffcf8a', 9, 12, 1.8);
  warm.position.set(0, 3.2, 1.5);
  pavilion.add(warm);
  root.add(pavilion);

  // Maroon invitation arch with the couple standing at both sides.
  const panel = invitationPanel(p, 2.4, 3.9, 'round', { paper: '#5e0d1b', ink: '#f6dfc4', accent: '#e0b866' });
  panel.position.set(0, topY + 0.05, -20.2);
  const frame = archFrame('round', 2.4, 3.9, 0.16, 0.18, brass);
  frame.position.copy(panel.position).add(v3(0, 0, -0.02));
  const { groom, bride } = couple(p, { suit: '#efe2c8', gown: '#8e1a2a', gownTone: '#d7a74e', veil: true });
  groom.position.set(-1.72, topY, -19.6);
  bride.position.set(1.85, topY, -19.6);
  groom.rotation.y = 0.2;
  bride.rotation.y = -0.2;
  root.add(panel, frame, groom, bride);

  // Velvet curtains in front of the arch – they part as guests arrive.
  const velvet = fabric('#7a0f1e', 0.55);
  const left = drape(2.6, 4.6, velvet, { folds: 8, depth: 0.1 });
  const right = drape(2.6, 4.6, velvet, { folds: 8, depth: 0.1 });
  left.position.set(-1.3, topY, -16.4);
  right.position.set(1.3, topY, -16.4);
  root.add(left, right);

  const flames = flicker(root);
  return {
    root,
    sky: ['#050a22', '#111c45', '#27305f'],
    light: { key: 0.35, hemi: 0.9, exposure: 1.1 },
    cameraPosition: v3(0, 2.2, 18),
    cameraTarget: v3(0, 7, -17),
    journey: {
      positions: [v3(0, 2, 18), v3(0, 2.4, 9), v3(0, 4.3, -2), v3(0, 7.6, -11), v3(0, 7.7, -14.2)],
      targets: [v3(0, 7.5, -17), v3(0, 7, -17), v3(0, 8, -18), v3(0, 7.2, -20), v3(0, 6.9, -20.2)],
    },
    update(t, _d, progress) {
      flames(t);
      const open = ramp(progress, 0.55, 0.85);
      left.scale.x = right.scale.x = 1 - open * 0.75;
      left.position.x = -1.3 - open * 1.4;
      right.position.x = 1.3 + open * 1.4;
    },
  };
}

// ---------------------------------------------------------------------------
// 2 · Portal: a glowing rock tunnel that opens onto a mountain valley
// ---------------------------------------------------------------------------
export function buildPortal(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const random = seeded(21);
  root.add(ground(320, '#7fa65a', 0.95));

  // Tunnel: an uneven rock tube, hidden inside a grassy hill.
  const tube = new THREE.CylinderGeometry(3.3, 3.3, 26, 48, 40, true);
  const pos = tube.attributes['position'];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = 1 + Math.sin(y * 1.3 + x * 2) * 0.06 + Math.sin(y * 3.1 + z * 4) * 0.04 + (random() - 0.5) * 0.05;
    pos.setXYZ(i, x * n, y, z * n);
  }
  tube.computeVertexNormals();
  tube.rotateX(Math.PI / 2);
  const rock = new THREE.Mesh(tube, new THREE.MeshStandardMaterial({ color: '#6a5440', roughness: 1, side: THREE.BackSide, flatShading: true }));
  rock.position.y = 2.2;
  const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.MeshStandardMaterial({ color: '#6f9a4c', roughness: 1 }));
  hill.scale.set(18, 9, 12.6);
  root.add(rock, hill);
  // Fairy lights and flowers around the tunnel mouth.
  for (let i = 0; i < 6; i++) {
    const z = 10 - i * 4;
    root.add(stringLights(v3(-2.6, 4.2, z), v3(2.6, 4.2, z - 2), 0.6, 18, '#ffd89a'));
  }
  root.add(blossoms(520, ['#ffffff', '#f7c6d0', p.primary, '#ffe3a8', '#c8e0a0'], 0.16, (_, r) => {
    const a = r() * Math.PI * 2;
    const radius = 3.2 + r() * 0.6;
    return v3(Math.cos(a) * radius, 2.2 + Math.sin(a) * radius, -12.8 - r() * 0.6);
  }, 22));
  const lamp = new THREE.PointLight('#ffcf8a', 30, 14, 1.5);
  lamp.position.set(0, 3, 4);
  root.add(lamp);

  // The valley: lake, mountains, trees, sun.
  const lake = mirror(60, 26, '#8ab2cf', '#5f97b8', 0.3);
  lake.group.position.set(0, 0.03, -58);
  root.add(lake.group);
  const mountain = new THREE.MeshStandardMaterial({ color: '#5d6f7d', roughness: 1, flatShading: true });
  const snow = new THREE.MeshStandardMaterial({ color: '#f4f6f8', roughness: 0.8, flatShading: true });
  for (let i = 0; i < 9; i++) {
    const h = 26 + random() * 26;
    const r = 18 + random() * 14;
    const x = -80 + i * 20 + (random() - 0.5) * 8;
    const z = -110 - random() * 40;
    const peak = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), mountain);
    peak.position.set(x, h / 2 - 1, z);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.32, h * 0.32, 7), snow);
    cap.position.set(x, h - h * 0.16 - 0.8, z);
    root.add(peak, cap);
  }
  for (let i = 0; i < 34; i++) {
    const side = i % 2 ? -1 : 1;
    const t = tree(4 + random() * 3, i % 3 ? '#4f7a3a' : '#5f8c45', i + 3);
    t.position.set(side * (8 + random() * 26), 0, -18 - random() * 60);
    root.add(t);
  }
  const sun = halo('#fff1c4', 40);
  sun.position.set(30, 34, -170);
  root.add(sun);

  // Invitation standing in the meadow, framed by flowers, the couple beside it.
  const panel = invitationPanel(p, 2.6, 4, 'round', { paper: '#fbf6ec', ink: '#3d3a33', accent: p.accent });
  panel.position.set(0, 0.2, -36);
  const frame = archFrame('round', 2.6, 4, 0.16, 0.16, gold(p));
  frame.position.set(0, 0.2, -36.02);
  root.add(panel, frame);
  root.add(blossoms(380, ['#ffffff', '#f7c6d0', '#ffe3a8', p.primary], 0.14, (_, r) => {
    const a = r() * Math.PI;
    return v3(Math.cos(a) * 1.75, 2.9 + Math.sin(a) * 1.75 + (r() - 0.5) * 0.3, -36.1 + (r() - 0.5) * 0.3);
  }, 23));
  const { groom, bride } = couple(p, { suit: '#2d3a4a', gown: '#fbf6ef' });
  groom.position.set(-2, 0, -35.4);
  bride.position.set(2, 0, -35.4);
  root.add(groom, bride);

  return {
    root,
    sky: ['#6aa6df', '#b7d6ef', '#f1e3c9'],
    light: { fog: [70, 220], bloom: 2.4 },
    cameraPosition: v3(0, 1.9, 11),
    cameraTarget: v3(0, 2, -40),
    journey: {
      positions: [v3(0, 1.9, 11), v3(0, 1.9, 1), v3(0, 2, -12), v3(0, 2.2, -24), v3(0, 2.2, -30.5)],
      targets: [v3(0, 2.1, -40), v3(0, 2.1, -40), v3(0, 2.4, -40), v3(0, 2.3, -36), v3(0, 2.2, -36)],
    },
    update() {},
    dispose: lake.dispose,
  };
}

// ---------------------------------------------------------------------------
// 3 · Floral doorway: carved wooden doors swing open onto a flower garden
// ---------------------------------------------------------------------------
export function buildFloralDoor(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const random = seeded(31);
  const plaster = new THREE.MeshStandardMaterial({ color: '#efe5da', roughness: 0.85 });
  const wood = new THREE.MeshStandardMaterial({ color: '#6e4224', roughness: 0.55, metalness: 0.05 });
  const brass = gold(p, 0.3);

  root.add(ground(200, '#93b071', 0.95));
  const pavement = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), new THREE.MeshStandardMaterial({ color: '#d9cdbd', roughness: 0.8 }));
  pavement.rotation.x = -Math.PI / 2;
  pavement.position.set(0, 0.01, 6);
  root.add(pavement);

  // Wall with an arched doorway.
  const wallShape = new THREE.Shape();
  wallShape.moveTo(-16, 0);
  wallShape.lineTo(-16, 9);
  wallShape.lineTo(16, 9);
  wallShape.lineTo(16, 0);
  wallShape.closePath();
  wallShape.holes.push(new THREE.Path(roundArch(3.4, 5.2).getPoints(48)));
  const wall = new THREE.Mesh(new THREE.ExtrudeGeometry(wallShape, { depth: 0.8, bevelEnabled: false, curveSegments: 48 }), plaster);
  wall.position.z = -0.4;
  root.add(wall);

  // Flower arch around the doorway (lilac, blush, white and greenery).
  root.add(blossoms(900, ['#ffffff', '#f3c4d2', '#c9b3e6', '#e8a3b8', '#9fbf8a', '#fbe7ef'], 0.17, (i, r) => {
    if (i < 650) {
      const a = r() * Math.PI;
      const radius = 1.95 + r() * 0.7;
      return v3(Math.cos(a) * radius, 3.5 + Math.sin(a) * radius, 0.5 + r() * 0.5);
    }
    const side = i % 2 ? -1 : 1;
    return v3(side * (1.95 + r() * 0.7), r() * 3.6, 0.5 + r() * 0.5);
  }, 32));

  // Two doors on hinges (they open inwards with the scroll).
  const makeDoor = (side: -1 | 1) => {
    const hinge = new THREE.Group();
    hinge.position.set(side * -1.7, 0, -0.1);
    const half = new THREE.Shape();
    half.moveTo(0, 0);
    half.lineTo(0, 3.5);
    half.absarc(side * 1.7, 3.5, 1.7, side > 0 ? Math.PI : 0, Math.PI / 2, side > 0);
    half.lineTo(side * 1.7, 0);
    half.closePath();
    const leaf = new THREE.Mesh(new THREE.ExtrudeGeometry(half, { depth: 0.14, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, curveSegments: 32 }), wood);
    hinge.add(leaf);
    for (const [y, h] of [[0.4, 1.4], [2.1, 1.4]] as const) {
      const inset = new THREE.Mesh(new THREE.BoxGeometry(1.1, h, 0.06), new THREE.MeshStandardMaterial({ color: '#5a341b', roughness: 0.6 }));
      inset.position.set(side * 0.85, y + h / 2, 0.18);
      hinge.add(inset);
    }
    const knocker = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 24), brass);
    knocker.position.set(side * 1.45, 2.4, 0.22);
    hinge.add(knocker);
    hinge.traverse((o) => (o.castShadow = true));
    root.add(hinge);
    return hinge;
  };
  const leftDoor = makeDoor(1);
  const rightDoor = makeDoor(-1);

  // Garden behind the wall: path, flower beds, trees, lights, arbour.
  const path = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 26), new THREE.MeshStandardMaterial({ color: '#e6dccb', roughness: 0.9 }));
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.02, -13);
  root.add(path);
  root.add(blossoms(1100, ['#f3c4d2', '#c9b3e6', '#ffffff', '#f7e08a', '#e88aa6'], 0.14, (i, r) => {
    const side = i % 2 ? -1 : 1;
    return v3(side * (1.6 + r() * 2.4), 0.12 + r() * 0.35, -1.5 - r() * 22);
  }, 33));
  for (let i = 0; i < 16; i++) {
    const side = i % 2 ? -1 : 1;
    const t = tree(3.4 + random() * 2, '#6f9b55', i + 40);
    t.position.set(side * (5 + random() * 6), 0, -4 - random() * 22);
    root.add(t);
  }
  for (let i = 0; i < 3; i++) {
    const z = -4 - i * 5;
    root.add(stringLights(v3(-3.4, 3.6, z), v3(3.4, 3.6, z), 0.5, 12, '#ffe2a6'));
  }
  const panel = invitationPanel(p, 2.4, 3.9, 'round', { paper: '#f2eaf8', ink: '#4a3c63', accent: '#9a7cc6' });
  panel.position.set(0, 0.2, -22);
  root.add(panel, archFrame('round', 2.4, 3.9, 0.14, 0.14, brass).translateY(0.2).translateZ(-22.02));
  root.add(blossoms(450, ['#ffffff', '#c9b3e6', '#f3c4d2', '#9fbf8a'], 0.15, (_, r) => {
    const a = r() * Math.PI;
    return v3(Math.cos(a) * 1.9, 2.9 + Math.sin(a) * 1.9 + (r() - 0.5) * 0.3, -22.2 + (r() - 0.5) * 0.4);
  }, 34));

  return {
    root,
    sky: ['#d9c6e0', '#efe2ec', '#f8efe8'],
    light: { bloom: 2.4 },
    cameraPosition: v3(0, 1.8, 9),
    cameraTarget: v3(0, 2.6, 0),
    journey: {
      positions: [v3(0, 1.8, 9), v3(0, 1.8, 4.5), v3(0, 1.8, -1), v3(0, 1.8, -10), v3(0, 2, -17.6)],
      targets: [v3(0, 2.7, 0), v3(0, 2.5, -10), v3(0, 2.2, -20), v3(0, 2.2, -22), v3(0, 2.2, -22)],
    },
    update(_t, _d, progress) {
      const open = ramp(progress, 0.08, 0.32) * 1.85;
      leftDoor.rotation.y = open;
      rightDoor.rotation.y = -open;
    },
  };
}

// ---------------------------------------------------------------------------
// 4 · Gothic rose corridor (burgundy, candles, hanging lanterns)
// ---------------------------------------------------------------------------
export function buildGothicCorridor(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const stoneDark = new THREE.MeshStandardMaterial({ color: '#41161f', roughness: 0.7 });
  const brass = gold(p, 0.3);
  root.add(ground(120, '#260a11', 0.18, 0.35));
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 46), new THREE.MeshStandardMaterial({ color: '#6b0d1d', roughness: 0.9 }));
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, 0.01, -8);
  root.add(runner);

  const glassLamp = glow('#ffcf8a', 2.2);
  for (let i = 0; i < 10; i++) {
    const z = 6 - i * 3.2;
    const frame = archFrame('pointed', 4.6, 6.6, 0.5, 0.7, stoneDark);
    frame.position.z = z;
    root.add(frame);
    for (const x of [-2.8, 2.8]) {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 4.6, 16), stoneDark);
      column.position.set(x, 2.3, z);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.6), brass);
      cap.position.set(x, 4.66, z);
      root.add(column, cap);
      const c = candle(0.5 + (i % 3) * 0.15, 0.07);
      c.position.set(x * 0.82, 0, z + 0.6);
      root.add(c);
    }
    if (i % 2 === 0) {
      const lantern = makeLantern(brass, glassLamp);
      lantern.scale.setScalar(0.55);
      lantern.position.set(0, 5.2, z);
      root.add(lantern);
    }
  }
  // Side walls.
  for (const x of [-5, 5]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 9, 46), new THREE.MeshStandardMaterial({ color: '#2d0d14', roughness: 0.8 }));
    wall.position.set(x, 4.5, -8);
    root.add(wall);
  }
  root.add(blossoms(900, ['#7a0f1d', '#a51c32', '#5a0a16', '#f3d6db'], 0.13, (i, r) => {
    const side = i % 2 ? -1 : 1;
    return v3(side * (2.3 + r() * 1.6), r() * 0.8, 7 - r() * 32);
  }, 41));
  for (const [x, z] of [[-2, 2], [2, -6], [-2, -14], [2, -21]]) {
    const light = new THREE.PointLight('#ff9c5a', 14, 9, 1.6);
    light.position.set(x, 2.6, z);
    root.add(light);
  }

  // End arch with the invitation.
  const back = new THREE.Mesh(new THREE.BoxGeometry(10, 9, 0.4), new THREE.MeshStandardMaterial({ color: '#2d0d14', roughness: 0.8 }));
  back.position.set(0, 4.5, -31);
  const panel = invitationPanel(p, 3.1, 5.4, 'pointed', { paper: '#3b0c18', ink: '#f2dccb', accent: '#dcaa63' });
  panel.position.set(0, 0.3, -30.7);
  const frame = archFrame('pointed', 3.1, 5.4, 0.22, 0.2, brass);
  frame.position.set(0, 0.3, -30.68);
  root.add(back, panel, frame);
  root.add(blossoms(380, ['#7a0f1d', '#a51c32', '#f3d6db'], 0.16, (_, r) => {
    const side = r() > 0.5 ? -1 : 1;
    return v3(side * (1.6 + r() * 0.9), 0.2 + r() * 2.6, -30.4 + r() * 0.5);
  }, 42));
  const endLight = new THREE.PointLight('#ffc48a', 26, 10, 1.5);
  endLight.position.set(0, 3, -27);
  root.add(endLight);

  const flames = flicker(root);
  return {
    root,
    sky: ['#0c0407', '#1b0910', '#270c15'],
    light: { key: 0.12, hemi: 0.7, exposure: 1.2, fog: [16, 60] },
    cameraPosition: v3(0, 1.8, 12),
    cameraTarget: v3(0, 2.2, -30),
    journey: {
      positions: [v3(0, 1.8, 12), v3(0, 1.8, 2), v3(0, 1.9, -10), v3(0, 2, -20), v3(0, 2.4, -25.4)],
      targets: [v3(0, 2.4, -30), v3(-1.5, 2.6, -12), v3(1, 2.4, -30), v3(0, 2.8, -31), v3(0, 3, -31)],
    },
    update: (t) => flames(t),
  };
}

// ---------------------------------------------------------------------------
// 5 · Pearl & satin (ivory silk waves, pearl strands, gold rings)
// ---------------------------------------------------------------------------
export function buildPearlSatin(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const satin = fabric('#f3e6d3', 0.42, 1);
  const champagne = fabric('#e5cfae', 0.4, 1);

  // A sea of slowly moving satin.
  const sea = new THREE.PlaneGeometry(60, 60, 80, 80);
  sea.rotateX(-Math.PI / 2);
  const seaMesh = new THREE.Mesh(sea, satin);
  root.add(seaMesh);
  const base = Float32Array.from(sea.attributes['position'].array as Float32Array);

  // Tall drapes behind, swags across the top.
  const backdrop = drape(34, 16, satin, { folds: 16, depth: 0.35 });
  backdrop.position.set(0, -1, -12);
  root.add(backdrop);
  for (let i = 0; i < 4; i++) {
    root.add(swag(v3(-14 + i * 7, 11, -10), v3(-7 + i * 7, 11, -10), 2.4, 0.4, i % 2 ? champagne : satin));
  }
  // Pearl strands draped in front of the backdrop + pearls scattered on the satin.
  const strands = 7;
  root.add(pearls(strands * 60 + 220, 0.08, (i, r) => {
    if (i < strands * 60) {
      const s = Math.floor(i / 60);
      const t = (i % 60) / 59;
      const x = -10 + s * 3.3 + (t - 0.5) * 5;
      return v3(x, 9 - Math.sin(t * Math.PI) * (2.5 + s * 0.3), -9 + s * 0.2);
    }
    return v3((r() - 0.5) * 14, 0.25, 2 - r() * 10);
  }, 51));

  // Intertwined gold rings floating beside the panel.
  const brass = gold(p, 0.15);
  const rings = new THREE.Group();
  const a = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.07, 24, 64), brass);
  const b = a.clone();
  b.position.x = 0.45;
  b.rotation.y = Math.PI / 2.5;
  rings.add(a, b);
  rings.position.set(2.6, 2.6, -4.5);
  root.add(rings);

  const panel = invitationPanel(p, 3, 4.6, 'round', { paper: '#fbf3e4', ink: '#6a5332', accent: '#b98a3c' });
  panel.position.set(0, 0.4, -6);
  const frame = archFrame('round', 3, 4.6, 0.16, 0.16, brass);
  frame.position.set(0, 0.4, -6.02);
  root.add(panel, frame);
  root.add(pearls(140, 0.06, (_, r) => {
    const t = r() * Math.PI;
    return v3(Math.cos(t) * 1.68, 3.4 + Math.sin(t) * 1.68, -5.95);
  }, 52));

  const glowLight = new THREE.PointLight('#fff1da', 20, 14, 1.4);
  glowLight.position.set(0, 4, -2);
  root.add(glowLight);

  return {
    root,
    sky: ['#eadcc8', '#f4ebdf', '#fbf6ee'],
    light: { key: 0.8, hemi: 1.2, exposure: 1.0, fog: [30, 90], bloom: 2.4 },
    cameraPosition: v3(0, 4, 12),
    cameraTarget: v3(0, 2.6, -6),
    journey: {
      positions: [v3(0, 4.2, 12), v3(2.4, 3.4, 6), v3(-1.2, 2.8, 1.5), v3(0, 2.7, -1.2)],
      targets: [v3(0, 4, -9), v3(0, 3, -6), v3(0, 2.8, -6), v3(0, 2.7, -6)],
    },
    update(t) {
      const position = sea.attributes['position'];
      for (let i = 0; i < position.count; i++) {
        const x = base[i * 3];
        const z = base[i * 3 + 2];
        position.setY(i, Math.sin(x * 0.35 + t * 0.6) * 0.18 + Math.sin(z * 0.5 + t * 0.4) * 0.14);
      }
      position.needsUpdate = true;
      sea.computeVertexNormals();
      rings.rotation.y = t * 0.4;
      rings.position.y = 2.6 + Math.sin(t) * 0.1;
    },
  };
}

// ---------------------------------------------------------------------------
// 6 · Storybook valley (waterfall, river, wooden bridge, drifting clouds)
// ---------------------------------------------------------------------------
export function buildStorybook(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const random = seeded(61);
  root.add(ground(260, '#8fbe68', 0.95));

  const river = mirror(80, 5, '#9cc8e4', '#5b9ec6', 0.35);
  river.group.position.set(0, 0.03, -8);
  root.add(river.group);

  // Arched wooden bridge.
  const timber = new THREE.MeshStandardMaterial({ color: '#8a5a34', roughness: 0.85 });
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    const plank = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.36), timber);
    plank.position.set(0, 0.15 + Math.sin(t * Math.PI) * 0.8, -4.6 - t * 6.8);
    root.add(plank);
    if (i % 3 === 0) {
      for (const x of [-1.3, 1.3]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), timber);
        post.position.set(x, plank.position.y + 0.4, plank.position.z);
        root.add(post);
      }
    }
  }
  for (const x of [-1.3, 1.3]) {
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => v3(x, 0.95 + Math.sin((i / 8) * Math.PI) * 0.8, -4.6 - (i / 8) * 6.8)));
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.05, 8), timber));
  }

  // Cliff and waterfall at the back.
  const cliffMat = new THREE.MeshStandardMaterial({ color: '#7d8a74', roughness: 1, flatShading: true });
  for (let i = 0; i < 14; i++) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(6 + random() * 5, 0), cliffMat);
    rock.position.set(-36 + i * 5.5, 5 + random() * 8, -52 - random() * 6);
    root.add(rock);
  }
  const water = flowTexture('#ffffff', '#9fd0ea');
  water.repeat.set(2, 3);
  const fall = new THREE.Mesh(new THREE.PlaneGeometry(5, 20), new THREE.MeshStandardMaterial({ map: water, emissive: '#bfe3f5', emissiveIntensity: 0.35, roughness: 0.2 }));
  fall.position.set(4, 9, -45.5);
  root.add(fall);
  root.add(blossoms(160, ['#ffffff', '#e8f6ff'], 0.5, (_, r) => v3(4 + (r() - 0.5) * 6, 0.3 + r() * 0.6, -45 + r() * 2), 62));

  for (let i = 0; i < 40; i++) {
    const side = i % 2 ? -1 : 1;
    const t = tree(3.6 + random() * 3.4, ['#4f8a3f', '#6ea24f', '#3f7a3a'][i % 3], i + 70);
    t.position.set(side * (6 + random() * 24), 0, 10 - random() * 52);
    root.add(t);
  }
  root.add(blossoms(1200, ['#f6a5c0', '#ffffff', '#ffd86b', '#e86a8a', '#c7a3ea'], 0.16, (_, r) => {
    const side = r() > 0.5 ? -1 : 1;
    return v3(side * (2 + r() * 7), 0.15 + r() * 0.4, 12 - r() * 34);
  }, 63));

  const clouds: THREE.Group[] = [];
  for (let i = 0; i < 9; i++) {
    const c = cloud(2.4 + random() * 2, i + 5);
    c.position.set(-40 + i * 10, 18 + random() * 10, -30 - random() * 40);
    root.add(c);
    clouds.push(c);
  }

  const { groom, bride } = couple(p, { suit: '#3e6aa8', gown: '#e8ded0', veil: false, hair: '#2a211b' });
  groom.position.set(-0.55, 0, -13.5);
  bride.position.set(0.55, 0, -13.5);
  groom.rotation.y = 0.3;
  bride.rotation.y = -0.3;
  root.add(groom, bride);

  const panel = invitationPanel(p, 2.8, 4.2, 'round', { paper: 'rgba(255,255,255,0.82)', ink: '#33465c', accent: '#3d6fa8' });
  panel.position.set(0, 0.3, -18);
  root.add(panel);
  root.add(blossoms(380, ['#ffffff', '#f6a5c0', '#c7a3ea', '#8ec26a'], 0.15, (_, r) => {
    const a = r() * Math.PI;
    return v3(Math.cos(a) * 1.95, 3.1 + Math.sin(a) * 1.95 + (r() - 0.5) * 0.3, -18.15 + (r() - 0.5) * 0.3);
  }, 64));

  return {
    root,
    sky: ['#4a96dc', '#9cc8ef', '#e9f4fb'],
    light: { fog: [70, 220], bloom: 2.4 },
    cameraPosition: v3(0, 1.8, 14),
    cameraTarget: v3(0, 3, -40),
    journey: {
      positions: [v3(0, 1.8, 14), v3(0, 1.9, 3), v3(0, 2.7, -8), v3(0, 1.9, -11.5), v3(0, 2, -14.2)],
      targets: [v3(2, 6, -45), v3(1, 3, -40), v3(0, 2.2, -18), v3(0, 2.3, -18), v3(0, 2.2, -18)],
    },
    update(t) {
      water.offset.y = -t * 0.6;
      clouds.forEach((c, i) => (c.position.x += Math.sin(t * 0.1 + i) * 0.004));
    },
    dispose: river.dispose,
  };
}

// ---------------------------------------------------------------------------
// 7 · Mirror hall (champagne drapes, hydrangeas, black arched signboards)
// ---------------------------------------------------------------------------
export function buildMirrorHall(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const champagne = fabric('#d9c4a6', 0.5);
  const brass = gold(p, 0.25);

  const floor = mirror(30, 50, '#bdb0a1', '#cdbfac', 0.32);
  floor.group.position.set(0, 0, -6);
  root.add(floor.group);

  for (const side of [-1, 1]) {
    const wall = drape(46, 10, champagne, { folds: 30, depth: 0.25 });
    wall.rotation.y = (side * -Math.PI) / 2;
    wall.position.set(side * 7.5, 0, -6);
    root.add(wall);
  }
  const back = drape(16, 10, champagne, { folds: 12, depth: 0.25 });
  back.position.set(0, 0, -20);
  root.add(back);
  for (let i = 0; i < 9; i++) {
    const z = 10 - i * 3.4;
    root.add(swag(v3(-7.5, 8.6, z), v3(7.5, 8.6, z), 2.2, 0.35, champagne));
  }
  for (const z of [6, 0, -6, -12]) {
    const c = chandelier(p);
    c.position.set(0, 6.4, z);
    root.add(c);
  }
  // Hydrangea beds along the mirror aisle.
  root.add(blossoms(1600, ['#ffffff', '#f4eee4', '#efe3d0', '#e9dccb'], 0.13, (i, r) => {
    const side = i % 2 ? -1 : 1;
    const cluster = Math.floor(r() * 10);
    const z = 9 - cluster * 2.6;
    return v3(side * (2.4 + r() * 1.1), 0.5 + r() * 0.9, z + (r() - 0.5) * 1.4);
  }, 71));
  for (let i = 0; i < 10; i++) {
    for (const side of [-1, 1]) {
      const riser = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.5, 24), new THREE.MeshStandardMaterial({ color: '#f1ebe2', roughness: 0.4 }));
      riser.position.set(side * 2.9, 0.25, 9 - i * 2.6);
      root.add(riser);
      const c = candle(0.25 + (i % 2) * 0.15, 0.06);
      c.position.set(side * 1.7, 0, 8.4 - i * 2.6);
      root.add(c);
    }
  }

  // Two black arched mirror signboards on gold easels.
  const boards: [number, number, number, 'names' | 'full'][] = [
    [-1.45, 2.1, 3.6, 'names'],
    [1.45, 2.3, 4.2, 'full'],
  ];
  for (const [x, w, h, layout] of boards) {
    const board = invitationPanel(p, w, h, 'round', { paper: '#141113', ink: '#f1e8d9', accent: '#d9c4a0', layout });
    board.position.set(x, 0.55, -14);
    const frame = archFrame('round', w, h, 0.1, 0.1, brass);
    frame.position.set(x, 0.55, -14.02);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), brass);
    leg.position.set(x, 0.3, -14.05);
    root.add(board, frame, leg);
  }
  root.add(blossoms(500, ['#ffffff', '#f4eee4', '#efe3d0'], 0.14, (_, r) => v3((r() - 0.5) * 6, 0.2 + r() * 0.5, -13.4 + (r() - 0.5) * 0.8), 72));

  const flames = flicker(root);
  return {
    root,
    sky: ['#1c1510', '#2e241b', '#3c3024'],
    light: { key: 0.25, hemi: 1.0, exposure: 1.15, fog: [22, 70], bloom: 2.2 },
    cameraPosition: v3(0, 1.7, 14),
    cameraTarget: v3(0, 2.2, -14),
    journey: {
      positions: [v3(0, 1.7, 14), v3(0, 1.7, 5), v3(0, 1.8, -2), v3(0, 2.1, -7)],
      targets: [v3(0, 2.4, -14), v3(0, 2.6, -14), v3(0, 2.4, -14), v3(0, 2.1, -14)],
    },
    update: (t) => flames(t),
    dispose: floor.dispose,
  };
}
