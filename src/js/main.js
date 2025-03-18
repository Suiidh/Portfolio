import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding; // Couleurs naturelles
document.body.appendChild(renderer.domElement);

// Améliorer la qualité du rendu pour les écrans haute résolution
const dpr = window.devicePixelRatio || 1;
renderer.setPixelRatio(dpr);

// Écran de chargement
const loadingScreen = document.createElement('div');
loadingScreen.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; color: #fff; display: flex; justify-content: center; align-items: center; z-index: 1000;';
loadingScreen.innerText = 'Chargement... 0%';
document.body.appendChild(loadingScreen);

// Loader GLTF
const loader = new GLTFLoader();
let pcModel, screenMesh, tvMesh;

// Liste des assets à charger
const assetsToLoad = [
    {
        path: '/assets/gaming_desktop_pc.glb',
        callback: (gltf) => {
            pcModel = gltf.scene;
            pcModel.scale.set(1, 1, 1);
            pcModel.position.set(0, -1, 0);
            pcModel.rotation.y = -Math.PI / 2;
            scene.add(pcModel);
            camera.position.set(0, 5, 15);
            camera.lookAt(0, 4.5, 0);
            createScreen(-3, 2, -1.36);
            createRoom();
        }
    },
    {
        path: '/assets/sofa.glb',
        callback: (gltf) => {
            const sofa = gltf.scene;
            sofa.scale.set(6, 6, 6);
            sofa.position.set(16.5, -6.2, -9);
            sofa.rotation.y = Math.PI;
            scene.add(sofa);
        }
    },
    {
        path: '/assets/plante2.glb',
        callback: (gltf) => {
            const sofa = gltf.scene;
            sofa.scale.set(14, 14, 14);
            sofa.position.set(17, -6.2, 1);
            sofa.rotation.y = Math.PI;
            scene.add(sofa);
        }
    },
    {
        path: '/assets/table.glb',
        callback: (gltf) => {
            const table = gltf.scene;
            table.scale.set(9, 9, 9);
            table.position.set(8, -6.2, -9);
            table.rotation.y = Math.PI;
            scene.add(table);
        }
    },
    {
        path: '/assets/plante1.glb',
        callback: (gltf) => {
            const plante1 = gltf.scene;
            plante1.scale.set(9, 9, 9);
            plante1.position.set(8, -2.94, -9);
            scene.add(plante1);
        }
    },
    {
        path: '/assets/casque.glb',
        callback: (gltf) => {
            const casque = gltf.scene;
            casque.scale.set(9, 9, 9);
            casque.position.set(-7, -0.46, 2);
            casque.rotation.set(Math.PI / 2.1, 0, 3);
            scene.add(casque);
        }
    },
    {
        path: '/assets/chair.glb',
        callback: (gltf) => {
            const chaise = gltf.scene;
            chaise.scale.set(8, 8, 8);
            chaise.position.set(-2, -6.1, 5);
            chaise.rotation.set(0, Math.PI / 2, 0);
            scene.add(chaise);
        }
    },
    {
        path: '/assets/tv.glb',
        callback: (gltf) => {
            const tv = gltf.scene;
            tv.scale.set(4, 4, 4);
            tv.position.set(-19.14, 0, -9);
            tv.rotation.y = 0;
            scene.add(tv);
            createTVScreen(-19.2, 5.5, -8.9);
        }
    },
    {
        path: '/assets/tv_stand.glb',
        callback: (gltf) => {
            const tv_stand = gltf.scene;
            tv_stand.scale.set(8, 8, 8);
            tv_stand.position.set(-18.3, -6.2, -9);
            tv_stand.rotation.set(0,-Math.PI/2,0);
            scene.add(tv_stand);
        }
    },
    {
        path: '/assets/tv_stand3.glb',
        callback: (gltf) => {
            const tv_stand = gltf.scene;
            tv_stand.scale.set(8, 8, 8);
            tv_stand.position.set(-18.3, 1, 15);
            tv_stand.rotation.set(0,-Math.PI/2,Math.PI/2);
            scene.add(tv_stand);
        }
    },
    {
        path: '/assets/spider-man.glb',
        callback: (gltf) => {
            const figure = gltf.scene;
            figure.scale.set(0.5, 0.5, 0.5);
            figure.position.set(-18.3, 3.55, 11);
            figure.rotation.set(0,Math.PI/2.7,0);
            scene.add(figure);
        }
    },
    {
        path: '/assets/venom.glb',
        callback: (gltf) => {
            const figure1 = gltf.scene;
            figure1.scale.set(1, 1, 1);
            figure1.position.set(-18.3, 3.5, 13.5);
            figure1.rotation.set(0,Math.PI/1.7,0);
            scene.add(figure1);
        }
    },
    {
        path: '/assets/batman.glb',
        callback: (gltf) => {
            const figure2 = gltf.scene;
            figure2.scale.set(1.5, 1.5, 1.5);
            figure2.position.set(-18.3, 0.07, 12.4);
            figure2.rotation.set(0,Math.PI/2,0);
            scene.add(figure2);
        }
    },
    {
        path: '/assets/iron_man.glb',
        callback: (gltf) => {
            const figure3 = gltf.scene;
            figure3.scale.set(0.004, 0.004, 0.004);
            figure3.position.set(-18.3, -6.05, 12.4);
            figure3.rotation.set(0,Math.PI/2,0);
            scene.add(figure3);
        }
    },
    {
        path: '/assets/lampe.glb',
        callback: (gltf) => {
            const lampe = gltf.scene;
            lampe.scale.set(0.8, 0.8, 0.8);
            lampe.position.set(-7.6, -0.68, -1);
            lampe.rotation.set(0, 4, 0);
            scene.add(lampe);

            const lampeLight = new THREE.PointLight(0xffd700, 1, 8);
            lampeLight.position.set(-7.6, 3, -1);
            lampeLight.decay = 2;
            lampeLight.castShadow = true;
            lampeLight.shadow.mapSize.width = 1024;
            lampeLight.shadow.mapSize.height = 1024;
            scene.add(lampeLight);

            const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                emissive: 0xffd700,
                emissiveIntensity: 2
            });
            const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            lightSphere.position.copy(lampeLight.position);
            scene.add(lightSphere);
        }
    },
    {
        path: '/assets/lampe.glb',
        callback: (gltf) => {
            const lampe = gltf.scene;
            lampe.scale.set(3, 3, 3);
            lampe.position.set(15, -5.95, 16);
            lampe.rotation.set(0, 0.7, 0);
            scene.add(lampe);

            const ambientLight = new THREE.AmbientLight(0xffe4b5, 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffe4b5, 1);
            directionalLight.position.set(15, 12, 16);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.left = -10;
            directionalLight.shadow.camera.right = 10;
            directionalLight.shadow.camera.top = 10;
            directionalLight.shadow.camera.bottom = -10;
            scene.add(directionalLight);

            const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xffe4b5,
                emissive: 0xffe4b5,
                emissiveIntensity: 1.0
            });
            const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            lightSphere.position.set(15, 7, 16);
            scene.add(lightSphere);
        }
    },
    {
        path: '/assets/wall2.glb',
        callback: (gltf) => {
            const wall = gltf.scene;
            wall.scale.set(1.7, 1.7, 1.7);
            wall.position.set(0, 2, -29.3);
            wall.rotation.set(0, Math.PI / 2, 0);
            scene.add(wall);
        }
    },
    {
        path: '/assets/wall3.glb',
        callback: (gltf) => {
            const wall = gltf.scene;
            wall.scale.set(1.7, 1.7, 1.7);
            wall.position.set(0, 2, 10.8);
            wall.rotation.set(0, Math.PI / 2, 0);
            scene.add(wall);
        }
    },
    {
        path: '/assets/wall3.glb',
        callback: (gltf) => {
            const wall = gltf.scene;
            wall.scale.set(1.7, 1.7, 1.7);
            wall.position.set(10.8, 2, 0);
            wall.rotation.set(0, Math.PI, 0);
            scene.add(wall);
        }
    },
    {
        path: '/assets/wall3.glb',
        callback: (gltf) => {
            const wall = gltf.scene;
            wall.scale.set(1.7, 1.7, 1.7);
            wall.position.set(-29.5, 2, 0);
            wall.rotation.set(0, Math.PI, 0);
            scene.add(wall);
        }
    },
    {
        path: '/assets/door.glb',
        callback: (gltf) => {
            const door = gltf.scene;
            door.scale.set(4, 4, 4);
            door.position.set(0, 1.8, 19.7);
            door.rotation.set(0, 0, 0);
            scene.add(door);
        }
    },
    {
        path: '/assets/ceiling.glb',
        callback: (gltf) => {
            const ceiling = gltf.scene;
            ceiling.scale.set(3, 3, 1.5);
            ceiling.position.set(4, 33, 0);
            ceiling.rotation.set(0, 0, Math.PI / 2);
            scene.add(ceiling);
        }
    },
    {
        path: '/assets/floor.glb',
        callback: (gltf) => {
            const floor = gltf.scene;
            floor.scale.set(3, 3, 1.5);
            floor.position.set(4, 10, 0);
            floor.rotation.set(0, 0, Math.PI / 2);
            scene.add(floor);
        }
    },
    {
        path: '/assets/plafonnier.glb',
        callback: (gltf) => {
            const plafonnier = gltf.scene;
            plafonnier.scale.set(4, 4, 4);
            plafonnier.position.set(6, -8.7, 4);
            plafonnier.rotation.set(0, 1.57, 0);
            scene.add(plafonnier);

            const plafonnierLight = new THREE.PointLight(0xffffff, 200, 60);
            plafonnierLight.position.set(-0.4, 10, 1.5);
            plafonnierLight.castShadow = true;
            plafonnierLight.shadow.mapSize.width = 8192;
            plafonnierLight.shadow.mapSize.height = 8192;
            plafonnierLight.shadow.bias = -0.001;
            plafonnierLight.shadow.camera.near = 1;
            plafonnierLight.shadow.camera.far = 50;
            plafonnierLight.shadow.camera.left = -20;
            plafonnierLight.shadow.camera.right = 20;
            plafonnierLight.shadow.camera.top = 20;
            plafonnierLight.shadow.camera.bottom = -20;
            scene.add(plafonnierLight);

            const spotLight = new THREE.SpotLight(0xffffff, 8, 60, Math.PI / 6, 0.3, 3);
            spotLight.position.set(-0.4, 10.5, 1.5);
            spotLight.target.position.set(-0.4, 10.5, 1.5);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 2048;
            spotLight.shadow.mapSize.height = 2048;
            spotLight.shadow.bias = -0.005;
            scene.add(spotLight);
            scene.add(spotLight.target);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
            const sphereMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffaa,
                emissive: 0xffffaa,
                emissiveIntensity: 5,
                metalness: 0.1,
                roughness: 0.5
            });
            const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            lightSphere.position.copy(plafonnierLight.position);
            scene.add(lightSphere);
        }
    }
];

