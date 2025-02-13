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
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Augmenter l'intensité
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Augmenter l'intensité
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6); // Légèrement plus faible mais présente
directionalLight2.position.set(-10, -10, -10);
scene.add(directionalLight2);

// PointLight
const pointLight = new THREE.PointLight(0xffffff, 1.2, 50); // Augmenter l'intensité
pointLight.position.set(0, 5, 0); // Positionne la lumière au centre du plafond
scene.add(pointLight);

// CeilingLight (simule une lumière douce au plafond)
const ceilingLight = new THREE.PointLight(0xffffff, 0.5, 100); // Augmenter légèrement l'intensité
ceilingLight.position.set(0, 20, 0); // Positionne la lumière plus haut, comme un plafonnier
scene.add(ceilingLight);

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

    createScreen(-3, 2, -1.36); // Crée l'écran avec une texture ronde
    createRoom(); // Ajouter la chambre autour du setup
});
// Charger le modèle sofa
loader.load('/assets/sofa.glb', (gltf) => {
    const sofa = gltf.scene;
    sofa.scale.set(6, 6, 6); // Ajuste la taille selon tes besoins
    sofa.position.set(16.5, -6.55, -9); // Positionne le canapé dans la scène
    sofa.rotation.y = Math.PI; // Ajuste l'orientation si nécessaire

    scene.add(sofa);
});

loader.load('/assets/table.glb', (gltf) => {
    const table = gltf.scene;
    table.scale.set(9, 9, 9); // Ajuste la taille selon tes besoins
    table.position.set(8, -6.55, -9); // Positionne le canapé dans la scène
    table.rotation.y = Math.PI; // Ajuste l'orientation si nécessaire

    scene.add(table);
});

loader.load('/assets/plante1.glb', (gltf) => {
    const plante1 = gltf.scene;
    plante1.scale.set(9, 9, 9); // Ajuste la taille selon tes besoins
    plante1.position.set(8, -3.29, -9); // Positionne le canapé dans la scène

    scene.add(plante1);
});

loader.load('/assets/casque.glb', (gltf) => {
    const casque = gltf.scene;
    casque.scale.set(9, 9, 9); // Ajuste la taille selon tes besoins
    casque.position.set(-7, -0.46, 2); // Positionne le canapé dans la scène
    casque.rotation.set(Math.PI / 2.1, 0, 3); // Ajuste l'orientation si nécessaire

    scene.add(casque);
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

    // Créer un matériau avec la texture ronde et appliquer des réglages pour l'affichage correct
    const screenMaterial = new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.DoubleSide,
        transparent: true, // Permet d'avoir une texture avec un fond transparent
        opacity: 1, // Opacité pour éviter que la texture soit trop transparente
    });

    // Créer le mesh de l'écran et appliquer la texture ronde
    screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.set(x, y, z);
    screenMesh.rotation.x = -Math.PI / 45;
    scene.add(screenMesh);

    // Centrer la texture ronde sur l'écran
    screenMesh.material.map.center.set(0.5, 0.5);

    // Initialiser les contrôles de la caméra
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
controls.maxDistance = 200;

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

// Fonction pour créer la chambre avec des murs qui se touchent
function createRoom() {
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide });

    // Charger la texture parquet.png pour le sol
    const parquetTexture = new THREE.TextureLoader().load('/assets/textures/parquet.jpg', (texture) => {
        texture.minFilter = THREE.LinearFilter; // Améliorer la qualité de la texture
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true; // Utiliser les mipmaps pour une meilleure qualité
    });

    // Charger les textures pour les murs
    const wallTexture = new THREE.TextureLoader().load('/assets/textures/mur4.jpg', (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
    });

    // Sol (utilise la texture parquet)
    const floorGeometry = new THREE.PlaneGeometry(40, 40); // Sol plus grand
    const floorMaterial = new THREE.MeshStandardMaterial({ map: parquetTexture, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Pour poser le sol horizontalement
    floor.position.set(0, -6.6, 0);
    scene.add(floor);

    // Autres murs (ils peuvent rester tels quels, selon ton design)
    // Murs (utilisation de BoxGeometry pour créer des murs)
    const wallThickness = 0.5; // Augmenter l'épaisseur des murs
    const wallHeight = 25; // Murs beaucoup plus grands
    const wallWidth = 40; // Larges murs pour un grand espace

    // Mur arrière avec texture
    const backWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness);
    const backWall = new THREE.Mesh(backWallGeometry, new THREE.MeshStandardMaterial({ map: wallTexture }));
    backWall.position.set(0, wallHeight / 6, -wallWidth / 2); // Positionner à la bonne distance
    scene.add(backWall);

    // Murs latéraux avec texture
    const sideWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallWidth);

    // Mur gauche avec texture
    const leftWall = new THREE.Mesh(sideWallGeometry, new THREE.MeshStandardMaterial({ map: wallTexture }));
    leftWall.position.set(-wallWidth / 2, wallHeight / 6, 0); // Mur gauche juste au bord
    scene.add(leftWall);

    // Mur droit avec texture
    const rightWall = new THREE.Mesh(sideWallGeometry, new THREE.MeshStandardMaterial({ map: wallTexture }));
    rightWall.position.set(wallWidth / 2, wallHeight / 6, 0); // Mur droit juste au bord
    scene.add(rightWall);

    const ceilingGeometry = new THREE.PlaneGeometry(wallWidth, wallWidth);
    const ceilingMaterial = new THREE.MeshStandardMaterial({map: wallTexture });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, wallHeight / 1.5, 0);
    scene.add(ceiling);

// Quatrième mur (devant)
    const frontWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness);
    const frontWall = new THREE.Mesh(frontWallGeometry, new THREE.MeshStandardMaterial({ map: wallTexture }));
    frontWall.position.set(0, wallHeight / 6, wallWidth / 2);
    scene.add(frontWall);
}

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
