// ===================== CONFIGURACIÓN =====================
const TOTAL_LAPS = 3;
const NUM_AI = 9;
const TRACK_WIDTH = 18;
const CAR_LENGTH = 4.5;
const CAR_WIDTH = 2;

const CAR_COLORS = [
  { name: 'Rojo', value: 0xcc0000 },
  { name: 'Azul', value: 0x0044cc },
  { name: 'Verde', value: 0x00aa44 },
  { name: 'Amarillo', value: 0xddaa00 },
  { name: 'Naranja', value: 0xff6600 },
  { name: 'Blanco', value: 0xeeeeee },
  { name: 'Morado', value: 0x8800cc },
  { name: 'Rosa', value: 0xff44aa },
];

// ===================== VARIABLES GLOBALES =====================
let scene, camera, renderer;
let playerCar, aiCars = [];
let trackPoints = [];
let trackCurve;
let isPaused = false;
let isFinished = false;
let isCountingDown = false;
let raceStarted = false;
let raceTimer = 0;
let lastTime = 0;
let currentDt = 0;
let audioCtx = null;
let isMuted = false;
let engineOsc = null, engineGain = null;
let selectedColor = CAR_COLORS[0].value;

// Player state
let playerSpeed = 0;
let playerAngle = 0;
let playerLap = 1;
let playerProgress = 0;
let playerCheckpoints = 0;
let playerNitro = 100;
let playerDrift = 0;
let playerPrevT = 0;
let playerCrossedStart = false;

// AI state
let aiStates = [];

// Track checkpoints
const CHECKPOINT_COUNT = 20;

// ===================== INICIALIZACIÓN =====================
function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);
  scene.fog = new THREE.Fog(0x87CEEB, 200, 800);

  // Camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1500);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.insertBefore(renderer.domElement, document.body.firstChild);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(100, 150, 100);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.left = -200;
  dirLight.shadow.camera.right = 200;
  dirLight.shadow.camera.top = 200;
  dirLight.shadow.camera.bottom = -200;
  scene.add(dirLight);

  // Generate track
  generateTrack();

  // Generate ground
  generateGround();

  // Generate scenery
  generateScenery();

  // Create player car
  playerCar = createCar(selectedColor, true);
  scene.add(playerCar);

  // Create AI cars
  for (let i = 0; i < NUM_AI; i++) {
    const aiColor = CAR_COLORS[(i + 2) % CAR_COLORS.length].value;
    const aiCar = createCar(aiColor, false);
    scene.add(aiCar);
    aiCars.push(aiCar);
    aiStates.push({
      progress: 0,
      speed: 0,
      baseSpeed: 0.6 + Math.random() * 0.4,
      lap: 1,
      active: true,
      angle: 0,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random() * 1.5,
      wobbleAmount: 0.3 + Math.random() * 0.5,
    });
  }

  // Setup color picker
  setupColorPicker();

  // Setup audio
  setupAudio();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Start render loop
  requestAnimationFrame(gameLoop);
}

function setupColorPicker() {
  const picker = document.getElementById('colorPicker');
  CAR_COLORS.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'color-option' + (i === 0 ? ' selected' : '');
    div.style.background = '#' + c.value.toString(16).padStart(6, '0');
    div.title = c.name;
    div.onclick = () => {
      document.querySelectorAll('.color-option').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
      selectedColor = c.value;
    };
    picker.appendChild(div);
  });
}

// ===================== AUDIO =====================
function setupAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) {
    console.log('Web Audio not supported');
  }
}

function startEngineSound() {
  if (!audioCtx || isMuted) return;
  if (engineOsc) return;
  engineOsc = audioCtx.createOscillator();
  engineGain = audioCtx.createGain();
  engineOsc.type = 'sawtooth';
  engineOsc.frequency.value = 80;
  engineGain.gain.value = 0.08;
  engineOsc.connect(engineGain);
  engineGain.connect(audioCtx.destination);
  engineOsc.start();
}

function updateEngineSound() {
  if (!engineOsc || isMuted) return;
  const freq = 80 + Math.abs(playerSpeed) * 3;
  engineOsc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
  engineGain.gain.setTargetAtTime(Math.min(0.12, 0.03 + Math.abs(playerSpeed) * 0.002), audioCtx.currentTime, 0.1);
}

