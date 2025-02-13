import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Améliorer la qualité du rendu pour les écrans haute résolution (comme Retina)
const dpr = window.devicePixelRatio || 1; // Vérifie la densité de pixels de l'écran
renderer.setPixelRatio(dpr);

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
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 4.5, 0);

    createScreen(-3, 2, -1.36);
});

// Liste des images des projets
const projectImages = [
    '/assets/CV_Lucas_2024.jpg',
    '/assets/1.jpg',
    '/assets/2.jpg',
    '/assets/3.jpg'
];
let currentProjectIndex = 0;

// Fonction pour créer l'écran du PC
function createScreen(x, y, z) {
    const screenGeometry = new THREE.PlaneGeometry(6.5, 3.6);

    // Charger la texture avec des filtres pour la netteté
    const screenTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], (texture) => {
        texture.minFilter = THREE.LinearFilter; // Améliore la qualité de la texture
        texture.magFilter = THREE.LinearFilter; // Améliore la qualité de la texture
        texture.generateMipmaps = true; // Utiliser les mipmaps pour une meilleure qualité
    });

    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, side: THREE.DoubleSide });
    screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.set(x, y, z);
    screenMesh.rotation.x = -Math.PI / 45;
    scene.add(screenMesh);

    controls.target.set(screenMesh.position.x, screenMesh.position.y, screenMesh.position.z);
    controls.update();

    startSlideshow();
}

// Mise à jour de l'image de l'écran
function updateScreenImage() {
    if (screenMesh) {
        const newTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
        });
        screenMesh.material.map = newTexture;
        screenMesh.material.needsUpdate = true;
    }
}

// Diaporama automatique toutes les 3 secondes
let slideshowInterval;

function startSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        currentProjectIndex = (currentProjectIndex + 1) % projectImages.length;
        updateScreenImage();
    }, 3000);
}

// Navigation manuelle avec les flèches
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        currentProjectIndex = (currentProjectIndex + 1) % projectImages.length;
    } else if (event.key === 'ArrowLeft') {
        currentProjectIndex = (currentProjectIndex - 1 + projectImages.length) % projectImages.length;
    }
    updateScreenImage();
    startSlideshow(); // Redémarrer le diaporama après interaction
});

// Caméra et contrôles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.maxPolarAngle = Math.PI / 2;
controls.enableZoom = true;
controls.zoomSpeed = 1.2;
controls.minDistance = 3;
controls.maxDistance = 20;

// Gestion du zoom interactif
let isZoomed = false;
const initialPosition = new THREE.Vector3(0, 5, 15);
const zoomedPosition = new THREE.Vector3(-3, 2.4, 1);

function animateZoom(targetPosition) {
    let frame = 0;
    const maxFrames = 30;
    const startPosition = camera.position.clone();

    function zoomStep() {
        frame++;
        const alpha = frame / maxFrames;
        camera.position.lerpVectors(startPosition, targetPosition, alpha);
        controls.target.set(screenMesh.position.x, screenMesh.position.y, screenMesh.position.z);
        controls.update();

        if (frame < maxFrames) {
            requestAnimationFrame(zoomStep);
        }
    }

    zoomStep();
}

function toggleZoom() {
    isZoomed = !isZoomed;
    const target = isZoomed ? zoomedPosition : initialPosition;
    animateZoom(target);
}

// Détection des clics pour zoomer
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0 && intersects[0].object === screenMesh) {
        toggleZoom();
    }
});

// Dézoom avec la touche "Échap"
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isZoomed) {
        toggleZoom();
    }
});

// Animation
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
