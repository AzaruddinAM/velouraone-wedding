/**
 * Wedding garden: an aisle lined with white chairs, string lights overhead,
 * hedges and trees, leading to a flower-covered arch. Guests walk down the aisle.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BuiltScene, ScenePalette, blossoms, ground, starField, stringLights, tree, v3 } from '../scene-kit';

/** One Chiavari-style chair (merged into a single geometry for instancing). */
function chairGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const seat = new THREE.BoxGeometry(0.46, 0.06, 0.44).translate(0, 0.46, 0);
  const back = new THREE.BoxGeometry(0.46, 0.5, 0.05).translate(0, 0.74, -0.2);
  parts.push(seat, back);
  for (const [x, z] of [[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]]) {
    parts.push(new THREE.CylinderGeometry(0.02, 0.02, 0.46, 8).translate(x, 0.23, z));
  }
  for (const x of [-0.12, 0, 0.12]) parts.push(new THREE.CylinderGeometry(0.012, 0.012, 0.46, 6).translate(x, 0.74, -0.2));
  return mergeGeometries(parts)!;
}

export function buildGarden(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const flowerColors = ['#ffffff', '#fbe3e8', p.primary, '#f6d6de', '#fff4e0'];

  root.add(ground(140, '#5f8f4e', 1));

  // Ivory aisle runner with scattered petals.
  const runner = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 34),
    new THREE.MeshStandardMaterial({ color: '#f7f1e6', roughness: 0.85 }),
  );
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, 0.01, -10);
  runner.receiveShadow = true;
  root.add(runner);
  root.add(blossoms(180, ['#f4b6c2', '#ffffff', p.primary], 0.05, (_, r) => v3((r() - 0.5) * 2, 0.03, 6 - r() * 32), 3));

  // Rows of chairs on both sides of the aisle.
  const chairs = new THREE.InstancedMesh(
    chairGeometry(),
    new THREE.MeshStandardMaterial({ color: '#f5efe2', roughness: 0.35, metalness: 0.2 }),
    12 * 6,
  );
  const matrix = new THREE.Matrix4();
  let n = 0;
  for (let row = 0; row < 12; row++) {
    for (const x of [-4.4, -3.4, -2.4, 2.4, 3.4, 4.4]) {
      matrix.makeTranslation(x, 0, 2 - row * 1.7);
      chairs.setMatrixAt(n++, matrix);
    }
  }
  chairs.castShadow = true;
  root.add(chairs);

  // Flower arch at the end of the aisle.
  const arch = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.08, 16, 96, Math.PI),
    new THREE.MeshStandardMaterial({ color: p.accent, metalness: 0.9, roughness: 0.3 }),
  );
  frame.position.y = 2.6;
  for (const x of [-2.6, 2.6]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 16), frame.material);
    pole.position.set(x, 1.3, 0);
    arch.add(pole);
  }
  arch.add(frame);
  arch.add(
    blossoms(420, flowerColors, 0.14, (i, r) => {
      // Dense on the top curve, trailing down the sides.
      const a = (i / 420) * Math.PI;
      const radius = 2.6 + (r() - 0.5) * 0.35;
      const side = i % 5 === 0 ? -1 : 1;
      const p3 = v3(Math.cos(a) * radius, 2.6 + Math.sin(a) * radius, (r() - 0.5) * 0.5);
      if (i % 9 === 0) p3.set(side * (2.6 + (r() - 0.5) * 0.3), r() * 2.6, (r() - 0.5) * 0.4);
      return p3;
    }, 5),
  );
  arch.add(blossoms(160, ['#4f7d3a', '#6a9a4c'], 0.12, (i, r) => {
    const a = r() * Math.PI;
    return v3(Math.cos(a) * (2.6 + (r() - 0.5) * 0.5), 2.6 + Math.sin(a) * 2.6, (r() - 0.5) * 0.6);
  }, 9));
  arch.position.z = -22;
  root.add(arch);

  // Hedges and trees framing the garden.
  for (const side of [-1, 1]) {
    root.add(blossoms(140, ['#3f6b35', '#4b7a3f', '#355c2d'], 0.55, (i, r) => v3(side * (7 + r() * 1.2), 0.5 + r() * 0.6, 6 - (i / 140) * 34), 20 + side));
    for (let i = 0; i < 6; i++) {
      const t = tree(4 + (i % 3), i % 2 ? '#3d6a34' : '#4f8040', 40 + i + side * 7);
      t.position.set(side * (10 + (i % 2) * 2), 0, 4 - i * 6);
      root.add(t);
    }
  }

  // String lights criss-crossing above the aisle.
  for (let z = 2; z >= -20; z -= 4) {
    root.add(stringLights(v3(-6, 4.4, z), v3(6, 4.4, z - 2), 0.8, 26, '#ffd9a0'));
    for (const x of [-6, 6]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.4, 8), new THREE.MeshStandardMaterial({ color: '#3b2a1e' }));
      pole.position.set(x, 2.2, z);
      root.add(pole);
    }
  }

  // Fireflies stay above head height so they never blur the camera on the walk.
  const fireflies = starField(90, 14, '#ffe6a8', 0.06, 4);
  fireflies.position.set(0, 4.5, -14);
  root.add(fireflies);

  return {
    root,
    sky: [p.bg, '#f3c9a8', '#ffe8c8'],
    cameraPosition: v3(0, 2.2, 9),
    cameraTarget: v3(0, 2, -20),
    journey: {
      positions: [v3(0, 1.8, 9), v3(0, 1.7, 1), v3(0.6, 1.8, -10), v3(0, 1.9, -16.5), v3(3.2, 2.6, -18.5)],
      targets: [v3(0, 2, -20), v3(0, 2, -22), v3(0, 2.4, -22), v3(0, 2.8, -22), v3(0, 2.6, -22)],
    },
    update(t) {
      fireflies.rotation.y = t * 0.03;
      fireflies.position.y = 4.5 + Math.sin(t * 0.5) * 0.3;
    },
  };
}