function playTone(freq, duration, vol = 0.1) {
  if (!audioCtx || isMuted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.value = vol;
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playCountdownBeep(high) {
  playTone(high ? 880 : 440, 0.3, 0.15);
}

function playGoBeep() {
  playTone(1200, 0.5, 0.2);
}

function playOvertakeSound() {
  playTone(600, 0.1, 0.1);
  setTimeout(() => playTone(900, 0.15, 0.1), 100);
}

function playFinishSound() {
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3, 0.15), i * 150);
  });
}

function playCrashSound() {
  if (!audioCtx || isMuted) return;
  const bufferSize = audioCtx.sampleRate * 0.2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  source.buffer = buffer;
  gain.gain.value = 0.15;
  source.connect(gain);
  gain.connect(audioCtx.destination);
  source.start();
}

// ===================== GENERACIÓN DE PISTA =====================
function generateTrack() {
  // Define track as a series of points forming a circuit
  const points = [];
  const cx = 0, cz = 0;

  // Create an interesting F1-style circuit
  const trackDefs = [
    { x: 0, z: 0 },
    { x: 80, z: -20 },
    { x: 160, z: -60 },
    { x: 220, z: -120 },
    { x: 240, z: -200 },
    { x: 200, z: -280 },
    { x: 120, z: -340 },
    { x: 20, z: -350 },
    { x: -50, z: -320 },
    { x: -100, z: -260 },
    { x: -130, z: -180 },
    { x: -140, z: -100 },
    { x: -120, z: -30 },
    { x: -80, z: 30 },
    { x: -100, z: 100 },
    { x: -160, z: 150 },
    { x: -220, z: 140 },
    { x: -260, z: 80 },
    { x: -250, z: 0 },
    { x: -200, z: -40 },
    { x: -140, z: -30 },
  ];

  for (const p of trackDefs) {
    points.push(new THREE.Vector3(p.x, 0, p.z));
  }

  trackPoints = points;
  trackCurve = new THREE.CatmullRomCurve3(points, true);

  // Generate track surface
  const segments = 500;
  const roadGeo = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t);
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    const left = point.clone().add(normal.clone().multiplyScalar(TRACK_WIDTH / 2));
    const right = point.clone().add(normal.clone().multiplyScalar(-TRACK_WIDTH / 2));

    vertices.push(left.x, 0.05, left.z);
    vertices.push(right.x, 0.05, right.z);

    uvs.push(0, t * 50);
    uvs.push(1, t * 50);

    if (i < segments) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2);
      indices.push(base + 1, base + 3, base + 2);
    }
  }

  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  roadGeo.setIndex(indices);
  roadGeo.computeVertexNormals();

  // Road texture
  const roadCanvas = document.createElement('canvas');
  roadCanvas.width = 256;
  roadCanvas.height = 256;
  const roadCtx = roadCanvas.getContext('2d');
  roadCtx.fillStyle = '#333333';
  roadCtx.fillRect(0, 0, 256, 256);

  // Asphalt texture
  for (let i = 0; i < 2000; i++) {
    roadCtx.fillStyle = `rgba(${40 + Math.random()*30}, ${40 + Math.random()*30}, ${40 + Math.random()*30}, 0.3)`;
    roadCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  // Center line dashes
  roadCtx.fillStyle = '#ffffff';
  for (let y = 0; y < 256; y += 20) {
    roadCtx.fillRect(126, y, 4, 10);
  }

  const roadTexture = new THREE.CanvasTexture(roadCanvas);
  roadTexture.wrapS = THREE.RepeatWrapping;
  roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(1, 50);

  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTexture,
    roughness: 0.8,
    metalness: 0.1,
  });

  const road = new THREE.Mesh(roadGeo, roadMat);
  road.receiveShadow = true;
  scene.add(road);

  // Generate curbs (bordillos)
  generateCurbs(segments);

  // Generate checkpoints
  generateCheckpoints();
}

