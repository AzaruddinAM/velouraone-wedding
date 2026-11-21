/**
 * Building blocks for the "Venue" 3D series (W93 …): draped fabric, arches,
 * mirror floors, stylised couple figures and invitation panels that carry the
 * couple's real names (drawn into a canvas texture).
 */
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { SceneLabels, ScenePalette, glow, seeded } from '../scene-kit';
import { CoupleOptions, illustratedCouple } from './couple-art';

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

/** Rectangle with a semicircular top. Origin at the bottom centre; total height `h`. */
export function roundArch(w: number, h: number): THREE.Shape {
  const r = w / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-r, 0);
  shape.lineTo(-r, h - r);
  shape.absarc(0, h - r, r, Math.PI, 0, true);
  shape.lineTo(r, 0);
  shape.closePath();
  return shape;
}

/** Pointed (gothic / Mughal) arch. Origin at the bottom centre; total height `h`. */
export function pointedArch(w: number, h: number): THREE.Shape {
  const r = w / 2;
  const spring = h - w * 0.85;
  const shape = new THREE.Shape();
  shape.moveTo(-r, 0);
  shape.lineTo(-r, spring);
  shape.quadraticCurveTo(-r, h - w * 0.12, 0, h);
  shape.quadraticCurveTo(r, h - w * 0.12, r, spring);
  shape.lineTo(r, 0);
  shape.closePath();
  return shape;
}

export type ArchKind = 'round' | 'pointed';
const archOf = (kind: ArchKind, w: number, h: number) => (kind === 'round' ? roundArch(w, h) : pointedArch(w, h));

/** Arch-shaped frame (an arch with an arch-shaped hole), extruded. */
export function archFrame(kind: ArchKind, w: number, h: number, border: number, depth: number, material: THREE.Material): THREE.Mesh {
  // Start the outline a hair lower than the hole so their edges never touch.
  const outer = new THREE.Shape(archOf(kind, w + border * 2, h + border + 0.02).getPoints(64).map((pt) => pt.setY(pt.y - 0.02)));
  const hole = archOf(kind, w, h);
  outer.holes.push(new THREE.Path(hole.getPoints(48)));
  const geometry = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 48 });
  geometry.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geometry, material);
}

/** Flat mesh of a shape with UVs stretched 0 → 1 over its bounds (for canvas textures). */
export function shapeMesh(shape: THREE.Shape, material: THREE.Material): THREE.Mesh {
  const geometry = new THREE.ShapeGeometry(shape, 48);
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const position = geometry.attributes['position'];
  const uv = geometry.attributes['uv'];
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) - box.min.x) / (box.max.x - box.min.x), (position.getY(i) - box.min.y) / (box.max.y - box.min.y));
  }
  uv.needsUpdate = true;
  return new THREE.Mesh(geometry, material);
}

// ---------------------------------------------------------------------------
// Fabric
// ---------------------------------------------------------------------------

export function fabric(color: string, roughness = 0.62, sheen = 1): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    sheen,
    sheenColor: new THREE.Color('#ffffff'),
    sheenRoughness: 0.45,
    side: THREE.DoubleSide,
  });
}

/**
 * Hanging curtain with soft folds. `gather` ties it back towards one side
 * (like a theatre / wedding drape). Origin at the bottom centre.
 */
export function drape(
  w: number,
  h: number,
  material: THREE.Material,
  { folds = 9, depth = 0.12, gather = 'none' as 'none' | 'left' | 'right', tie = 0.38 } = {},
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(w, h, Math.max(24, folds * 10), 40);
  const position = geometry.attributes['position'];
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const u = (x + w / 2) / w;
    const v = (y + h / 2) / h;
    let nx = x;
    let fold = depth;
    if (gather !== 'none') {
      // Pinch the fabric towards the side edge around the tie height.
      const pinch = 0.72 * Math.exp(-((v - tie) ** 2) / 0.02) + 0.35 * Math.max(0, tie - v);
      const s = Math.min(0.85, pinch);
      nx = gather === 'left' ? -w / 2 + (x + w / 2) * (1 - s) : w / 2 - (w / 2 - x) * (1 - s);
      fold = depth * (1 + s * 1.6);
    }
    position.setXYZ(i, nx, y + h / 2, Math.sin(u * folds * Math.PI * 2) * fold + Math.sin(v * 3 + u * 7) * 0.02);
  }
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = false;
  return mesh;
}

