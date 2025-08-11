// Import Three.js library (if you're not using the CDN version, you can import this way)
import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a light source
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Add a grid to the scene for visualization
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// Set the camera position
camera.position.z = 20;

// Function to calculate the vector field
function vectorField(x, y, z) {
    return new THREE.Vector3(y, -x, 0); // Example: (y, -x, 0)
}

// Function to calculate divergence
function divergence(x, y, z) {
    return 0; // In this case, the divergence of (y, -x, 0) is 0 (constant flow)
}

// Function to calculate curl
function curl(x, y, z) {
    return new THREE.Vector3(0, 0, 2); // Constant curl in the z-axis (rotation effect)
}

// Function to create arrows at each point
function createArrow(x, y, z) {
    const vector = vectorField(x, y, z);
    const arrowHelper = new THREE.ArrowHelper(
        vector.clone().normalize(), // Direction of the arrow
        new THREE.Vector3(x, y, z), // Position of the arrow
        vector.length(),            // Length of the arrow
        0x00ff00                    // Color of the arrow (green for flow)
    );
    scene.add(arrowHelper);
}

// Create a grid of arrows
const gridSize = 10;
for (let x = -gridSize; x <= gridSize; x++) {
    for (let y = -gridSize; y <= gridSize; y++) {
        createArrow(x, y, 0);
    }
}

// Pinwheel setup
const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 6);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const pinwheel = new THREE.Mesh(geometry, material);
pinwheel.rotation.x = Math.PI / 2; // Align to horizontal plane
pinwheel.position.set(0, 0, 0);
scene.add(pinwheel);

// Function to animate the pinwheel based on curl
function animatePinwheel() {
    const curlEffect = curl(0, 0, 0); // Get the curl vector at the pinwheel's position
    pinwheel.rotation.z += curlEffect.z * 0.1; // Spin the pinwheel based on the curl's z-axis value
}

// Render loop to animate and render the scene
function animate() {
    requestAnimationFrame(animate);
    animatePinwheel();  // Spin the pinwheel
    renderer.render(scene, camera);  // Render the scene
}

// Call the animation function to start
animate();
