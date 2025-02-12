import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lumières
const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Lumière ambiante
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Lumière directionnelle
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3); // Lumière directionnelle secondaire
directionalLight2.position.set(-10, -10, -10);
scene.add(directionalLight2);

// Charger le modèle gaming_desktop_pc en GLB
const loader = new GLTFLoader();
let pcModel;
loader.load('/assets/gaming_desktop_pc.glb', (gltf) => {
    pcModel = gltf.scene;
    pcModel.scale.set(1, 1, 1);  // Ajuster la taille du modèle si nécessaire
    pcModel.position.set(0, -1, 0);  // Centrer le modèle dans la scène
    pcModel.rotation.y = -Math.PI / 2;  // Rotation vers la droite (45 degrés)

    scene.add(pcModel);

    // Ajuster la caméra pour centrer le modèle
    camera.position.set(0, 5, 15);  // Positionner la caméra en face du modèle
    camera.lookAt(0, 4.5, 0);  // Regarder directement au niveau de l'écran du modèle

    // Ajouter un écran sur le PC avec un ajustement fin de la position
    createScreen(-3, 2, -1.36);  // Nouvelle position de l'écran plus proche du modèle
});

// Liste des images des projets
const projectImages = [
    '/assets/CV_Lucas_2024.jpg',
    //'/assets/project2.jpg',
    //'/assets/project3.jpg'
];
let currentProjectIndex = 0;
let screenMesh;

// Fonction pour créer l'écran et afficher une image dessus
function createScreen(x, y, z) {
    const screenGeometry = new THREE.PlaneGeometry(6.5, 3.6);  // Taille de l'écran
    const screenTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], texture => {
        // Améliorer la qualité de la texture
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;  // Améliore la qualité sur les textures larges
    });  // Charger l'image
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, side: THREE.DoubleSide });
    screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);

    screenMesh.position.set(x, y, z);
    screenMesh.rotation.y = 0;  // Orientation correcte de l'écran
    screenMesh.rotation.x = -Math.PI / 45;  // Légère rotation pour mieux voir l'écran
    scene.add(screenMesh);
}

// Met à jour l'image de l'écran
function updateScreenImage() {
    if (screenMesh) {
        const newTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], texture => {
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();  // Améliore la qualité de la texture
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

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();  // Mise à jour des contrôles
    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
