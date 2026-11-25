/**
 * Real-time 3D for the wedding websites (Three.js / WebGL).
 *
 * IMPORTANT: this module is only ever loaded with `import()` from `ThreeScene`,
 * so Three.js is downloaded only when a 3D design is actually on screen.
 *
 *  • createLiveStage – animated scene with its own canvas.
 *      - hero mode:    subject framed beside the text, follows the pointer
 *      - journey mode: the camera travels a route as the guest scrolls,
 *                      and guests can drag to look around (realistic scenes)
 *  • snapshotTo      – draws a single frame into a 2D canvas using ONE shared
 *                      renderer (gallery thumbnails never open many WebGL contexts).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { Scene3DKind } from '../../core/models/wedding-template.model';
import { hdri, hdriEnvironment } from './assets';
import { BuiltScene, ScenePalette } from './scene-kit';
import { buildBeach } from './scenes/beach';
import { buildCake } from './scenes/cake';
import { buildGarden } from './scenes/garden';
import { buildHall } from './scenes/hall';
import { buildCrescent, buildGirih, buildLanterns, buildMosque, buildRings } from './scenes/islamic';
import { buildPalace } from './scenes/palace';
import { buildFloralDoor, buildGothicCorridor, buildMirrorHall, buildMoonStairs, buildPearlSatin, buildPortal, buildStorybook } from './scenes/venues-a';
import { buildRealBallroom, buildRealBay, buildRealCake, buildRealEsplanade, buildRealGallery, buildRealLanternNight, buildRealLounge, buildRealTerrace } from './scenes/realistic';
import { buildEaselGallery, buildGrotto, buildIvoryBallroom, buildMoonArcade, buildTheatre, buildVelvetArches } from './scenes/venues-b';

export type { SceneLabels, ScenePalette } from './scene-kit';

export interface StageOptions {
  /** Scroll-driven walk-through with drag-to-look (journey hero). */
  readonly journey?: boolean;
}

export interface LiveStage {
  /** Scroll progress of the 3D journey (0 → 1). */
  setProgress(progress: number): void;
  dispose(): void;
}

const BUILDERS: Record<Scene3DKind, (p: ScenePalette) => BuiltScene> = {
  mosque: buildMosque,
  lanterns: buildLanterns,
  rings: buildRings,
  girih: buildGirih,
  crescent: buildCrescent,
  garden: buildGarden,
  palace: buildPalace,
  beach: buildBeach,
  hall: buildHall,
  cake: buildCake,
  moonstairs: buildMoonStairs,
  portal: buildPortal,
  floraldoor: buildFloralDoor,
  gothic: buildGothicCorridor,
  pearl: buildPearlSatin,
  storybook: buildStorybook,
  mirrorhall: buildMirrorHall,
  grotto: buildGrotto,
  gallery: buildEaselGallery,
  velvet: buildVelvetArches,
  arcade: buildMoonArcade,
  theatre: buildTheatre,
  ballroom: buildIvoryBallroom,
  realballroom: buildRealBallroom,
  realterrace: buildRealTerrace,
  reallantern: buildRealLanternNight,
  realesplanade: buildRealEsplanade,
  realbay: buildRealBay,
  reallounge: buildRealLounge,
  realcake: buildRealCake,
  realgallery: buildRealGallery,
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

/** Vertical sky gradient used as the background of journey scenes. */
function skyTexture([top, middle, horizon]: readonly [string, string, string]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, top);
  gradient.addColorStop(0.6, middle);
  gradient.addColorStop(1, horizon);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 4, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  built: BuiltScene;
  key: THREE.DirectionalLight;
  /** Resolves when GLB models and HDR lighting are in place. */
  loaded: Promise<void>;
}