/** Fabric swag hanging between two points. */
export function swag(from: THREE.Vector3, to: THREE.Vector3, sag: number, thickness: number, material: THREE.Material): THREE.Mesh {
  const middle = from.clone().lerp(to, 0.5);
  middle.y -= sag;
  const curve = new THREE.QuadraticBezierCurve3(from, middle, to);
  const geometry = new THREE.TubeGeometry(curve, 40, thickness, 12, false);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

// ---------------------------------------------------------------------------
// Floors and water
// ---------------------------------------------------------------------------

/** Real mirror reflection (polished marble, lake, mirror aisle) + a tinted veil on top. */
export function mirror(width: number, depth: number, tint: string, veil: string, veilOpacity = 0.55): { group: THREE.Group; dispose(): void } {
  const group = new THREE.Group();
  const reflector = new Reflector(new THREE.PlaneGeometry(width, depth), {
    clipBias: 0.003,
    textureWidth: 1024,
    textureHeight: 1024,
    color: new THREE.Color(tint),
  });
  reflector.rotation.x = -Math.PI / 2;
  const cover = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({ color: veil, transparent: true, opacity: veilOpacity, roughness: 0.25, metalness: 0.1 }),
  );
  cover.rotation.x = -Math.PI / 2;
  cover.position.y = 0.004;
  cover.receiveShadow = true;
  group.add(reflector, cover);
  return { group, dispose: () => reflector.dispose() };
}

/** Moving stripe texture (waterfalls, shimmering water). */
export function flowTexture(light: string, dark: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, 64, 256);
  const random = seeded(9);
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = light;
    ctx.globalAlpha = 0.25 + random() * 0.6;
    ctx.fillRect(random() * 64, random() * 256, 1 + random() * 3, 10 + random() * 40);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ---------------------------------------------------------------------------
// Lights and props
// ---------------------------------------------------------------------------

/** Pillar candle with a flickering flame; returns the flame for animation. */
export function candle(height = 0.35, radius = 0.06): THREE.Group {
  const group = new THREE.Group();
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 14), new THREE.MeshStandardMaterial({ color: '#fbf4e6', roughness: 0.6 }));
  wax.position.y = height / 2;
  const flame = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.45, radius * 1.4, 10), glow('#ffb347', 5));
  flame.position.y = height + radius * 0.7;
  flame.name = 'flame';
  group.add(wax, flame);
  return group;
}

/** Glass globe lamp on a slim post. */
export function globeLamp(height: number, brass: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, height, 10), brass);
  post.position.y = height / 2;
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), glow('#fff2d6', 3.2));
  globe.position.y = height + 0.2;
  group.add(post, globe);
  return group;
}

/** Flickers every mesh named "flame" under `root`. */
export function flicker(root: THREE.Object3D): (t: number) => void {
  const flames: THREE.Object3D[] = [];
  root.traverse((o) => o.name === 'flame' && flames.push(o));
  return (t) => flames.forEach((f, i) => (f.scale.y = 1 + Math.sin(t * 9 + i * 1.7) * 0.15 + Math.sin(t * 23 + i) * 0.06));
}

/** Hand-illustrated groom & bride standing in the scene (see couple-art.ts). */
export function couple(p: ScenePalette, options: CoupleOptions = {}): { groom: THREE.Group; bride: THREE.Group } {
  return illustratedCouple(p, options);
}

// ---------------------------------------------------------------------------
// Invitation panels with the couple's names
// ---------------------------------------------------------------------------

export interface PanelStyle {
  /** Background fill; 'glass' leaves it see-through. */
  readonly paper: string | 'glass';
  readonly ink: string;
  readonly accent: string;
  /** Which lines to draw. */
  readonly layout?: 'full' | 'names' | 'monogram' | 'events';
  readonly border?: boolean;
}

