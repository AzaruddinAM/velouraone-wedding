/**
 * Realistic assets for the 3D scenes (CC0, from Poly Haven – see public/3d/CREDITS.md):
 *  • GLB models (meshopt-compressed, WebP textures)   public/3d/models/<name>.glb
 *  • HDRI environments (real-world light + backdrop)  public/3d/hdri/<name>_1k.hdr
 *  • PBR surfaces (colour, normal, AO/rough/metal)    public/3d/textures/<name>_*.webp
 *
 * Everything is loaded once and shared between scenes; shared objects are flagged
 * with `userData.shared` so scene clean-up never disposes them.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export type ModelName =
  | 'Chandelier_01'
  | 'Chandelier_02'
  | 'Chandelier_03'
  | 'lantern_chandelier_01'
  | 'brass_diya_lantern'
  | 'vintage_oil_lamp'
  | 'Lantern_01'
  | 'ornate_mirror_01'
  | 'fancy_picture_frame_01'
  | 'standing_picture_frame_02'
  | 'dining_chair_02'
  | 'round_wooden_table_01'
  | 'chinese_sofa'
  | 'potted_plant_02'
  | 'brass_vase_01'
  | 'ceramic_vase_01'
  | 'strawberry_chocolate_cake'
  | 'street_lamp_01'
  | 'painted_wooden_bench';

export type HdriName = 'ballroom' | 'venice_sunset' | 'satara_night' | 'royal_esplanade' | 'golden_bay';
export type SurfaceName = 'marble_tiles' | 'velour_velvet' | 'crepe_satin' | 'herringbone_parquet';

const url = (path: string) => new URL(`3d/${path}`, document.baseURI).href;

let gltfLoader: GLTFLoader | null = null;
const models = new Map<ModelName, Promise<THREE.Group>>();
const hdris = new Map<HdriName, Promise<THREE.DataTexture>>();
const environments = new WeakMap<THREE.WebGLRenderer, Map<HdriName, THREE.Texture>>();
const textures = new Map<string, THREE.Texture>();

function markShared(root: THREE.Object3D): void {
  root.traverse((o) => {
    o.userData['shared'] = true;
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of materials) m.userData['shared'] = true;
    }
  });
}

/** A copy of the model (geometry and materials are shared with the cached original). */
export async function model(name: ModelName): Promise<THREE.Group> {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader();
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
  }
  let promise = models.get(name);
  if (!promise) {
    promise = gltfLoader.loadAsync(url(`models/${name}.glb`)).then((gltf) => {
      markShared(gltf.scene);
      return gltf.scene;
    });
    models.set(name, promise);
  }
  const original = await promise;
  const copy = original.clone(true);
  copy.userData['shared'] = false;
  return copy;
}

export interface Placement {
  readonly at: readonly [number, number, number];
  readonly scale?: number;
  readonly rotY?: number;
}

/** Loads a model and adds copies of it at every placement. */
export async function place(parent: THREE.Object3D, name: ModelName, placements: readonly Placement[]): Promise<THREE.Group[]> {
  const copies: THREE.Group[] = [];
  for (const p of placements) {
    const copy = await model(name);
    copy.position.set(...p.at);
    copy.scale.setScalar(p.scale ?? 1);
    copy.rotation.y = p.rotY ?? 0;
    parent.add(copy);
    copies.push(copy);
  }
  return copies;
}

/** Equirectangular HDR image (shared by every renderer). */
export function hdri(name: HdriName): Promise<THREE.DataTexture> {
  let promise = hdris.get(name);
  if (!promise) {
    promise = new HDRLoader().loadAsync(url(`hdri/${name}_1k.hdr`)).then((texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.userData['shared'] = true;
      return texture;
    });
    hdris.set(name, promise);
  }
  return promise;
}

/** Pre-filtered environment map for image-based lighting (one per renderer). */
export async function hdriEnvironment(renderer: THREE.WebGLRenderer, name: HdriName): Promise<THREE.Texture> {
  let byName = environments.get(renderer);
  if (!byName) environments.set(renderer, (byName = new Map()));
  const cached = byName.get(name);
  if (cached) return cached;
  const source = await hdri(name);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(source).texture;
  env.userData['shared'] = true;
  pmrem.dispose();
  byName.set(name, env);
  return env;
}

function texture(path: string, color: boolean, repeat: number): THREE.Texture {
  const key = `${path}|${repeat}`;
  let t = textures.get(key);
  if (!t) {
    t = new THREE.TextureLoader().load(url(`textures/${path}`));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.anisotropy = 8;
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.userData['shared'] = true;
    textures.set(key, t);
  }
  return t;
}

/** Physically based surface (marble, velvet, satin, parquet) tiled `repeat` times. */
export function surface(name: SurfaceName, repeat: number, tint = '#ffffff', extra: THREE.MeshPhysicalMaterialParameters = {}): THREE.MeshPhysicalMaterial {
  const arm = texture(`${name}_arm_1k.webp`, false, repeat);
  return new THREE.MeshPhysicalMaterial({
    color: tint,
    map: texture(`${name}_diffuse_1k.webp`, true, repeat),
    normalMap: texture(`${name}_nor_gl_1k.webp`, false, repeat),
    aoMap: arm,
    roughnessMap: arm,
    metalnessMap: arm,
    roughness: 1,
    metalness: 1,
    ...extra,
  });
}
