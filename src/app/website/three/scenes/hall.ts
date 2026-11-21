/**
 * Reception hall: glossy floor, round tables with candles, crystal
 * chandeliers, a curtain of fairy lights and a floral stage with the couple's sofa.
 * Guests walk in from the entrance, between the tables, up to the stage.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BuiltScene, ScenePalette, blossoms, glow, gold, ground, seeded, v3 } from '../scene-kit';

function chandelier(p: ScenePalette): THREE.Group {
  const group = new THREE.Group();
  const brass = gold(p, 0.2);
  const crystal = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0, transmission: 0.9, ior: 1.9, thickness: 0.2 });
  for (const [radius, y, count] of [[1, 0, 18], [0.7, -0.35, 14], [0.4, -0.7, 10]] as const) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.025, 8, 48), brass);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
    for (let i = 0; i < count; i++) {
      const drop = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), crystal);
      const a = (i / count) * Math.PI * 2;
      drop.position.set(Math.cos(a) * radius, y - 0.12, Math.sin(a) * radius);
      drop.scale.y = 1.8;
      group.add(drop);
    }
  }
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), glow('#fff1d2', 3));
  core.position.y = -0.3;
  const light = new THREE.PointLight('#ffe2b0', 18, 12, 1.6);
  light.position.y = -0.4;
  group.add(core, light);
  return group;
}

function roundTable(p: ScenePalette, linen: THREE.Material, chair: THREE.BufferGeometry, chairMat: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.25, 0.78, 48), linen);
  cloth.position.y = 0.39;
  cloth.castShadow = true;
  cloth.receiveShadow = true;
  group.add(cloth);
  const centerpiece = blossoms(40, ['#ffffff', p.primary, '#f7d4dc'], 0.07, (_, r) => v3((r() - 0.5) * 0.4, 0.95 + r() * 0.25, (r() - 0.5) * 0.4), 31);
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 10), new THREE.MeshStandardMaterial({ color: '#fff8ea' }));
  candle.position.y = 0.93;
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.07, 8), glow('#ffb347', 4));
  flame.position.y = 1.12;
  group.add(centerpiece, candle, flame);
  const chairs = new THREE.InstancedMesh(chair, chairMat, 8);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    matrix.makeRotationY(-a + Math.PI / 2);
    matrix.setPosition(Math.cos(a) * 1.65, 0, Math.sin(a) * 1.65);
    chairs.setMatrixAt(i, matrix);
  }
  group.add(chairs);
  return group;
}

export function buildHall(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const random = seeded(17);

  // Glossy dark floor that reflects the lights.
  root.add(ground(80, '#1b1420', 0.12, 0.4));

  // Fairy-light curtain behind the stage.
  const strands = 60;
  const perStrand = 24;
  const curtain = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 8), glow('#ffe1a6', 3), strands * perStrand);
  const matrix = new THREE.Matrix4();
  let n = 0;
  for (let s = 0; s < strands; s++) {
    for (let k = 0; k < perStrand; k++) {
      matrix.makeTranslation(-9 + (s / strands) * 18, 0.4 + k * 0.32 + random() * 0.1, -9.6);
      curtain.setMatrixAt(n++, matrix);
    }
  }
  root.add(curtain);

  // Stage, floral backdrop and the couple's sofa.
  const stage = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), new THREE.MeshStandardMaterial({ color: '#f4ede3', roughness: 0.4 }));
  stage.position.set(0, 0.25, -7.2);
  stage.receiveShadow = true;
  root.add(stage);
  const backdrop = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.12, 16, 80, Math.PI), gold(p, 0.3));
  backdrop.position.set(0, 2.6, -8.8);
  root.add(backdrop);
  root.add(blossoms(650, ['#ffffff', '#fbe3e8', p.primary, '#fff2dc', '#e8c1cc'], 0.2, (i, r) => {
    if (i < 380) {
      const a = r() * Math.PI;
      const radius = 3.2 + (r() - 0.5) * 0.7;
      return v3(Math.cos(a) * radius, 2.6 + Math.sin(a) * radius, -8.7 + (r() - 0.5) * 0.5);
    }
    // Two big floral stands at the sides of the stage.
    const side = i % 2 ? -1 : 1;
    return v3(side * (4.2 + (r() - 0.5) * 0.9), 0.6 + r() * 2.2, -7.2 + (r() - 0.5) * 0.9);
  }, 23));
  const velvet = new THREE.MeshPhysicalMaterial({ color: p.primary, roughness: 0.7, sheen: 1, sheenColor: new THREE.Color('#ffffff') });
  const sofa = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.9), velvet);
  seat.position.y = 0.72;
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 0.2), velvet);
  back.position.set(0, 1.25, -0.4);
  for (const x of [-1.35, 1.35]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.6, 0.9), velvet);
    arm.position.set(x, 0.95, 0);
    sofa.add(arm);
  }
  sofa.add(seat, back);
  sofa.position.set(0, 0.25, -7.4);
  sofa.traverse((o) => (o.castShadow = true));
  root.add(sofa);

  // Round tables on both sides of the walkway.
  const chairParts = [
    new THREE.BoxGeometry(0.42, 0.06, 0.42).translate(0, 0.45, 0),
    new THREE.BoxGeometry(0.42, 0.55, 0.05).translate(0, 0.75, -0.19),
    ...[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([x, z]) => new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6).translate(x, 0.22, z)),
  ];
  const chairGeometry = mergeGeometries(chairParts)!;
  const chairMaterial = new THREE.MeshStandardMaterial({ color: p.accent, metalness: 0.8, roughness: 0.35 });
  const linen = new THREE.MeshPhysicalMaterial({ color: '#fbf8f2', roughness: 0.85, sheen: 0.6 });
  for (let row = 0; row < 3; row++) {
    for (const x of [-5, 5]) {
      const table = roundTable(p, linen, chairGeometry, chairMaterial);
      table.position.set(x + (row % 2 ? 0.6 : -0.6), 0, 6 - row * 4.2);
      root.add(table);
    }
  }

  // Walkway carpet and chandeliers above it.
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(2, 18), new THREE.MeshStandardMaterial({ color: p.primary, roughness: 0.9 }));
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.01, 1);
  root.add(carpet);
  const chandeliers: THREE.Group[] = [];
  for (const [x, z] of [[0, 6], [0, 1], [0, -4], [-5, 2], [5, 2]]) {
    const c = chandelier(p);
    c.position.set(x, 5, z);
    root.add(c);
    chandeliers.push(c);
  }

  return {
    root,
    sky: ['#0c0810', '#1d1424', '#2a1d30'],
    cameraPosition: v3(0, 2.4, 14),
    cameraTarget: v3(0, 2, -8),
    journey: {
      positions: [v3(0, 2.2, 15), v3(0, 1.9, 8), v3(-1.4, 2, 2), v3(0, 1.9, -2.5), v3(3.5, 3.4, -1)],
      targets: [v3(0, 2.2, -8), v3(-3, 1.4, 2), v3(0, 2, -8), v3(0, 1.8, -8), v3(0, 2, -8)],
    },
    update(t) {
      chandeliers.forEach((c, i) => (c.rotation.y = t * 0.15 + i));
      (curtain.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.6 + Math.sin(t * 2) * 0.4;
    },
  };
}
