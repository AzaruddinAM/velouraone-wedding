/**
 * Real-time 3D scenes for the Nikah 3D websites (Three.js / WebGL).
 *
 * IMPORTANT: this module is only ever loaded with `import()` from `ThreeScene`,
 * so Three.js is downloaded only when a 3D design is actually on screen.
 *
 *  • createLiveStage – animated scene with its own canvas, follows the pointer.
 *  • snapshotTo      – draws a single frame into a 2D canvas using ONE shared
 *                      renderer (gallery thumbnails never open many WebGL contexts).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Scene3DKind } from '../../core/models/wedding-template.model';

export interface ScenePalette {
  readonly bg: string;
  readonly surface: string;
  readonly ink: string;
  readonly primary: string;
  readonly accent: string;
}

interface BuiltScene {
  readonly root: THREE.Object3D;
  readonly cameraPosition: THREE.Vector3;
  readonly cameraTarget: THREE.Vector3;
  update(time: number, delta: number): void;
}

export interface LiveStage {
  dispose(): void;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Deterministic pseudo-random numbers so every render of a design looks the same. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const gold = (p: ScenePalette, roughness = 0.26) =>
  new THREE.MeshStandardMaterial({ color: p.accent, metalness: 1, roughness });

const stone = (p: ScenePalette) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f5eddc').lerp(new THREE.Color(p.surface), 0.18),
    metalness: 0.05,
    roughness: 0.55,
  });

const glow = (color: string, intensity = 1.6) =>
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });

/** Soft round sprite texture used for stars, sparks and halos. */
function radialTexture(inner: string, outer = 'rgba(0,0,0,0)'): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** A field of glowing points scattered in a shell around the scene. */
function starField(count: number, radius: number, color: string, size: number, seed: number): THREE.Points {
  const random = seeded(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.45 + random() * 0.55);
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.8 - 2;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - radius * 0.3;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size,
    map: radialTexture('rgba(255,255,255,1)'),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

/** Large soft glow plane behind the hero object. */
function halo(color: string, size: number): THREE.Mesh {
  const material = new THREE.MeshBasicMaterial({
    map: radialTexture(color),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.55,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
}

/** 8-point Islamic star outline (or any n-point star). */
function starShape(points: number, outer: number, inner: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

/**
 * Crescent = outer circle (0,0 r1.6) minus inner circle (0.56,0.32 r1.36).
 * Intersection points pre-computed: I1 (0.093, 1.597) and I2 (1.424, -0.731).
 */
function crescentShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const outerStart = Math.atan2(1.597, 0.093);
  const outerEnd = Math.atan2(-0.731, 1.424) + Math.PI * 2;
  const innerStart = Math.atan2(-0.731 - 0.32, 1.424 - 0.56);
  const innerEnd = Math.atan2(1.597 - 0.32, 0.093 - 0.56) - Math.PI * 2;
  shape.moveTo(0.093, 1.597);
  shape.absarc(0, 0, 1.6, outerStart, outerEnd, false);
  shape.absarc(0.56, 0.32, 1.36, innerStart, innerEnd, true);
  return shape;
}

/** Pointed-arch window shape (used for glowing mosque windows). */
function archShape(width: number, height: number): THREE.Shape {
  const w = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-w, 0);
  shape.lineTo(-w, height - w);
  shape.quadraticCurveTo(-w, height, 0, height + w * 0.6);
  shape.quadraticCurveTo(w, height, w, height - w);
  shape.lineTo(w, 0);
  shape.closePath();
  return shape;
}

const extrude = (shape: THREE.Shape, depth: number, bevel = 0.04) =>
  new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 48,
  }).center();

/** A traditional brass lantern with a glowing glass body. */
function makeLantern(brass: THREE.Material, glass: THREE.Material): THREE.Group {
  const lantern = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.8, 6), glass);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.38, 6), brass);
  cap.position.y = 0.59;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 24), brass);
  ring.position.y = 0.88;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.12, 6), brass);
  base.position.y = -0.46;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 6), brass);
  tip.rotation.x = Math.PI;
  tip.position.y = -0.65;
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), glow('#fff3c4', 3));
  for (let i = 0; i < 6; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.82, 0.03), brass);
    const a = (i / 6) * Math.PI * 2;
    rib.position.set(Math.cos(a) * 0.32, 0, Math.sin(a) * 0.32);
    lantern.add(rib);
  }
  lantern.add(body, cap, ring, base, tip, flame);
  return lantern;
}

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------

function buildMosque(p: ScenePalette): BuiltScene {
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
    update(t) {
      mosque.rotation.y = Math.sin(t * 0.22) * 0.6;
      windowMaterial.emissiveIntensity = 1.5 + Math.sin(t * 2.2) * 0.35;
      moon.rotation.y = Math.sin(t * 0.4) * 0.4;
      stars.rotation.y = t * 0.01;
    },
  };
}