// Gestion du chargement asynchrone
let loadedCount = 0;

function loadNextAsset(index) {
    if (index >= assetsToLoad.length) {
        console.log("Chargement terminé !");
        document.body.removeChild(loadingScreen);
        animate();
        return;
    }

    const asset = assetsToLoad[index];
    loader.load(
        asset.path,
        (gltf) => {
            asset.callback(gltf);
            loadedCount++;
            const progress = (loadedCount / assetsToLoad.length) * 100;
            loadingScreen.innerText = `Chargement... ${progress.toFixed(0)}%`;
            loadNextAsset(index + 1);
        },
        undefined,
        (error) => console.error(`Erreur lors du chargement de ${asset.path}:`, error)
    );
}

// Démarrer le chargement
loadNextAsset(0);

// Liste des images des projets (pour la TV uniquement)
const projectImages = [
    '/assets/CV_Lucas_2024.jpg',
    '/assets/github.png',
];
let currentProjectIndex = 0;

// Image statique pour l’écran du PC
const githubImage = '/assets/github.png';

// Fonction pour créer l'écran du PC (statique)
function createScreen(x, y, z) {
    const screenGeometry = new THREE.PlaneGeometry(6.5, 3.6);
    const screenTexture = new THREE.TextureLoader().load(githubImage, (texture) => {
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        texture.encoding = THREE.sRGBEncoding;
    });

    const screenMaterial = new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.DoubleSide,
        transparent: false,
        color: 0xffffff
    });

    screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.set(x, y, z);
    screenMesh.rotation.x = -Math.PI / 45;
    scene.add(screenMesh);

    screenMesh.material.map.center.set(0.5, 0.5);

    controls.target.set(screenMesh.position.x, screenMesh.position.y, screenMesh.position.z);
    controls.update();
}

