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

// Écran de chargement (sans mini-jeu)
const loadingScreen = document.createElement('div');
loadingScreen.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 1000; font-family: Arial, sans-serif;';

const loadingText = document.createElement('div');
loadingText.style.cssText = 'font-size: 24px; margin-bottom: 20px; animation: pulse 1.5s infinite;';

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
    @keyframes modalFadeIn { 
        from { opacity: 0; transform: scale(0.95); } 
        to { opacity: 1; transform: scale(1); } 
    }
    #infoButton { 
        position: fixed; 
        top: 15px; 
        right: 15px; 
        padding: 10px 20px; 
        background: linear-gradient(135deg, #1e90ff, #00bfff); 
        color: #fff; 
        border: none; 
        border-radius: 25px; 
        cursor: pointer; 
        font-size: 16px; 
        font-family: 'Poppins', sans-serif; 
        font-weight: 600; 
        z-index: 1000; 
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); 
        transition: transform 0.2s, background 0.3s; 
    }
    #infoButton:hover { 
        background: linear-gradient(135deg, #00bfff, #1e90ff); 
        transform: scale(1.05); 
    }
    #infoModal { 
        display: none; 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0, 0, 0, 0.75); 
        z-index: 2000; 
        justify-content: center; 
        align-items: center; 
    }
    #infoModalContent { 
        background: linear-gradient(135deg, #ffffff, #f0f4f8); 
        padding: 25px; 
        border-radius: 15px; 
        max-width: 900px; 
        width: 90%; 
        height: 500px; 
        position: relative; 
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); 
        font-family: 'Poppins', sans-serif; 
        animation: modalFadeIn 0.3s ease-out; 
        display: flex; 
        flex-direction: column; 
        flex-wrap: wrap; 
        gap: 20px; 
    }
    #infoModalContent h2 { 
        margin: 0 0 15px; 
        color: #1e90ff; 
        font-size: 24px; 
        font-weight: 600; 
        text-align: center; 
        border-bottom: 2px solid #1e90ff; 
        padding-bottom: 10px; 
        width: 100%; 
    }
    #infoModalContent .content-wrapper { 
        display: flex; 
        flex-direction: row; 
        flex: 1; 
        width: 100%; 
        height: calc(100% - 60px); 
    }
    #infoModalContent .section { 
        flex: 1; 
        padding: 0 15px; 
    }
    #infoModalContent h3 { 
        color: #333; 
        font-size: 18px; 
        font-weight: 600; 
        margin: 0 0 10px; 
        text-align: center; 
    }
    #infoModalContent ul { 
        list-style: none; 
        padding: 0; 
        margin: 0; 
    }
    #infoModalContent ul li { 
        margin: 8px 0; 
        color: #555; 
        font-size: 14px; 
        position: relative; 
        padding-left: 20px; 
    }
    #infoModalContent ul li:before { 
        content: '•'; 
        position: absolute; 
        left: 0; 
        color: #1e90ff; 
        font-size: 16px; 
        line-height: 14px; 
    }
    #infoModalContent a { 
        color: #1e90ff; 
        text-decoration: none; 
        transition: color 0.2s; 
    }
    #infoModalContent a:hover { 
        color: #00bfff; 
        text-decoration: underline; 
    }
    #closeModal { 
        position: absolute; 
        top: 15px; 
        right: 15px; 
        background: #ff4444; 
        color: #fff; 
        border: none; 
        border-radius: 50%; 
        width: 30px; 
        height: 30px; 
        cursor: pointer; 
        font-size: 20px; 
        line-height: 30px; 
        text-align: center; 
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); 
        transition: background 0.3s, transform 0.2s; 
    }
    #closeModal:hover { 
        background: #cc0000; 
        transform: scale(1.1); 
    }
