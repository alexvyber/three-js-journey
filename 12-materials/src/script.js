// import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import GUI from "lil-gui";
const gui = new GUI();

const random = () => Math.random() > 0.5;

// Textures

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/3/px.jpg",
  "/textures/environmentMaps/3/nx.jpg",
  "/textures/environmentMaps/3/py.jpg",
  "/textures/environmentMaps/3/ny.jpg",
  "/textures/environmentMaps/3/pz.jpg",
  "/textures/environmentMaps/3/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial();
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// const material = new THREE.MeshToonMaterial();
const material = new THREE.MeshStandardMaterial();

// material.wireframe = true;

material.envMap = environmentMapTexture;
material.metalness = 0.99;
material.roughness = 0;
// material.displacementScale = 0.05;

gui.add(material, "metalness").min(0).max(1).step(0.01);
gui.add(material, "roughness").min(0).max(1).step(0.01);
gui.add(material, "displacementScale").min(0).max(1).step(0.01);

// material.gradientMap = gradientTexture;

// material.aoMap = doorAmbientOcclusionTexture;
// material.displacementMap = doorHeightTexture;
// material.normalMap = doorNormalTexture;

// material.shininess = 100;
// material.specular = new THREE.Color("red");
// material.flatShading = random();
// material.map = doorColorTexture;
// material.color.set(0x00ff00);

// material.matcap = matcapTexture;
// material.alphaMap = doorAlphaTexture;
// material.opacity = 0.6;
// material.transparent = true;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 300, 300),
  material
);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 300, 300), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.15, 161, 321),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

sphere.position.x = -1.1;
torus.position.x = 1.1;

scene.add(sphere, plane, torus);
// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.7);

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(ambientLight, pointLight);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.3 * elapsedTime;
  plane.rotation.y = 0.3 * elapsedTime;
  torus.rotation.y = 0.3 * elapsedTime;

  sphere.rotation.x = 0.3 * elapsedTime;
  plane.rotation.x = 0.3 * elapsedTime;
  torus.rotation.x = 0.3 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
