/**
 * Illustrated bride & groom for the venue scenes – hand-drawn on a canvas
 * (shaded fabric, faces, jewellery, bouquet, veil / dupatta) and shown as
 * cut-out figures standing in the 3D scene, like the couple in a
 * wedding-invitation illustration. Front and back views.
 */
import * as THREE from 'three';
import { ScenePalette } from '../scene-kit';

export interface CoupleOptions {
  /** Groom's outfit colour. Dark → western suit; light → sherwani with safa and stole. */
  readonly suit?: string;
  /** Bride's outfit colour. */
  readonly gown?: string;
  /** Gold border colour → lehenga with dupatta (instead of a white gown). */
  readonly gownTone?: string;
  readonly veil?: boolean;
  readonly skin?: string;
  readonly hair?: string;
  /** Seen from behind (couples walking away from the guests). */
  readonly back?: boolean;
}

type Ctx = CanvasRenderingContext2D;

const SCALE = 2; // canvas pixels per drawing unit (crisp when the camera is close)

function luminance(hex: string): number {
  const c = new THREE.Color(hex);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

/** Fills the current path, then shades it with a soft side-to-side gradient (fabric volume). */
function fillShaded(ctx: Ctx, color: string, x0: number, x1: number, depth = 0.28): void {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, `rgba(0,0,0,${depth})`);
  g.addColorStop(0.35, 'rgba(255,255,255,0.08)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, `rgba(0,0,0,${depth + 0.06})`);
  ctx.fillStyle = g;
  ctx.fillRect(x0 - 50, 0, x1 - x0 + 100, 1200);
  ctx.restore();
}

function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, color: string): void {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Soft, closed-eye face (calm, happy expression). */
function face(ctx: Ctx, x: number, y: number, s: number, skin: string, lips: string): void {
  const head = ctx.createRadialGradient(x - s * 8, y - s * 10, s * 4, x, y, s * 50);
  head.addColorStop(0, new THREE.Color(skin).offsetHSL(0, 0, 0.06).getStyle());
  head.addColorStop(1, new THREE.Color(skin).offsetHSL(0, 0, -0.1).getStyle());
  ctx.beginPath();
  ctx.ellipse(x, y, s * 34, s * 44, 0, 0, Math.PI * 2);
  ctx.fillStyle = head;
  ctx.fill();
  ctx.strokeStyle = 'rgba(40,22,15,0.85)';
  ctx.lineCap = 'round';
  ctx.lineWidth = s * 2.6;
  for (const side of [-1, 1]) {
    // brow
    ctx.beginPath();
    ctx.moveTo(x + side * s * 7, y - s * 12);
    ctx.quadraticCurveTo(x + side * s * 15, y - s * 17, x + side * s * 23, y - s * 12);
    ctx.stroke();
    // closed eye with lashes
    ctx.beginPath();
    ctx.moveTo(x + side * s * 8, y - s * 2);
    ctx.quadraticCurveTo(x + side * s * 15, y + s * 4, x + side * s * 22, y - s * 2);
    ctx.stroke();
    // blush
    const blush = ctx.createRadialGradient(x + side * s * 18, y + s * 12, 0, x + side * s * 18, y + s * 12, s * 10);
    blush.addColorStop(0, 'rgba(230,120,120,0.28)');
    blush.addColorStop(1, 'rgba(230,120,120,0)');
    ctx.fillStyle = blush;
    ctx.fillRect(x + side * s * 18 - s * 10, y + s * 2, s * 20, s * 20);
  }
  // nose
  ctx.lineWidth = s * 1.8;
  ctx.strokeStyle = 'rgba(90,50,35,0.45)';
  ctx.beginPath();
  ctx.moveTo(x - s * 2, y + s * 4);
  ctx.quadraticCurveTo(x - s * 5, y + s * 14, x + s * 2, y + s * 15);
  ctx.stroke();
  // smile
  ctx.fillStyle = lips;
  ctx.beginPath();
  ctx.moveTo(x - s * 9, y + s * 23);
  ctx.quadraticCurveTo(x, y + s * 31, x + s * 9, y + s * 23);
  ctx.quadraticCurveTo(x, y + s * 26, x - s * 9, y + s * 23);
  ctx.fill();
}

function lighter(color: string, amount: number): string {
  return new THREE.Color(color).offsetHSL(0, 0, amount).getStyle();
}

// ---------------------------------------------------------------------------
// Groom (drawing units: 200 × 500, feet at y = 492)
// ---------------------------------------------------------------------------
function drawGroom(ctx: Ctx, p: ScenePalette, o: Required<Omit<CoupleOptions, 'gownTone'>>): void {
  const cx = 100;
  const sherwani = luminance(o.suit) > 0.3;
  const trousers = sherwani ? '#f3ece0' : lighter(o.suit, -0.02);
  const gold = p.accent;

  // Soft shadow on the floor.
  const shadow = ctx.createRadialGradient(cx, 490, 2, cx, 490, 60);
  shadow.addColorStop(0, 'rgba(0,0,0,0.35)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadow;
  ctx.fillRect(cx - 60, 478, 120, 22);

  // Shoes / mojari.
  ellipse(ctx, cx - 14, 487, 14, 6, sherwani ? gold : '#141414');
  ellipse(ctx, cx + 14, 487, 14, 6, sherwani ? gold : '#141414');

  // Legs.
  ctx.beginPath();
  ctx.moveTo(cx - 26, sherwani ? 340 : 285);
  ctx.lineTo(cx - 24, 484);
  ctx.lineTo(cx - 4, 484);
  ctx.lineTo(cx, 330);
  ctx.lineTo(cx + 4, 484);
  ctx.lineTo(cx + 24, 484);
  ctx.lineTo(cx + 26, sherwani ? 340 : 285);
  ctx.closePath();
  fillShaded(ctx, trousers, cx - 26, cx + 26, 0.2);

  // Coat: knee-length sherwani or hip-length suit jacket.
  const hem = sherwani ? 355 : 292;
  const coat = new Path2D();
  coat.moveTo(cx - 12, 112);
  coat.quadraticCurveTo(cx - 44, 116, cx - 50, 132);
  coat.lineTo(cx - 46, 230);
  coat.quadraticCurveTo(cx - 44, 300, cx - (sherwani ? 46 : 38), hem);
  coat.quadraticCurveTo(cx, hem + 6, cx + (sherwani ? 46 : 38), hem);
  coat.quadraticCurveTo(cx + 44, 300, cx + 46, 230);
  coat.lineTo(cx + 50, 132);
  coat.quadraticCurveTo(cx + 44, 116, cx + 12, 112);
  coat.closePath();
  ctx.save();
  ctx.fillStyle = o.suit;
  ctx.fill(coat);
  ctx.clip(coat);
  const g = ctx.createLinearGradient(cx - 50, 0, cx + 50, 0);
  g.addColorStop(0, 'rgba(0,0,0,0.3)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.1)');
  g.addColorStop(1, 'rgba(0,0,0,0.36)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 200, 500);
  ctx.restore();

  if (!o.back) {
    if (sherwani) {
      // Embroidered collar, placket and gold buttons.
      ctx.strokeStyle = gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, 118);
      ctx.lineTo(cx, hem - 4);
      ctx.stroke();
      ctx.fillStyle = gold;
      for (let y = 128; y < 240; y += 16) ellipse(ctx, cx, y, 3, 3, gold);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 44, hem - 8);
      ctx.quadraticCurveTo(cx, hem - 2, cx + 44, hem - 8);
      ctx.stroke();
      // Stole across the shoulder.
      ctx.beginPath();
      ctx.moveTo(cx - 40, 118);
      ctx.lineTo(cx - 24, 114);
      ctx.quadraticCurveTo(cx + 10, 220, cx + 44, 300);
      ctx.lineTo(cx + 30, 310);
      ctx.quadraticCurveTo(cx - 6, 230, cx - 40, 118);
      ctx.fillStyle = p.primary;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = gold;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      // Shirt, tie and lapels.
      ctx.beginPath();
      ctx.moveTo(cx - 14, 114);
      ctx.lineTo(cx, 190);
      ctx.lineTo(cx + 14, 114);
      ctx.closePath();
      ctx.fillStyle = '#f7f5f0';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - 4, 122);
      ctx.lineTo(cx + 4, 122);
      ctx.lineTo(cx + 5, 170);
      ctx.lineTo(cx, 180);
      ctx.lineTo(cx - 5, 170);
      ctx.closePath();
      ctx.fillStyle = luminance(o.suit) < 0.1 ? '#1a1a1a' : lighter(o.suit, -0.15);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 14, 114);
      ctx.lineTo(cx - 4, 200);
      ctx.moveTo(cx + 14, 114);
      ctx.lineTo(cx + 4, 200);
      ctx.stroke();
      // Boutonniere.
      ellipse(ctx, cx + 28, 150, 5, 5, '#ffffff');
      ellipse(ctx, cx + 31, 154, 3, 3, '#f2c9d3');
    }
  }

  // Sleeves and hands.
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + side * 44, 128);
    ctx.quadraticCurveTo(cx + side * 60, 180, cx + side * 56, 262);
    ctx.lineTo(cx + side * 42, 262);
    ctx.quadraticCurveTo(cx + side * 44, 200, cx + side * 36, 150);
    ctx.closePath();
    fillShaded(ctx, lighter(o.suit, -0.03), cx + side * 60, cx + side * 36, 0.22);
    ellipse(ctx, cx + side * 50, 270, 8, 10, o.skin);
  }

  // Neck and head.
  ctx.fillStyle = lighter(o.skin, -0.06);
  ctx.fillRect(cx - 9, 92, 18, 24);
  if (o.back) {
    ellipse(ctx, cx, 66, 34, 44, o.hair);
  } else {
    face(ctx, cx, 66, 1, o.skin, '#a5574f');
    // Hair.
    ctx.beginPath();
    ctx.ellipse(cx, 50, 36, 30, 0, Math.PI, 0);
    ctx.quadraticCurveTo(cx + 26, 40, cx + 10, 36);
    ctx.quadraticCurveTo(cx - 20, 34, cx - 34, 56);
    ctx.closePath();
    ctx.fillStyle = o.hair;
    ctx.fill();
    // Short beard line.
    ctx.strokeStyle = 'rgba(30,20,15,0.25)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(cx, 72, 30, 36, 0, 0.25 * Math.PI, 0.75 * Math.PI);
    ctx.stroke();
  }
  if (sherwani) {
    // Safa (wedding turban) with a brooch.
    ctx.beginPath();
    ctx.ellipse(cx, 38, 40, 24, 0, Math.PI, 0);
    ctx.lineTo(cx + 38, 48);
    ctx.quadraticCurveTo(cx, 58, cx - 38, 48);
    ctx.closePath();
    fillShaded(ctx, p.primary, cx - 40, cx + 40, 0.25);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - 36, 44 - i * 7);
      ctx.quadraticCurveTo(cx, 30 - i * 8, cx + 36, 44 - i * 7);
      ctx.stroke();
    }
    if (!o.back) {
      ellipse(ctx, cx, 30, 6, 7, gold);
      ellipse(ctx, cx, 30, 3, 3.5, '#b3263a');
    }
  }
}

