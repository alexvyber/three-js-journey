import * as THREE from "three";
console.log("🚀 ~ THREE:", THREE);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: 1200,
  height: 1200,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10;
camera.position.x = 1;
camera.position.y = 1;

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

const group = new THREE.Group();

mesh.position.z = 2;
mesh.position.x = 5;
mesh.position.y = 3;

mesh.scale.x = 3;
mesh.rotation.set(1, 0, 0);
console.log("🚀 ~ mesh:", mesh.position.distanceTo(camera.position));

// --
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00eeff })
);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 2.5),
  new THREE.MeshBasicMaterial({ color: 0x00ffee })
);
cube2.position.x = 1.5;

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 0.5),
  new THREE.MeshBasicMaterial({ color: 0xff9922 })
);
cube3.position.x = -2;

group.add(cube1);
group.add(cube2);
group.add(cube3);

// console.log("🚀 ~ mesh:", mesh.position.length());
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
scene.add(camera);
// scene.add(mesh);
scene.add(group);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

// camera.lookAt(mesh.position);

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

setInterval(() => {
  // mesh.position.set(Math.random(), Math.random(), Math.random());
  // mesh.rotation.set(mesh.rotation.x + 0.0, mesh.rotation.y + 0.01, 0);
  // group.rotation.set(group.rotation.x + 0.01, 0, 0);
  group.rotation.set(0, group.rotation.y + 0.01, 0);
  renderer.render(scene, camera);
}, 10);
