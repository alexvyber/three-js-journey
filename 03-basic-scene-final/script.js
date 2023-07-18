// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 1800,
  height: 1200,
};

console.log("🚀 ~ THREE:", THREE);

// Scene
const scene = new THREE.Scene();

// Object
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
});

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cubeMesh);

// Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height);
camera.position.z = 9;
camera.position.x = 2.5;
camera.position.y = -1;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
