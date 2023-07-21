import * as THREE from "three";
import * as lil from "lil-gui";
import gasp from "gsap";

/**
 * Debug
 */
const gui = new lil.GUI();

const parameters = {
  materialColor: "#f59e0b",
};
const objectsDIstance = 3;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
// const material = new THREE.MeshNormalMaterial();
const material = new THREE.MeshStandardMaterial({
  color: parameters.materialColor,
  //   wireframe: true,
});
/**
 * Particles
 */

const particlesCount = 300;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = objectsDIstance - Math.random() * objectsDIstance * 4;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.02,
  depthWrite: false,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Scroll
 */

let currentSection = 0;

let scrollY = window.scrollX;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(window.scrollY / sizes.height);
  //   console.log("🚀 ~ window.addEventListener ~ newSection:", newSection);
  if (newSection !== currentSection) {
    currentSection = newSection;

    gasp.to(meshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
    });
  }
});

/**
 * Cursor
 */

const cursor = {
  x: 0,
  y: 0,
  setCursor(event) {
    this.x = event.clientX / sizes.width - 0.5;
    this.y = event.clientY / sizes.height - 0.5;
  },
};

window.addEventListener("mousemove", (event) => {
  cursor.setCursor(event);
});

const one = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 128, 4), material);

const two = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 256), material);

const three = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.7, 0.25, 128, 128),
  material
);

one.position.y = 0;
two.position.y = objectsDIstance * 1 * -1;
three.position.y = objectsDIstance * 2 * -1;

const moveDistance = 1.6;
one.position.x = moveDistance;
two.position.x = -moveDistance;
three.position.x = moveDistance;

scene.add(
  one,
  two,
  three
  //
);

const meshes = [one, two, three];

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0.7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
scene.add(ambientLight);

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
const group = new THREE.Group();
scene.add(group);
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
group.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate camera
  camera.position.y = (-scrollY / sizes.height) * objectsDIstance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  group.position.x += (parallaxX - group.position.x) * 5 * deltaTime;
  group.position.y += (parallaxY - group.position.y) * 5 * deltaTime;

  // Animate meshes
  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

tick();