function createWorld(renderer: THREE.WebGLRenderer, kind: Scene3DKind, palette: ScenePalette, journey: boolean): World {
  const scene = new THREE.Scene();
  scene.environment = environmentFor(renderer);

  const built = BUILDERS[kind](palette);
  const sky = built.sky ?? [palette.bg, palette.surface, palette.bg];
  if (journey) {
    scene.background = skyTexture(sky);
    // Keep pale skies just under the bloom threshold (only lamps and candles should glow).
    scene.backgroundIntensity = 0.82;
    const [near, far] = built.light?.fog ?? [55, 180];
    scene.fog = new THREE.Fog(sky[2], near, far);
  } else {
    scene.fog = new THREE.Fog(palette.bg, 26, 62);
  }

  // Journey scenes are full environments: less flat fill light, a stronger sun → depth and contrast.
  scene.add(journey ? new THREE.HemisphereLight(sky[1], '#2a2620', 0.45 * (built.light?.hemi ?? 1)) : new THREE.HemisphereLight('#ffffff', palette.bg, 0.7));
  if (journey) scene.environmentIntensity = 0.45;
  const key = new THREE.DirectionalLight('#fff3e0', (journey ? 2.6 : 1.8) * (built.light?.key ?? 1));
  key.position.set(6, 12, 8);
  const rim = new THREE.DirectionalLight(palette.primary, 1.1);
  rim.position.set(-6, 3, -5);
  scene.add(key, rim);
  scene.add(built.root);

  const camera = new THREE.PerspectiveCamera(journey ? 55 : 42, 1, 0.1, 400);
  camera.position.copy(built.cameraPosition);
  camera.lookAt(built.cameraTarget);

  // Realistic scenes: real HDR photo for image-based lighting (and as the backdrop).
  const light = built.hdri;
  const hdriReady = light
    ? hdriEnvironment(renderer, light.name).then(async (env) => {
        scene.environment = env;
        scene.environmentIntensity = light.envIntensity ?? 1;
        if (light.background) {
          scene.background = await hdri(light.name);
          scene.backgroundBlurriness = light.blur ?? 0;
          scene.backgroundIntensity = light.backgroundIntensity ?? 1;
          scene.backgroundRotation.y = scene.environmentRotation.y = light.rotation ?? 0;
        }
      })
    : Promise.resolve();
  const loaded = Promise.all([built.ready, hdriReady]).then(() => undefined);
  return { scene, camera, built, key, loaded };
}

/**
 * Hero framing: keeps the 3D subject clear of the text and returns the camera's resting position.
 *  • wide screens – subject shifted to the right (text sits on the left)
 *  • tall screens – camera pulled back and subject shifted up (text sits at the bottom)
 */
function frameHero(camera: THREE.PerspectiveCamera, built: BuiltScene, width: number, height: number): THREE.Vector3 {
  const aspect = width / Math.max(1, height);
  camera.aspect = aspect;
  const distance = aspect >= 1 ? 1 : 1.25 + (1 - aspect) * 0.9;
  const position = built.cameraTarget.clone().add(built.cameraPosition.clone().sub(built.cameraTarget).multiplyScalar(distance));
  if (aspect > 1.15) camera.setViewOffset(width, height, -width * 0.2, 0, width, height);
  else camera.setViewOffset(width, height, 0, height * 0.24, width, height);
  camera.position.copy(position);
  camera.lookAt(built.cameraTarget);
  camera.updateProjectionMatrix();
  return position;
}

/** Journey framing: plain full-frame perspective (wider on portrait screens). */
function frameJourney(camera: THREE.PerspectiveCamera, width: number, height: number): void {
  const aspect = width / Math.max(1, height);
  camera.aspect = aspect;
  camera.fov = aspect < 1 ? 68 : 55;
  camera.clearViewOffset();
  camera.updateProjectionMatrix();
}

/** Smooth camera route through the scene's waypoints. */
interface Route {
  positions: THREE.CatmullRomCurve3;
  targets: THREE.CatmullRomCurve3;
}

function routeFor(built: BuiltScene): Route | null {
  if (!built.journey) return null;
  return {
    positions: new THREE.CatmullRomCurve3(built.journey.positions, false, 'centripetal'),
    targets: new THREE.CatmullRomCurve3(built.journey.targets, false, 'centripetal'),
  };
}

function enableShadows(renderer: THREE.WebGLRenderer, world: World): void {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const { key } = world;
  key.castShadow = true;
  // Phones get a smaller shadow map (same look, far less GPU work).
  const shadowSize = Math.min(window.innerWidth, window.innerHeight) < 700 ? 1024 : 2048;
  key.shadow.mapSize.set(shadowSize, shadowSize);
  const s = key.shadow.camera;
  s.left = -18;
  s.right = 18;
  s.top = 18;
  s.bottom = -18;
  s.near = 1;
  s.far = 60;
  key.shadow.bias = -0.0005;
  world.built.root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && (mesh.material as THREE.Material).type !== 'MeshBasicMaterial') {
      mesh.castShadow ||= mesh.geometry.type !== 'PlaneGeometry';
      mesh.receiveShadow = true;
    }
  });
}