function buildLanterns(p: ScenePalette): BuiltScene {
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

function buildRings(p: ScenePalette): BuiltScene {
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

function buildGirih(p: ScenePalette): BuiltScene {
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

function buildCrescent(p: ScenePalette): BuiltScene {
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

const BUILDERS: Record<Scene3DKind, (p: ScenePalette) => BuiltScene> = {
  mosque: buildMosque,
  lanterns: buildLanterns,
  rings: buildRings,
  girih: buildGirih,
  crescent: buildCrescent,
};

// ---------------------------------------------------------------------------
// World setup shared by live and snapshot rendering
// ---------------------------------------------------------------------------

const environments = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

function environmentFor(renderer: THREE.WebGLRenderer): THREE.Texture {
  let env = environments.get(renderer);
  if (!env) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    environments.set(renderer, env);
  }
  return env;
}

function configureRenderer(renderer: THREE.WebGLRenderer): void {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);
}

interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  built: BuiltScene;
}

function createWorld(renderer: THREE.WebGLRenderer, kind: Scene3DKind, palette: ScenePalette): World {
  const scene = new THREE.Scene();
  scene.environment = environmentFor(renderer);
  scene.fog = new THREE.Fog(palette.bg, 26, 62);

  scene.add(new THREE.HemisphereLight('#ffffff', palette.bg, 0.7));
  const key = new THREE.DirectionalLight('#ffffff', 1.6);
  key.position.set(5, 9, 7);
  const rim = new THREE.DirectionalLight(palette.primary, 1.1);
  rim.position.set(-6, 3, -5);
  scene.add(key, rim);

  const built = BUILDERS[kind](palette);
  scene.add(built.root);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.copy(built.cameraPosition);
  camera.lookAt(built.cameraTarget);
  return { scene, camera, built };
}

/**
 * Keeps the 3D subject clear of the text and returns the camera's resting position:
 *  • wide screens – subject shifted to the right (text sits on the left)
 *  • tall screens – camera pulled back and subject shifted up (text sits at the bottom)
 */
function frame(camera: THREE.PerspectiveCamera, built: BuiltScene, width: number, height: number): THREE.Vector3 {
  const aspect = width / Math.max(1, height);
  camera.aspect = aspect;

  // Portrait screens show less width, so move the camera further away.
  const distance = aspect >= 1 ? 1 : 1.25 + (1 - aspect) * 0.9;
  const position = built.cameraTarget.clone().add(built.cameraPosition.clone().sub(built.cameraTarget).multiplyScalar(distance));

  if (aspect > 1.15) camera.setViewOffset(width, height, -width * 0.2, 0, width, height);
  else camera.setViewOffset(width, height, 0, height * 0.24, width, height);
  camera.position.copy(position);
  camera.lookAt(built.cameraTarget);
  camera.updateProjectionMatrix();
  return position;
}

function disposeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    for (const m of Array.isArray(material) ? material : material ? [material] : []) {
      (m as THREE.MeshBasicMaterial).map?.dispose();
      m.dispose();
    }
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Animated, interactive scene rendered into a new canvas inside `host`. */
export function createLiveStage(host: HTMLElement, kind: Scene3DKind, palette: ScenePalette): LiveStage {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  configureRenderer(renderer);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  host.appendChild(renderer.domElement);

  const { scene, camera, built } = createWorld(renderer, kind, palette);
  let base = built.cameraPosition.clone();
  const pointer = { x: 0, y: 0 };
  const clock = new THREE.Clock();
  let visible = true;

  const resize = () => {
    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    renderer.setSize(width, height, false);
    base = frame(camera, built, width, height);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // Pause rendering when the hero scrolls out of view.
  const visibility = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  visibility.observe(host);

  const onPointer = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  };
  const onOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma == null || event.beta == null) return;
    pointer.x = Math.max(-1, Math.min(1, event.gamma / 30));
    pointer.y = Math.max(-1, Math.min(1, (event.beta - 45) / 30));
  };
  host.addEventListener('pointermove', onPointer);
  window.addEventListener('deviceorientation', onOrientation);

  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    if (!visible) return;
    const t = clock.elapsedTime;
    built.update(t, delta);
    camera.position.x += (base.x + pointer.x * 1.4 - camera.position.x) * 0.05;
    camera.position.y += (base.y - pointer.y * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(built.cameraTarget);
    renderer.render(scene, camera);
  });

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      visibility.disconnect();
      host.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrientation);
      disposeScene(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

let sharedRenderer: THREE.WebGLRenderer | null = null;

/** Draws one still frame of the scene into `target` (a 2D canvas) using a single shared renderer. */
export function snapshotTo(target: HTMLCanvasElement, kind: Scene3DKind, palette: ScenePalette, time = 2.4): void {
  const width = Math.max(1, Math.round(target.clientWidth));
  const height = Math.max(1, Math.round(target.clientHeight));
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  if (!sharedRenderer) {
    sharedRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    configureRenderer(sharedRenderer);
  }
  sharedRenderer.setPixelRatio(ratio);
  sharedRenderer.setSize(width, height, false);

  const { scene, camera, built } = createWorld(sharedRenderer, kind, palette);
  built.update(time, 0);
  frame(camera, built, width, height);
  sharedRenderer.render(scene, camera);

  target.width = Math.round(width * ratio);
  target.height = Math.round(height * ratio);
  const ctx = target.getContext('2d');
  ctx?.clearRect(0, 0, target.width, target.height);
  ctx?.drawImage(sharedRenderer.domElement, 0, 0, target.width, target.height);
  disposeScene(scene);
}