// Fonction pour créer l'écran de la TV (diaporama)
function createTVScreen(x, y, z) {
    const tvGeometry = new THREE.PlaneGeometry(16.2, 7.8);
    const tvTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], (texture) => {
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        texture.encoding = THREE.sRGBEncoding;
    });

    const tvMaterial = new THREE.MeshBasicMaterial({
        map: tvTexture,
        side: THREE.DoubleSide,
        transparent: false,
        color: 0xffffff
    });

    tvMesh = new THREE.Mesh(tvGeometry, tvMaterial);
    tvMesh.position.set(-19.2, 5.5, -8.9);
    tvMesh.rotation.y = Math.PI / 2;
    scene.add(tvMesh);

    tvMesh.material.map.center.set(0.5, 0.5);

    startTVSlideshow();
}

// Mise à jour de l'image de la TV (diaporama)
function updateTVImage() {
    if (tvMesh) {
        const newTexture = new THREE.TextureLoader().load(projectImages[currentProjectIndex], (texture) => {
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            texture.encoding = THREE.sRGBEncoding;
        });
        tvMesh.material.map = newTexture;
        tvMesh.material.needsUpdate = true;
    }
}

// Diaporama automatique pour la TV
let slideshowInterval;

function startTVSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        currentProjectIndex = (currentProjectIndex + 1) % projectImages.length;
        updateTVImage();
    }, 3000);
}