function generateCurbs(segments) {
  const curbWidth = 2;
  const curbSegments = segments * 2;

  // Left curbs
  for (let side = -1; side <= 1; side += 2) {
    const curbGeo = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    for (let i = 0; i <= curbSegments; i++) {
      const t = i / curbSegments;
      const point = trackCurve.getPointAt(t);
      const tangent = trackCurve.getTangentAt(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const outerEdge = point.clone().add(normal.clone().multiplyScalar(side * (TRACK_WIDTH / 2 + curbWidth)));
      const innerEdge = point.clone().add(normal.clone().multiplyScalar(side * TRACK_WIDTH / 2));

      vertices.push(outerEdge.x, 0.06, outerEdge.z);
      vertices.push(innerEdge.x, 0.06, innerEdge.z);

      if (i < curbSegments) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    curbGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    curbGeo.setIndex(indices);
    curbGeo.computeVertexNormals();

    // Curb texture
    const curbCanvas = document.createElement('canvas');
    curbCanvas.width = 64;
    curbCanvas.height = 64;
    const cCtx = curbCanvas.getContext('2d');
    for (let y = 0; y < 64; y += 8) {
      cCtx.fillStyle = (y % 16 === 0) ? '#ff0000' : '#ffffff';
      cCtx.fillRect(0, y, 64, 8);
    }

    const curbTex = new THREE.CanvasTexture(curbCanvas);
    curbTex.wrapS = THREE.RepeatWrapping;
    curbTex.wrapT = THREE.RepeatWrapping;
    curbTex.repeat.set(1, curbSegments / 10);

    const curbMat = new THREE.MeshStandardMaterial({
      map: curbTex,
      roughness: 0.6,
    });

    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.receiveShadow = true;
    scene.add(curb);
  }
}

function generateCheckpoints() {
  for (let i = 0; i < CHECKPOINT_COUNT; i++) {
    const t = i / CHECKPOINT_COUNT;
    const point = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t);

    // Create checkpoint markers (invisible for detection, visible as posts)
    const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 });

    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.copy(point).add(normal.clone().multiplyScalar(TRACK_WIDTH / 2 + 1));
    leftPost.position.y = 1.5;
    scene.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, postMat);
    rightPost.position.copy(point).add(normal.clone().multiplyScalar(-TRACK_WIDTH / 2 - 1));
    rightPost.position.y = 1.5;
    scene.add(rightPost);
  }
}

function generateGround() {
  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(2000, 2000);
  const groundCanvas = document.createElement('canvas');
  groundCanvas.width = 512;
  groundCanvas.height = 512;
  const gCtx = groundCanvas.getContext('2d');
  gCtx.fillStyle = '#2d5a1e';
  gCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5000; i++) {
    gCtx.fillStyle = `rgba(${30 + Math.random()*40}, ${70 + Math.random()*50}, ${20 + Math.random()*30}, 0.5)`;
    gCtx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
  }
  const groundTex = new THREE.CanvasTexture(groundCanvas);
  groundTex.wrapS = THREE.RepeatWrapping;
  groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(40, 40);

  const groundMat = new THREE.MeshStandardMaterial({
    map: groundTex,
    roughness: 1,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);
}

