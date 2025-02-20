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
    sofa.position.set(16.5, -6.2, -9); // Positionne le canapé dans la scène
    sofa.rotation.y = Math.PI; // Ajuste l'orientation si nécessaire

    scene.add(sofa);
});

loader.load('/assets/plante2.glb', (gltf) => {
    const sofa = gltf.scene;
    sofa.scale.set(14, 14, 14); // Ajuste la taille selon tes besoins
    sofa.position.set(17, -6.2, 1); // Positionne dans la scène
    sofa.rotation.y = Math.PI; // Ajuste l'orientation si nécessaire

    scene.add(sofa);
});

loader.load('/assets/table.glb', (gltf) => {
    const table = gltf.scene;
    table.scale.set(9, 9, 9); // Ajuste la taille selon tes besoins
    table.position.set(8, -6.2, -9); // Positionne dans la scène
    table.rotation.y = Math.PI; // Ajuste l'orientation si nécessaire

    scene.add(table);
});

loader.load('/assets/plante1.glb', (gltf) => {
    const plante1 = gltf.scene;
    plante1.scale.set(9, 9, 9); // Ajuste la taille selon tes besoins
    plante1.position.set(8, -2.94, -9); // Positionne dans la scène

    scene.add(plante1);
});

loader.load('/assets/casque.glb', (gltf) => {
    const casque = gltf.scene;
    casque.scale.set(9, 9, 9); // Ajuste la taille selon tes besoins
    casque.position.set(-7, -0.46, 2); // Positionne dans la scène
    casque.rotation.set(Math.PI / 2.1, 0, 3); // Ajuste l'orientation si nécessaire

    scene.add(casque);
});

loader.load('/assets/lampe.glb', (gltf) => {
    const lampe = gltf.scene;
    lampe.scale.set(0.8, 0.8, 0.8);
    lampe.position.set(-7.6, -0.68, -1);
    lampe.rotation.set(0, 4, 0);

    scene.add(lampe);

    // Ajouter une lumière plus douce et diffuse
    const lampeLight = new THREE.PointLight(0xffd700, 1, 8); // Lumière jaune plus large
    lampeLight.position.set(-7.6, 3, -1);
    lampeLight.decay = 2; // Réduction plus douce de l'intensité
    lampeLight.castShadow = true;
    lampeLight.shadow.mapSize.width = 1024;
    lampeLight.shadow.mapSize.height = 1024;
    scene.add(lampeLight);

    // Ajouter une boule lumineuse au niveau de la source
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 2
    });
    const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    lightSphere.position.copy(lampeLight.position);
    scene.add(lightSphere);
});

loader.load('/assets/lampe.glb', (gltf) => {
    const lampe = gltf.scene;
    lampe.scale.set(3, 3, 3);
    lampe.position.set(15, -6.3, 16);
    lampe.rotation.set(0, 0.7, 0);

    scene.add(lampe);

    // Lumière d'ambiance plus neutre et douce
    const ambientLight = new THREE.AmbientLight(0xffe4b5, 0.4); // Teinte beige clair, intensité réduite
    scene.add(ambientLight);

    // Lumière directionnelle plus douce et moins jaune
    const directionalLight = new THREE.DirectionalLight(0xffe4b5, 1);
    directionalLight.position.set(15, 12, 16);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    // Rendre la lumière plus diffuse
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;

    scene.add(directionalLight);

    // Ajustement de la boule lumineuse avec une teinte plus neutre
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffe4b5,
        emissive: 0xffe4b5,
        emissiveIntensity: 1.0 // Moins intense
    });
    const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    lightSphere.position.set(15, 7, 16);
    scene.add(lightSphere);
});

loader.load('/assets/wall2.glb', (gltf) => {
    const wall = gltf.scene;
    wall.scale.set(1.7, 1.7, 1.7); // Ajuste la taille selon tes besoins
    wall.position.set(0, 2, -29.3); // Positionne dans la scène
    wall.rotation.set(0, Math.PI/2, 0); // Ajuste l'orientation si nécessaire

    scene.add(wall);
});

loader.load('/assets/wall3.glb', (gltf) => {
    const wall = gltf.scene;
    wall.scale.set(1.7, 1.7, 1.7); // Ajuste la taille selon tes besoins
    wall.position.set(0, 2, 10.8); // Positionne dans la scène
    wall.rotation.set(0, Math.PI/2, 0); // Ajuste l'orientation si nécessaire

    scene.add(wall);
});

loader.load('/assets/wall3.glb', (gltf) => {
    const wall = gltf.scene;
    wall.scale.set(1.7, 1.7, 1.7); // Ajuste la taille selon tes besoins
    wall.position.set(10.8, 2, 0); // Positionne dans la scène
    wall.rotation.set(0, Math.PI, 0); // Ajuste l'orientation si nécessaire

    scene.add(wall);
});