function disposeScene(scene: THREE.Scene, built?: BuiltScene): void {
  built?.dispose?.();
  const background = scene.background as THREE.Texture | null;
  if (!background?.userData?.['shared']) background?.dispose?.();
  scene.traverse((object) => {
    // Cached GLB parts (shared between scenes) stay alive.
    if (object.userData['shared']) {
      // Shared model parts may carry a per-scene material copy (e.g. the softened mirror).
      const own = (object as THREE.Mesh).material as THREE.Material | undefined;
      if (own?.userData?.['perScene']) own.dispose();
      return;
    }
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    for (const m of Array.isArray(material) ? material : material ? [material] : []) {
      const map = (m as THREE.MeshBasicMaterial).map;
      if (!map?.userData?.['shared']) map?.dispose();
      m.dispose();
    }
  });
}

const smooth = (t: number) => t * t * (3 - 2 * t);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Animated scene rendered into a new canvas inside `host`. */
export function createLiveStage(host: HTMLElement, kind: Scene3DKind, palette: ScenePalette, options: StageOptions = {}): LiveStage {
  const journey = !!options.journey;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !journey, powerPreference: 'high-performance' });
  configureRenderer(renderer);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;';
  host.appendChild(renderer.domElement);

  const world = createWorld(renderer, kind, palette, journey);
  const { scene, camera, built } = world;
  const route = journey ? routeFor(built) : null;

  // Realism extras for the walk-through scenes: soft shadows + a gentle bloom on lights.
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  if (journey) {
    enableShadows(renderer, world);
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // High threshold (HDR values above 1.5): only lamps, candles and fairy lights glow –
    // never sunlit white chairs, flowers or marble (that used to wash bright scenes out).
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.5, built.light?.bloom ?? 1.5);
    renderer.toneMappingExposure = built.light?.exposure ?? 1.0;
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }
  // Models arrive a moment later: give them shadows too.
  void world.loaded.then(() => journey && enableShadows(renderer, world)).catch((error) => console.warn('3D assets failed to load', error));

  let base = built.cameraPosition.clone();
  const pointer = { x: 0, y: 0 };
  const look = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0 };
  let progress = 0;
  let shownProgress = 0;
  let dragging: { x: number; y: number; yaw: number; pitch: number } | null = null;
  const timer = new THREE.Timer();
  let visible = true;

  const resize = () => {
    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    renderer.setSize(width, height, false);
    composer?.setSize(width, height);
    bloom?.resolution.set(width, height);
    if (journey) frameJourney(camera, width, height);
    else base = frameHero(camera, built, width, height);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // Pause rendering when the scene scrolls out of view.
  const visibility = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  visibility.observe(host);

  const onPointerMove = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    if (dragging) {
      look.targetYaw = dragging.yaw - ((event.clientX - dragging.x) / rect.width) * 2.4;
      look.targetPitch = Math.max(-0.5, Math.min(0.5, dragging.pitch + ((event.clientY - dragging.y) / rect.height) * 1.2));
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    if (!journey) return;
    dragging = { x: event.clientX, y: event.clientY, yaw: look.targetYaw, pitch: look.targetPitch };
    renderer.domElement.style.cursor = 'grabbing';
  };
  const onPointerUp = () => {
    dragging = null;
    renderer.domElement.style.cursor = journey ? 'grab' : '';
  };
  const onOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma == null || event.beta == null) return;
    pointer.x = Math.max(-1, Math.min(1, event.gamma / 30));
    pointer.y = Math.max(-1, Math.min(1, (event.beta - 45) / 30));
  };
  if (journey) renderer.domElement.style.cursor = 'grab';
  host.addEventListener('pointermove', onPointerMove);
  host.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('deviceorientation', onOrientation);

  const position = new THREE.Vector3();
  const target = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  // Adaptive resolution: if frames get slow (older phones), render slightly fewer pixels.
  const maxRatio = renderer.getPixelRatio();
  // Never drop below 1.5× on sharp screens, so lettering on the invitation panels stays crisp.
  const minRatio = Math.min(maxRatio, 1.5);
  let slowFrames = 0;
  let fastFrames = 0;
  const adaptResolution = (delta: number) => {
    if (delta <= 0 || delta > 0.5) return; // tab switches, first frame
    if (delta > 1 / 38) slowFrames++;
    else if (delta < 1 / 55) fastFrames++;
    const ratio = renderer.getPixelRatio();
    if (slowFrames > 45 && ratio > 1) {
      setRatio(Math.max(minRatio, ratio - 0.25));
    } else if (fastFrames > 240 && ratio < maxRatio) {
      setRatio(Math.min(maxRatio, ratio + 0.25));
    } else return;
    slowFrames = fastFrames = 0;
  };
  const setRatio = (ratio: number) => {
    renderer.setPixelRatio(ratio);
    composer?.setPixelRatio(ratio);
    resize();
  };

  renderer.setAnimationLoop((timestamp) => {
    timer.update(timestamp);
    const delta = timer.getDelta();
    if (!visible) return;
    const t = timer.getElapsed();
    // Time-based easing: same speed on slow phones and fast screens.
    if (route) shownProgress += (progress - shownProgress) * (1 - Math.exp(-Math.min(delta, 0.5) * 4.5));
    built.update(t, delta, route ? smooth(Math.max(0, Math.min(1, shownProgress))) : 0);

    if (route) {
      // Ease towards the scroll position, then follow the route.

      const p = smooth(Math.max(0, Math.min(1, shownProgress)));
      route.positions.getPointAt(p, position);
      route.targets.getPointAt(p, target);
      position.y += Math.sin(t * 1.1) * 0.03; // subtle "walking" breath

      // Drag to look around (and a little pointer parallax), easing back when released.
      if (!dragging) {
        look.targetYaw *= 0.985;
        look.targetPitch *= 0.985;
      }
      look.yaw += (look.targetYaw + pointer.x * 0.12 - look.yaw) * 0.08;
      look.pitch += (look.targetPitch - pointer.y * 0.06 - look.pitch) * 0.08;
      forward.subVectors(target, position).applyAxisAngle(up, look.yaw);
      forward.y += look.pitch * forward.length();
      camera.position.copy(position);
      camera.lookAt(position.clone().add(forward));
    } else {
      camera.position.x += (base.x + pointer.x * 1.4 - camera.position.x) * 0.05;
      camera.position.y += (base.y - pointer.y * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(built.cameraTarget);
    }

    if (composer) composer.render();
    else renderer.render(scene, camera);
    adaptResolution(delta);
  });

  return {
    setProgress(value: number) {
      progress = value;
    },
    dispose() {
      renderer.setAnimationLoop(null);
      timer.dispose();
      resizeObserver.disconnect();
      visibility.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('deviceorientation', onOrientation);
      composer?.dispose();
      disposeScene(scene, built);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

let sharedRenderer: THREE.WebGLRenderer | null = null;

/** Thumbnails are drawn one at a time, in idle moments, so a gallery full of 3D designs scrolls smoothly. */
let snapshotQueue: Promise<void> = Promise.resolve();
const idle = () =>
  new Promise<void>((resolve) =>
    'requestIdleCallback' in window ? requestIdleCallback(() => resolve(), { timeout: 400 }) : setTimeout(resolve, 16),
  );

/** Draws one still frame of the scene into the target 2D canvas using a single shared renderer. */
export function snapshotTo(...args: Parameters<typeof renderSnapshot>): Promise<void> {
  const job = snapshotQueue.then(idle).then(() => (args[0].isConnected ? renderSnapshot(...args) : undefined));
  snapshotQueue = job.catch(() => undefined);
  return job;
}

function renderSnapshot(
  target: HTMLCanvasElement,
  kind: Scene3DKind,
  palette: ScenePalette,
  options: StageOptions = {},
  time = 2.4,
): Promise<void> {
  const journey = !!options.journey;
  const width = Math.max(1, Math.round(target.clientWidth));
  const height = Math.max(1, Math.round(target.clientHeight));
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  if (!sharedRenderer) {
    sharedRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    configureRenderer(sharedRenderer);
  }
  const renderer = sharedRenderer;
  const world = createWorld(renderer, kind, palette, journey);
  const { scene, camera, built } = world;
  // Wait for models / HDR light (realistic scenes) before taking the picture.
  return world.loaded.catch(() => undefined).then(() => {
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    built.update(time, 0, 0);
    const route = journey ? routeFor(built) : null;
    if (route) {
      renderer.toneMappingExposure = built.light?.exposure ?? 1.0;
      frameJourney(camera, width, height);
      camera.position.copy(route.positions.getPointAt(0));
      camera.lookAt(route.targets.getPointAt(0));
    } else {
      frameHero(camera, built, width, height);
    }
    renderer.render(scene, camera);

    target.width = Math.round(width * ratio);
    target.height = Math.round(height * ratio);
    const ctx = target.getContext('2d');
    ctx?.clearRect(0, 0, target.width, target.height);
    ctx?.drawImage(renderer.domElement, 0, 0, target.width, target.height);
    renderer.toneMappingExposure = 1.1;
    disposeScene(scene, built);
  });
}
