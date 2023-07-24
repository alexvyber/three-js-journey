import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.7);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * GLTF
 */
let model = null;
gltfLoader.load(
  //   "/models/FlightHelmet/glTF/FlightHelmet.gltf",
  "/models/Duck/glTF-Binary/Duck.glb",
  (gltf) => {
    // const scale = 0.025;

    // mixer = new THREE.AnimationMixer(gltf.scene);
    // const action = mixer.clipAction(gltf.animations[2]);

    // action.play();

    // gltf.scene.scale.set(scale, scale, scale);
    scene.add(gltf.scene);
    model = gltf.scene;

    // scene.add(gltf.scene.children[3]);
    // while (gltf.scene.children.length) {
    //   scene.add(gltf.scene.children[0]);
    // }
  }
  //   () => console.log("progress"),
  //   () => console.log("error")
);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log("🚀 ~ intersect:", intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log("🚀 ~ intersects:", intersects);

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
 * Cursor
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = ((event.clientY / sizes.height) * 2 - 1) * -1;
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

let currentitersect = null;

window.addEventListener("click", (event) => {
  //   console.log("🚀 ~ window.addEventListener ~ event:", event);
  if (currentitersect) {
    console.log(
      "🚀 ~ window.addEventListener ~ currentitersect:",
      currentitersect
    );
  }
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // ray
  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDirection = new THREE.Vector3(1, 0, 0);
  //   rayDirection.normalize();

  //   raycaster.set(rayOrigin, rayDirection);
  raycaster.setFromCamera(mouse, camera);

  const objects = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objects);

  for (const obj of objects) {
    obj.material.color.set("red");
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set("blue");
  }

  if (intersects.length) {
    if (!currentitersect) {
      currentitersect = intersects[0];
    }
  } else {
    currentitersect = null;
  }

  // model intersects

  if (model) {
    const modelIntersects = raycaster.intersectObject(model);

    if (modelIntersects.length) {
      model.scale.set(1.2, 1.2, 1.2);
    } else {
      model.scale.set(1, 1, 1);
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
