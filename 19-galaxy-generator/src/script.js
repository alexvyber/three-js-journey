import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new lil.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const params = {};
params.count = 100000;
params.particleSize = 0.001;
params.radius = 5;
params.branches = 5;
params.spin = -0.5;
params.randomness = 0.2;
params.randomnessCoefficient = 4;
params.insideColor = "#0000ff";
params.outsideColor = "#ff0000";

const galaxyParams = {
  geometry: null,
  points: null,
  material: null,
  colors: new Float32Array(params.count * 3),
  reset() {
    this.geometry.dispose();
    this.material.dispose();
  },
};

generateGalaxy(scene, galaxyParams);

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
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
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

// Params tweaks

const refreshGalaxy = () => generateGalaxy(scene, galaxyParams);

gui
  .add(params, "count")
  .min(100)
  .max(10_000_000)
  .step(30)
  .onFinishChange(refreshGalaxy);
gui
  .add(params, "particleSize")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(refreshGalaxy);

gui
  .add(params, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(refreshGalaxy);

gui
  .add(params, "branches")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(refreshGalaxy);

gui
  .add(params, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(refreshGalaxy);

gui
  .add(params, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(refreshGalaxy);

gui
  .add(params, "randomnessCoefficient")
  .min(-10)
  .max(20)
  .step(1)
  .onFinishChange(refreshGalaxy);

gui.addColor(params, "insideColor").onFinishChange(refreshGalaxy);
gui.addColor(params, "outsideColor").onFinishChange(refreshGalaxy);

function generateGalaxy(scene, galaxyParams) {
  //   console.log(
  //     "🚀 ~ generateGalaxy ~ positions before:",
  //     galaxyParams.positions
  //   );

  if (galaxyParams.points) {
    // galaxyParams.reset();
    scene.remove(galaxyParams.points);
  }

  galaxyParams.geometry = new THREE.BufferGeometry();
  galaxyParams.points = new Float32Array(params.count * 3);

  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * params.radius;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;
    const spinAngle = radius * params.spin;

    const randomX =
      Math.pow(Math.random(), params.randomnessCoefficient) *
      (Math.random() > 0.5 ? 1 : -1);

    const randomY =
      Math.pow(Math.random(), params.randomnessCoefficient) *
      (Math.random() > 0.5 ? 1 : -1);

    const randomZ =
      Math.pow(Math.random(), params.randomnessCoefficient) *
      (Math.random() > 0.5 ? 1 : -1);

    if (i < params.branches) {
      console.log(branchAngle);
    }
    galaxyParams.points[i3] =
      Math.cos(branchAngle + spinAngle) * radius + randomX;
    galaxyParams.points[i3 + 1] = randomY; // (Math.random() - 0.5) * 0.3;
    galaxyParams.points[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

    galaxyParams.colors[i3] = mixedColor.r;
    galaxyParams.colors[i3 + 1] = mixedColor.g;
    galaxyParams.colors[i3 + 2] = mixedColor.b;
  }

  galaxyParams.geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(galaxyParams.points, 3)
  );

  console.log(
    "🚀 ~ generateGalaxy ~ galaxyParams.colors:",
    galaxyParams.colors
  );
  galaxyParams.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(galaxyParams.colors, 3)
  );

  // MATERIAL
  galaxyParams.material = new THREE.PointsMaterial({
    size: params.particleSize,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  galaxyParams.points = new THREE.Points(
    galaxyParams.geometry,
    galaxyParams.material
  );

  scene.add(galaxyParams.points);
}