const FALLBACK: SceneLabels = {
  bride: 'Ayesha',
  groom: 'Rayan',
  initials: 'A & R',
  opening: 'Together with their families',
  invitation: 'request the honour of your presence at their wedding',
  date: 'Saturday, 12 December 2026',
  time: '11:00 AM',
  venue: 'The Grand Palace',
  fontScript: "'Great Vibes', cursive",
  fontHeading: "'Cinzel', serif",
  fontBody: "'Cormorant Garamond', serif",
};

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function drawPanel(canvas: HTMLCanvasElement, labels: SceneLabels, style: PanelStyle, arch: ArchKind | 'rect'): void {
  const ctx = canvas.getContext('2d')!;
  const { width: W, height: H } = canvas;
  ctx.clearRect(0, 0, W, H);
  if (style.paper !== 'glass') {
    ctx.fillStyle = style.paper;
    ctx.fillRect(0, 0, W, H);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, 'rgba(255,255,255,0.22)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
  }
  // Inner border that follows the arch.
  if (style.border !== false) {
    ctx.strokeStyle = style.accent;
    for (const [inset, lw] of [[W * 0.05, 3], [W * 0.065, 1.2]] as const) {
      ctx.lineWidth = lw;
      ctx.beginPath();
      const r = W / 2 - inset;
      if (arch === 'round') {
        ctx.moveTo(inset, H - inset);
        ctx.lineTo(inset, r + inset);
        ctx.arc(W / 2, r + inset, r, Math.PI, 0);
        ctx.lineTo(W - inset, H - inset);
        ctx.closePath();
      } else if (arch === 'pointed') {
        ctx.moveTo(inset, H - inset);
        ctx.lineTo(inset, W * 0.85);
        ctx.quadraticCurveTo(inset, W * 0.14 + inset, W / 2, inset * 1.4);
        ctx.quadraticCurveTo(W - inset, W * 0.14 + inset, W - inset, W * 0.85);
        ctx.lineTo(W - inset, H - inset);
        ctx.closePath();
      } else {
        ctx.rect(inset, inset, W - inset * 2, H - inset * 2);
      }
      ctx.stroke();
    }
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cx = W / 2;
  const unit = W / 100;
  let y = arch === 'rect' ? H * 0.12 : W * 0.42;
  const line = (text: string, font: string, color: string, gap: number) => {
    ctx.font = font;
    ctx.fillStyle = color;
    // A thin outline in the same colour thickens the strokes so text stays legible when the panel is small on screen.
    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1, parseFloat(font.replace(/^italic /, '')) * 0.045);
    for (const l of wrap(ctx, text, W * 0.74)) {
      ctx.strokeText(l, cx, y);
      ctx.fillText(l, cx, y);
      y += gap;
    }
  };
  const ornament = () => {
    ctx.strokeStyle = style.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.2, y);
    ctx.lineTo(cx - unit * 3, y);
    ctx.moveTo(cx + unit * 3, y);
    ctx.lineTo(cx + W * 0.2, y);
    ctx.stroke();
    ctx.fillStyle = style.accent;
    ctx.beginPath();
    ctx.moveTo(cx, y - unit * 1.6);
    ctx.lineTo(cx + unit * 1.6, y);
    ctx.lineTo(cx, y + unit * 1.6);
    ctx.lineTo(cx - unit * 1.6, y);
    ctx.fill();
    y += unit * 7;
  };

  const layout = style.layout ?? 'full';
  if (layout === 'monogram') {
    y = H * 0.42;
    line(labels.initials, `${unit * 22}px ${labels.fontScript}`, style.accent, unit * 20);
    ornament();
    line(labels.date, `${unit * 5}px ${labels.fontHeading}`, style.ink, unit * 7);
    return;
  }
  if (labels.arabic) line(labels.arabic, `${unit * 6.5}px 'Aref Ruqaa', serif`, style.accent, unit * 9);
  if (layout !== 'names') line(labels.opening.toUpperCase(), `${unit * 3.8}px ${labels.fontHeading}`, style.ink, unit * 5.6);
  y += unit * 3;
  line(labels.bride, `${unit * 14}px ${labels.fontScript}`, style.accent, unit * 11);
  line('&', `${unit * 7}px ${labels.fontScript}`, style.ink, unit * 10);
  line(labels.groom, `${unit * 14}px ${labels.fontScript}`, style.accent, unit * 13);
  ornament();
  if (layout === 'names') {
    line(labels.date, `${unit * 4.4}px ${labels.fontHeading}`, style.ink, unit * 6);
    return;
  }
  if (layout === 'full') line(labels.invitation, `italic ${unit * 4.8}px ${labels.fontBody}`, style.ink, unit * 6.2);
  y += unit * 2;
  line(labels.date.toUpperCase(), `${unit * 4.8}px ${labels.fontHeading}`, style.ink, unit * 6);
  line(labels.time, `${unit * 4.4}px ${labels.fontBody}`, style.ink, unit * 6);
  line(labels.venue, `${unit * 5.2}px ${labels.fontHeading}`, style.accent, unit * 6.4);
}

