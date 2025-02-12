import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lumières
const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight2.position.set(-10, -10, -10);
scene.add(directionalLight2);

// Charger le modèle gaming_desktop_pc
const loader = new GLTFLoader();
let pcModel, screenMesh;

loader.load('/assets/gaming_desktop_pc.glb', (gltf) => {
    pcModel = gltf.scene;
    pcModel.scale.set(1, 1, 1);
    pcModel.position.set(0, -1, 0);
    pcModel.rotation.y = -Math.PI / 2;

    scene.add(pcModel);

    // Position initiale de la caméra pour voir l’écran
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 4.5, 0);

    // Ajouter un écran sur le PC
    createScreen(-3, 2, -1.36);
});

// Liste des images des projets
const projectImages = [
    '/assets/CV_Lucas_2024.jpg',
    '/assets/project2.jpg',
    '/assets/project3.jpg'
];
let currentProjectIndex = 0;

// Fonction pour créer l'écran et afficher une image dessus
function createScreen(x, y, z) {
    const screenGeometry = new THREE.PlaneGeometry(6.5, 3.6);
    const screenTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], (texture) => {
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });

    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, side: THREE.DoubleSide });
    screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.set(x, y, z);
    screenMesh.rotation.x = -Math.PI / 45;
    scene.add(screenMesh);

    // Ajuster la caméra pour cibler l'écran
    controls.target.set(screenMesh.position.x, screenMesh.position.y, screenMesh.position.z);
    controls.update();
}

// Met à jour l'image de l'écran
function updateScreenImage() {
    if (screenMesh) {
        const newTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], (texture) => {
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        });
        screenMesh.material.map = newTexture;
        screenMesh.material.needsUpdate = true;
    }
}

// Écouteur pour changer d'image avec les flèches
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        currentProjectIndex = (currentProjectIndex + 1) % projectImages.length;
    } else if (event.key === 'ArrowLeft') {
        currentProjectIndex = (currentProjectIndex - 1 + projectImages.length) % projectImages.length;
    }
    updateScreenImage();
});

// Caméra et contrôles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.enableZoom = true;
controls.zoomSpeed = 1.2;
controls.minDistance = 3;
controls.maxDistance = 20;

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