function generateScenery() {
  // Trees around the track
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 300;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // Check if too close to track
    let tooClose = false;
    for (let t = 0; t < 1; t += 0.02) {
      const tp = trackCurve.getPointAt(t);
      const d = Math.sqrt((x - tp.x) ** 2 + (z - tp.z) ** 2);
      if (d < TRACK_WIDTH / 2 + 10) { tooClose = true; break; }
    }
    if (tooClose) continue;

    // Tree
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.8, 4, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 2, z);
    trunk.castShadow = true;
    scene.add(trunk);

    const leavesGeo = new THREE.SphereGeometry(3 + Math.random() * 2, 8, 6);
    const leavesMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.25 + Math.random() * 0.1, 0.6, 0.25 + Math.random() * 0.15)
    });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.set(x, 6 + Math.random() * 2, z);
    leaves.castShadow = true;
    scene.add(leaves);
  }

  // Grandstands near start/finish
  for (let side = -1; side <= 1; side += 2) {
    const standGeo = new THREE.BoxGeometry(30, 8, 4);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const stand = new THREE.Mesh(standGeo, standMat);

    const startPoint = trackCurve.getPointAt(0);
    const startTangent = trackCurve.getTangentAt(0);
    const normal = new THREE.Vector3(-startTangent.z, 0, startTangent.x).normalize();

    stand.position.copy(startPoint).add(normal.clone().multiplyScalar(side * (TRACK_WIDTH / 2 + 15)));
    stand.position.y = 4;
    stand.rotation.y = Math.atan2(startTangent.x, startTangent.z);
    stand.castShadow = true;
    scene.add(stand);

    // Seats
    for (let row = 0; row < 3; row++) {
      const seatGeo = new THREE.BoxGeometry(28, 0.5, 3);
      const seatColors = [0xff0000, 0x0000ff, 0xffff00];
      const seatMat = new THREE.MeshStandardMaterial({ color: seatColors[row] });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.copy(stand.position);
      seat.position.y = 2 + row * 2.5;
      seat.position.z += side * -2;
      scene.add(seat);
    }
  }

  // Start/Finish line
  const sfPoint = trackCurve.getPointAt(0);
  const sfTangent = trackCurve.getTangentAt(0);
  const sfNormal = new THREE.Vector3(-sfTangent.z, 0, sfTangent.x).normalize();

  const sfGeo = new THREE.PlaneGeometry(TRACK_WIDTH, 3);
  const sfCanvas = document.createElement('canvas');
  sfCanvas.width = 128;
  sfCanvas.height = 32;
  const sfCtx = sfCanvas.getContext('2d');
  for (let x = 0; x < 128; x += 16) {
    for (let y = 0; y < 32; y += 16) {
      sfCtx.fillStyle = ((x / 16 + y / 16) % 2 === 0) ? '#fff' : '#000';
      sfCtx.fillRect(x, y, 16, 16);
    }
  }
  const sfTex = new THREE.CanvasTexture(sfCanvas);
  const sfMat = new THREE.MeshStandardMaterial({ map: sfTex });
  const sf = new THREE.Mesh(sfGeo, sfMat);
  sf.rotation.x = -Math.PI / 2;
  sf.position.copy(sfPoint);
  sf.position.y = 0.07;
  sf.rotation.z = Math.atan2(sfTangent.x, sfTangent.z) + Math.PI / 2;
  scene.add(sf);

  // Start lights tower
  const towerGeo = new THREE.CylinderGeometry(0.3, 0.3, 12, 8);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.copy(sfPoint).add(sfNormal.clone().multiplyScalar(TRACK_WIDTH / 2 + 3));
  tower.position.y = 6;
  scene.add(tower);

  // Light bar
  const lightBarGeo = new THREE.BoxGeometry(4, 0.5, 1);
  const lightBarMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const lightBar = new THREE.Mesh(lightBarGeo, lightBarMat);
  lightBar.position.copy(sfPoint).add(sfNormal.clone().multiplyScalar(TRACK_WIDTH / 2 + 3));
  lightBar.position.y = 12;
  scene.add(lightBar);

  // Individual lights
  for (let i = 0; i < 5; i++) {
    const lightGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0x333333,
      emissiveIntensity: 0
    });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.set(
      sfPoint.x + sfNormal.x * (TRACK_WIDTH / 2 + 3) + (i - 2) * 0.8,
      12,
      sfPoint.z + sfNormal.z * (TRACK_WIDTH / 2 + 3)
    );
    light.userData.isStartLight = true;
    light.userData.lightIndex = i;
    scene.add(light);
  }
}

// ===================== CREACIÓN DE AUTOS =====================
function createCar(color, isPlayer) {
  const carGroup = new THREE.Group();

  // Body
  const bodyGeo = new THREE.BoxGeometry(1.8, 0.6, 4);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.7,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.5;
  body.castShadow = true;
  carGroup.add(body);

  // Nose
  const noseGeo = new THREE.BoxGeometry(1.2, 0.4, 1.5);
  const nose = new THREE.Mesh(noseGeo, bodyMat);
  nose.position.set(0, 0.4, -2.5);
  nose.castShadow = true;
  carGroup.add(nose);

  // Cockpit
  const cockpitGeo = new THREE.BoxGeometry(1, 0.5, 1.2);
  const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
  const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
  cockpit.position.set(0, 0.9, -0.3);
  carGroup.add(cockpit);

  // Front wing
  const fwGeo = new THREE.BoxGeometry(3, 0.15, 0.8);
  const fwMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.5 });
  const fw = new THREE.Mesh(fwGeo, fwMat);
  fw.position.set(0, 0.2, -3.2);
  fw.castShadow = true;
  carGroup.add(fw);

  // Rear wing
  const rwGeo = new THREE.BoxGeometry(2.5, 0.15, 0.6);
  const rw = new THREE.Mesh(rwGeo, fwMat);
  rw.position.set(0, 1.2, 2);
  rw.castShadow = true;
  carGroup.add(rw);

  // Rear wing supports
  for (let x = -1; x <= 1; x += 2) {
    const supportGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    const support = new THREE.Mesh(supportGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    support.position.set(x * 0.8, 0.8, 2);
    carGroup.add(support);
  }

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

  const wheelPositions = [
    { x: -1.1, y: 0.4, z: -1.8 },
    { x: 1.1, y: 0.4, z: -1.8 },
    { x: -1.1, y: 0.4, z: 1.5 },
    { x: 1.1, y: 0.4, z: 1.5 },
  ];

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, pos.y, pos.z);
    wheel.castShadow = true;
    carGroup.add(wheel);

    // Wheel rim
    const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.42, 8);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(pos.x, pos.y, pos.z);
    carGroup.add(rim);
  });

  // Headlights
  for (let x = -0.6; x <= 0.6; x += 1.2) {
    const hlGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc, emissiveIntensity: 0.5 });
    const hl = new THREE.Mesh(hlGeo, hlMat);
    hl.position.set(x, 0.5, -3.1);
    carGroup.add(hl);
  }

  // Taillights
  for (let x = -0.6; x <= 0.6; x += 1.2) {
    const tlGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const tlMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.3 });
    const tl = new THREE.Mesh(tlGeo, tlMat);
    tl.position.set(x, 0.5, 2.2);
    carGroup.add(tl);
  }

  // Number plate
  if (isPlayer) {
    const plateGeo = new THREE.PlaneGeometry(0.8, 0.5);
    const plateCanvas = document.createElement('canvas');
    plateCanvas.width = 128;
    plateCanvas.height = 80;
    const pCtx = plateCanvas.getContext('2d');
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, 128, 80);
    pCtx.fillStyle = '#000000';
    pCtx.font = 'bold 50px Arial';
    pCtx.textAlign = 'center';
    pCtx.fillText('1', 64, 60);
    const plateTex = new THREE.CanvasTexture(plateCanvas);
    const plateMat = new THREE.MeshStandardMaterial({ map: plateTex });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, 0.9, -0.3);
    plate.rotation.x = -Math.PI / 2;
    carGroup.add(plate);
  }

  return carGroup;
}