// Navigation manuelle avec les flèches (pour la TV uniquement)
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        currentProjectIndex = (currentProjectIndex + 1) % projectImages.length;
        updateTVImage();
        startTVSlideshow();
    } else if (event.key === 'ArrowLeft') {
        currentProjectIndex = (currentProjectIndex - 1 + projectImages.length) % projectImages.length;
        updateTVImage();
        startTVSlideshow();
    }
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

// Gestion du zoom interactif pour le PC
let isZoomedPC = false;
const initialPositionPC = new THREE.Vector3(0, 5, 15);
const zoomedPositionPC = new THREE.Vector3(-3, 2.4, 1);

// Gestion du zoom interactif pour la TV
let isZoomedTV = false;
const zoomedPositionTV = new THREE.Vector3(-11.62, 5.69, -8.96);
const zoomedRotationTV = new THREE.Euler(
    -108.29 * Math.PI / 180,
    88.52 * Math.PI / 180,
    108.29 * Math.PI / 180
);

function animateZoom(targetPosition, targetRotation, targetFocus) {
    let frame = 0;
    const maxFrames = 30;
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const startTarget = controls.target.clone();

    function zoomStep() {
        frame++;
        const alpha = frame / maxFrames;
        camera.position.lerpVectors(startPosition, targetPosition, alpha);
        camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, alpha);
        camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, alpha);
        camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, alpha);
        controls.target.lerpVectors(startTarget, targetFocus, alpha);
        controls.update();

        if (frame < maxFrames) {
            requestAnimationFrame(zoomStep);
        }
    }

    zoomStep();
}

function toggleZoomPC() {
    isZoomedPC = !isZoomedPC;
    const targetPosition = isZoomedPC ? zoomedPositionPC : initialPositionPC;
    const targetRotation = isZoomedPC ? new THREE.Euler(0, 0, 0) : new THREE.Euler(0, 0, 0);
    const targetFocus = screenMesh.position;
    animateZoom(targetPosition, targetRotation, targetFocus);
}

function toggleZoomTV() {
    isZoomedTV = !isZoomedTV;
    const targetPosition = isZoomedTV ? zoomedPositionTV : initialPositionPC;
    const targetRotation = isZoomedTV ? zoomedRotationTV : new THREE.Euler(0, 0, 0);
    const targetFocus = isZoomedTV ? tvMesh.position : screenMesh.position;
    animateZoom(targetPosition, targetRotation, targetFocus);
}

// Détection des clics pour zoomer, dézoomer ou rediriger
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        if (intersects[0].object === screenMesh) {
            if (!isZoomedPC) {
                toggleZoomPC();
            } else {
                window.open("https://github.com/Suiidh", "_blank");
            }
        } else if (intersects[0].object === tvMesh) {
            toggleZoomTV();
        } else if (isZoomedPC) {
            toggleZoomPC();
        }
    } else if (isZoomedPC) {
        toggleZoomPC();
    }
});

// Dézoom avec la touche "Échap"
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (isZoomedPC) {
            toggleZoomPC();
        } else if (isZoomedTV) {
            toggleZoomTV();
        }
    }
});

// Fonction pour créer la chambre
function createRoom() {
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load('/assets/paysage.png');
    const planeGeometry = new THREE.PlaneGeometry(70, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });

    const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    backgroundPlane.position.set(0, 10, -40);
    scene.add(backgroundPlane);
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Resize handler
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});