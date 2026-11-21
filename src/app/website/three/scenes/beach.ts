/**
 * Beach mandap at sunset: rolling ocean waves, a setting sun, a wooden canopy
 * with drapes swaying in the breeze, torches and palm trees along the aisle.
 * Guests walk from the dunes to the mandap and turn towards the sea.
 */
import * as THREE from 'three';
import { BuiltScene, ScenePalette, blossoms, glow, halo, seeded, v3 } from '../scene-kit';

function palm(height: number, seed: number): THREE.Group {
  const random = seeded(seed);
  const group = new THREE.Group();
  const lean = (random() - 0.5) * 1.6;
  const curve = new THREE.CatmullRomCurve3([v3(0, 0, 0), v3(lean * 0.4, height * 0.5, 0), v3(lean, height, 0)]);
  const trunk = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 20, 0.16, 10, false),
    new THREE.MeshStandardMaterial({ color: '#8a6a45', roughness: 0.95 }),
  );
  trunk.castShadow = true;
  group.add(trunk);
  const leaf = new THREE.MeshStandardMaterial({ color: '#3f7a3a', roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) {
    const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2.6, 1, 6), leaf);
    const pos = frond.geometry.attributes['position'] as THREE.BufferAttribute;
    for (let v = 0; v < pos.count; v++) pos.setZ(v, -Math.pow(pos.getY(v) / 1.3, 2) * 0.45); // droop
    frond.geometry.computeVertexNormals();
    frond.geometry.translate(0, 1.3, 0);
    frond.position.set(lean, height, 0);
    frond.rotation.set(-1.2, (i / 8) * Math.PI * 2, 0, 'YXZ');
    group.add(frond);
  }
  return group;
}