// ===================== LÓGICA DEL JUEGO =====================
const keys = {};

function onKeyDown(e) {
  keys[e.key.toLowerCase()] = true;
  keys[e.code] = true;

  if (e.key.toLowerCase() === 'p' && !isFinished && isCountingDown === false) {
    isPaused = !isPaused;
    document.getElementById('pauseOverlay').style.display = isPaused ? 'flex' : 'none';
  }

  if (e.key.toLowerCase() === 'm') {
    isMuted = !isMuted;
    if (isMuted && engineOsc) {
      engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    } else if (!isMuted && engineOsc) {
      updateEngineSound();
    }
  }
}

function onKeyUp(e) {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function getTrackPosition(x, z) {
  let minDist = Infinity;
  let bestT = 0;

  for (let t = 0; t <= 1; t += 0.001) {
    const point = trackCurve.getPointAt(t);
    const dx = x - point.x;
    const dz = z - point.z;
    const dist = dx * dx + dz * dz;
    if (dist < minDist) {
      minDist = dist;
      bestT = t;
    }
  }

  return { t: bestT, dist: Math.sqrt(minDist) };
}

function isOnTrack(x, z) {
  const info = getTrackPosition(x, z);
  return info.dist < TRACK_WIDTH / 2;
}

function updatePlayer(dt) {
  if (isPaused || isFinished || !raceStarted) return;

  const accel = keys['arrowup'] || keys['w'];
  const brake = keys['arrowdown'] || keys['s'];
  const left = keys['arrowleft'] || keys['a'];
  const right = keys['arrowright'] || keys['d'];
  const handbrake = keys['Space'] || keys['SHIFT'];

  // Acceleration
  if (accel) {
    playerSpeed += (12 + (playerNitro > 0 && keys['z'] ? 8 : 0)) * dt;
  } else {
    playerSpeed -= 5 * dt;
  }

  // Braking
  if (brake) {
    playerSpeed -= 18 * dt;
  }

  // Handbrake
  if (handbrake) {
    playerSpeed -= 10 * dt;
    playerDrift = Math.min(playerDrift + dt * 3, 1);
  } else {
    playerDrift = Math.max(playerDrift - dt * 5, 0);
  }

  // Nitro recharge
  if (!accel) {
    playerNitro = Math.min(100, playerNitro + 10 * dt);
  } else {
    playerNitro = Math.max(0, playerNitro - 15 * dt);
  }

  // Speed limits
  playerSpeed = Math.max(-5, Math.min(35, playerSpeed));

  // Off-track penalty
  const pos = getTrackPosition(playerCar.position.x, playerCar.position.z);
  if (pos.dist > TRACK_WIDTH / 2) {
    playerSpeed *= 0.97;
  }

  // Steering
  const steerAmount = 2.5 * (1 - Math.abs(playerSpeed) / 60) + playerDrift * 1.5;
  if (left) playerAngle += steerAmount * dt;
  if (right) playerAngle -= steerAmount * dt;

  // Update position
  playerCar.position.x += Math.sin(playerAngle) * playerSpeed * dt;
  playerCar.position.z += Math.cos(playerAngle) * playerSpeed * dt;

  // Update car rotation
  playerCar.rotation.y = playerAngle;

  // Tilt car based on steering
  playerCar.rotation.z = (left ? 0.05 : 0) + (right ? -0.05 : 0);

  // Check checkpoints and laps
  const currentT = pos.t;
  const prevCheckpoints = playerCheckpoints;

  // Determine which checkpoint sector we're in
  const sector = Math.floor(currentT * CHECKPOINT_COUNT) % CHECKPOINT_COUNT;

  // Lap detection: only count when crossing start line from behind
  // Player must have passed >70% of checkpoints this lap AND cross from t>0.05 to t<0.05
  if (playerPrevT > 0.05 && currentT < 0.05 && playerCheckpoints > CHECKPOINT_COUNT * 0.7) {
    playerLap++;
    playerCheckpoints = 0;
    if (playerLap > TOTAL_LAPS) {
      finishRace();
      return;
    }
    playTone(660, 0.2, 0.1);
  }

  playerCheckpoints = Math.max(playerCheckpoints, sector);

  // Update progress for position calculation
  playerProgress = (playerLap - 1) + currentT;

  playerPrevT = currentT;

  // Update nitro UI
  document.getElementById('nitroFill').style.width = playerNitro + '%';

  // Update speed display
  const speedKmh = Math.abs(Math.round(playerSpeed * 10));
  document.getElementById('speedValue').textContent = speedKmh;

  // Gear
  let gear = 'N';
  if (playerSpeed > 0.5) gear = Math.min(8, Math.ceil(speedKmh / 50));
  else if (playerSpeed < -0.5) gear = 'R';
  document.getElementById('gearDisplay').textContent = gear;

  // Lap display
  document.getElementById('lapCount').textContent = Math.min(playerLap, TOTAL_LAPS);

  // Engine sound
  updateEngineSound();
}

function updateAI(dt) {
  if (isPaused || isFinished) return;

  aiCars.forEach((aiCar, i) => {
    const state = aiStates[i];

    // Wobble for natural movement
    state.wobble += state.wobbleSpeed * dt;
    const wobbleOffset = Math.sin(state.wobble) * state.wobbleAmount;

    // Speed variation
    const speedVariation = Math.sin(state.wobble * 2) * 0.1;
    const targetSpeed = (state.baseSpeed + speedVariation) * 30;

    // Accelerate/decelerate towards target
    state.speed += (targetSpeed - state.speed) * dt * 2;

    // Get position on track
    state.progress += (state.speed * dt) / (trackCurve.getLength());

    if (state.progress >= 1) {
      state.progress -= 1;
      state.lap++;
      if (state.lap > TOTAL_LAPS) {
        state.active = false;
      }
    }

    // Get track point
    const point = trackCurve.getPointAt(state.progress);
    const tangent = trackCurve.getTangentAt(state.progress);

    // Apply wobble offset
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const wobblePos = point.clone().add(normal.clone().multiplyScalar(wobbleOffset));

    aiCar.position.x = wobblePos.x;
    aiCar.position.z = wobblePos.z;
    aiCar.position.y = 0;

    // Face direction of track
    aiCar.rotation.y = Math.atan2(tangent.x, tangent.z);

    // AI progress for position
    state.totalProgress = (state.lap - 1) + state.progress;
  });
}

function updateCamera() {
  // Third-person chase camera
  const camDist = 12;
  const camHeight = 5;

  const targetX = playerCar.position.x - Math.sin(playerAngle) * camDist;
  const targetZ = playerCar.position.z - Math.cos(playerAngle) * camDist;

  camera.position.x += (targetX - camera.position.x) * 0.08;
  camera.position.z += (targetZ - camera.position.z) * 0.08;
  camera.position.y += (camHeight - camera.position.y) * 0.08;

  // Look ahead of the car
  const lookX = playerCar.position.x + Math.sin(playerAngle) * 15;
  const lookZ = playerCar.position.z + Math.cos(playerAngle) * 15;

  camera.lookAt(lookX, 1, lookZ);
}

function updatePosition() {
  const allPositions = [];

  // Player
  allPositions.push({
    progress: playerProgress,
    isPlayer: true,
    name: 'TÚ'
  });

  // AI
  aiStates.forEach((state, i) => {
    if (state.active) {
      allPositions.push({
        progress: state.totalProgress,
        isPlayer: false,
        name: 'AI ' + (i + 1)
      });
    }
  });

  allPositions.sort((a, b) => b.progress - a.progress);

  let playerPos = 1;
  allPositions.forEach((p, i) => {
    if (p.isPlayer) {
      playerPos = i + 1;
    }
  });

  document.getElementById('posValue').textContent = playerPos;

  // Check for overtakes
  const prevPos = window._lastPlayerPos || 1;
  if (playerPos < prevPos) {
    showOvertake();
    playOvertakeSound();
  }
  window._lastPlayerPos = playerPos;
}

function showOvertake() {
  const el = document.getElementById('overtake');
  el.style.display = 'block';
  el.style.animation = 'none';
  el.offsetHeight; // trigger reflow
  el.style.animation = 'pulse 0.8s ease-out';
  setTimeout(() => { el.style.display = 'none'; }, 800);
}

function updateTimer() {
  if (!raceStarted || isPaused || isFinished) return;
  raceTimer += currentDt;

  const minutes = Math.floor(raceTimer / 60);
  const seconds = raceTimer % 60;
  const ms = Math.floor((raceTimer % 1) * 1000);

  document.getElementById('timer').textContent =
    String(minutes).padStart(2, '0') + ':' +
    String(Math.floor(seconds)).padStart(2, '0') + '.' +
    String(ms).padStart(3, '0');
}

function drawMinimap() {
  const canvas = document.getElementById('minimapCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 180, 180);

  // Find track bounds
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let t = 0; t < 1; t += 0.01) {
    const p = trackCurve.getPointAt(t);
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z);
    maxZ = Math.max(maxZ, p.z);
  }

  const padding = 20;
  const scaleX = (180 - padding * 2) / (maxX - minX);
  const scaleZ = (180 - padding * 2) / (maxZ - minZ);
  const scale = Math.min(scaleX, scaleZ);

  const offsetX = (180 - (maxX - minX) * scale) / 2;
  const offsetZ = (180 - (maxZ - minZ) * scale) / 2;

  function toMap(x, z) {
    return {
      x: (x - minX) * scale + offsetX,
      y: (z - minZ) * scale + offsetZ
    };
  }

  // Draw track
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let t = 0; t <= 1; t += 0.005) {
    const p = trackCurve.getPointAt(t);
    const m = toMap(p.x, p.z);
    if (t === 0) ctx.moveTo(m.x, m.y);
    else ctx.lineTo(m.x, m.y);
  }
  ctx.closePath();
  ctx.stroke();

  // Draw AI cars
  aiStates.forEach((state, i) => {
    if (!state.active) return;
    const point = trackCurve.getPointAt(state.progress);
    const m = toMap(point.x, point.z);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw player
  const pm = toMap(playerCar.position.x, playerCar.position.z);
  ctx.fillStyle = '#00ff00';
  ctx.beginPath();
  ctx.arc(pm.x, pm.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function finishRace() {
  isFinished = true;
  playFinishSound();

  const minutes = Math.floor(raceTimer / 60);
  const seconds = raceTimer % 60;
  const ms = Math.floor((raceTimer % 1) * 1000);
  const timeStr =
    String(minutes).padStart(2, '0') + ':' +
    String(Math.floor(seconds)).padStart(2, '0') + '.' +
    String(ms).padStart(3, '0');

  document.getElementById('finalPos').textContent = window._lastPlayerPos || 1;
  document.getElementById('finalTime').textContent = timeStr;
  document.getElementById('finalLaps').textContent = Math.min(playerLap, TOTAL_LAPS);
  document.getElementById('finishScreen').style.display = 'flex';
}

// ===================== SEMÁFORO =====================
function startCountdown() {
  isCountingDown = true;
  const countdownEl = document.getElementById('countdown');
  countdownEl.style.display = 'block';

  // Light up start lights
  const lights = scene.children.filter(c => c.userData.isStartLight);
  lights.forEach(l => {
    l.material.emissive.setHex(0xff0000);
    l.material.emissiveIntensity = 1;
  });

  let step = 0;
  const steps = [
    { text: '', delay: 500 },
    { text: '3', delay: 1000 },
    { text: '2', delay: 1000 },
    { text: '1', delay: 1000 },
    { text: '¡GO!', delay: 500 },
  ];

  function nextStep() {
    if (step >= steps.length) {
      countdownEl.style.display = 'none';
      isCountingDown = false;
      raceStarted = true;
      playGoBeep();

      // Turn off red lights
      lights.forEach(l => {
        l.material.emissive.setHex(0x00ff00);
        l.material.emissiveIntensity = 1;
      });
      return;
    }

    countdownEl.textContent = steps[step].text;
    if (step > 0 && step < steps.length - 1) {
      playCountdownBeep(false);
    } else if (step === steps.length - 1) {
      playGoBeep();
    }

    step++;
    setTimeout(nextStep, steps[step - 1].delay);
  }

  setTimeout(nextStep, 500);
}

// ===================== GAME LOOP =====================
function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);

  if (!lastTime) {
    lastTime = timestamp;
    currentDt = 0;
  } else {
    currentDt = Math.min((timestamp - lastTime) / 1000, 0.05);
  }
  lastTime = timestamp;

  updatePlayer(currentDt);
  updateAI(currentDt);
  updateCamera();
  updateTimer();
  updatePosition();
  drawMinimap();

  renderer.render(scene, camera);
}

// ===================== INICIO =====================
function startGame() {
  document.getElementById('startScreen').style.display = 'none';

  if (!scene) {
    init();
  }

  // Reset player
  const startPoint = trackCurve.getPointAt(0);
  const startTangent = trackCurve.getTangentAt(0);
  playerCar.position.copy(startPoint);
  playerCar.position.x -= startTangent.x * 2;
  playerCar.position.z -= startTangent.z * 2;
  playerAngle = Math.atan2(startTangent.x, startTangent.z);
  playerCar.rotation.y = playerAngle;
  playerSpeed = 0;
  playerLap = 1;
  playerProgress = 0;
  playerCheckpoints = 0;
  playerNitro = 100;
  playerDrift = 0;
  playerPrevT = 0;
  playerCrossedStart = false;

  // Reset AI
  aiStates.forEach((state, i) => {
    const t = 0.02 + i * 0.015;
    state.progress = t;
    state.speed = 0;
    state.lap = 1;
    state.active = true;
    state.baseSpeed = 0.55 + Math.random() * 0.45;
    state.wobble = Math.random() * Math.PI * 2;
    const point = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t);
    aiCars[i].position.copy(point);
    aiCars[i].rotation.y = Math.atan2(tangent.x, tangent.z);
  });

  isFinished = false;
  isPaused = false;
  raceStarted = false;
  raceTimer = 0;
  isCountingDown = false;
  window._lastPlayerPos = 1;

  document.getElementById('finishScreen').style.display = 'none';
  document.getElementById('pauseOverlay').style.display = 'none';
  document.getElementById('lapCount').textContent = '1';

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  startEngineSound();
  startCountdown();
}