// ---------------------------------------------------------------------------
// Bride (drawing units: 320 × 500, feet at y = 492)
// ---------------------------------------------------------------------------
function drawBride(ctx: Ctx, p: ScenePalette, o: Required<CoupleOptions>): void {
  const cx = 160;
  const lehenga = !!o.gownTone;
  const gold = o.gownTone || p.accent;

  const shadow = ctx.createRadialGradient(cx, 488, 4, cx, 488, 150);
  shadow.addColorStop(0, 'rgba(0,0,0,0.3)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadow;
  ctx.fillRect(cx - 150, 472, 300, 28);

  // Veil / dupatta behind the body.
  const drapeColor = lehenga ? p.primary : '#ffffff';
  if (o.veil || lehenga) {
    ctx.beginPath();
    ctx.moveTo(cx - 20, 48);
    ctx.quadraticCurveTo(cx - 110, 260, cx - 148, 494);
    ctx.lineTo(cx + 148, 494);
    ctx.quadraticCurveTo(cx + 110, 260, cx + 20, 48);
    ctx.closePath();
    ctx.globalAlpha = lehenga ? 0.55 : 0.4;
    ctx.fillStyle = drapeColor;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Skirt (ball gown / lehenga) with folds.
  const skirt = new Path2D();
  skirt.moveTo(cx - 26, 205);
  skirt.bezierCurveTo(cx - 60, 280, cx - 140, 380, cx - 146, 488);
  for (let i = 0; i <= 8; i++) {
    const x = cx - 146 + (292 * i) / 8;
    skirt.quadraticCurveTo(x - 18, 496, x, 488 + (i % 2 ? 3 : -2));
  }
  skirt.bezierCurveTo(cx + 140, 380, cx + 60, 280, cx + 26, 205);
  skirt.closePath();
  ctx.save();
  ctx.fillStyle = o.gown;
  ctx.fill(skirt);
  ctx.clip(skirt);
  const g = ctx.createLinearGradient(cx - 146, 0, cx + 146, 0);
  g.addColorStop(0, 'rgba(0,0,0,0.28)');
  g.addColorStop(0.42, 'rgba(255,255,255,0.12)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.06)');
  g.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 320, 500);
  // Fabric folds.
  ctx.lineWidth = 3;
  for (let i = -4; i <= 4; i++) {
    ctx.strokeStyle = i % 2 ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.moveTo(cx + i * 5, 210);
    ctx.quadraticCurveTo(cx + i * 18, 340, cx + i * 32, 492);
    ctx.stroke();
  }
  if (lehenga) {
    // Gold zari border and buttis.
    ctx.strokeStyle = gold;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(cx - 146, 476);
    ctx.quadraticCurveTo(cx, 492, cx + 146, 476);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 140, 460);
    ctx.quadraticCurveTo(cx, 476, cx + 140, 460);
    ctx.stroke();
    ctx.fillStyle = gold;
    for (let i = 0; i < 70; i++) {
      const t = (i * 37) % 100 / 100;
      const row = ((i * 53) % 100) / 100;
      const y = 230 + row * 220;
      const half = 26 + (row * 110);
      ellipse(ctx, cx - half + t * half * 2, y, 2, 2, gold);
    }
  }
  ctx.restore();

  // Bodice.
  ctx.beginPath();
  ctx.moveTo(cx - 26, 112);
  ctx.quadraticCurveTo(cx - 32, 160, cx - 24, 210);
  ctx.lineTo(cx + 24, 210);
  ctx.quadraticCurveTo(cx + 32, 160, cx + 26, 112);
  ctx.quadraticCurveTo(cx, o.back ? 108 : 128, cx - 26, 112);
  ctx.closePath();
  fillShaded(ctx, lehenga ? lighter(o.gown, -0.04) : o.gown, cx - 30, cx + 30, 0.22);
  if (lehenga) {
    ctx.strokeStyle = gold;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Arms holding the bouquet at the waist.
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + side * 26, 116);
    if (o.back) ctx.quadraticCurveTo(cx + side * 40, 170, cx + side * 36, 232);
    else ctx.quadraticCurveTo(cx + side * 44, 170, cx + side * 14, 214);
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.strokeStyle = lehenga ? lighter(o.gown, -0.04) : o.skin;
    ctx.stroke();
  }
  if (!o.back) {
    // Bouquet.
    const flowers = ['#ffffff', '#f6d3dc', '#f2b8c6', '#fff3e0'];
    for (let i = 0; i < 16; i++) {
      const a = i * 2.4;
      const r = 4 + (i % 5) * 3.6;
      ellipse(ctx, cx + Math.cos(a) * r, 214 + Math.sin(a) * r * 0.8, 8, 7, flowers[i % 4]);
    }
    ctx.strokeStyle = '#6f9b55';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 6, 230);
    ctx.lineTo(cx - 10, 262);
    ctx.moveTo(cx + 4, 230);
    ctx.lineTo(cx + 8, 258);
    ctx.stroke();
  }

  // Neck, necklace, head.
  ctx.fillStyle = lighter(o.skin, -0.05);
  ctx.fillRect(cx - 8, 88, 16, 26);
  if (!o.back) {
    ctx.strokeStyle = gold;
    ctx.lineWidth = lehenga ? 5 : 2;
    ctx.beginPath();
    ctx.ellipse(cx, 106, 16, 14, 0, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }
  // Hair (bun behind).
  ellipse(ctx, cx, 64, 36, 44, o.hair);
  ellipse(ctx, cx, 24, 18, 14, o.hair);
  if (!o.back) {
    ctx.save();
    ctx.scale(0.92, 0.92);
    face(ctx, cx / 0.92, 70 / 0.92, 1, o.skin, '#c0505d');
    ctx.restore();
    // Hair parting framing the face.
    ctx.beginPath();
    ctx.ellipse(cx, 52, 34, 26, 0, Math.PI, 0);
    ctx.quadraticCurveTo(cx + 12, 36, cx, 34);
    ctx.quadraticCurveTo(cx - 12, 36, cx - 34, 52);
    ctx.fillStyle = o.hair;
    ctx.fill();
    if (lehenga) {
      // Maang tikka.
      ctx.strokeStyle = gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, 30);
      ctx.lineTo(cx, 44);
      ctx.stroke();
      ellipse(ctx, cx, 47, 4, 5, gold);
    } else {
      // Pearl tiara.
      for (let i = -3; i <= 3; i++) ellipse(ctx, cx + i * 7, 32 + Math.abs(i) * 2, 2.6, 2.6, '#fbf6ee');
    }
  }
  // Veil or dupatta over the head (in front when seen from behind).
  if (o.veil || lehenga) {
    ctx.beginPath();
    ctx.moveTo(cx - 40, 60);
    ctx.quadraticCurveTo(cx, 6, cx + 40, 60);
    ctx.quadraticCurveTo(cx + 44, 90, cx + 46, 120);
    ctx.lineTo(cx + 38, 120);
    ctx.quadraticCurveTo(cx + 30, 40, cx, 30);
    ctx.quadraticCurveTo(cx - 30, 40, cx - 38, 120);
    ctx.lineTo(cx - 46, 120);
    ctx.closePath();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = drapeColor;
    ctx.fill();
    ctx.globalAlpha = 1;
    if (lehenga) {
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    if (o.back) {
      // Long veil train covering the back of the gown.
      ctx.beginPath();
      ctx.moveTo(cx - 30, 50);
      ctx.quadraticCurveTo(cx - 90, 300, cx - 120, 494);
      ctx.lineTo(cx + 120, 494);
      ctx.quadraticCurveTo(cx + 90, 300, cx + 30, 50);
      ctx.closePath();
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = drapeColor;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

function figure(width: number, height: number, worldHeight: number, draw: (ctx: Ctx) => void): THREE.Group {
  const canvas = document.createElement('canvas');
  canvas.width = width * SCALE;
  canvas.height = height * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const worldWidth = (worldHeight * width) / height;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(worldWidth, worldHeight),
    new THREE.MeshStandardMaterial({ map: texture, transparent: true, alphaTest: 0.04, roughness: 0.85, side: THREE.DoubleSide }),
  );
  mesh.position.y = worldHeight / 2;
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}

/** Illustrated groom & bride; each group's origin is at the figure's feet. */
export function illustratedCouple(p: ScenePalette, options: CoupleOptions = {}): { groom: THREE.Group; bride: THREE.Group } {
  const o: Required<CoupleOptions> = {
    suit: '#f1e6d2',
    gown: '#fbf6ef',
    gownTone: '',
    veil: true,
    skin: '#c99c7d',
    hair: '#1d1612',
    back: false,
    ...options,
  };
  const groom = figure(200, 500, 1.95, (ctx) => drawGroom(ctx, p, o));
  const bride = figure(320, 500, 1.85, (ctx) => drawBride(ctx, p, o));
  return { groom, bride };
}
