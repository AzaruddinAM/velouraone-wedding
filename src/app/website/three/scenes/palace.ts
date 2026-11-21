/**
 * Mughal palace courtyard: arcaded walls with pointed arches, a long
 * reflecting pool with fountains, cypress trees and a domed iwan gateway.
 * Guests glide along the pool towards the gateway.
 */
import * as THREE from 'three';
import { BuiltScene, ScenePalette, archShape, gold, ground, makeLantern, v3 } from '../scene-kit';

/** A wall pierced by a row of pointed arches (real holes, extruded). */
function arcadeWall(length: number, height: number, arches: number, material: THREE.Material): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.moveTo(-length / 2, 0);
  shape.lineTo(length / 2, 0);
  shape.lineTo(length / 2, height);
  shape.lineTo(-length / 2, height);
  shape.closePath();
  const spacing = length / arches;
  for (let i = 0; i < arches; i++) {
    const x = -length / 2 + spacing * (i + 0.5);
    // Holes start just above the ground so they stay inside the wall outline (needed for triangulation).
    const hole = archShape(spacing * 0.62, height * 0.6);
    const path = new THREE.Path(hole.getPoints(24).map((pt) => new THREE.Vector2(pt.x + x, pt.y + 0.3)));
    shape.holes.push(path);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: false, curveSegments: 24 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cypress(height: number): THREE.Group {
  const group = new THREE.Group();
  const foliage = new THREE.Mesh(
    new THREE.ConeGeometry(height * 0.16, height, 16),
    new THREE.MeshStandardMaterial({ color: '#2f5a37', roughness: 0.9 }),
  );
  foliage.position.y = height / 2 + 0.3;
  foliage.castShadow = true;
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.5, 16), new THREE.MeshStandardMaterial({ color: '#c9b79b', roughness: 0.6 }));
  pot.position.y = 0.25;
  group.add(foliage, pot);
  return group;
}

export function buildPalace(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const sandstone = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f1e3c8').lerp(new THREE.Color(p.surface), 0.12),
    roughness: 0.7,
  });
  const brass = gold(p, 0.25);

  // Polished marble courtyard.
  root.add(ground(80, '#efe6d6', 0.18, 0.15));

  // Reflecting pool with a gold rim.
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 26),
    new THREE.MeshPhysicalMaterial({ color: '#1f5d6b', roughness: 0.04, metalness: 0.3, clearcoat: 1, envMapIntensity: 1.6 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.03, -4);
  const rim = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 26.5), brass);
  rim.position.set(0, 0.0, -4);
  root.add(rim, water);

  // Fountain jets along the pool.
  const jets: THREE.Mesh[] = [];
  const jetMaterial = new THREE.MeshPhysicalMaterial({ color: '#dff6ff', transmission: 0.8, roughness: 0.1, transparent: true, opacity: 0.7 });
  for (let z = 6; z >= -14; z -= 4) {
    const jet = new THREE.Mesh(new THREE.ConeGeometry(0.08, 1.2, 12, 1, true), jetMaterial);
    jet.position.set(0, 0.6, z);
    root.add(jet);
    jets.push(jet);
  }

  // Arcaded side walls and the back wall.
  for (const side of [-1, 1]) {
    const wall = arcadeWall(28, 5, 7, sandstone);
    wall.rotation.y = side * Math.PI / 2;
    wall.position.set(side * 7.5, 0, -4);
    root.add(wall);
    for (let i = 0; i < 7; i++) {
      const lantern = makeLantern(brass, new THREE.MeshStandardMaterial({ color: p.accent, emissive: p.accent, emissiveIntensity: 1.6, transparent: true, opacity: 0.9 }));
      lantern.scale.setScalar(0.55);
      lantern.position.set(side * 7.1, 2.4, 10 - 4 * i - 2);
      root.add(lantern);
    }
    for (let z = 8; z >= -14; z -= 4) {
      const c = cypress(4.2);
      c.position.set(side * 3.2, 0, z);
      root.add(c);
    }
  }

  // Iwan gateway with a large pointed arch and a dome.
  const gate = arcadeWall(13, 9, 1, sandstone);
  gate.position.set(0, 0, -18);
  root.add(gate);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(2.1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), sandstone);
  dome.scale.y = 1.25;
  dome.position.set(0, 9, -17.6);
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.2, 16), brass);
  finial.position.set(0, 12.2, -17.6);
  for (const x of [-6.2, 6.2]) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 10, 24), sandstone);
    tower.position.set(x, 5, -17.6);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), brass);
    cap.position.set(x, 10, -17.6);
    root.add(tower, cap);
  }
  const doorway = new THREE.Mesh(
    new THREE.ShapeGeometry(archShape(7.4, 5.2), 32),
    new THREE.MeshStandardMaterial({ color: p.accent, emissive: p.accent, emissiveIntensity: 0.9 }),
  );
  doorway.position.set(0, 0, -18.2);
  root.add(dome, finial, doorway);

  const sun = new THREE.PointLight(p.accent, 40, 30, 1.5);
  sun.position.set(0, 5, -15);
  root.add(sun);

  return {
    root,
    sky: [p.bg, '#f2b37a', '#fde2b8'],
    cameraPosition: v3(0, 2.4, 14),
    cameraTarget: v3(0, 3.5, -18),
    journey: {
      positions: [v3(0, 1.6, 15), v3(-1.6, 1.4, 6), v3(1.6, 1.5, -3), v3(0, 2.2, -9), v3(0, 6.5, -6)],
      targets: [v3(0, 3, -18), v3(0, 2.5, -18), v3(0, 3, -18), v3(0, 4, -18), v3(0, 6, -18)],
    },
    update(t) {
      jets.forEach((jet, i) => {
        jet.scale.y = 1 + Math.sin(t * 3 + i) * 0.15;
      });
    },
  };
}
