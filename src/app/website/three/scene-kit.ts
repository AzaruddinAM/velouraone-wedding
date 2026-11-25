/**
 * Shared toolkit for the 3D wedding scenes: palette & scene types, materials,
 * textures, particles and reusable shapes (stars, crescent, arches, lanterns).
 * Only loaded lazily together with the 3D runtime.
 */
import * as THREE from 'three';
import type { HdriName } from './assets';

export interface ScenePalette {
  readonly bg: string;
  readonly surface: string;
  readonly ink: string;
  readonly primary: string;
  readonly accent: string;
  /** Couple's details, written onto 3D invitation panels (venue scenes). */
  readonly labels?: SceneLabels;
}

/** Text shown on the 3D invitation panels of the venue scenes. */
export interface SceneLabels {
  readonly bride: string;
  readonly groom: string;
  readonly initials: string;
  readonly opening: string;
  readonly invitation: string;
  readonly date: string;
  readonly time: string;
  readonly venue: string;
  readonly arabic?: string;
  readonly fontScript: string;
  readonly fontHeading: string;
  readonly fontBody: string;
}

export interface BuiltScene {
  readonly root: THREE.Object3D;
  readonly cameraPosition: THREE.Vector3;
  readonly cameraTarget: THREE.Vector3;
  /** progress = journey scroll position (0 → 1): doors open, curtains part… */
  update(time: number, delta: number, progress: number): void;
  /** Lighting overrides for dark interiors (multipliers of the defaults). */
  readonly light?: { readonly key?: number; readonly hemi?: number; readonly exposure?: number; readonly fog?: readonly [near: number, far: number]; readonly bloom?: number };
  /** Extra clean-up (mirror render targets…). */
  dispose?(): void;
  /** Resolves when async assets (GLB models) are in the scene. */
  readonly ready?: Promise<unknown>;
  /** Real-world HDR photo used for lighting and, optionally, as the visible backdrop. */
  readonly hdri?: {
    readonly name: HdriName;
    readonly background?: boolean;
    readonly blur?: number;
    readonly backgroundIntensity?: number;
    readonly envIntensity?: number;
    /** Turns the backdrop (radians) so the best part of the photo is ahead. */
    readonly rotation?: number;
  };
  /** Camera route for the scroll-driven 3D journey (positions and look-at targets). */
  readonly journey?: { readonly positions: THREE.Vector3[]; readonly targets: THREE.Vector3[] };
  /** Opaque sky for journey scenes (environment scenes are not transparent). */
  readonly sky?: readonly [top: string, middle: string, horizon: string];
}


// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Deterministic pseudo-random numbers so every render of a design looks the same. */
export function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const gold = (p: ScenePalette, roughness = 0.26) =>
  new THREE.MeshStandardMaterial({ color: p.accent, metalness: 1, roughness });

export const stone = (p: ScenePalette) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f5eddc').lerp(new THREE.Color(p.surface), 0.18),
    metalness: 0.05,
    roughness: 0.55,
  });

export const glow = (color: string, intensity = 1.6) =>
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });

/** Soft round sprite texture used for stars, sparks and halos. */
export function radialTexture(inner: string, outer = 'rgba(0,0,0,0)'): THREE.CanvasTexture {
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
export function starField(count: number, radius: number, color: string, size: number, seed: number): THREE.Points {
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
export function halo(color: string, size: number): THREE.Mesh {
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
export function starShape(points: number, outer: number, inner: number): THREE.Shape {
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
export function crescentShape(): THREE.Shape {
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
export function archShape(width: number, height: number): THREE.Shape {
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

export const extrude = (shape: THREE.Shape, depth: number, bevel = 0.04) =>
  new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 48,
  }).center();

/** A traditional brass lantern with a glowing glass body. */
export function makeLantern(brass: THREE.Material, glass: THREE.Material): THREE.Group {
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
// Environment helpers (garden, palace, beach, hall, cake scenes)
// ---------------------------------------------------------------------------

/**
 * Many small blossoms drawn with one InstancedMesh (fast even with hundreds).
 * `place` returns the position for blossom i; colours cycle through `colors`.
 */
export function blossoms(
  count: number,
  colors: readonly string[],
  size: number,
  place: (i: number, random: () => number) => THREE.Vector3,
  seed = 1,
): THREE.InstancedMesh {
  const random = seeded(seed);
  const mesh = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0 }),
    count,
  );
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const s = size * (0.65 + random() * 0.7);
    quaternion.setFromEuler(new THREE.Euler(random() * 3, random() * 3, random() * 3));
    matrix.compose(place(i, random), quaternion, new THREE.Vector3(s, s * 0.8, s));
    mesh.setMatrixAt(i, matrix);
    mesh.setColorAt(i, color.set(colors[i % colors.length]).offsetHSL(0, 0, (random() - 0.5) * 0.08));
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}

/** A strand of warm fairy-light bulbs hanging between two points. */
export function stringLights(from: THREE.Vector3, to: THREE.Vector3, sag: number, bulbs: number, color: string): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 10, 10), glow(color, 3), bulbs);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < bulbs; i++) {
    const t = i / (bulbs - 1);
    const point = from.clone().lerp(to, t);
    point.y -= Math.sin(t * Math.PI) * sag;
    matrix.makeTranslation(point.x, point.y, point.z);
    mesh.setMatrixAt(i, matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

/** Stylised tree: trunk + layered foliage spheres. */
export function tree(height: number, leaves: string, seed: number): THREE.Group {
  const random = seeded(seed);
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12 * height * 0.3, 0.2 * height * 0.3, height * 0.55, 10),
    new THREE.MeshStandardMaterial({ color: '#6b4a2f', roughness: 0.95 }),
  );
  trunk.position.y = height * 0.27;
  group.add(trunk);
  const leaf = new THREE.MeshStandardMaterial({ color: leaves, roughness: 0.9 });
  for (let i = 0; i < 6; i++) {
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(height * (0.18 + random() * 0.1), 1), leaf);
    ball.position.set((random() - 0.5) * height * 0.35, height * (0.6 + random() * 0.3), (random() - 0.5) * height * 0.35);
    group.add(ball);
  }
  return group;
}

/** Ground plane with a soft, slightly varied surface. */
export function ground(size: number, color: string, roughness = 0.95, metalness = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size, 1, 1),
    new THREE.MeshStandardMaterial({ color, roughness, metalness }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}

export const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
