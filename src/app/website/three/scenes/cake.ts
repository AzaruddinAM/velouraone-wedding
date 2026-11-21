/**
 * Wedding cake close-up: a five-tier iced cake with gold bands and a cascade of
 * flowers, candles, crystal glasses and petals on the table, warm bokeh behind.
 * The camera circles the cake and rises to the topper.
 */
import * as THREE from 'three';
import { BuiltScene, ScenePalette, blossoms, glow, gold, starField, v3 } from '../scene-kit';

/** A champagne flute made with a lathe (glass). */
function flute(): THREE.Mesh {
  const profile = [
    [0.0, 0], [0.18, 0], [0.18, 0.02], [0.03, 0.05], [0.025, 0.5], [0.04, 0.55],
    [0.11, 0.75], [0.12, 1.05], [0.115, 1.06],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.Mesh(
    new THREE.LatheGeometry(profile, 40),
    new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0.02, transmission: 1, thickness: 0.05, ior: 1.5 }),
  );
}

export function buildCake(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();

  // Table with a long linen cloth.
  const linen = new THREE.MeshPhysicalMaterial({ color: '#e6ddd0', roughness: 0.9, sheen: 0.4 });
  const table = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 1.5, 64), linen);
  table.position.y = 0.75;
  table.receiveShadow = true;
  root.add(table);

  // Five iced tiers with gold ribbons.
  // Slightly warm, matte icing so it reads as sugar paste rather than glowing white.
  const icing = new THREE.MeshPhysicalMaterial({ color: '#eadfcd', roughness: 0.6, clearcoat: 0.08, sheen: 0.3 });
  const ribbon = gold(p, 0.2);
  const cake = new THREE.Group();
  let y = 1.5;
  const tiers = [0.95, 0.78, 0.62, 0.47, 0.34];
  for (const r of tiers) {
    const h = 0.42;
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64), icing);
    tier.position.y = y + h / 2;
    tier.castShadow = true;
    const band = new THREE.Mesh(new THREE.TorusGeometry(r + 0.005, 0.025, 12, 96), ribbon);
    band.rotation.x = Math.PI / 2;
    band.position.y = y + 0.05;
    // Little pearl dots around the top edge.
    const pearls = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 10, 10), new THREE.MeshStandardMaterial({ color: '#fff7e8', roughness: 0.2, metalness: 0.3 }), 36);
    const m = new THREE.Matrix4();
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      m.makeTranslation(Math.cos(a) * r, y + h, Math.sin(a) * r);
      pearls.setMatrixAt(i, m);
    }
    cake.add(tier, band, pearls);
    y += h;
  }

  // Flowers cascading diagonally down the cake.
  cake.add(blossoms(260, ['#f7c6d0', '#ffffff', p.primary, '#f3a7b8', '#fde7c9'], 0.07, (i, r) => {
    const t = i / 260;
    const tierIndex = Math.min(4, Math.floor(t * 5));
    const radius = tiers[tierIndex] + 0.02;
    const a = -0.6 + t * 2.4 + (r() - 0.5) * 0.5;
    return v3(Math.cos(a) * radius, 1.5 + (4 - tierIndex) * 0.42 + r() * 0.42, Math.sin(a) * radius);
  }, 12));
  cake.add(blossoms(60, ['#5f8a4a', '#729e5a'], 0.05, (i, r) => {
    const a = -0.6 + (i / 60) * 2.4;
    const tierIndex = Math.min(4, Math.floor((i / 60) * 5));
    return v3(Math.cos(a) * (tiers[tierIndex] + 0.05), 1.5 + (4 - tierIndex) * 0.42 + r() * 0.4, Math.sin(a) * (tiers[tierIndex] + 0.05));
  }, 14));

  // Topper: two interlocked gold rings.
  const topper = new THREE.Group();
  const ringGeometry = new THREE.TorusGeometry(0.16, 0.022, 16, 64);
  const ringA = new THREE.Mesh(ringGeometry, gold(p, 0.15));
  ringA.position.x = -0.08;
  const ringB = new THREE.Mesh(ringGeometry, gold(p, 0.15));
  ringB.position.x = 0.08;
  ringB.rotation.y = Math.PI / 2;
  topper.add(ringA, ringB);
  topper.position.y = y + 0.2;
  cake.add(topper);
  root.add(cake);

  // Candles, glasses and petals on the table.
  const flames: THREE.Mesh[] = [];
  for (const [x, z] of [[-1.4, 0.9], [1.5, 0.6], [-1.1, -1.2], [1.2, -1.2]]) {
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 16), new THREE.MeshStandardMaterial({ color: '#fff6e5' }));
    candle.position.set(x, 1.72, z);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.11, 10), glow('#ffb347', 4));
    flame.position.set(x, 2.0, z);
    const light = new THREE.PointLight('#ffb766', 1.1, 4, 2);
    light.position.set(x, 2.1, z);
    root.add(candle, flame, light);
    flames.push(flame);
  }
  for (const [x, z] of [[0.9, 1.4], [1.15, 1.25]]) {
    const glass = flute();
    glass.position.set(x, 1.5, z);
    root.add(glass);
  }
  root.add(blossoms(80, ['#f4a7b9', '#ffffff', p.primary], 0.04, (_, r) => {
    const a = r() * Math.PI * 2;
    const d = 1.1 + r() * 0.9;
    return v3(Math.cos(a) * d, 1.52, Math.sin(a) * d);
  }, 16));

  // Warm bokeh lights in the background.
  const bokeh = starField(120, 22, '#ffd9a0', 0.7, 21);
  bokeh.position.set(0, 2, -16);
  root.add(bokeh);

  return {
    root,
    sky: ['#1a1016', '#3a2430', '#5a3a3a'],
    cameraPosition: v3(0, 2.6, 6.5),
    cameraTarget: v3(0, 2.4, 0),
    journey: {
      positions: [v3(0, 2.2, 7), v3(4.2, 2.6, 3.6), v3(2.2, 3.4, -3.8), v3(-3.6, 3, 1.8), v3(0.4, 5.6, 1.4)],
      targets: [v3(0, 2.3, 0), v3(0, 2.4, 0), v3(0, 2.6, 0), v3(0, 2.6, 0), v3(0, 3.6, 0)],
    },
    update(t) {
      cake.rotation.y = Math.sin(t * 0.2) * 0.2;
      topper.rotation.y = t * 0.6;
      flames.forEach((f, i) => f.scale.setScalar(1 + Math.sin(t * 10 + i * 2) * 0.12));
      bokeh.rotation.z = t * 0.01;
    },
  };
}