/**
 * Arch / rectangular invitation panel showing the couple's names and date.
 * The texture is redrawn once the web fonts have loaded.
 */
export function invitationPanel(
  p: ScenePalette,
  w: number,
  h: number,
  arch: ArchKind | 'rect',
  style: PanelStyle,
): THREE.Mesh {
  const labels = p.labels ?? FALLBACK;
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = Math.round((900 * h) / w);
  drawPanel(canvas, labels, style, arch);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  if (typeof document !== 'undefined' && document.fonts) {
    const fonts = [labels.fontScript, labels.fontHeading, labels.fontBody].map((f) => `40px ${f}`);
    void Promise.all(fonts.map((f) => document.fonts.load(f).catch(() => null))).then(() => {
      drawPanel(canvas, labels, style, arch);
      texture.needsUpdate = true;
    });
  }
  const material =
    style.paper === 'glass'
      ? new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide })
      : // Evenly lit like a backlit sign, kept just under the bloom threshold so text never blows out.
        new THREE.MeshBasicMaterial({ map: texture, color: '#f2f2f2', toneMapped: false, transparent: style.paper.startsWith('rgba'), side: THREE.DoubleSide });
  const shape = arch === 'rect' ? rectShape(w, h) : archOf(arch, w, h);
  return shapeMesh(shape, material);
}

function rectShape(w: number, h: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(-w / 2, h);
  shape.lineTo(w / 2, h);
  shape.lineTo(w / 2, 0);
  shape.closePath();
  return shape;
}

/** Glass slab behind a 'glass' panel (gives it thickness and a glint). */
export function glassSlab(arch: ArchKind | 'rect', w: number, h: number): THREE.Mesh {
  const shape = arch === 'rect' ? rectShape(w, h) : archOf(arch, w, h);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2, curveSegments: 40 });
  geometry.translate(0, 0, -0.06);
  return new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, transmission: 0.92, thickness: 0.3, ior: 1.45, transparent: true, opacity: 0.6 }),
  );
}

/** A loose cloud made of soft spheres. */
export function cloud(scale: number, seed: number): THREE.Group {
  const random = seeded(seed);
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#ffffff', emissiveIntensity: 0.25 });
  for (let i = 0; i < 9; i++) {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(scale * (0.5 + random() * 0.5), 2), material);
    puff.position.set((random() - 0.5) * scale * 3, (random() - 0.3) * scale * 0.7, (random() - 0.5) * scale);
    group.add(puff);
  }
  return group;
}

/** Instanced pearls scattered with `place`. */
export function pearls(count: number, size: number, place: (i: number, r: () => number) => THREE.Vector3, seed = 5): THREE.InstancedMesh {
  const random = seeded(seed);
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 20, 14),
    new THREE.MeshPhysicalMaterial({ color: '#fbf6ee', roughness: 0.18, metalness: 0.1, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color('#ffe9d0'), iridescence: 0.4 }),
    count,
  );
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    const s = size * (0.6 + random() * 0.8);
    matrix.makeScale(s, s, s);
    matrix.setPosition(place(i, random));
    mesh.setMatrixAt(i, matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}
