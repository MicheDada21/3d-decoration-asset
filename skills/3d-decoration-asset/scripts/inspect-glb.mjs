#!/usr/bin/env node
// Inspect a .glb structure with Node.js built-ins. No rendering or dependencies.
// Exit 0 with meshes; exit 1 for an invalid file or one without meshes.
import { readFileSync } from 'node:fs';
import process from 'node:process';

const path = process.argv[2];
if (!path) { console.error('Usage: node inspect-glb.mjs path/to/model.glb'); process.exit(2); }
let bytes;
try { bytes = readFileSync(path); } catch(e) { console.error(e.message); process.exit(2); }
if (bytes.length < 20 || bytes.toString('ascii', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2) {
  console.error('Invalid GLB v2 header'); process.exit(1);
}
const declaredLength = bytes.readUInt32LE(8);
if (declaredLength !== bytes.length) { console.error('Declared GLB length mismatch'); process.exit(1); }
const jsonLen = bytes.readUInt32LE(12);
if (20+jsonLen>bytes.length || bytes.toString('ascii', 16, 20) !== 'JSON') { console.error('Missing JSON chunk'); process.exit(1); }
let gltf;
try { gltf = JSON.parse(bytes.toString('utf8', 20, 20+jsonLen).trim()); }
catch(e) { console.error('Invalid JSON chunk: '+e.message); process.exit(1); }
const meshes = gltf.meshes?.length ?? 0;
const animations = (gltf.animations || []).map(a => ({ name:a.name || '(unnamed)', channels:a.channels?.length || 0 }));
const materialCount = gltf.materials?.length ?? 0;
const textures = gltf.textures?.length ?? 0;
const images = gltf.images?.length ?? 0;
console.log(JSON.stringify({ file:path, bytes:bytes.length, meshes, materials:materialCount, textures, images, animations }, null, 2));
if (meshes === 0) { console.error('No meshes found'); process.exitCode=1; }
