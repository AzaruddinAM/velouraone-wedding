# 3D asset credits

All models, HDRIs and textures in this folder come from **Poly Haven** (https://polyhaven.com)
and are released under **CC0** (public domain – free for commercial use, no attribution required).
They were downloaded at 1K resolution and compressed for the web (meshopt geometry, WebP textures).
The original downloads are kept outside the repository in `assets-src/3d/`.

- Models: Chandelier_01, Chandelier_02, Chandelier_03, lantern_chandelier_01, brass_diya_lantern,
  vintage_oil_lamp, Lantern_01, ornate_mirror_01, fancy_picture_frame_01, standing_picture_frame_02,
  dining_chair_02, round_wooden_table_01, chinese_sofa, potted_plant_02, brass_vase_01, ceramic_vase_01,
  strawberry_chocolate_cake, street_lamp_01, painted_wooden_bench
- HDRIs: ballroom, venice_sunset, satara_night, royal_esplanade, golden_bay
- Textures: marble_tiles, velour_velvet, crepe_satin, herringbone_parquet

To re-compress a model:

```bash
npx gltf-transform optimize assets-src/3d/models/<name>/<name>.gltf public/3d/models/<name>.glb --compress meshopt --texture-compress webp --texture-size 1024 --simplify false
```