export function buildBeach(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();

  // Sand dunes (gently displaced).
  const sandGeometry = new THREE.PlaneGeometry(80, 60, 80, 60);
  const sandPos = sandGeometry.attributes['position'] as THREE.BufferAttribute;
  for (let i = 0; i < sandPos.count; i++) {
    const x = sandPos.getX(i);
    const y = sandPos.getY(i);
    sandPos.setZ(i, Math.sin(x * 0.25) * 0.15 + Math.cos(y * 0.3) * 0.12);
  }
  sandGeometry.computeVertexNormals();
  const sand = new THREE.Mesh(sandGeometry, new THREE.MeshStandardMaterial({ color: '#e8d2ab', roughness: 1 }));
  sand.rotation.x = -Math.PI / 2;
  sand.position.z = 12;
  sand.receiveShadow = true;
  root.add(sand);

  // Animated ocean.
  const seaGeometry = new THREE.PlaneGeometry(220, 120, 140, 70);
  const sea = new THREE.Mesh(
    seaGeometry,
    new THREE.MeshPhysicalMaterial({ color: '#1d5c73', roughness: 0.12, metalness: 0.2, clearcoat: 1, envMapIntensity: 1.4 }),
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, -0.15, -78);
  root.add(sea);
  const seaPos = seaGeometry.attributes['position'] as THREE.BufferAttribute;
  const seaBase = Float32Array.from(seaPos.array as Float32Array);

  // Setting sun with a warm glow.
  const sun = new THREE.Mesh(new THREE.SphereGeometry(6, 48, 24), glow('#ffd39a', 2.2));
  sun.position.set(-8, 4, -110);
  const sunGlow = halo('#ffb070', 60);
  sunGlow.position.set(-8, 4, -112);
  root.add(sun, sunGlow);

  // Wooden mandap with flowing drapes and flowers.
  const mandap = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: '#c9a77c', roughness: 0.6 });
  for (const [x, z] of [[-2, -1.6], [2, -1.6], [-2, 1.6], [2, 1.6]]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 3.6, 12), wood);
    post.position.set(x, 1.8, z);
    post.castShadow = true;
    mandap.add(post);
  }
  for (const z of [-1.6, 1.6]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.16, 0.16), wood);
    beam.position.set(0, 3.6, z);
    mandap.add(beam);
  }
  for (const x of [-2, 2]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 3.6), wood);
    beam.position.set(x, 3.6, 0);
    mandap.add(beam);
  }
  const drapeMaterial = new THREE.MeshPhysicalMaterial({ color: '#fffaf4', roughness: 0.8, sheen: 1, sheenColor: new THREE.Color('#ffffff'), side: THREE.DoubleSide, transparent: true, opacity: 0.92 });
  const drapes: { mesh: THREE.Mesh; base: Float32Array; phase: number }[] = [];
  for (const [x, z, ry] of [[-2, 0, Math.PI / 2], [2, 0, Math.PI / 2], [0, -1.6, 0]] as const) {
    const geometry = new THREE.PlaneGeometry(3.2, 3.4, 20, 20);
    const drape = new THREE.Mesh(geometry, drapeMaterial);
    drape.position.set(x, 1.8, z);
    drape.rotation.y = ry;
    mandap.add(drape);
    drapes.push({ mesh: drape, base: Float32Array.from(geometry.attributes['position'].array as Float32Array), phase: x + z });
  }
  mandap.add(blossoms(200, ['#ffffff', '#f7c6d0', p.primary, '#fbe7c6'], 0.16, (i, r) => {
    const corner = i % 4;
    const cx = corner < 2 ? -2 : 2;
    const cz = corner % 2 ? -1.6 : 1.6;
    return v3(cx + (r() - 0.5) * 0.9, 3.5 + (r() - 0.5) * 0.6, cz + (r() - 0.5) * 0.9);
  }, 8));
  mandap.position.set(0, 0, -2);
  root.add(mandap);

  // Torches and petals along the aisle.
  const flames: THREE.Mesh[] = [];
  for (let z = 12; z >= 2; z -= 2.5) {
    for (const x of [-1.6, 1.6]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.4, 8), wood);
      pole.position.set(x, 0.7, z);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.32, 12), glow('#ffb347', 3));
      flame.position.set(x, 1.55, z);
      root.add(pole, flame);
      flames.push(flame);
    }
  }
  root.add(blossoms(160, ['#f4a7b9', '#ffffff', '#fbd3a5'], 0.05, (_, r) => v3((r() - 0.5) * 1.6, 0.12, 13 - r() * 13), 6));
  for (const [x, z, h, s] of [[-7, 6, 6, 1], [-9, 0, 7, 2], [7.5, 4, 6.5, 3], [9, -2, 5.5, 4], [-6, -6, 5, 5]]) {
    const tree = palm(h, s);
    tree.position.set(x, 0, z);
    root.add(tree);
  }

  return {
    root,
    sky: ['#2a3f73', '#f08a5d', '#ffd29a'],
    cameraPosition: v3(0, 2.2, 15),
    cameraTarget: v3(0, 2, -6),
    journey: {
      positions: [v3(0, 2, 17), v3(0, 1.8, 9), v3(0, 2, 3), v3(0.3, 2.1, -1), v3(2.5, 2.6, -4.5)],
      targets: [v3(0, 2, -2), v3(0, 2, -2), v3(0, 2.2, -4), v3(-2, 3, -60), v3(-8, 4, -110)],
    },
    update(t) {
      for (let i = 0; i < seaPos.count; i++) {
        const x = seaBase[i * 3];
        const y = seaBase[i * 3 + 1];
        seaPos.setZ(i, Math.sin(x * 0.18 + t * 1.2) * 0.25 + Math.cos(y * 0.22 + t * 0.9) * 0.2);
      }
      seaPos.needsUpdate = true;
      for (const d of drapes) {
        const pos = d.mesh.geometry.attributes['position'] as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          const y = d.base[i * 3 + 1];
          const x = d.base[i * 3];
          pos.setZ(i, Math.sin(x * 2 + t * 1.6 + d.phase) * 0.12 * (1.7 - y) * 0.6);
        }
        pos.needsUpdate = true;
      }
      flames.forEach((f, i) => f.scale.setScalar(1 + Math.sin(t * 9 + i) * 0.12));
    },
  };
}
