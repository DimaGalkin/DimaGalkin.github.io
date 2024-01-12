import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";

// setup scene
const scene = new THREE.Scene();

// set everything outside to black
scene.background = new THREE.Color(0x000000);
// fog creates the illusion of darkness
scene.fog = new THREE.FogExp2(0x000000, 0.35);

// set up camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
camera.position.set(0, 0.35, 0);
// magicaly fixes rotation issues
camera.rotation.order = "YXZ";

// set up renderer
const renderer = new THREE.WebGLRenderer(
    { antialias: false, alpha: true, powerPreference: "high-performance" }
)
renderer.shadowMap.enabled = false
renderer.setSize(window.innerWidth, window.innerHeight);
// show scene
document.body.appendChild(renderer.domElement);

// point for crosshair

// dynamically resize scene
onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export { scene, camera, renderer };