loader.load('/assets/wall3.glb', (gltf) => {
    const wall = gltf.scene;
    wall.scale.set(1.7, 1.7, 1.7); // Ajuste la taille selon tes besoins
    wall.position.set(-29.5, 2, 0); // Positionne dans la scène
    wall.rotation.set(0, Math.PI, 0); // Ajuste l'orientation si nécessaire

    scene.add(wall);
});

loader.load('/assets/door.glb', (gltf) => {
    const door = gltf.scene;
    door.scale.set(4, 4, 4); // Ajuste la taille selon tes besoins
    door.position.set(0, 1.8, 19.7); // Positionne dans la scène
    door.rotation.set(0, 0, 0); // Ajuste l'orientation si nécessaire

    scene.add(door);
});

loader.load('/assets/ceiling.glb', (gltf) => {
    const ceiling = gltf.scene;
    ceiling.scale.set(3, 3, 1.5); // Ajuste la taille selon tes besoins
    ceiling.position.set(4, 33, 0); // Positionne dans la scène
    ceiling.rotation.set(0, 0, Math.PI/2); // Ajuste l'orientation si nécessaire

    scene.add(ceiling);
});

loader.load('/assets/floor.glb', (gltf) => {
    const floor = gltf.scene;
    floor.scale.set(3, 3, 1.5); // Ajuste la taille selon tes besoins
    floor.position.set(4, 10, 0); // Positionne dans la scène
    floor.rotation.set(0, 0, Math.PI/2); // Ajuste l'orientation si nécessaire

    scene.add(floor);
});

loader.load('/assets/plafonnier.glb', (gltf) => {
    const plafonnier = gltf.scene;
    plafonnier.scale.set(4, 4, 4);
    plafonnier.position.set(6, -8.7, 4);
    plafonnier.rotation.set(0, 1.57, 0);

    scene.add(plafonnier);

    // Lumière principale plus puissante et positionnée pour un éclairage optimal
    const plafonnierLight = new THREE.PointLight(0xffffff, 200, 60); // Intensité augmentée et portée plus large
    plafonnierLight.position.set(-0.4, 10, 1.5);
    plafonnierLight.castShadow = true; // Activer les ombres
    plafonnierLight.shadow.mapSize.width = 8192; // Résolution des ombres améliorée
    plafonnierLight.shadow.mapSize.height = 8192;
    plafonnierLight.shadow.bias = -0.001; // Ajuster pour éviter les artefacts
    plafonnierLight.shadow.camera.near = 1; // Ajuster les paramètres de la caméra des ombres
    plafonnierLight.shadow.camera.far = 50;
    plafonnierLight.shadow.camera.left = -20;
    plafonnierLight.shadow.camera.right = 20;
    plafonnierLight.shadow.camera.top = 20;
    plafonnierLight.shadow.camera.bottom = -20;
    scene.add(plafonnierLight);

    // SpotLight directionnel plus focalisé
    const spotLight = new THREE.SpotLight(0xffffff, 8, 60, Math.PI / 6, 0.3, 3);
    spotLight.position.set(-0.4, 10.5, 1.5);
    spotLight.target.position.set(-0.4, 10.5, 1.5); // Diriger vers le bureau
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048; // Réduire la taille des ombres pour plus de performance
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.005; // Prévenir les artefacts
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Lumière ambiante plus douce pour équilibrer
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Un peu plus forte pour contraster avec les ombres
    scene.add(ambientLight);

    // Augmenter la taille de la sphère émissive et ajuster l'intensité
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32); // Augmenter la taille
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffaa,
        emissive: 0xffffaa,
        emissiveIntensity: 5, // Intensité accrue pour plus d'effet lumineux
        metalness: 0.1, // Surface légèrement métallique
        roughness: 0.5  // Surface moins lisse pour un effet plus réaliste
    });
    const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    lightSphere.position.copy(plafonnierLight.position);
    scene.add(lightSphere);

    // Ajouter des réflecteurs ou des surfaces pour l'éclairage supplémentaire si nécessaire
    // Exemple d'un sol légèrement réfléchissant
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.7,
        metalness: 0.3
    });
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
controls.maxDistance = 100;

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
    const textureLoader = new THREE.TextureLoader();

    // Dimensions des murs
    const wallThickness = 0.5;
    const wallHeight = 25;
    const wallWidth = 40;

    const backgroundTexture = textureLoader.load('/assets/paysage.png');

    const planeGeometry = new THREE.PlaneGeometry(70, 50); // Taille ajustable
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture
    });

    const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    backgroundPlane.position.set(0, 10, -40); // Ajuste la position derrière ton mur
    scene.add(backgroundPlane);
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

