/** Islamic-art scenes: mosque, lanterns, rings, girih stars and crescent. */
import * as THREE from 'three';
import { BuiltScene, ScenePalette, seeded, gold, stone, glow, starField, halo, starShape, crescentShape, archShape, extrude, makeLantern } from '../scene-kit';

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------

export function buildMosque(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const mosque = new THREE.Group();
  const wall = stone(p);
  const brass = gold(p);
  const half = (r: number) => new THREE.SphereGeometry(r, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const add = (mesh: THREE.Mesh, x: number, y: number, z = 0) => {
    mesh.position.set(x, y, z);
    mosque.add(mesh);
    return mesh;
  };

  add(new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.45, 3.4), wall), 0, 0.22);
  add(new THREE.Mesh(new THREE.BoxGeometry(4.3, 1.6, 2.6), wall), 0, 1.25);
  add(new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.3, 0.6, 64), wall), 0, 2.35);
  add(new THREE.Mesh(half(1.3), brass), 0, 2.65).scale.y = 1.2;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 12), brass), 0, 4.5);
  const finial = add(new THREE.Mesh(extrude(crescentShape(), 0.06, 0.02), brass), 0, 5.0);
  finial.scale.setScalar(0.17);

  for (const x of [-1.65, 1.65]) {
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.35, 48), wall), x, 2.2);
    add(new THREE.Mesh(half(0.56), brass), x, 2.37).scale.y = 1.15;
  }
  for (const x of [-3.0, 3.0]) {
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 4.4, 32), wall), x, 2.6);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.14, 32), brass), x, 3.75);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.9, 32), wall), x, 4.25);
    add(new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 32), brass), x, 5.05);
  }

  // Glowing pointed-arch windows and door on the front.
  const windowMaterial = glow(p.accent, 1.8);
  const windows: THREE.Mesh[] = [];
  for (let i = -3; i <= 3; i++) {
    const big = i === 0;
    const pane = new THREE.Mesh(new THREE.ShapeGeometry(archShape(big ? 0.55 : 0.3, big ? 0.85 : 0.55), 24), windowMaterial);
    pane.position.set(i * 0.58, big ? 0.46 : 0.9, 1.31);
    mosque.add(pane);
    windows.push(pane);
  }

  // Reflective courtyard floor.
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(10, 96),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(p.bg).lerp(new THREE.Color(p.accent), 0.15), metalness: 0.6, roughness: 0.35 }),
  );
  floor.rotation.x = -Math.PI / 2;

  const moon = new THREE.Mesh(extrude(crescentShape(), 0.25), glow(p.primary, 1.2));
  moon.position.set(4.6, 6.6, -7);
  moon.scale.setScalar(0.8);
  const moonHalo = halo(p.primary, 7);
  moonHalo.position.set(4.6, 6.6, -7.5);

  const stars = starField(700, 40, p.primary, 0.18, 7);
  root.add(mosque, floor, moon, moonHalo, stars);

  return {
    root,
    cameraPosition: new THREE.Vector3(0, 3.4, 12.5),
    cameraTarget: new THREE.Vector3(0, 2.2, 0),
    journey: {
      positions: [new THREE.Vector3(0, 2.4, 24), new THREE.Vector3(9, 3.2, 10), new THREE.Vector3(4, 2.2, 6.5), new THREE.Vector3(0, 1.9, 5.6), new THREE.Vector3(0, 7.5, 6)],
      targets: [new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(0, 1.6, 1.3), new THREE.Vector3(0, 1.2, 1.3), new THREE.Vector3(0, 3.4, 0)],
    },
    update(t) {
      mosque.rotation.y = Math.sin(t * 0.22) * 0.6;
      windowMaterial.emissiveIntensity = 1.5 + Math.sin(t * 2.2) * 0.35;
      moon.rotation.y = Math.sin(t * 0.4) * 0.4;
      stars.rotation.y = t * 0.01;
    },
  };
}