`;
document.head.appendChild(styleSheet);

const progressBarContainer = document.createElement('div');
progressBarContainer.style.cssText = 'width: 50%; height: 10px; background: #333; border-radius: 5px; overflow: hidden; margin-top: 10px;';
const progressBar = document.createElement('div');
progressBar.style.cssText = 'width: 0%; height: 100%; background: #0f0; transition: width 0.5s;';

progressBarContainer.appendChild(progressBar);
loadingScreen.appendChild(loadingText);
loadingScreen.appendChild(progressBarContainer);
document.body.appendChild(loadingScreen);

// Tous les assets avec les sphères pour les lumières
let ps5Model;
const assetsToLoad = [
    { path: '/assets/gaming_desktop.glb', callback: (gltf) => { pcModel = gltf.scene; pcModel.scale.set(1, 1, 1); pcModel.position.set(0, -4.25, 0); pcModel.rotation.y = -Math.PI / 2; scene.add(pcModel); camera.position.set(0, 5, 15); camera.lookAt(0, 4.5, 0); createScreen(-3, 2, -1.36); createRoom(); }},
    { path: '/assets/sofa.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(6, 6, 6); m.position.set(16.5, -6.2, -9); m.rotation.y = Math.PI; scene.add(m); }},
    { path: '/assets/plante2.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(14, 14, 14); m.position.set(17, -6.2, 1); m.rotation.y = Math.PI; scene.add(m); }},
    { path: '/assets/table.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(9, 9, 9); m.position.set(8, -6.2, -9); m.rotation.y = Math.PI; scene.add(m); }},
    { path: '/assets/plante1.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(9, 9, 9); m.position.set(8, -2.94, -9); scene.add(m); }},
    { path: '/assets/casque.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(9, 9, 9); m.position.set(-7, -0.46, 2); m.rotation.set(Math.PI / 2.1, 0, 3); scene.add(m); }},
    { path: '/assets/chair.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(8, 8, 8); m.position.set(-2, -6.1, 5); m.rotation.set(0, Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/tv.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(4, 4, 4); m.position.set(-19.14, 1, -9); m.rotation.y = 0; scene.add(m); createTVScreen(-19.2, 5.5, -8.9); }},
    { path: '/assets/tv_stand4.glb', callback: (gltf) => { const m = gltf.scene; m.scale.set(8, 8, 8); m.position.set(-18.3, -6.2, -9); m.rotation.set(0, -Math.PI / 2, 0); scene.add(m); }},
    { path: '/assets/ps5.glb', callback: (gltf) => { ps5Model = gltf.scene; ps5Model.scale.set(0.8, 0.8, 0.8); ps5Model.position.set(-18.3, 0.5, -4); ps5Model.rotation.set(0, -Math.PI / 2, 0); scene.add(ps5Model); }},
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

// Chargement (sans mini-jeu)
let loadedCount = 0;

function updateLoadingText() {
    loadingText.textContent = `Chargement... ${Math.round(loadedCount / assetsToLoad.length * 100)}%`;
}
updateLoadingText();

// Mini-jeu sur la TV avec difficulté croissante et pièces
let tvIsJumping = false;
let tvGameRunning = false;
let tvCactusPosition = 800;
let tvScore = 0;
let tvHighScore = localStorage.getItem('tvDinoHighScore') ? parseInt(localStorage.getItem('tvDinoHighScore')) : 0;
let tvCoins = 0; // Compteur de pièces
let tvGameCanvas, tvGameContext, tvDino, tvCactus, tvCoin;
let jumpStartTime = 0;
const jumpDuration = 700;

function startTVGame() {
    if (tvGameRunning) return;
    tvGameRunning = true;
    tvCactusPosition = 800;
    tvScore = 0;
    tvCoins = 0;

    tvGameCanvas = document.createElement('canvas');
    tvGameCanvas.width = 800;
    tvGameCanvas.height = 400;
    tvGameContext = tvGameCanvas.getContext('2d');

    tvDino = { x: 50, y: 375, width: 25, height: 25, jumping: false, velocity: 0 }; // Sol à 400px
    tvCactus = { x: 800, y: 350, width: 20, height: 50 };
    tvCoin = null; // Pièce initialement absente

    const texture = new THREE.CanvasTexture(tvGameCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    tvMesh.material.map = texture;
    tvMesh.material.needsUpdate = true;

    animateTVGame();
}

function stopTVGame() {
    tvGameRunning = false;
    tvMesh.material.map = new THREE.TextureLoader().load(projectImages[currentTVIndex]);
    tvMesh.material.needsUpdate = true;
}

function tvJump() {
    if (!tvIsJumping && tvGameRunning) {
        tvIsJumping = true;
        tvDino.jumping = true;
        jumpStartTime = performance.now();
    }
}

function spawnCoin() {
    if (!tvCoin && Math.random() < 0.02) { // 2% de chance par frame de générer une pièce
        tvCoin = {
            x: 800,
            y: Math.random() * (375 - 275) + 275, // Entre 275 (sommet du saut) et 375 (sol)
            width: 15,
            height: 15
        };
    }
}

function animateTVGame() {
    if (!tvGameRunning) return;

    const currentTime = performance.now();
    const speed = 5 + tvScore * 0.1; // Vitesse augmente avec le score
    tvCactusPosition -= speed;

    if (tvCactusPosition <= -25) {
        tvCactusPosition = 800;
        tvScore++;
    }

    // Gestion du saut
    if (tvIsJumping) {
        const elapsed = currentTime - jumpStartTime;
        const progress = Math.min(elapsed / jumpDuration, 1);
        const height = 100 * Math.sin(progress * Math.PI);
        tvDino.y = 375 - height;

        if (progress >= 1) {
            tvDino.y = 375;
            tvIsJumping = false;
            tvDino.jumping = false;
        }
    }

    // Gestion des pièces
    spawnCoin();
    if (tvCoin) {
        tvCoin.x -= speed;
        if (tvCoin.x < -15) {
            tvCoin = null; // Supprime la pièce si elle sort de l'écran
        } else if (
            tvDino.x + tvDino.width > tvCoin.x &&
            tvDino.x < tvCoin.x + tvCoin.width &&
            tvDino.y + tvDino.height > tvCoin.y &&
            tvDino.y < tvCoin.y + tvCoin.height
        ) {
            tvCoins++;
            tvCoin = null; // Pièce collectée
        }
    }

    // Rendu
    tvGameContext.clearRect(0, 0, 800, 400);
    tvGameContext.fillStyle = '#222';
    tvGameContext.fillRect(0, 0, 800, 400);

    // Dino
    tvGameContext.fillStyle = '#fff';
    tvGameContext.fillRect(tvDino.x, tvDino.y, tvDino.width, tvDino.height);

    // Cactus
    tvGameContext.fillStyle = '#0f0';
    tvGameContext.fillRect(tvCactusPosition, tvCactus.y, tvCactus.width, tvCactus.height);

    // Pièce
    if (tvCoin) {
        tvGameContext.fillStyle = '#ffd700'; // Or pour les pièces
        tvGameContext.beginPath();
        tvGameContext.arc(tvCoin.x + tvCoin.width / 2, tvCoin.y + tvCoin.height / 2, tvCoin.width / 2, 0, Math.PI * 2);
        tvGameContext.fill();
    }

    // Texte
    tvGameContext.fillStyle = '#fff';
    tvGameContext.font = '20px Arial';
    tvGameContext.fillText(`Score: ${tvScore} | Record: ${tvHighScore} | Pièces: ${tvCoins}`, 10, 30);

    // Collision avec cactus
    if (tvDino.x + tvDino.width > tvCactusPosition && tvDino.x < tvCactusPosition + tvCactus.width && tvDino.y + tvDino.height > tvCactus.y) {
        tvGameRunning = false;
        if (tvScore > tvHighScore) {
            tvHighScore = tvScore;
            localStorage.setItem('tvDinoHighScore', tvHighScore);
        }
        tvGameContext.fillText(`Perdu ! Score: ${tvScore} | Record: ${tvHighScore} | Pièces: ${tvCoins}`, 300, 200);
        setTimeout(stopTVGame, 2000);
    } else {
        requestAnimationFrame(animateTVGame);
    }

    tvMesh.material.map.needsUpdate = true;
}

// Gestion des événements
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loadedCount >= assetsToLoad.length) {
        if (isZoomedPC) toggleZoomPC();
        else if (isZoomedTV) {
            stopTVGame();
            toggleZoomTV();
        }
    } else if (e.key === 'ArrowRight' && loadedCount >= assetsToLoad.length && !tvGameRunning) {
        if (isZoomedPC) {
            currentPCIndex = (currentPCIndex + 1) % pcImages.length;
            updatePCImage();
            startPCSlideshow();
        } else {
            currentTVIndex = (currentTVIndex + 1) % projectImages.length;
            updateTVImage();
            startTVSlideshow();
        }
    } else if (e.key === 'ArrowLeft' && loadedCount >= assetsToLoad.length && !tvGameRunning) {
        if (isZoomedPC) {
            currentPCIndex = (currentPCIndex - 1 + pcImages.length) % pcImages.length;
            updatePCImage();
            startPCSlideshow();
        } else {
            currentTVIndex = (currentTVIndex - 1 + projectImages.length) % projectImages.length;
            updateTVImage();
            startTVSlideshow();
        }
    } else if (e.key === ' ' && tvGameRunning) tvJump();
});

// Chargement
const loader = new GLTFLoader();
let pcModel, screenMesh, tvMesh;

function loadNextAsset(index) {
    if (index >= assetsToLoad.length) {
        loadingText.textContent = 'Chargement terminé !';
        progressBar.style.width = '100%';
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
const projectImages = [
    '/assets/Projet1.png',
    '/assets/Projet2.png',
    '/assets/Projet3.png'
];
const projectLinks = {
    '/assets/Projet1.png': 'https://emotionsgarden.vercel.app/',
    '/assets/Projet2.png': 'https://github.com/Suiidh/TriApp',
    '/assets/Projet3.png': 'https://github.com/Suiidh/movie-scope'
};
const githubImage = '/assets/github.png';
const pcImages = ['/assets/CV_Diapo/1.png', '/assets/CV_Diapo/2.png', '/assets/CV_Diapo/3.png', '/assets/CV_Diapo/4.png', '/assets/CV_Diapo/5.png', '/assets/CV_Diapo/6.png', '/assets/CV_Diapo/7.png', '/assets/CV_Diapo/8.png', githubImage];
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
    tvMesh.position.set(-19.2, 6.5, -8.9);
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
    if (!tvMesh || tvGameRunning) return;
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
    }, 10000);
}

function startTVSlideshow() {
    clearInterval(tvSlideshowInterval);
    tvSlideshowInterval = setInterval(() => {
        currentTVIndex = (currentTVIndex + 1) % projectImages.length;
        updateTVImage();
    }, 10000);
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
const zoomedPositionTV = new THREE.Vector3(-11.62, 6.69, -8.96);
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

// Fonction pour vérifier si un objet est un enfant de ps5Model
function isChildOfPs5Model(obj) {
    let current = obj;
    while (current) {
        if (current === ps5Model) return true;
        current = current.parent;
    }
    return false;
}

// Bouton Info et Modale
const infoButton = document.createElement('button');
infoButton.id = 'infoButton';
infoButton.textContent = 'Info';
document.body.appendChild(infoButton);

const infoModal = document.createElement('div');
infoModal.id = 'infoModal';
const infoModalContent = document.createElement('div');
infoModalContent.id = 'infoModalContent';
infoModalContent.innerHTML = `
    <h2>Informations sur les modèles</h2>
    <div class="content-wrapper">
        <div class="section">
            <h3>Modèles créés par moi</h3>
            <ul>
                <li>TV (tv.glb)</li>
                <li>Meuble TV principal (tv_stand4.glb)</li>
                <li>Vitrine (tv_stand3.glb)</li>
                <li>Murs (wall2.glb, wall3.glb)</li>
                <li>Sol (floor.glb)</li>
                <li>Plafond (ceiling.glb)</li>
                <li>Porte (door.glb)</li>
                <li>Plafonnier (plafonnier.glb)</li>
                <li>Lampes (lampe.glb)</li>
                <li>Fenêtres (window.glb)</li>
                <li>Cadres (cadre.glb)</li>
            </ul>
        </div>
        <div class="section">
            <h3>Modèles non créés par moi</h3>
            <ul>
                <li>"Sony PS5 DualSense Controller" par <a href="https://sketchfab.com/JayakrishnanMarath" target="_blank">Jayakrishnan Marath</a>, sous licence Creative Commons Attribution.</li>
                <li>"Ps5" par <a href="https://sketchfab.com/Voshi" target="_blank">Voshi</a>, sous licence Creative Commons Attribution.</li>
                <li>Bureau gaming (gaming_desktop.glb)</li>
                <li>Canapé (sofa.glb)</li>
                <li>Plantes (plante1.glb, plante2.glb)</li>
                <li>Table (table.glb)</li>
                <li>Casque (casque.glb)</li>
                <li>Chaise (chair.glb)</li>
                <li>Figurines : Spider-Man (spider-man.glb), Venom (venom.glb), Batman (batman.glb), Iron Man (iron_man.glb)</li>
            </ul>
        </div>
    </div>
`;
const closeModalButton = document.createElement('button');
closeModalButton.id = 'closeModal';
closeModalButton.textContent = '×';
infoModalContent.appendChild(closeModalButton);
infoModal.appendChild(infoModalContent);
document.body.appendChild(infoModal);

// Gestion des événements pour le bouton et la modale
infoButton.addEventListener('click', () => {
    infoModal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
    infoModal.style.display = 'none';
});

// Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;

        if (ps5Model && isChildOfPs5Model(obj)) {
            if (!isZoomedTV) {
                toggleZoomTV();
                startTVGame();
            }
        } else if (obj === screenMesh) {
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
            if (!isZoomedTV) {
                toggleZoomTV();
            } else if (!tvGameRunning) {
                const currentImage = projectImages[currentTVIndex];
                const link = projectLinks[currentImage];
                if (link) {
                    window.open(link, "_blank");
                }
            }
        } else if (isZoomedTV) {
            stopTVGame();
            toggleZoomTV();
        }
    } else if (isZoomedPC) {
        toggleZoomPC();
    } else if (isZoomedTV) {
        stopTVGame();
        toggleZoomTV();
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