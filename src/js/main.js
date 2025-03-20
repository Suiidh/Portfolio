import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Ajout de la favicon
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = '/assets/favicon.png';
document.head.appendChild(favicon);

// Détection des capacités
const isHighPerf = !!document.createElement('canvas').getContext('webgl2') && window.devicePixelRatio > 1;
const renderer = new THREE.WebGLRenderer({ antialias: isHighPerf, powerPreference: 'low-power' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = isHighPerf;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

const dpr = Math.min(window.devicePixelRatio, isHighPerf ? 2 : 1);
renderer.setPixelRatio(dpr);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, isHighPerf ? 100 : 50);

// Écran de chargement
const loadingScreen = document.createElement('div');
loadingScreen.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 1000; font-family: Arial, sans-serif;';

const loadingText = document.createElement('div');
loadingText.style.cssText = 'font-size: 24px; margin-bottom: 20px; animation: pulse 1.5s infinite;';

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
    #gameContainer { width: 400px; height: 150px; position: relative; background: #222; overflow: hidden; }
    #dino { width: 30px; height: 30px; background: #fff; position: absolute; bottom: 0; left: 40px; transition: bottom 0.2s; }
    #cactus { width: 15px; height: 30px; background: #0f0; position: absolute; bottom: 0; right: -15px; }
`;
document.head.appendChild(styleSheet);

const gameContainer = document.createElement('div');
gameContainer.id = 'gameContainer';
const dino = document.createElement('div');
dino.id = 'dino';
const cactus = document.createElement('div');
cactus.id = 'cactus';
gameContainer.appendChild(dino);
gameContainer.appendChild(cactus);

const progressBarContainer = document.createElement('div');
progressBarContainer.style.cssText = 'width: 50%; height: 10px; background: #333; border-radius: 5px; overflow: hidden; margin-top: 10px;';
const progressBar = document.createElement('div');
progressBar.style.cssText = 'width: 0%; height: 100%; background: #0f0; transition: width 0.5s;';

progressBarContainer.appendChild(progressBar);
loadingScreen.appendChild(loadingText);
loadingScreen.appendChild(gameContainer);
loadingScreen.appendChild(progressBarContainer);
document.body.appendChild(loadingScreen);

// Tous les assets avec les sphères pour les lumières
const assetsToLoad = [
    { path: '/assets/gaming_desktop.glb', callback: (gltf) => { pcModel = gltf.scene; pcModel.scale.set(1, 1, 1); pcModel.position.set(0, -4.25, 0); pcModel.rotation.y = -Math.PI / 2; scene.add(pcModel); camera.position.set(0, 5, 15); camera.lookAt(0, 4.5, 0); createScreen(-3, 2, -1.36); createRoom(); }},
    { path: '/assets/sofa.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(6, 6, 6); m.position.set(16.5, -6.2, -9); m.rotation.y = Math.PI; scene.add(m); }},
    { path: '/assets/plante2.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(14, 14, 14); m.position.set(17, -6.2, 1); m.rotation.y = Math.PI; scene.add(m); }},
    { path: '/assets/table.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(9, 9, 9); m.position.set(8, -6.2, -9); m.rotation.y = Math.PI; scene.add(m); }},
    { path: '/assets/plante1.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(9, 9, 9); m.position.set(8, -2.94, -9); scene.add(m); }},
    { path: '/assets/casque.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(9, 9, 9); m.position.set(-7, -0.46, 2); m.rotation.set(Math.PI / 2.1, 0, 3); scene.add(m); }},
    { path: '/assets/chair.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(8, 8, 8); m.position.set(-2, -6.1, 5); m.rotation.set(0, Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/tv.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(4, 4, 4); m.position.set(-19.14, 0, -9); m.rotation.y = 0; scene.add(m); createTVScreen(-19.2, 5.5, -8.9); }},
    { path: '/assets/tv_stand4.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(8, 8, 8); m.position.set(-18.3, -6.2, -9); m.rotation.set(0, -Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/tv_stand3.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(8, 8, 8); m.position.set(-18.3, 1, 15); m.rotation.set(0, -Math.PI / 2, Math.PI / 2); scene.add(m); }},
    { path: '/assets/spider-man.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(0.5, 0.5, 0.5); m.position.set(-18.3, 3.55, 11); m.rotation.set(0, Math.PI / 2.7, 0); scene.add(m); }},
    { path: '/assets/venom.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(1, 1, 1); m.position.set(-18.3, 3.5, 13.5); m.rotation.set(0, Math.PI / 1.7, 0); scene.add(m); }},
    { path: '/assets/batman.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(1.5, 1.5, 1.5); m.position.set(-18.3, 0.07, 12.4); m.rotation.set(0, Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/iron_man.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(0.004, 0.004, 0.004); m.position.set(-18.3, -6.05, 12.4); m.rotation.set(0, Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/lampe.glb', callback: (gltf) => {
            const m = gltf.scene; m.scale.set(0.8, 0.8, 0.8); m.position.set(-7.6, -0.68, -1); m.rotation.set(0, 4, 0); scene.add(m);
            const light = new THREE.PointLight(0xffd700, isHighPerf ? 1 : 0.5, 8); light.position.set(-7.6, 3, -1); scene.add(light);
            const bulbGeometry = new THREE.SphereGeometry(0.2, 16, 16); const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 }); const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial); bulb.position.set(-7.6, 3, -1); scene.add(bulb);
        }},
    { path: '/assets/lampe.glb', callback: (gltf) => {
            const m = gltf.scene; m.scale.set(3, 3, 3); m.position.set(15, -5.95, 16); m.rotation.set(0, 0.7, 0); scene.add(m);
            const light = new THREE.DirectionalLight(0xffe4b5, isHighPerf ? 1 : 0.5); light.position.set(15, 12, 16); scene.add(light);
            const ambient = new THREE.AmbientLight(0xffe4b5, 0.3); scene.add(ambient);
            const bulbGeometry = new THREE.SphereGeometry(0.8, 16, 16); const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffe4b5 }); const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial); bulb.position.set(15, 8, 16); scene.add(bulb);
        }},
    { path: '/assets/wall2.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(1.7, 1.7, 1.7); m.position.set(0, 2, -29.3); m.rotation.set(0, Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/wall3.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(1.7, 1.7, 1.7); m.position.set(0, 2, 10.8); m.rotation.set(0, Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/wall3.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(1.7, 1.7, 1.7); m.position.set(10.8, 2, 0); m.rotation.set(0, Math.PI, 0); scene.add(m); }},
    { path: '/assets/wall3.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(1.7, 1.7, 1.7); m.position.set(-29.5, 2, 0); m.rotation.set(0, Math.PI, 0); scene.add(m); }},
    { path: '/assets/door.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(4, 4, 4); m.position.set(0, 1.8, 19.7); m.rotation.set(0, 0, 0); scene.add(m); }},
    { path: '/assets/ceiling.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(3, 3, 1.5); m.position.set(4, 33, 0); m.rotation.set(0, 0, Math.PI / 2); scene.add(m); }},
    { path: '/assets/floor.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(3, 3, 1.5); m.position.set(4, 10, 0); m.rotation.set(0, 0, Math.PI / 2); scene.add(m); }},
    { path: '/assets/plafonnier.glb', callback: (gltf) => {
            const m = gltf.scene; m.scale.set(4, 4, 4); m.position.set(6, -8.7, 4); m.rotation.set(0, 1.57, 0); scene.add(m);
            const light = new THREE.PointLight(0xffffff, isHighPerf ? 100 : 50, 60); light.position.set(-0.4, 10, 1.5); scene.add(light);
            const ambient = new THREE.AmbientLight(0xffffff, 0.3); scene.add(ambient);
            const bulbGeometry = new THREE.SphereGeometry(0.8, 16, 16); const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial); bulb.position.set(-0.4, 11, 1.5); scene.add(bulb);
        }},
];

// Mini-jeu
let isJumping = false;
let gameRunning = true;
let cactusPosition = 400;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') ? parseInt(localStorage.getItem('dinoHighScore')) : 0;
let loadedCount = 0;

function updateLoadingText() {
    loadingText.textContent = `Chargement... ${Math.round(loadedCount / assetsToLoad.length * 100)}% | Score: ${score} | Record: ${highScore}`;
}
updateLoadingText();

function jump() {
    if (!isJumping && gameRunning) {
        isJumping = true;
        dino.style.bottom = '60px';
        setTimeout(() => {
            dino.style.bottom = '0px';
            isJumping = false;
        }, 300);
    }
}

let lastTime = 0;
function moveCactus(time) {
    if (!gameRunning) return;
    const delta = time - lastTime;
    if (delta < (isHighPerf ? 16 : 33)) {
        requestAnimationFrame(moveCactus);
        return;
    }
    lastTime = time;

    cactusPosition -= 3;
    cactus.style.right = `${400 - cactusPosition}px`;

    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    if (dinoRect.right > cactusRect.left && dinoRect.left < cactusRect.right && dinoRect.bottom > cactusRect.top) {
        gameRunning = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('dinoHighScore', highScore);
        }
        loadingText.textContent = `Perdu ! Score: ${score} | Record: ${highScore} | Espace ou Échap pour rejouer`;
    }

    if (cactusPosition <= -15) {
        cactusPosition = 400;
        score++;
        updateLoadingText();
    }
    requestAnimationFrame(moveCactus);
}
requestAnimationFrame(moveCactus);

function resetGame() {
    if (!gameRunning && loadedCount < assetsToLoad.length) {
        gameRunning = true;
        cactusPosition = 400;
        cactus.style.right = '-15px';
        score = 0;
        updateLoadingText();
        requestAnimationFrame(moveCactus);
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && gameRunning) jump();
    else if ((e.key === ' ' || e.key === 'Escape') && !gameRunning && loadedCount < assetsToLoad.length) resetGame();
    else if (e.key === 'Escape' && loadedCount >= assetsToLoad.length) {
        if (isZoomedPC) toggleZoomPC();
        else if (isZoomedTV) toggleZoomTV();
    }
    else if (e.key === 'ArrowRight' && loadedCount >= assetsToLoad.length) {
        if (isZoomedPC) {
            currentPCIndex = (currentPCIndex + 1) % pcImages.length;
            updatePCImage();
            startPCSlideshow();
        } else {
            currentTVIndex = (currentTVIndex + 1) % projectImages.length;
            updateTVImage();
            startTVSlideshow();
        }
    }
    else if (e.key === 'ArrowLeft' && loadedCount >= assetsToLoad.length) {
        if (isZoomedPC) {
            currentPCIndex = (currentPCIndex - 1 + pcImages.length) % pcImages.length;
            updatePCImage();
            startPCSlideshow();
        } else {
            currentTVIndex = (currentTVIndex - 1 + projectImages.length) % projectImages.length;
            updateTVImage();
            startTVSlideshow();
        }
    }
});

// Chargement
const loader = new GLTFLoader();
let pcModel, screenMesh, tvMesh;

function loadNextAsset(index) {
    if (index >= assetsToLoad.length) {
        loadingText.textContent = 'Chargement terminé !';
        progressBar.style.width = '100%';
        gameRunning = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('dinoHighScore', highScore);
        }
        setTimeout(() => {
            document.body.removeChild(loadingScreen);
            loadingScreen.remove();
            startPCSlideshow();
            startTVSlideshow();
            animate();
        }, 300);
        return;
    }

    const asset = assetsToLoad[index];
    loader.load(asset.path, (gltf) => {
        asset.callback(gltf);
        loadedCount++;
        updateLoadingText();
        progressBar.style.width = `${loadedCount / assetsToLoad.length * 100}%`;
        loadNextAsset(index + 1);
    }, undefined, (error) => {
        console.warn(`Erreur chargement ${asset.path}: ${error.message}`);
        loadedCount++;
        updateLoadingText();
        progressBar.style.width = `${loadedCount / assetsToLoad.length * 100}%`;
        loadNextAsset(index + 1);
    });
}
loadNextAsset(0);

// Textures et diaporama
const projectImages = ['/assets/CV_Diapo/1.png', '/assets/CV_Diapo/2.png', '/assets/CV_Diapo/3.png', '/assets/CV_Diapo/4.png', '/assets/CV_Diapo/5.png', '/assets/CV_Diapo/6.png', '/assets/CV_Diapo/7.png', '/assets/CV_Diapo/8.png'];
const githubImage = '/assets/github.png';
const pcImages = [...projectImages, githubImage];
let currentPCIndex = 0;
let currentTVIndex = 0;

function createScreen(x, y, z) {
    const geometry = new THREE.PlaneGeometry(6.5, 3.6);
    const texture = new THREE.TextureLoader().load(pcImages[currentPCIndex]);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.encoding = THREE.sRGBEncoding;
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 1 });
    screenMesh = new THREE.Mesh(geometry, material);
    screenMesh.position.set(x, y, z);
    screenMesh.rotation.x = -Math.PI / 45;
    scene.add(screenMesh);
    controls.target.copy(screenMesh.position);
    controls.update();
}

function createTVScreen(x, y, z) {
    const geometry = new THREE.PlaneGeometry(16.2, 7.8);
    const texture = new THREE.TextureLoader().load(projectImages[currentTVIndex]);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.encoding = THREE.sRGBEncoding;
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 1 });
    tvMesh = new THREE.Mesh(geometry, material);
    tvMesh.position.set(-19.2, 5.5, -8.9);
    tvMesh.rotation.y = Math.PI / 2;
    scene.add(tvMesh);
}

function updatePCImage() {
    if (!screenMesh) return;
    const fadeOut = setInterval(() => {
        screenMesh.material.opacity -= 0.2;
        if (screenMesh.material.opacity <= 0) {
            clearInterval(fadeOut);
            const newTexture = new THREE.TextureLoader().load(pcImages[currentPCIndex]);
            newTexture.minFilter = THREE.LinearFilter;
            newTexture.magFilter = THREE.LinearFilter;
            newTexture.encoding = THREE.sRGBEncoding;
            screenMesh.material.map.dispose();
            screenMesh.material.map = newTexture;
            screenMesh.material.needsUpdate = true;
            const fadeIn = setInterval(() => {
                screenMesh.material.opacity += 0.2;
                if (screenMesh.material.opacity >= 1) clearInterval(fadeIn);
            }, 50);
        }
    }, 50);
}

function updateTVImage() {
    if (!tvMesh) return;
    const fadeOut = setInterval(() => {
        tvMesh.material.opacity -= 0.2;
        if (tvMesh.material.opacity <= 0) {
            clearInterval(fadeOut);
            const newTexture = new THREE.TextureLoader().load(projectImages[currentTVIndex]);
            newTexture.minFilter = THREE.LinearFilter;
            newTexture.magFilter = THREE.LinearFilter;
            newTexture.encoding = THREE.sRGBEncoding;
            tvMesh.material.map.dispose();
            tvMesh.material.map = newTexture;
            tvMesh.material.needsUpdate = true;
            const fadeIn = setInterval(() => {
                tvMesh.material.opacity += 0.2;
                if (tvMesh.material.opacity >= 1) clearInterval(fadeIn);
            }, 50);
        }
    }, 50);
}

let pcSlideshowInterval, tvSlideshowInterval;
function startPCSlideshow() {
    clearInterval(pcSlideshowInterval);
    pcSlideshowInterval = setInterval(() => {
        currentPCIndex = (currentPCIndex + 1) % pcImages.length;
        updatePCImage();
    }, 5000);
}

function startTVSlideshow() {
    clearInterval(tvSlideshowInterval);
    tvSlideshowInterval = setInterval(() => {
        currentTVIndex = (currentTVIndex + 1) % projectImages.length;
        updateTVImage();
    }, 5000);
}

// Contrôles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;
controls.enableZoom = true;
controls.zoomSpeed = 0.8;
controls.minDistance = 3;
controls.maxDistance = 14;

let isZoomedPC = false, isZoomedTV = false;
const initialPositionPC = new THREE.Vector3(0, 5, 15);
const zoomedPositionPC = new THREE.Vector3(-3, 2.4, 1);
const zoomedPositionTV = new THREE.Vector3(-11.62, 5.69, -8.96);
const zoomedRotationTV = new THREE.Euler(-108.29 * Math.PI / 180, 88.52 * Math.PI / 180, 108.29 * Math.PI / 180);

function animateZoom(targetPosition, targetRotation, targetFocus) {
    const duration = 300;
    const start = performance.now();
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const startTarget = controls.target.clone();

    function step(timestamp) {
        const elapsed = timestamp - start;
        const alpha = Math.min(elapsed / duration, 1);
        camera.position.lerpVectors(startPosition, targetPosition, alpha);
        camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, alpha);
        camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, alpha);
        camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, alpha);
        controls.target.lerpVectors(startTarget, targetFocus, alpha);
        controls.update();
        if (alpha < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function toggleZoomPC() {
    isZoomedPC = !isZoomedPC;
    animateZoom(isZoomedPC ? zoomedPositionPC : initialPositionPC, isZoomedPC ? new THREE.Euler(0, 0, 0) : new THREE.Euler(0, 0, 0), screenMesh.position);
}

function toggleZoomTV() {
    isZoomedTV = !isZoomedTV;
    animateZoom(isZoomedTV ? zoomedPositionTV : initialPositionPC, isZoomedTV ? zoomedRotationTV : new THREE.Euler(0, 0, 0), isZoomedTV ? tvMesh.position : screenMesh.position);
}

// Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([screenMesh, tvMesh]);
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj === screenMesh) {
            if (!isZoomedPC) {
                toggleZoomPC();
            } else {
                if (pcImages[currentPCIndex] === githubImage) {
                    window.open("https://github.com/Suiidh", "_blank");
                } else {
                    toggleZoomPC();
                }
            }
        } else if (obj === tvMesh) {
            toggleZoomTV();
        }
    } else if (isZoomedPC) {
        toggleZoomPC();
    }
});

function createRoom() {
    const texture = new THREE.TextureLoader().load('/assets/paysage.png');
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const geometry = new THREE.PlaneGeometry(isHighPerf ? 70 : 50, isHighPerf ? 50 : 30);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 10, -30);
    scene.add(plane);
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();