function restartGame() {
  document.getElementById('finishScreen').style.display = 'none';

  // Reset everything
  playerSpeed = 0;
  playerAngle = 0;
  playerLap = 1;
  playerProgress = 0;
  playerCheckpoints = 0;
  playerNitro = 100;
  playerDrift = 0;
  playerPrevT = 0;
  playerCrossedStart = false;

  aiStates.forEach((state, i) => {
    state.progress = 0.02 + i * 0.015;
    state.speed = 0;
    state.lap = 1;
    state.active = true;
  });

  isFinished = false;
  isPaused = false;
  raceStarted = false;
  raceTimer = 0;
  isCountingDown = false;
  window._lastPlayerPos = 1;

  const startPoint = trackCurve.getPointAt(0);
  const startTangent = trackCurve.getTangentAt(0);
  playerCar.position.copy(startPoint);
  playerCar.position.x -= startTangent.x * 2;
  playerCar.position.z -= startTangent.z * 2;
  playerAngle = Math.atan2(startTangent.x, startTangent.z);
  playerCar.rotation.y = playerAngle;

  aiStates.forEach((state, i) => {
    const point = trackCurve.getPointAt(state.progress);
    aiCars[i].position.copy(point);
  });

  document.getElementById('timer').textContent = '00:00.000';
  document.getElementById('speedValue').textContent = '0';
  document.getElementById('gearDisplay').textContent = 'N';
  document.getElementById('lapCount').textContent = '1';
  document.getElementById('posValue').textContent = '1';

  startEngineSound();
  startCountdown();
}

// Prevent scrolling
document.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
    e.preventDefault();
  }
});
