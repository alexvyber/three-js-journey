import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

// Fonts

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const geometry = new TextGeometry("Jafarchik Lohanulsya", {
    font,
    size: 0.7,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });

  geometry.computeBoundingBox();
  geometry.center();
  //   geometry.translate(
  //     -(geometry.boundingBox.max.x - 0.2) * 0.5,
  //     -(geometry.boundingBox.max.y - 0.2) * 0.5,
  //     -(geometry.boundingBox.max.z - 0.3) * 0.5
  //   );

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  //   textMaterial.wireframe = true;
  const text = new THREE.Mesh(geometry, material);

  scene.add(text);

  console.time("donuts");

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.1, 30, 45);
  const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 40);
  const coneGeometry = new THREE.ConeGeometry(0.2, 0.4, 45);

  const numberOfPieces = 50;

  for (let index = 0; index < numberOfPieces; index++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.rotation.x = Math.PI * Math.random();
    donut.rotation.y = Math.PI * Math.random();

    const scale = getRandomInt(25, 100) / 100;
    donut.scale.set(scale, scale, scale);

    donut.position.set(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9
    );

    scene.add(donut);
  }

  for (let index = 0; index < numberOfPieces; index++) {
    const donut = new THREE.Mesh(cubeGeometry, material);
    donut.rotation.x = Math.PI * Math.random();
    donut.rotation.y = Math.PI * Math.random();

    const scale = getRandomInt(25, 100) / 100;
    donut.scale.set(scale, scale, scale);

    donut.position.set(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9
    );

    scene.add(donut);
  }

  for (let index = 0; index < numberOfPieces; index++) {
    const donut = new THREE.Mesh(sphereGeometry, material);
    donut.rotation.x = Math.PI * Math.random();
    donut.rotation.y = Math.PI * Math.random();

    // const scale = getRandomInt(25, 100) / 100;
    // donut.scale.set(scale, scale, scale);

    donut.position.set(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9
    );

    scene.add(donut);
  }

  for (let index = 0; index < numberOfPieces; index++) {
    const donut = new THREE.Mesh(coneGeometry, material);
    donut.rotation.x = Math.PI * Math.random();
    donut.rotation.y = Math.PI * Math.random();

    // const scale = getRandomInt(25, 100) / 100;
    // donut.scale.set(scale, scale, scale);

    donut.position.set(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 9
    );

    scene.add(donut);
  }

  console.timeEnd("donuts");
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

//  axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