export function buildLanterns(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const brass = gold(p, 0.3);
  const glass = new THREE.MeshStandardMaterial({
    color: p.accent,
    emissive: p.accent,
    emissiveIntensity: 1.3,
    transparent: true,
    opacity: 0.9,
    roughness: 0.35,
  });
  const random = seeded(11);
  const lanterns: { mesh: THREE.Group; baseY: number; phase: number; spin: number }[] = [];

  const hero = makeLantern(brass, glass);
  hero.scale.setScalar(2.1);
  hero.position.set(0, 2.4, 1.2);
  root.add(hero);
  lanterns.push({ mesh: hero, baseY: 2.4, phase: 0, spin: 0.35 });

  for (let i = 0; i < 18; i++) {
    const lantern = makeLantern(brass, glass);
    const x = (random() - 0.5) * 14;
    const y = -1 + random() * 7.5;
    const z = -8 + random() * 7;
    if (Math.abs(x) < 1.6 && z > -2) continue; // keep the hero lantern clear
    lantern.position.set(x, y, z);
    lantern.scale.setScalar(0.55 + random() * 0.7);
    root.add(lantern);
    lanterns.push({ mesh: lantern, baseY: y, phase: random() * Math.PI * 2, spin: 0.2 + random() * 0.5 });
  }

  for (const [x, y, z] of [[0, 2.5, 2.5], [-4, 4, -3], [4, 1, -2]]) {
    const light = new THREE.PointLight(p.accent, 14, 14, 1.6);
    light.position.set(x, y, z);
    root.add(light);
  }

  const glowBehind = halo(p.accent, 9);
  glowBehind.position.set(0, 2.4, -1);
  const sparks = starField(260, 14, p.primary, 0.12, 3);
  root.add(glowBehind, sparks);

  return {
    root,
    cameraPosition: new THREE.Vector3(0, 2.4, 11),
    cameraTarget: new THREE.Vector3(0, 2.3, 0),
    journey: {
      positions: [new THREE.Vector3(0, 2.2, 13), new THREE.Vector3(2.5, 3, 5), new THREE.Vector3(-1.5, 3.8, -1), new THREE.Vector3(1, 4.6, -6), new THREE.Vector3(0, 3, 6)],
      targets: [new THREE.Vector3(0, 2.4, 0), new THREE.Vector3(0, 2.6, 0), new THREE.Vector3(0, 3.2, -6), new THREE.Vector3(0, 3.5, -12), new THREE.Vector3(0, 2.4, 0)],
    },
    update(t) {
      for (const l of lanterns) {
        l.mesh.position.y = l.baseY + Math.sin(t * 0.8 + l.phase) * 0.25;
        l.mesh.rotation.y = t * l.spin;
        l.mesh.rotation.z = Math.sin(t * 0.9 + l.phase) * 0.06;
      }
      glass.emissiveIntensity = 1.2 + Math.sin(t * 3.1) * 0.15;
      sparks.rotation.y = t * 0.05;
      sparks.position.y = (t * 0.25) % 2;
    },
  };
}

export function buildRings(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const rings = new THREE.Group();
  const yellow = gold(p, 0.18);
  const rose = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.accent).lerp(new THREE.Color('#e8a3a0'), 0.45),
    metalness: 1,
    roughness: 0.2,
  });
  const torus = new THREE.TorusGeometry(1.3, 0.2, 64, 200);

  const ringA = new THREE.Mesh(torus, yellow);
  ringA.position.x = -0.65;
  const ringB = new THREE.Mesh(torus, rose);
  ringB.position.x = 0.65;
  ringB.rotation.x = Math.PI / 2;

  const diamond = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0, transmission: 0.95, ior: 2.4, thickness: 0.6, envMapIntensity: 2.5 }),
  );
  diamond.scale.y = 1.3;
  diamond.position.set(-0.65, 1.62, 0);
  const setting = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.18, 6), yellow);
  setting.position.set(-0.65, 1.42, 0);
  rings.add(ringA, ringB, diamond, setting);

  const halos = new THREE.Group();
  for (const [r, opacity] of [[3.1, 0.9], [3.6, 0.5]] as const) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 220), glow(p.accent, 1.5));
    (ring.material as THREE.MeshStandardMaterial).transparent = true;
    (ring.material as THREE.MeshStandardMaterial).opacity = opacity;
    halos.add(ring);
  }
  const back = halo(p.primary, 10);
  back.position.z = -2;
  const sparkles = starField(320, 9, p.accent, 0.1, 5);
  root.add(rings, halos, back, sparkles);

  return {
    root,
    cameraPosition: new THREE.Vector3(0, 0.7, 8.2),
    cameraTarget: new THREE.Vector3(0, 0.3, 0),
    journey: {
      positions: [new THREE.Vector3(0, 0.7, 9.5), new THREE.Vector3(5, 1.6, 3.5), new THREE.Vector3(0.5, 3.6, 2), new THREE.Vector3(-4.2, 0.4, 3.4), new THREE.Vector3(0, 0.9, 5)],
      targets: [new THREE.Vector3(0, 0.3, 0), new THREE.Vector3(0, 0.3, 0), new THREE.Vector3(0, 0.4, 0), new THREE.Vector3(0, 0.3, 0), new THREE.Vector3(-0.6, 1.2, 0)],
    },
    update(t) {
      rings.rotation.y = t * 0.45;
      rings.rotation.x = Math.sin(t * 0.5) * 0.25;
      rings.position.y = Math.sin(t * 0.9) * 0.15;
      diamond.rotation.y = t * 1.4;
      halos.rotation.z = t * 0.1;
      halos.rotation.x = Math.sin(t * 0.3) * 0.3;
      sparkles.rotation.y = -t * 0.04;
    },
  };
}

