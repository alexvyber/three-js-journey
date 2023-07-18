import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Fog
const fog = new THREE.Fog("#223344", 1, 10);

// Scene
const scene = new THREE.Scene();
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

const grassTextures = [
  grassColorTexture,
  grassAmbientOcclusionTexture,
  grassNormalTexture,
  grassRoughnessTexture,
];

grassTextures.forEach((texture) => {
  texture.repeat.set(8, 8);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
});

// grassColorTexture.repeat.set(8, 8)
// grassAmbientOcclusionTexture.repeat.set(8, 8)
// grassNormalTexture.repeat.set(8, 8)
// grassRoughnessTexture.repeat.set(8, 8)

// grassColorTexture.wrapS = THREE.RepeatWrapping
// grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
// grassNormalTexture.wrapS = THREE.RepeatWrapping
// grassRoughnessTexture.wrapS = THREE.RepeatWrapping

// grassColorTexture.wrapT = THREE.RepeatWrapping
// grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
// grassNormalTexture.wrapT = THREE.RepeatWrapping
// grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ roughness: 0.7 })
);
sphere.position.y = 1;
// scene.add(sphere)

// house
const house = new THREE.Group();

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughness: bricksNormalTexture,
  })
);

walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xffee00 })
);

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    // wireframe: true,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughness: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.z = 2;
door.position.y = 1;

walls.position.y = 2.5 / 2;
roof.position.y = 2.5 + 0.5;
roof.rotateY(Math.PI * 0.25);

// bushes
const bushGeometry = new THREE.SphereGeometry();
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 });

const bushes = [
  {
    scale: [0.25, 0.25, 0.25],
    position: [0.8, 0.2, 2.2],
  },
  {
    scale: [0.4, 0.4, 0.4],
    position: [-0.8, 0.1, 2.2],
  },

  {
    scale: [0.25, 0.25, 0.25],
    position: [1.4, 0.1, 2.1],
  },

  {
    scale: [0.15, 0.15, 0.15],
    position: [-1, 0.05, 2.6],
  },
];

for (const bush of bushes) {
  const bush_ = new THREE.Mesh(bushGeometry, bushMaterial);
  bush_.scale.set(...bush.scale);
  bush_.position.set(...bush.position);

  scene.add(bush_);
}

house.add(walls);
house.add(roof);
house.add(door);

scene.add(house);

// gravees

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 5 + Math.random() * 4;

  const x = Math.sin(angle) * radius;

  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.6;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;
  grave.castShadow = true;

  graves.add(grave);
}

// Floor

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#87a9de", 0.03);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#87a9de", 0.2);
moonLight.position.set(4, 5, -2);

gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door Light

const doorLight = new THREE.PointLight("#ff7d00", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// Ghosts
const ghostsParams = [
  {
    color: "#ff0033",
    params: [2, 3],
  },
  {
    color: "#00ff33",
    params: [2, 3],
  },
  {
    color: "#33ffee",
    params: [2, 3],
  },
];

const ghosts = [];

for (const ghost of ghostsParams) {
  ghosts.push(new THREE.PointLight(ghost.color, ...ghost.params));
}

for (const ghost of ghosts) {
  scene.add(ghost);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#223344");

// Shdows

renderer.shadowMap.enabled = true;
moonLight.castShadow = true;
doorLight.castShadow = true;
for (const ghost of ghosts) {
  ghost.castShadow = true;
}

walls.castShadow = true;
floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghosts[0].position.x = Math.cos(ghost1Angle) * 4;
  ghosts[0].position.z = Math.sin(ghost1Angle) * 4;
  ghosts[0].position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghosts[1].position.x = Math.cos(ghost2Angle) * 5;
  ghosts[1].position.z = Math.sin(ghost2Angle) * 5;
  ghosts[1].position.y =
    Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghosts[2].position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghosts[2].position.z =
    Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghosts[2].position.y =
    Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
