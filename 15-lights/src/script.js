import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

const directionalLight = new THREE.DirectionalLight(0xff0000, 0.4);
directionalLight.position.set(1, 0.2, 0);

// scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.3
);
// scene.add(directionalLightHelper);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.8);
// scene.add(hemisphereLight);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.3
);
// scene.add(hemisphereLightHelper);

const pointLight = new THREE.PointLight(0x0088ff, 0.5, 3);
pointLight.position.x = 1;
pointLight.position.y = 0.1;
pointLight.position.z = 0;
// scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);

const reactAreaLight = new THREE.RectAreaLight(0xff00ff, 1, 3, 2);
reactAreaLight.position.z = 1;
reactAreaLight.position.y = 1;
reactAreaLight.position.x = 0;

const center = new THREE.Vector3();
reactAreaLight.lookAt(center);

scene.add(reactAreaLight);
const reactAreaLightHelper = new RectAreaLightHelper(reactAreaLight, 0.3);
scene.add(reactAreaLightHelper);

const spotLight = new THREE.SpotLight(
  0xff0088,
  0.5,
  10,
  Math.PI * 0.2,
  0.7,
  0.5
);
spotLight.position.y = 2;

// scene.add(spotLight.target);
// scene.add(spotLight);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
sphere.castShadow = true;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.receiveShadow = true;

scene.add(sphere, cube, torus, plane);

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

renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  console.log("🚀 ~ tick ~ elapsedTime:", elapsedTime);

  //   reactAreaLight.position.set(0, 0, Math.sin(elapsedTime / 2));

  reactAreaLight.position.x = Math.sin(elapsedTime / 2) * 3;
  reactAreaLight.lookAt(center);
  spotLight.target.position.x = Math.sin(elapsedTime / 2) * 3;

  //   pointLight.position.z = Math.sin(elapsedTime / 2) * 2.5;

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