export function buildGirih(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const brass = gold(p, 0.22);
  const inlay = new THREE.MeshStandardMaterial({ color: p.primary, metalness: 0.6, roughness: 0.3 });

  const center = new THREE.Group();
  const big = new THREE.Mesh(extrude(starShape(8, 1, 0.62), 0.25), brass);
  big.scale.setScalar(1.7);
  const inner = new THREE.Mesh(extrude(starShape(8, 1, 0.62), 0.2), inlay);
  inner.scale.setScalar(0.95);
  inner.rotation.z = Math.PI / 8;
  inner.position.z = 0.25;
  const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), glow(p.accent, 1.2));
  jewel.position.z = 0.45;
  center.add(big, inner, jewel);

  const orbit = new THREE.Group();
  const smallStars: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const star = new THREE.Mesh(extrude(starShape(8, 1, 0.62), 0.25), i % 2 ? inlay : brass);
    const a = (i / 8) * Math.PI * 2;
    star.position.set(Math.cos(a) * 3.3, Math.sin(a) * 3.3, 0);
    star.scale.setScalar(0.42);
    orbit.add(star);
    smallStars.push(star);
  }

  const octagons = new THREE.Group();
  for (const [r, rot] of [[2.35, 0], [4.3, Math.PI / 8]] as const) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 8, 8), brass);
    ring.rotation.z = rot;
    octagons.add(ring);
  }

  // Flat tiled stars far behind, like a mosaic wall.
  const tile = new THREE.ShapeGeometry(starShape(8, 0.5, 0.31));
  const tileMaterial = new THREE.MeshBasicMaterial({ color: p.accent, transparent: true, opacity: 0.12 });
  const wallTiles = new THREE.Group();
  for (let x = -8; x <= 8; x += 1.4) {
    for (let y = -6; y <= 6; y += 1.4) {
      const t = new THREE.Mesh(tile, tileMaterial);
      t.position.set(x, y, -5);
      wallTiles.add(t);
    }
  }
  const back = halo(p.accent, 8);
  back.position.z = -1.5;
  root.add(wallTiles, back, octagons, orbit, center, starField(250, 12, p.primary, 0.1, 9));

  return {
    root,
    cameraPosition: new THREE.Vector3(0, 0, 10.5),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    journey: {
      positions: [new THREE.Vector3(0, 0, 12), new THREE.Vector3(4, 1.2, 7), new THREE.Vector3(0, 0, 4), new THREE.Vector3(-3, -1.2, 6.5), new THREE.Vector3(0, 0, 9)],
      targets: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)],
    },
    update(t) {
      center.rotation.z = t * 0.3;
      center.rotation.y = Math.sin(t * 0.45) * 0.55;
      orbit.rotation.z = -t * 0.15;
      for (const s of smallStars) s.rotation.y = t * 1.2;
      octagons.rotation.z = t * 0.06;
      octagons.rotation.x = Math.sin(t * 0.35) * 0.25;
      wallTiles.position.x = Math.sin(t * 0.1) * 0.4;
    },
  };
}

export function buildCrescent(p: ScenePalette): BuiltScene {
  const root = new THREE.Group();
  const moonGroup = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: p.accent, metalness: 1, roughness: 0.2, emissive: p.accent, emissiveIntensity: 0.12 });

  const crescent = new THREE.Mesh(extrude(crescentShape(), 0.42, 0.07), brass);
  crescent.scale.setScalar(1.45);
  const star = new THREE.Mesh(extrude(starShape(5, 0.5, 0.2), 0.16), glow(p.primary, 1.4));
  star.position.set(1.25, 0.55, 0.1);
  moonGroup.add(crescent, star);

  // A ring of tiny lanterns slowly orbiting the moon.
  const orbit = new THREE.Group();
  const brassSmall = gold(p, 0.3);
  const glass = new THREE.MeshStandardMaterial({ color: p.accent, emissive: p.accent, emissiveIntensity: 1.4, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 6; i++) {
    const lantern = makeLantern(brassSmall, glass);
    const a = (i / 6) * Math.PI * 2;
    lantern.position.set(Math.cos(a) * 3.6, Math.sin(a) * 1.1, Math.sin(a) * 2.2);
    lantern.scale.setScalar(0.45);
    orbit.add(lantern);
  }
  orbit.rotation.x = 0.25;

  const back = halo(p.primary, 11);
  back.position.z = -2.5;
  const clouds = halo('rgba(255,255,255,0.35)', 16);
  clouds.position.set(-3, -3.5, -4);
  const stars = starField(800, 30, p.primary, 0.16, 13);
  root.add(stars, clouds, back, orbit, moonGroup);

  return {
    root,
    cameraPosition: new THREE.Vector3(0, 0.3, 9.5),
    cameraTarget: new THREE.Vector3(0, 0.2, 0),
    journey: {
      positions: [new THREE.Vector3(0, 0.3, 11), new THREE.Vector3(4.5, 1.2, 5.5), new THREE.Vector3(1.2, 2.2, 3.2), new THREE.Vector3(-3.6, 0, 5.5), new THREE.Vector3(0, 0.4, 7.5)],
      targets: [new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0.4, 0.3, 0), new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 0.2, 0)],
    },
    update(t) {
      moonGroup.rotation.y = Math.sin(t * 0.5) * 0.65;
      moonGroup.position.y = Math.sin(t * 0.8) * 0.2;
      star.rotation.z = t * 0.8;
      star.scale.setScalar(1 + Math.sin(t * 2.5) * 0.08);
      orbit.rotation.y = t * 0.25;
      stars.rotation.y = t * 0.012;
    },
  };
}

