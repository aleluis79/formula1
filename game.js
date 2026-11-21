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
  { name: 'Cian', value: 0x00bcd4 },
  { name: 'Verde lima', value: 0x9acd32 },
  { name: 'Gris', value: 0x777777 },
  { name: 'Marrón', value: 0x8b5a2b },
];

const AI_NAMES = ['Vega', 'Ortega', 'Silva', 'Moretti', 'Nakamura', 'Ríos', 'Kovac', 'Ferrer', 'Dubois'];

// Puntos de cada posición al final de la carrera
const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// ===================== CIRCUITOS =====================
const CIRCUITS = [
  {
    name: 'Circuito Nacional',
    sky: 0x87ceeb,
    crossingZones: [
      { start: 0.575, end: 0.620 },
      { start: 0.910, end: 0.955 },
    ],
    points: [
      [0, 0], [80, -20], [160, -60], [220, -120], [240, -200], [200, -280],
      [120, -340], [20, -350], [-50, -320], [-100, -260], [-130, -180],
      [-140, -100], [-120, -30], [-80, 30], [-100, 100], [-160, 150],
      [-220, 140], [-260, 80], [-250, 0], [-200, -40], [-140, -30],
    ],
  },
  {
    name: 'Circuito del Valle',
    sky: 0x9fd8ef,
    points: [
      [307.7, 0.0], [313.5, 94.2], [258.9, 179.4], [159.4, 228.0],
      [49.5, 231.7], [-43.8, 205.2], [-118.1, 168.9], [-187.0, 129.6],
      [-255.9, 76.9], [-307.7, 0.0], [-313.5, -94.2], [-258.9, -179.4],
      [-159.4, -228.0], [-49.5, -231.7], [43.8, -205.2], [118.1, -168.9],
      [187.0, -129.6], [255.9, -76.9],
    ],
  },
  {
    name: 'Circuito Serpiente',
    sky: 0x9ed3c4,
    points: [
      [256.0, 0.0], [252.6, 106.4], [177.2, 172.1], [90.5, 181.5],
      [29.2, 191.8], [-35.7, 234.6], [-128.0, 256.7], [-205.9, 200.0],
      [-217.3, 91.6], [-181.0, 0.0], [-158.1, -66.6], [-157.6, -153.1],
      [-128.0, -256.7], [-46.7, -306.5], [40.2, -263.7], [90.5, -181.5],
      [128.9, -125.2], [193.3, -81.5],
    ],
  },
  {
    name: 'Circuito de Montaña',
    sky: 0xa9c2e8,
    points: [
      [267.9, 0.0], [193.2, 51.3], [130.5, 77.6], [104.0, 117.2],
      [73.3, 184.6], [0.0, 239.1], [-91.7, 231.0], [-145.3, 163.6],
      [-149.0, 88.5], [-151.9, 40.4], [-194.1, 0.0], [-246.2, -65.5],
      [-243.2, -144.6], [-167.5, -188.6], [-69.5, -174.9], [0.0, -138.9],
      [51.0, -128.5], [126.3, -142.2], [224.8, -133.6], [287.4, -76.4],
    ],
  },
  {
    name: 'Autódromo Rápido',
    sky: 0xb7d9f2,
    points: [
      [390.3, 0.0], [365.1, 107.1], [268.3, 190.1], [134.8, 230.6],
      [0.0, 233.5], [-124.3, 212.6], [-240.8, 170.6], [-339.7, 99.7],
      [-390.3, 0.0], [-365.1, -107.1], [-268.3, -190.1], [-134.8, -230.6],
      [0.0, -233.5], [124.3, -212.6], [240.8, -170.6], [339.7, -99.7],
    ],
  },
];

// ===================== VARIABLES GLOBALES =====================
let scene, camera, renderer;
let worldGroup;
let playerCar, aiCars = [];
let trackPoints = [];
let trackCurve;
let trackCurvature = [];
let currentCircuitIndex = 0;

// Championship
let drivers = [];
let driverById = {};
let raceFinishOrder = [];
let raceResults = [];
let championshipHistory = [];
let playerGridSlot = NUM_AI;

let isPaused = false;
let isFinished = false;
let isCountingDown = false;
let raceStarted = false;
let raceTimer = 0;
let lastTime = 0;
let currentDt = 0;
let audioCtx = null;
let isMuted = false;
let engineOsc = null, engineGain = null, engineFilter = null;
let skidSource = null, skidFilter = null, skidGain = null;
let skidIntensity = 0;
let skidMarkGroup, skidMarkPool = [], skidMarkIndex = 0;
let flagArmGroup = null, flagPivot = null, flagPersonGroup = null;
let mirrorCamera;
let selectedColor = CAR_COLORS[0].value;
let cameraSpeedFactor = 0;

// Gamepad state
let gamepadInput = { connected: false, throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
let gamepadPrev = { pause: false, mute: false };
let gamepadNoticeTimer = null;

// Player state
let playerSpeed = 0;
let playerAngle = 0;
let playerLap = 1;
let playerProgress = 0;
let playerCheckpoints = 0;
let playerNitro = 100;
let playerDrift = 0;
let playerSlip = 0;
let playerLateral = 0;
let playerPrevT = 0;
let playerCrossedStart = false;
let playerFinishing = false;
let pendingPlayerFinish = null;

// Handling
const MAX_SPEED = 52;
const SPEED_DISPLAY_FACTOR = 350 / MAX_SPEED; // HUD never goes above 350 km/h
const GRIP_LATERAL = 36; // maximum lateral acceleration (m/s²) the car can sustain
const PLAYER_ACCEL = 16; // player acceleration (m/s²)
const AI_ACCEL = 16;     // rivals accelerate at the same rate at the start
const AI_BRAKE = 26;     // rivals' braking deceleration (m/s²)
const LAUNCH_ASSIST = 15;      // automatic acceleration at the start (m/s²)
const LAUNCH_ASSIST_TIME = 1.2;  // seconds of launch assist

// Zones where the track crosses itself: there the two road surfaces overlap,
// so the car is kept inside its own branch to avoid taking the wrong route
let crossingZones = [];

function isInCrossingZone(t) {
  return crossingZones.some(z => t > z.start && t < z.end);
}

// AI state
let aiStates = [];

// Track checkpoints
const CHECKPOINT_COUNT = 20;

// Car-to-car collisions
const CAR_COLLISION_DIST = 2.4;
let crashSoundCooldown = 0;

// ===================== INICIALIZACIÓN =====================
function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CIRCUITS[0].sky);
  scene.fog = new THREE.Fog(CIRCUITS[0].sky, 200, 800);

  // Camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1500);

  // Rear-view mirror camera
  mirrorCamera = new THREE.PerspectiveCamera(55, 3.6, 0.1, 1500);

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

  // All track/scenery objects go in this group so a circuit can be rebuilt
  worldGroup = new THREE.Group();
  scene.add(worldGroup);

  initSkidMarks();

  // Cars and championship drivers
  createDriversAndCars();

  // Setup audio
  setupAudio();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Build the first circuit and place the cars on its grid
  buildCircuit(CIRCUITS[0]);
  placeCarsOnGrid();

  // Start render loop
  requestAnimationFrame(gameLoop);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDriversAndCars() {
  drivers = [];
  driverById = {};
  aiCars = [];
  aiStates = [];

  // Stable pace and grip for each rival during the whole championship
  const baseSpeeds = [];
  const grips = [];
  for (let i = 0; i < NUM_AI; i++) {
    const f = NUM_AI > 1 ? i / (NUM_AI - 1) : 0;
    baseSpeeds.push(0.80 + f * 0.16);
    grips.push(24 + f * 8);
  }
  shuffleArray(baseSpeeds);
  shuffleArray(grips);

  const playerDriver = {
    id: 'player',
    name: 'TÚ',
    isPlayer: true,
    color: selectedColor,
    points: 0,
    bestFinish: 99,
    seed: Math.random(),
  };
  drivers.push(playerDriver);
  driverById[playerDriver.id] = playerDriver;

  playerCar = createCar(selectedColor, true);
  scene.add(playerCar);

  for (let i = 0; i < NUM_AI; i++) {
    const aiColor = CAR_COLORS[(i + 2) % CAR_COLORS.length].value;
    const aiCar = createCar(aiColor, false);
    scene.add(aiCar);
    aiCars.push(aiCar);

    const driver = {
      id: 'ai' + i,
      name: AI_NAMES[i],
      isPlayer: false,
      color: aiColor,
      points: 0,
      bestFinish: 99,
      seed: Math.random(),
      aiIndex: i,
    };
    drivers.push(driver);
    driverById[driver.id] = driver;

    aiStates.push({
      driverId: driver.id,
      progress: 0,
      speed: 0,
      baseSpeed: baseSpeeds[i] + (Math.random() - 0.5) * 0.01,
      grip: grips[i],
      lap: 1,
      active: true,
      crossedStart: false,
      braking: false,
      finished: false,
      parkOffset: 0,
      angle: 0,
      lateral: 0,
      lineOffset: [-4.2, -2.1, 0, 2.1, 4.2][i % 5] + (Math.random() - 0.5) * 1.2,
      overtakeSide: 0,
      overtakeTimer: 0,
      overtakeCooldown: 0,
      totalProgress: 0,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random() * 1.5,
      wobbleAmount: 0.3 + Math.random() * 0.5,
    });
  }
}

function disposeObject(obj) {
  obj.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(m => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
}

function clearWorld() {
  flagArmGroup = null;
  flagPivot = null;
  flagPersonGroup = null;

  while (worldGroup.children.length > 0) {
    const child = worldGroup.children[0];
    worldGroup.remove(child);
    disposeObject(child);
  }
}

// ===================== MARCAS DE DERRAPE =====================
function initSkidMarks() {
  skidMarkGroup = new THREE.Group();
  scene.add(skidMarkGroup);

  const geo = new THREE.PlaneGeometry(0.32, 1.1);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });

  for (let i = 0; i < 500; i++) {
    const mark = new THREE.Mesh(geo, mat);
    mark.rotation.order = 'YXZ';
    mark.visible = false;
    mark.renderOrder = 2;
    skidMarkGroup.add(mark);
    skidMarkPool.push(mark);
  }
}

function clearSkidMarks() {
  skidMarkPool.forEach(mark => { mark.visible = false; });
  skidMarkIndex = 0;
}

function addSkidMark(x, z, angle) {
  if (skidMarkPool.length === 0) return;
  const mark = skidMarkPool[skidMarkIndex];
  skidMarkIndex = (skidMarkIndex + 1) % skidMarkPool.length;
  mark.position.set(x, 0.068, z);
  mark.rotation.set(-Math.PI / 2, angle, 0);
  mark.visible = true;
}

function buildCircuit(circuit) {
  clearWorld();
  crossingZones = circuit.crossingZones || [];
  scene.background = new THREE.Color(circuit.sky);
  scene.fog = new THREE.Fog(circuit.sky, 200, 800);

  generateTrack(circuit.points);
  generateGround();
  generateScenery();
  generateClouds();
  generateCornerSigns();
}

function setupColorPicker() {
  const picker = document.getElementById('colorPicker');
  if (!picker || picker.children.length > 0) return;

  CAR_COLORS.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'color-option' + (i === 0 ? ' selected' : '');
    div.style.background = '#' + c.value.toString(16).padStart(6, '0');
    div.title = c.name;
    div.onclick = () => {
      document.querySelectorAll('.color-option').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
      selectedColor = c.value;
      if (playerCar) {
        (playerCar.userData.paintMaterials || []).forEach(m => m.color.setHex(c.value));
        const driver = driverById['player'];
        if (driver) driver.color = c.value;
      }
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
  engineOsc.type = 'sawtooth';
  engineOsc.frequency.value = 60;

  // Low-pass filter to remove the harsh high harmonics of the sawtooth
  engineFilter = audioCtx.createBiquadFilter();
  engineFilter.type = 'lowpass';
  engineFilter.frequency.value = 420;
  engineFilter.Q.value = 0.7;

  engineGain = audioCtx.createGain();
  engineGain.gain.value = 0;

  engineOsc.connect(engineFilter);
  engineFilter.connect(engineGain);
  engineGain.connect(audioCtx.destination);
  engineOsc.start();

  // Fade in to avoid a click
  engineGain.gain.setTargetAtTime(0.04, audioCtx.currentTime, 0.2);
}

function updateEngineSound() {
  if (!engineOsc || isMuted) return;
  const speed = Math.abs(playerSpeed);

  // Lower, warmer engine note; it no longer becomes shrill at top speed
  const freq = 55 + speed * 1.7;
  engineOsc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.08);

  // Open the filter only slightly with speed
  engineFilter.frequency.setTargetAtTime(400 + speed * 6, audioCtx.currentTime, 0.12);

  const volume = 0.028 + Math.min(speed / MAX_SPEED, 1) * 0.014;
  engineGain.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.15);
}

function stopEngineSound() {
  if (!engineOsc) return;

  const osc = engineOsc;
  const filter = engineFilter;
  const gain = engineGain;

  engineOsc = null;
  engineFilter = null;
  engineGain = null;

  if (!audioCtx) return;

  // Fade out quickly to avoid a click, then stop and disconnect the chain
  gain.gain.cancelScheduledValues(audioCtx.currentTime);
  gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.06);

  setTimeout(() => {
    try { osc.stop(); } catch (e) {}
    try { osc.disconnect(); } catch (e) {}
    try { filter.disconnect(); } catch (e) {}
    try { gain.disconnect(); } catch (e) {}
  }, 250);
}

// ===================== SONIDO DE DERRAPE =====================
function startSkidSound() {
  if (!audioCtx || skidSource) return;

  const bufferSize = audioCtx.sampleRate * 3;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  skidSource = audioCtx.createBufferSource();
  skidSource.buffer = buffer;
  skidSource.loop = true;

  skidFilter = audioCtx.createBiquadFilter();
  skidFilter.type = 'bandpass';
  skidFilter.frequency.value = 1300;
  skidFilter.Q.value = 1.1;

  skidGain = audioCtx.createGain();
  skidGain.gain.value = 0;

  skidSource.connect(skidFilter);
  skidFilter.connect(skidGain);
  skidGain.connect(audioCtx.destination);
  skidSource.start();
}

function updateSkidSound() {
  if (!skidSource || !audioCtx) return;
  const volume = isMuted ? 0 : skidIntensity * 0.055;
  skidGain.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.05);
  skidFilter.frequency.setTargetAtTime(1300 + skidIntensity * 600, audioCtx.currentTime, 0.05);
}

function stopSkidSound() {
  if (!skidSource) return;

  const src = skidSource;
  const filter = skidFilter;
  const gain = skidGain;

  skidSource = null;
  skidFilter = null;
  skidGain = null;

  if (!audioCtx) return;

  gain.gain.cancelScheduledValues(audioCtx.currentTime);
  gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);

  setTimeout(() => {
    try { src.stop(); } catch (e) {}
    try { src.disconnect(); } catch (e) {}
    try { filter.disconnect(); } catch (e) {}
    try { gain.disconnect(); } catch (e) {}
  }, 250);
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
function generateTrack(trackDefs) {
  // Define track as a series of points forming a circuit
  const points = trackDefs.map(p => new THREE.Vector3(p[0], 0, p[1]));

  trackPoints = points;
  trackCurve = new THREE.CatmullRomCurve3(points, true);

  // Precompute track curvature so the rivals can brake for corners
  const curvatureSamples = 400;
  const trackLength = trackCurve.getLength();
  trackCurvature = [];
  for (let i = 0; i < curvatureSamples; i++) {
    const t1 = (((i - 0.5) / curvatureSamples) % 1 + 1) % 1;
    const t2 = ((i + 0.5) / curvatureSamples) % 1;
    const a = trackCurve.getTangentAt(t1);
    const b = trackCurve.getTangentAt(t2);
    const dot = Math.max(-1, Math.min(1, a.x * b.x + a.z * b.z));
    const angle = Math.acos(dot);
    trackCurvature.push(angle / (trackLength / curvatureSamples));
  }

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

    uvs.push(0, t);
    uvs.push(1, t);

    if (i < segments) {
      const base = i * 2;
      indices.push(base, base + 2, base + 1);
      indices.push(base + 1, base + 2, base + 3);
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

  // Solid edge lines (both sides of the road)
  roadCtx.fillRect(4, 0, 5, 256);
  roadCtx.fillRect(247, 0, 5, 256);

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
  worldGroup.add(road);

  // Generate curbs (bordillos)
  generateCurbs(segments);

  // Generate checkpoints
  generateCheckpoints();

  // Painted starting grid boxes
  generateGridBoxes();
}

function generateGridBoxes() {
  const boxGeo = new THREE.PlaneGeometry(3.2, 5.8);
  const edges = new THREE.EdgesGeometry(boxGeo);
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

  // One box for every slot (the rivals plus the player's)
  for (let i = 0; i <= NUM_AI; i++) {
    const slot = getGridSlot(i);
    const box = new THREE.LineSegments(edges, mat);
    box.rotation.x = -Math.PI / 2;
    box.rotation.z = Math.atan2(slot.tangent.x, slot.tangent.z);
    box.position.copy(slot.position);
    box.position.y = 0.062;
    worldGroup.add(box);
  }
}

function generateCurbs(segments) {
  const curbWidth = 2;
  const curbSegments = segments * 2;

  // Left curbs
  for (let side = -1; side <= 1; side += 2) {
    const curbGeo = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
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

      uvs.push(0, t);
      uvs.push(1, t);

      if (i < curbSegments) {
        const base = i * 2;
        // Make every curb face upwards (the winding depends on the side)
        if (side > 0) {
          indices.push(base, base + 2, base + 1);
          indices.push(base + 1, base + 2, base + 3);
        } else {
          indices.push(base, base + 1, base + 2);
          indices.push(base + 1, base + 3, base + 2);
        }
      }
    }

    curbGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    curbGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
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
    worldGroup.add(curb);
  }
}

function generateCheckpoints() {
  const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 });

  for (let i = 0; i < CHECKPOINT_COUNT; i++) {
    const t = i / CHECKPOINT_COUNT;
    const point = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t);
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    for (let side = -1; side <= 1; side += 2) {
      const postPos = point.clone().add(normal.clone().multiplyScalar(side * (TRACK_WIDTH / 2 + 1)));

      // Skip posts that would land on another part of the track (e.g. at the crossing)
      if (getTrackPosition(postPos.x, postPos.z).dist < TRACK_WIDTH / 2 + 0.5) continue;

      const post = new THREE.Mesh(postGeo, postMat);
      post.position.copy(postPos);
      post.position.y = 1.5;
      worldGroup.add(post);
    }
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
  worldGroup.add(ground);
}

function generateScenery() {
  // Dense samples of the centreline so we never place a tree on the track
  const trackSamples = [];
  for (let i = 0; i < 900; i++) {
    trackSamples.push(trackCurve.getPointAt(i / 900));
  }

  // Shared tree geometries and materials
  const trunkGeo = new THREE.CylinderGeometry(0.45, 0.7, 1, 6);
  const sphereGeo = new THREE.SphereGeometry(1, 9, 7);
  const coneGeo = new THREE.ConeGeometry(1, 1, 8);

  const trunkMats = [
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 }),
  ];

  const leafMats = [
    new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x6a994e, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x7cb342, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0xc0ca33, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.9 }),
  ];

  const darkLeafMats = leafMats.slice(0, 4);
  const flowerMats = [
    new THREE.MeshStandardMaterial({ color: 0xfff3b0, roughness: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0xffe066, roughness: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0xff8fab, roughness: 0.8 }),
  ];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function makeTrunk(x, z, height) {
    const trunk = new THREE.Mesh(trunkGeo, pick(trunkMats));
    trunk.scale.set(1, height, 1);
    trunk.position.set(x, height / 2 - 0.1, z);
    trunk.castShadow = true;
    worldGroup.add(trunk);
  }

  function addFoliage(x, y, z, sx, sy, sz, mat, geo = sphereGeo) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.castShadow = true;
    worldGroup.add(mesh);
    return mesh;
  }

  // Trees around the track
  for (let i = 0; i < 300; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 300;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // Keep the trunk far enough away for the whole canopy to stay off the asphalt
    let minDistSq = Infinity;
    for (let s = 0; s < trackSamples.length; s++) {
      const tp = trackSamples[s];
      const dx = x - tp.x;
      const dz = z - tp.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < minDistSq) minDistSq = d2;
    }
    if (minDistSq < (TRACK_WIDTH / 2 + 11) ** 2) continue;

    const type = Math.random();

    if (type < 0.42) {
      // Round, leafy tree
      const leafMat = pick(leafMats);
      const trunkH = 3 + Math.random() * 2;
      makeTrunk(x, z, trunkH);
      const top = trunkH - 0.1;
      const r = 2.2 + Math.random() * 1.5;

      addFoliage(x, top + r * 0.55, z, r, r * 0.9, r, leafMat);
      addFoliage(
        x + (Math.random() - 0.5) * r * 0.9,
        top + r * 0.35,
        z + (Math.random() - 0.5) * r * 0.9,
        r * 0.62, r * 0.58, r * 0.62,
        leafMat
      );
    } else if (type < 0.7) {
      // Pine tree with stacked cones
      const leafMat = pick(darkLeafMats);
      const trunkH = 2.3 + Math.random() * 1.3;
      makeTrunk(x, z, trunkH);
      const top = trunkH - 0.1;
      const baseR = 2.1 + Math.random() * 1.2;
      const levelH = 2.4 + Math.random() * 0.8;

      for (let level = 0; level < 3; level++) {
        const rr = baseR * (1 - level * 0.26);
        const hh = levelH * (1 - level * 0.14);
        addFoliage(
          x,
          top - 0.25 + level * levelH * 0.5 + hh / 2,
          z,
          rr, hh, rr,
          leafMat,
          coneGeo
        );
      }
    } else if (type < 0.9) {
      // Tall, thin cypress / poplar
      const leafMat = pick(darkLeafMats);
      const trunkH = 2 + Math.random() * 1.2;
      makeTrunk(x, z, trunkH);
      const top = trunkH - 0.1;
      const h = 5.5 + Math.random() * 2.5;
      const r = 1.1 + Math.random() * 0.5;

      addFoliage(x, top + h / 2 - 0.4, z, r, h / 2, r, leafMat);
    } else {
      // Low bush / shrub: a rounded cluster of puffs sitting on the ground
      const leafMat = pick(leafMats);
      let accentMat = pick(leafMats);
      if (accentMat === leafMat) accentMat = pick(leafMats);

      const r = 0.8 + Math.random() * 0.6;
      const puffs = 3 + Math.floor(Math.random() * 2);

      for (let p = 0; p < puffs; p++) {
        const ang = (p / puffs) * Math.PI * 2 + Math.random() * 0.5;
        const off = p === 0 ? 0 : r * (0.4 + Math.random() * 0.25);
        const pr = r * (p === 0 ? 1 : 0.55 + Math.random() * 0.25);

        addFoliage(
          x + Math.cos(ang) * off,
          pr * 0.85 - 0.1,
          z + Math.sin(ang) * off,
          pr * 1.12, pr * 0.88, pr * 1.05,
          p % 2 === 0 ? leafMat : accentMat
        ).userData.isBush = true;
      }

      // Small flowers on some bushes
      if (Math.random() < 0.35) {
        const flowerMat = pick(flowerMats);
        const flowers = 2 + Math.floor(Math.random() * 3);
        for (let f = 0; f < flowers; f++) {
          const fa = Math.random() * Math.PI * 2;
          const u = 0.25 + Math.random() * 0.6;
          const fd = u * 1.12 * r;
          const fy = 0.85 * r - 0.1 + 0.88 * r * Math.sqrt(1 - u * u) + 0.04;

          addFoliage(
            x + Math.cos(fa) * fd,
            fy,
            z + Math.sin(fa) * fd,
            0.09, 0.08, 0.09,
            flowerMat
          );
        }
      }
    }
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
    worldGroup.add(stand);

    // Seats
    for (let row = 0; row < 3; row++) {
      const seatGeo = new THREE.BoxGeometry(28, 0.5, 3);
      const seatColors = [0xff0000, 0x0000ff, 0xffff00];
      const seatMat = new THREE.MeshStandardMaterial({ color: seatColors[row] });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.copy(stand.position);
      seat.position.y = 2 + row * 2.5;
      seat.position.z += side * -2;
      worldGroup.add(seat);
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
  sf.rotation.z = Math.atan2(sfTangent.x, sfTangent.z);
  worldGroup.add(sf);

  // Start lights tower
  const towerGeo = new THREE.CylinderGeometry(0.3, 0.3, 12, 8);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.copy(sfPoint).add(sfNormal.clone().multiplyScalar(TRACK_WIDTH / 2 + 3));
  tower.position.y = 6;
  worldGroup.add(tower);

  // Light bar
  const lightBarGeo = new THREE.BoxGeometry(4, 0.5, 1);
  const lightBarMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const lightBar = new THREE.Mesh(lightBarGeo, lightBarMat);
  lightBar.position.copy(sfPoint).add(sfNormal.clone().multiplyScalar(TRACK_WIDTH / 2 + 3));
  lightBar.position.y = 12;
  worldGroup.add(lightBar);

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
    worldGroup.add(light);
  }

  // Person waving the checkered flag at the finish line
  generateFlagPerson();
}

// ===================== BANDERA A CUADROS =====================
function generateFlagPerson() {
  const person = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd8a37a, roughness: 0.8 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, roughness: 0.8 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1b2a4a, roughness: 0.8 });

  // Legs
  for (let side = -1; side <= 1; side += 2) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.8, 0.2), pantsMat);
    leg.position.set(side * 0.16, 0.4, 0);
    leg.castShadow = true;
    person.add(leg);
  }

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.32), shirtMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  person.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 8), skinMat);
  head.position.y = 1.68;
  head.castShadow = true;
  person.add(head);

  // Left arm (down)
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.58, 0.12), shirtMat);
  leftArm.position.set(-0.36, 1.12, 0);
  leftArm.rotation.z = 0.12;
  leftArm.castShadow = true;
  person.add(leftArm);

  // Right arm raised, holding the flag
  const armGroup = new THREE.Group();
  armGroup.position.set(0.3, 1.35, 0);
  armGroup.rotation.z = -0.62;

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.62, 0.13), shirtMat);
  rightArm.position.y = 0.31;
  rightArm.castShadow = true;
  armGroup.add(rightArm);

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.5, roughness: 0.5 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 6), poleMat);
  pole.position.y = 0.95;
  armGroup.add(pole);

  // Checkered flag texture
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 128;
  flagCanvas.height = 64;
  const fCtx = flagCanvas.getContext('2d');
  for (let x = 0; x < 128; x += 16) {
    for (let y = 0; y < 64; y += 16) {
      fCtx.fillStyle = ((x / 16 + y / 16) % 2 === 0) ? '#ffffff' : '#111111';
      fCtx.fillRect(x, y, 16, 16);
    }
  }
  const flagTex = new THREE.CanvasTexture(flagCanvas);
  const flagMat = new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide });

  flagPivot = new THREE.Group();
  flagPivot.position.y = 1.55;
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.85), flagMat);
  flag.position.set(0.69, 0, 0);
  flagPivot.add(flag);
  armGroup.add(flagPivot);

  person.add(armGroup);
  flagArmGroup = armGroup;
  flagPersonGroup = person;

  // Make the marshal larger and therefore easier to see
  person.scale.set(1.5, 1.5, 1.5);
  // Only shown on the last lap
  person.visible = false;

  // Place the person just before the start/finish line, outside the track,
  // clear of the grandstands and visible on the final approach.
  const sfT = 0.996;
  const sfPoint = trackCurve.getPointAt(sfT);
  const sfTangent = trackCurve.getTangentAt(sfT);
  const normal = new THREE.Vector3(-sfTangent.z, 0, sfTangent.x).normalize();

  person.position.copy(sfPoint).add(normal.clone().multiplyScalar(-(TRACK_WIDTH / 2 + 2.8)));
  person.position.y = 0;
  person.rotation.y = Math.atan2(normal.x, normal.z);
  person.userData.isFlagPerson = true;

  worldGroup.add(person);
}

function animateFlag() {
  if (!flagArmGroup) return;
  const time = performance.now() * 0.001;

  flagArmGroup.rotation.z = -0.62 + Math.sin(time * 3.4) * 0.38;
  if (flagPivot) {
    flagPivot.rotation.y = Math.sin(time * 7) * 0.75;
    flagPivot.rotation.x = Math.sin(time * 5.3) * 0.2;
  }
}

function updateFlagPersonVisibility() {
  if (!flagPersonGroup) return;

  // The marshal appears on the last lap and stays during the player's slow-down
  const show = raceStarted && !isFinished && (playerLap >= TOTAL_LAPS || playerFinishing);
  flagPersonGroup.visible = show;

  if (show) animateFlag();
}

// ===================== NUBES =====================
function generateClouds() {
  const puffGeo = new THREE.SphereGeometry(1, 8, 6);
  const cloudMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    emissive: 0xb8c9d9,
    emissiveIntensity: 0.25,
    fog: false,
  });

  for (let c = 0; c < 28; c++) {
    const cloud = new THREE.Group();
    const puffs = 4 + Math.floor(Math.random() * 3);
    const baseSize = 9 + Math.random() * 9;

    for (let i = 0; i < puffs; i++) {
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      const s = baseSize * (0.55 + Math.random() * 0.55);
      puff.scale.set(s * 1.45, s * 0.7, s);
      puff.position.set(
        (i - (puffs - 1) / 2) * baseSize * 0.85 + (Math.random() - 0.5) * baseSize * 0.6,
        (Math.random() - 0.5) * baseSize * 0.25,
        (Math.random() - 0.5) * baseSize
      );
      cloud.add(puff);
    }

    cloud.position.set(
      (Math.random() - 0.5) * 1500,
      95 + Math.random() * 80,
      (Math.random() - 0.5) * 1500
    );
    cloud.rotation.y = Math.random() * Math.PI * 2;
    worldGroup.add(cloud);
  }
}

// ===================== CARTELES DE DISTANCIA =====================
function generateCornerSigns() {
  const n = trackCurvature.length;
  if (n === 0) return;

  const trackLength = trackCurve.getLength();
  const threshold = 0.008;
  const minRun = 4;
  let corners = [];
  let runStart = -1;

  // Find the corners from the curvature profile
  for (let i = 0; i <= n; i++) {
    const k = i < n ? trackCurvature[i] : 0;
    if (k > threshold) {
      if (runStart < 0) runStart = i;
    } else if (runStart >= 0) {
      const runEnd = i - 1;
      if (runEnd - runStart + 1 >= minRun) {
        let apex = runStart;
        let best = -1;
        for (let j = runStart; j <= runEnd; j++) {
          const v = trackCurvature[j % n];
          if (v > best) {
            best = v;
            apex = j;
          }
        }
        corners.push({ startT: (runStart % n) / n, apexT: (apex % n) / n, k: best });
      }
      runStart = -1;
    }
  }

  // Merge entries that belong to the same corner complex
  const mergeDist = 60 / trackLength;
  const merged = [];
  corners.forEach(c => {
    const prev = merged[merged.length - 1];
    if (prev && c.startT - prev.startT < mergeDist) {
      if (c.k > prev.k) prev.apexT = c.apexT;
    } else {
      merged.push({ ...c });
    }
  });

  // Textures for the boards
  function makeSignTexture(label) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 498, 242);
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 108px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 256, 138);
    return new THREE.CanvasTexture(canvas);
  }

  const tex100 = makeSignTexture('100 m');
  const tex50 = makeSignTexture('50 m');

  const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.8, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.4, roughness: 0.6 });
  const backGeo = new THREE.BoxGeometry(3.9, 2.0, 0.12);
  const backMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const boardGeo = new THREE.PlaneGeometry(3.8, 1.9);

  const placed = [];

  function addSign(t, lateral, texture) {
    const point = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t);
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const pos = point.clone().add(normal.clone().multiplyScalar(lateral));

    // Do not put a board over another part of the track (e.g. at the crossing)
    if (getTrackPosition(pos.x, pos.z).dist < TRACK_WIDTH / 2 + 1) return;

    // Avoid piling up signs from corners that are very close together
    if (placed.some(p => Math.hypot(p.x - pos.x, p.z - pos.z) < 22)) return;
    placed.push({ x: pos.x, z: pos.z });

    const group = new THREE.Group();
    group.position.copy(pos);
    group.position.y = -0.1;
    // Face the cars coming towards the corner
    group.rotation.y = Math.atan2(-tangent.x, -tangent.z);
    group.userData.isCornerSign = true;
    group.userData.t = t;

    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 1.4, -0.25);
    pole.castShadow = true;
    group.add(pole);

    const back = new THREE.Mesh(backGeo, backMat);
    back.position.set(0, 2.3, 0);
    back.castShadow = true;
    group.add(back);

    const board = new THREE.Mesh(
      boardGeo,
      new THREE.MeshBasicMaterial({ map: texture })
    );
    board.position.set(0, 2.3, 0.07);
    group.add(board);

    worldGroup.add(group);
  }

  merged.forEach(corner => {
    // Determine which side of the track is the outside of the corner
    const tA = ((corner.apexT - 0.006) % 1 + 1) % 1;
    const tB = (corner.apexT + 0.006) % 1;
    const tanA = trackCurve.getTangentAt(tA);
    const tanB = trackCurve.getTangentAt(tB);
    const normalX = -tanB.z;
    const normalZ = tanB.x;
    const sideDot = (tanB.x - tanA.x) * normalX + (tanB.z - tanA.z) * normalZ;
    const lateral = (sideDot > 0 ? -1 : 1) * (TRACK_WIDTH / 2 + 2.5);

    const t100 = ((corner.startT - 100 / trackLength) % 1 + 1) % 1;
    const t50 = ((corner.startT - 50 / trackLength) % 1 + 1) % 1;

    addSign(t100, lateral, tex100);
    addSign(t50, lateral, tex50);
  });
}

// ===================== CREACIÓN DE AUTOS =====================
function createCar(color, isPlayer) {
  const carGroup = new THREE.Group();

  // The car model is built facing +Z (nose at +Z) so that setting
  // carGroup.rotation.y = drivingAngle points the nose forward.

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
  nose.position.set(0, 0.4, 2.5);
  nose.castShadow = true;
  carGroup.add(nose);

  // Cockpit
  const cockpitGeo = new THREE.BoxGeometry(1, 0.5, 1.2);
  const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
  const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
  cockpit.position.set(0, 0.9, 0.3);
  carGroup.add(cockpit);

  // Front wing
  const fwGeo = new THREE.BoxGeometry(3, 0.15, 0.8);
  const fwMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.5 });
  const fw = new THREE.Mesh(fwGeo, fwMat);
  fw.position.set(0, 0.2, 3.2);
  fw.castShadow = true;
  carGroup.add(fw);

  // Rear wing
  const rwGeo = new THREE.BoxGeometry(2.5, 0.15, 0.6);
  const rw = new THREE.Mesh(rwGeo, fwMat);
  rw.position.set(0, 1.2, -2);
  rw.castShadow = true;
  carGroup.add(rw);

  // Rear wing supports
  for (let x = -1; x <= 1; x += 2) {
    const supportGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    const support = new THREE.Mesh(supportGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    support.position.set(x * 0.8, 0.8, -2);
    carGroup.add(support);
  }

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

  const wheelPositions = [
    { x: -1.1, y: 0.4, z: 1.8 },
    { x: 1.1, y: 0.4, z: 1.8 },
    { x: -1.1, y: 0.4, z: -1.5 },
    { x: 1.1, y: 0.4, z: -1.5 },
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
    hl.position.set(x, 0.5, 3.1);
    carGroup.add(hl);
  }

  // Taillights: dark red when off, they only glow while braking
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0x550000,
    emissive: 0xff0000,
    emissiveIntensity: 0,
  });
  carGroup.userData.taillightMaterial = taillightMat;

  for (let x = -0.6; x <= 0.6; x += 1.2) {
    const tlGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const tl = new THREE.Mesh(tlGeo, taillightMat);
    tl.position.set(x, 0.5, -2.2);
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
    plate.position.set(0, 0.9, 0.3);
    plate.rotation.x = -Math.PI / 2;
    carGroup.add(plate);
  }

  // Materials that carry the car's paint colour (used to recolour the player)
  carGroup.userData.paintMaterials = [bodyMat, fwMat];

  return carGroup;
}

// ===================== LÓGICA DEL JUEGO =====================
const keys = {};

function onKeyDown(e) {
  keys[e.key.toLowerCase()] = true;
  keys[e.code] = true;

  if (e.key.toLowerCase() === 'p') togglePause();
  if (e.key.toLowerCase() === 'm') toggleMute();
}

function togglePause() {
  if (isFinished || isCountingDown) return;
  isPaused = !isPaused;
  document.getElementById('pauseOverlay').style.display = isPaused ? 'flex' : 'none';
}

function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    if (audioCtx && engineGain) engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    if (audioCtx && skidGain) skidGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
  } else {
    if (engineOsc) updateEngineSound();
    updateSkidSound();
  }
}

function onKeyUp(e) {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
}

// ===================== MANDO =====================
function gamepadButtonValue(pad, index) {
  const button = pad.buttons[index];
  if (!button) return 0;
  return button.value !== undefined ? button.value : (button.pressed ? 1 : 0);
}

function gamepadButtonPressed(pad, index) {
  const button = pad.buttons[index];
  return !!(button && button.pressed);
}

function pollGamepad() {
  if (!navigator.getGamepads) return;

  const pads = navigator.getGamepads();
  let pad = null;
  for (let i = 0; i < pads.length; i++) {
    if (pads[i] && pads[i].connected) {
      pad = pads[i];
      break;
    }
  }

  const wasConnected = gamepadInput.connected;

  if (!pad) {
    gamepadInput.connected = false;
    gamepadInput.throttle = 0;
    gamepadInput.brake = 0;
    gamepadInput.steer = 0;
    gamepadInput.handbrake = false;
    gamepadInput.nitro = false;
    gamepadPrev.pause = false;
    gamepadPrev.mute = false;
    if (wasConnected) showGamepadNotice('Mando desconectado');
    return;
  }

  // Throttle / brake: RT-LT triggers, A-B and D-pad
  let throttle = Math.max(gamepadButtonValue(pad, 7), gamepadButtonValue(pad, 0));
  let brake = Math.max(gamepadButtonValue(pad, 6), gamepadButtonValue(pad, 1));

  if (pad.mapping !== 'standard') {
    if (pad.axes[5] !== undefined) throttle = Math.max(throttle, Math.max(0, pad.axes[5]));
    if (pad.axes[4] !== undefined) brake = Math.max(brake, Math.max(0, pad.axes[4]));
  }

  if (gamepadButtonPressed(pad, 12)) throttle = 1;
  if (gamepadButtonPressed(pad, 13)) brake = 1;

  // Steering: left stick with dead zone and a soft response curve
  let rawSteer = pad.axes[0] || 0;
  const deadzone = 0.14;
  if (Math.abs(rawSteer) < deadzone) {
    rawSteer = 0;
  } else {
    rawSteer = Math.sign(rawSteer) *
      Math.pow((Math.abs(rawSteer) - deadzone) / (1 - deadzone), 1.25);
  }

  let steer = -rawSteer; // stick left = steer left
  if (gamepadButtonPressed(pad, 14)) steer = 1;
  if (gamepadButtonPressed(pad, 15)) steer = -1;

  gamepadInput.connected = true;
  gamepadInput.throttle = Math.min(1, throttle);
  gamepadInput.brake = Math.min(1, brake);
  gamepadInput.steer = Math.max(-1, Math.min(1, steer));
  gamepadInput.handbrake = gamepadButtonPressed(pad, 2) || gamepadButtonPressed(pad, 4);
  gamepadInput.nitro = gamepadButtonPressed(pad, 5) || gamepadButtonPressed(pad, 3);

  if (!wasConnected) {
    showGamepadNotice('🎮 Mando conectado');
  }

  // Start = pause, Back = mute (only on the initial press)
  const pausePressed = gamepadButtonPressed(pad, 9);
  const mutePressed = gamepadButtonPressed(pad, 8);

  if (pausePressed && !gamepadPrev.pause) togglePause();
  if (mutePressed && !gamepadPrev.mute) toggleMute();

  gamepadPrev.pause = pausePressed;
  gamepadPrev.mute = mutePressed;
}

function showGamepadNotice(text) {
  const el = document.getElementById('gamepadNotice');
  if (!el) return;

  el.textContent = text;
  el.style.display = 'block';
  el.style.opacity = '1';

  if (gamepadNoticeTimer) clearTimeout(gamepadNoticeTimer);
  gamepadNoticeTimer = setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; }, 300);
  }, 2500);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function getTrackPosition(x, z, hintT) {
  let minDist = Infinity;
  let bestT = 0;

  if (typeof hintT === 'number' && isFinite(hintT)) {
    // Search only around the last known position. Near the crossing another
    // stretch of track is very close, and a global search would make the
    // player's progress jump to that branch.
    const range = 0.05;
    const steps = 200;

    for (let i = 0; i <= steps; i++) {
      const off = -range + 2 * range * (i / steps);
      const t = ((hintT + off) % 1 + 1) % 1;
      const point = trackCurve.getPointAt(t);
      const dx = x - point.x;
      const dz = z - point.z;
      const dist = dx * dx + dz * dz;
      if (dist < minDist) {
        minDist = dist;
        bestT = t;
      }
    }
  } else {
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
  }

  return { t: bestT, dist: Math.sqrt(minDist) };
}

function getTrackCurvature(t) {
  if (trackCurvature.length === 0) return 0;

  const n = trackCurvature.length;
  const x = (((t % 1) + 1) % 1) * n;
  const i = Math.floor(x) % n;
  const j = (i + 1) % n;
  const f = x - Math.floor(x);
  return trackCurvature[i] * (1 - f) + trackCurvature[j] * f;
}

function isOnTrack(x, z) {
  const info = getTrackPosition(x, z);
  return info.dist < TRACK_WIDTH / 2;
}

function updatePlayer(dt) {
  if (isPaused || isFinished || !raceStarted) return;

  if (playerFinishing) {
    updatePlayerFinishCoast(dt);
    return;
  }

  const accel = keys['arrowup'] || keys['w'];
  const brake = keys['arrowdown'] || keys['s'];
  const left = keys['arrowleft'] || keys['a'];
  const right = keys['arrowright'] || keys['d'];
  const handbrake = keys['Space'] || keys['SHIFT'];

  // Keyboard and gamepad inputs combined
  const throttle = accel ? 1 : gamepadInput.throttle;
  const brakeAmount = brake ? 1 : gamepadInput.brake;
  const handbrakeActive = handbrake || gamepadInput.handbrake;
  const nitroActive = keys['z'] || gamepadInput.nitro;

  // Taillights only glow while braking
  const taillightMat = playerCar.userData.taillightMaterial;
  if (taillightMat) {
    taillightMat.emissiveIntensity = (brakeAmount > 0.1 || handbrakeActive) ? 1.2 : 0;
  }

  // Acceleration (with a short automatic launch at the green light)
  if (throttle > 0.05) {
    const nitroBoost = (playerNitro > 0 && nitroActive) ? 8 : 0;
    playerSpeed += (PLAYER_ACCEL * throttle + nitroBoost) * dt;
  } else if (brakeAmount < 0.05 && !handbrakeActive && raceTimer < LAUNCH_ASSIST_TIME) {
    playerSpeed += LAUNCH_ASSIST * dt;
  } else {
    playerSpeed -= 5 * dt;
  }

  // Braking
  if (brakeAmount > 0.01) {
    playerSpeed -= 18 * brakeAmount * dt;
  }

  // Handbrake
  if (handbrakeActive) {
    playerSpeed -= 10 * dt;
    playerDrift = Math.min(playerDrift + dt * 3, 1);
  } else {
    playerDrift = Math.max(playerDrift - dt * 5, 0);
  }

  // Nitro recharge
  if (throttle < 0.05) {
    playerNitro = Math.min(100, playerNitro + 10 * dt);
  } else {
    playerNitro = Math.max(0, playerNitro - 15 * dt);
  }

  // Speed limits
  playerSpeed = Math.max(-5, Math.min(MAX_SPEED, playerSpeed));

  // Off-track penalty (track the car locally so the crossing can't steal its progress)
  const pos = getTrackPosition(playerCar.position.x, playerCar.position.z, playerPrevT);
  if (pos.dist > TRACK_WIDTH / 2) {
    playerSpeed *= 0.97;
  }

  // ----- Steering with a cornering grip limit -----
  const keyboardSteer = (left ? 1 : 0) - (right ? 1 : 0);
  const steerInput = Math.max(-1, Math.min(1, keyboardSteer + gamepadInput.steer));
  const speedAbs = Math.abs(playerSpeed);

  // Steering becomes less sensitive as speed rises
  const steeringAuthority = 3.2 / (1 + speedAbs / 16) + playerDrift * 0.9;

  // Maximum yaw rate the tires can sustain at this speed
  // (the handbrake makes the rear slide, allowing a bit more rotation)
  const gripYaw = (GRIP_LATERAL + playerDrift * 8) / Math.max(speedAbs, 4);

  const desiredYaw = Math.abs(steerInput) * steeringAuthority;

  // Understeer: asking for more grip than available makes the car slide wide
  // and scrub speed, so tight corners must be taken slower
  const excessYaw = Math.max(0, desiredYaw - gripYaw);
  if (steerInput !== 0 && excessYaw > 0 && speedAbs > 6) {
    playerSlip = Math.min(1, playerSlip + excessYaw * dt * 3);
    const scrub = Math.min(excessYaw * speedAbs * 0.5, 12);
    playerSpeed -= Math.sign(playerSpeed) * scrub * dt;
  } else {
    playerSlip = Math.max(0, playerSlip - dt * 2);
  }

  // Actual turning is limited by the available grip, and lowers further while sliding
  const yawRate = steerInput * Math.min(steeringAuthority, gripYaw) * (1 - playerSlip * 0.25);
  playerAngle += yawRate * dt;

  // Update position
  playerCar.position.x += Math.sin(playerAngle) * playerSpeed * dt;
  playerCar.position.z += Math.cos(playerAngle) * playerSpeed * dt;

  // Signed lateral offset from the center of the car's branch
  const lanePoint = trackCurve.getPointAt(pos.t);
  const laneTangent = trackCurve.getTangentAt(pos.t);
  const laneNormalX = -laneTangent.z;
  const laneNormalZ = laneTangent.x;
  let lateral =
    (playerCar.position.x - lanePoint.x) * laneNormalX +
    (playerCar.position.z - lanePoint.z) * laneNormalZ;

  // In the self-crossing area, keep the car inside the edges of its own branch
  if (isInCrossingZone(pos.t)) {
    const maxLateral = TRACK_WIDTH / 2 - CAR_WIDTH / 2 - 0.3;
    if (Math.abs(lateral) > maxLateral) {
      const excess = Math.abs(lateral) - maxLateral;
      const sign = Math.sign(lateral);
      playerCar.position.x -= laneNormalX * sign * excess;
      playerCar.position.z -= laneNormalZ * sign * excess;
      lateral = sign * maxLateral;
      // Scraping the limit costs speed
      playerSpeed *= Math.max(0, 1 - 1.2 * dt);
    }
  }

  playerLateral = lateral;

  // ----- Drifting: tyre sound and skid marks on the asphalt -----
  const skidAmount = Math.min(1, Math.max(playerDrift, playerSlip * 0.9));
  const onAsphalt = Math.abs(playerLateral) < TRACK_WIDTH / 2 - 0.5;
  const skidding = !isFinished && onAsphalt &&
    Math.abs(playerSpeed) > 8 && skidAmount > 0.2;

  skidIntensity = skidding ? skidAmount : 0;
  updateSkidSound();

  if (skidding) {
    const cosA = Math.cos(playerAngle);
    const sinA = Math.sin(playerAngle);

    for (let side = -1; side <= 1; side += 2) {
      // Rear wheel positions in world space
      const wx = playerCar.position.x + cosA * 1.1 * side + sinA * -1.5;
      const wz = playerCar.position.z - sinA * 1.1 * side + cosA * -1.5;
      addSkidMark(wx, wz, playerAngle);
    }
  }

  // Update car rotation
  playerCar.rotation.y = playerAngle;

  // Tilt car based on steering
  playerCar.rotation.z = steerInput * 0.05;

  // Check checkpoints and laps
  const currentT = pos.t;

  // Determine which checkpoint sector we're in
  const sector = Math.floor(currentT * CHECKPOINT_COUNT) % CHECKPOINT_COUNT;

  // Crossing the start line (the player starts just behind it)
  const crossedStartLine = playerPrevT > 0.8 && currentT < 0.05;

  if (crossedStartLine) {
    if (!playerCrossedStart) {
      // First crossing from the grid: this starts lap 1, it doesn't count as a lap
      playerCrossedStart = true;
      playerCheckpoints = 0;
    } else if (playerCheckpoints > CHECKPOINT_COUNT * 0.7) {
      playerLap++;
      playerCheckpoints = 0;
      if (playerLap > TOTAL_LAPS) {
        beginPlayerFinish();
        return;
      }
      playTone(660, 0.2, 0.1);
    }
  }

  if (playerCrossedStart) {
    playerCheckpoints = Math.max(playerCheckpoints, sector);
  }

  // Update progress for position calculation (negative while behind the start line)
  playerProgress = playerCrossedStart ? (playerLap - 1) + currentT : currentT - 1;

  playerPrevT = currentT;

  // Update nitro UI
  document.getElementById('nitroFill').style.width = playerNitro + '%';

  // Update speed display
  const speedKmh = Math.abs(Math.round(playerSpeed * SPEED_DISPLAY_FACTOR));
  document.getElementById('speedValue').textContent = speedKmh;

  // Gear
  let gear = 'N';
  if (playerSpeed > 0.5) gear = Math.min(8, Math.ceil(speedKmh / 44));
  else if (playerSpeed < -0.5) gear = 'R';
  document.getElementById('gearDisplay').textContent = gear;

  // Lap display
  document.getElementById('lapCount').textContent = Math.min(playerLap, TOTAL_LAPS);

  // Engine sound
  updateEngineSound();
}

function updateFinishedCar(aiCar, state, dt, trackLength) {
  // Coast past the finish line and slow down smoothly
  state.speed = Math.max(0, state.speed - 5 * dt);
  state.progress += (state.speed * dt) / trackLength;
  if (state.progress >= 1) state.progress -= 1;

  state.wobble += state.wobbleSpeed * dt * 0.5;
  state.lateral += (state.parkOffset - state.lateral) * Math.min(1, dt * 1.5);

  const point = trackCurve.getPointAt(state.progress);
  const tangent = trackCurve.getTangentAt(state.progress);
  const normalX = -tangent.z;
  const normalZ = tangent.x;
  const wobble = Math.sin(state.wobble) * state.wobbleAmount * 0.3;
  const lateralOffset = Math.max(-7.8, Math.min(7.8, state.lateral + wobble));

  aiCar.position.set(point.x + normalX * lateralOffset, 0, point.z + normalZ * lateralOffset);
  aiCar.rotation.y = Math.atan2(tangent.x, tangent.z);

  state.braking = state.speed > 0.5;
  if (aiCar.userData.taillightMaterial) {
    aiCar.userData.taillightMaterial.emissiveIntensity = state.braking ? 1.2 : 0;
  }

  // Keep classified cars ahead in the standings
  state.totalProgress = TOTAL_LAPS + state.progress;
}

function updateAI(dt) {
  if (isPaused || isFinished || !raceStarted) return;

  const trackLength = trackCurve.getLength();

  aiCars.forEach((aiCar, i) => {
    const state = aiStates[i];

    if (state.finished) {
      updateFinishedCar(aiCar, state, dt, trackLength);
      return;
    }

    if (!state.active) return;

    // Natural wobble
    state.wobble += state.wobbleSpeed * dt;

    // ----- Pace: own base speed and own cornering grip -----
    const speedVariation = Math.sin(state.wobble * 2) * 0.03;
    const baseTarget = (state.baseSpeed + speedVariation) * MAX_SPEED;
    const lookAheadT = state.progress + (state.speed * 0.45) / trackLength;
    const curvature = getTrackCurvature(lookAheadT);
    const cornerSpeed = Math.sqrt(state.grip / Math.max(curvature, 0.0001));
    const freeTarget = Math.min(MAX_SPEED, baseTarget, cornerSpeed);

    // ----- Traffic: find the nearest car ahead (rivals and the player) -----
    const myProg = state.totalProgress;
    let obstacle = null;
    let bestGap = Infinity;

    if (playerProgress > myProg) {
      const gap = (playerProgress - myProg) * trackLength;
      if (gap > 0 && gap < 30) {
        obstacle = { lateral: playerLateral, speed: Math.abs(playerSpeed) };
        bestGap = gap;
      }
    }

    for (let j = 0; j < aiStates.length; j++) {
      if (j === i) continue;
      const other = aiStates[j];
      if (!other.active) continue;
      const gap = (other.totalProgress - myProg) * trackLength;
      if (gap > 0 && gap < 30 && gap < bestGap) {
        obstacle = { lateral: other.lateral, speed: other.speed };
        bestGap = gap;
      }
    }

    // ----- Decide whether to overtake -----
    if (state.overtakeCooldown > 0) state.overtakeCooldown -= dt;

    const canOvertake = obstacle && bestGap < 20 && state.overtakeCooldown <= 0 &&
      freeTarget > obstacle.speed + 1.5;

    if (canOvertake) {
      let side = obstacle.lateral >= 0 ? -1 : 1;

      if (state.overtakeTimer > 0 && state.overtakeSide !== 0) {
        side = state.overtakeSide;
      } else {
        // Choose the side away from the car ahead, unless it is occupied
        const candidate = side * 5.2;
        let blocked = false;

        for (let j = 0; j < aiStates.length; j++) {
          if (j === i) continue;
          const other = aiStates[j];
          if (!other.active) continue;
          const gap = Math.abs((other.totalProgress - myProg) * trackLength);
          if (gap < 15 && Math.abs(other.lateral - candidate) < 2.6) {
            blocked = true;
            break;
          }
        }

        if (!blocked) {
          const playerGap = Math.abs((playerProgress - myProg) * trackLength);
          if (playerGap < 15 && Math.abs(playerLateral - candidate) < 2.6) blocked = true;
        }

        if (blocked) side = -side;
        state.overtakeSide = side;
      }

      state.overtakeTimer = 2;
    }

    // If the car ahead is gone, finish the maneuver soon and return to the line
    if (state.overtakeTimer > 0 && !obstacle) {
      state.overtakeTimer = Math.min(state.overtakeTimer, 0.6);
    }

    // ----- Follow closely only if still right behind a slower car -----
    let following = false;
    let targetSpeed = freeTarget;

    if (obstacle && bestGap < 9 && Math.abs(state.lateral - obstacle.lateral) < 1.6 &&
        targetSpeed > obstacle.speed) {
      targetSpeed = Math.max(obstacle.speed, 3);
      following = true;
    }

    // ----- Brake lights: corners or slowing behind traffic -----
    const cornerBraking = cornerSpeed < baseTarget && state.speed > cornerSpeed + 0.6;
    const trafficBraking = following && state.speed > targetSpeed + 0.4;
    state.braking = cornerBraking || trafficBraking;

    // ----- Speed: limited acceleration and braking, like the player's car -----
    if (state.speed < targetSpeed) {
      state.speed = Math.min(targetSpeed, state.speed + AI_ACCEL * dt);
    } else {
      state.speed = Math.max(targetSpeed, state.speed - AI_BRAKE * dt);
    }
    if (state.speed < 0) state.speed = 0;

    // ----- Lateral movement: racing line or overtaking line -----
    let desiredLateral = state.lineOffset;

    if (state.overtakeTimer > 0) {
      desiredLateral = state.overtakeSide * 5.2;
      state.overtakeTimer -= dt;
      if (state.overtakeTimer <= 0) {
        state.overtakeTimer = 0;
        state.overtakeSide = 0;
        state.overtakeCooldown = 2;
      }
    }

    const lateralStep = 4.5 * dt;
    const lateralDiff = desiredLateral - state.lateral;
    state.lateral += Math.max(-lateralStep, Math.min(lateralStep, lateralDiff));
    state.lateral = Math.max(-6.5, Math.min(6.5, state.lateral));

    // ----- Advance along the track -----
    state.progress += (state.speed * dt) / trackLength;

    if (state.progress >= 1) {
      state.progress -= 1;
      if (state.crossedStart) {
        state.lap++;
        if (state.lap > TOTAL_LAPS) {
          // The car keeps rolling past the line and slows to a stop
          state.finished = true;
          state.active = false;
          state.braking = true;
          state.parkOffset = (i % 2 === 0 ? 1 : -1) * 7.2;
          registerFinish(state.driverId);
          return;
        }
      } else {
        // Crossing the line from the grid starts their first lap
        state.crossedStart = true;
      }
    }

    // ----- Place the car -----
    const point = trackCurve.getPointAt(state.progress);
    const tangent = trackCurve.getTangentAt(state.progress);
    const normalX = -tangent.z;
    const normalZ = tangent.x;
    const wobbleOffset = Math.sin(state.wobble) * state.wobbleAmount * 0.5;
    const lateralOffset = Math.max(-6.5, Math.min(6.5, state.lateral + wobbleOffset));

    aiCar.position.x = point.x + normalX * lateralOffset;
    aiCar.position.z = point.z + normalZ * lateralOffset;
    aiCar.position.y = 0;
    aiCar.rotation.y = Math.atan2(tangent.x, tangent.z);

    if (aiCar.userData.taillightMaterial) {
      aiCar.userData.taillightMaterial.emissiveIntensity = state.braking ? 1.2 : 0;
    }

    // AI progress for position (negative while still behind the start line)
    state.totalProgress = state.crossedStart
      ? (state.lap - 1) + state.progress
      : state.progress - 1;
  });
}

// Push an AI car sideways (relative to the track) when it collides
function pushAISideways(state, pushX, pushZ, amount) {
  const tangent = trackCurve.getTangentAt(state.progress);
  const normalX = -tangent.z;
  const normalZ = tangent.x;

  // Project the push direction onto the track normal
  let dot = pushX * normalX + pushZ * normalZ;
  if (Math.abs(dot) < 0.15) {
    // Cars are nose-to-tail: pick a side so they can still separate
    dot = state.lateral >= 0 ? 1 : -1;
  }

  state.lateral += Math.sign(dot) * amount;
  state.lateral = Math.max(-6.5, Math.min(6.5, state.lateral));
}

function updateCollisions(dt) {
  if (!raceStarted || isPaused || isFinished || playerFinishing) return;

  if (crashSoundCooldown > 0) crashSoundCooldown -= dt;

  // Player vs AI cars
  aiCars.forEach((aiCar, i) => {
    const state = aiStates[i];
    if (!state.active) return;

    let dx = playerCar.position.x - aiCar.position.x;
    let dz = playerCar.position.z - aiCar.position.z;
    let dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < CAR_COLLISION_DIST) {
      if (dist < 0.001) {
        dx = 1;
        dz = 0;
        dist = 1;
      }
      const nx = dx / dist;
      const nz = dz / dist;
      const overlap = CAR_COLLISION_DIST - dist;

      // Separate the player from the AI car
      playerCar.position.x += nx * overlap * 0.8;
      playerCar.position.z += nz * overlap * 0.8;

      // Move the AI car the opposite way and slow it down
      pushAISideways(state, -nx, -nz, overlap * 0.6);
      state.speed *= 0.85;

      // The player loses speed when hit
      playerSpeed *= 0.6;

      if (crashSoundCooldown <= 0) {
        playCrashSound();
        crashSoundCooldown = 0.5;
      }
    }
  });

  // AI vs AI cars
  for (let i = 0; i < aiCars.length; i++) {
    const a = aiStates[i];
    if (!a.active) continue;

    for (let j = i + 1; j < aiCars.length; j++) {
      const b = aiStates[j];
      if (!b.active) continue;

      const dx = aiCars[i].position.x - aiCars[j].position.x;
      const dz = aiCars[i].position.z - aiCars[j].position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < CAR_COLLISION_DIST && dist > 0.001) {
        const nx = dx / dist;
        const nz = dz / dist;
        const overlap = CAR_COLLISION_DIST - dist;

        pushAISideways(a, nx, nz, overlap * 0.5);
        pushAISideways(b, -nx, -nz, overlap * 0.5);

        // The car behind loses a little speed on contact
        if (a.totalProgress > b.totalProgress) b.speed *= 0.985;
        else a.speed *= 0.985;
      }
    }
  }
}

function updateCamera() {
  const speedFactor = Math.min(Math.abs(playerSpeed) / MAX_SPEED, 1);
  cameraSpeedFactor += (speedFactor - cameraSpeedFactor) * 0.06;

  // Camera gets closer and lower as speed increases
  const camDist = 8.0 - cameraSpeedFactor * 1.0;
  const camHeight = 4.3 - cameraSpeedFactor * 0.5;

  const targetX = playerCar.position.x - Math.sin(playerAngle) * camDist;
  const targetZ = playerCar.position.z - Math.cos(playerAngle) * camDist;

  camera.position.x += (targetX - camera.position.x) * 0.08;
  camera.position.z += (targetZ - camera.position.z) * 0.08;
  camera.position.y += (camHeight - camera.position.y) * 0.08;

  // Wider field of view at speed, but only slightly so the car does not shrink
  const targetFov = 70 + cameraSpeedFactor * 6;
  if (Math.abs(camera.fov - targetFov) > 0.01) {
    camera.fov += (targetFov - camera.fov) * 0.08;
    camera.updateProjectionMatrix();
  }

  // Look further ahead when going fast
  const lookAhead = 15 + cameraSpeedFactor * 4;
  const lookX = playerCar.position.x + Math.sin(playerAngle) * lookAhead;
  const lookZ = playerCar.position.z + Math.cos(playerAngle) * lookAhead;

  // Subtle high-speed vibration
  const shake = Math.max(0, cameraSpeedFactor - 0.55) * 0.18;
  const now = performance.now() * 0.001;
  const shakeX = Math.sin(now * 41) * shake;
  const shakeY = Math.cos(now * 33) * shake;

  camera.lookAt(lookX + shakeX, 1 + shakeY, lookZ);

  // Speed lines / tunnel vignette overlay
  const fx = document.getElementById('speedFX');
  if (fx) {
    const opacity = Math.max(0, (cameraSpeedFactor - 0.35) / 0.65) * 0.7;
    fx.style.opacity = opacity.toFixed(2);
  }
}

function updateMirrorCamera() {
  const fx = Math.sin(playerAngle);
  const fz = Math.cos(playerAngle);

  // Sit above the car and look back down the track
  mirrorCamera.position.set(playerCar.position.x, 4, playerCar.position.z);
  mirrorCamera.lookAt(
    playerCar.position.x - fx * 45,
    1,
    playerCar.position.z - fz * 45
  );
}

function renderRearviewMirror() {
  const frame = document.getElementById('rearviewMirror');
  if (!frame) return;

  const rect = frame.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return;

  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  const x = Math.round(rect.left);
  const y = Math.round(window.innerHeight - rect.bottom);

  mirrorCamera.aspect = w / h;
  mirrorCamera.updateProjectionMatrix();

  renderer.setScissorTest(true);
  renderer.setViewport(x, y, w, h);
  renderer.setScissor(x, y, w, h);
  renderer.render(scene, mirrorCamera);
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
}

function updatePosition() {
  // Keep showing the classified position while the player coasts to a stop
  if (playerFinishing && pendingPlayerFinish) {
    document.getElementById('posValue').textContent = pendingPlayerFinish.playerPos;
    window._lastPlayerPos = pendingPlayerFinish.playerPos;
    return;
  }

  const allPositions = [];

  // Player
  allPositions.push({
    progress: playerProgress,
    isPlayer: true,
  });

  // AI (including those that have already finished, so they keep their place)
  aiStates.forEach((state) => {
    allPositions.push({
      progress: state.totalProgress,
      isPlayer: false,
    });
  });

  allPositions.sort((a, b) => b.progress - a.progress);

  let playerPos = 1;
  allPositions.forEach((p, i) => {
    if (p.isPlayer) {
      playerPos = i + 1;
    }
  });

  document.getElementById('posValue').textContent = playerPos;

  // Check for overtakes only while actually racing
  const prevPos = window._lastPlayerPos || playerPos;
  if (raceStarted && !isCountingDown && !isFinished && playerPos < prevPos) {
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
  if (!raceStarted || isPaused || isFinished || playerFinishing) return;
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

  // Start/finish marker on the minimap
  const sfPoint = trackCurve.getPointAt(0);
  const sfTangent = trackCurve.getTangentAt(0);
  const sfMap = toMap(sfPoint.x, sfPoint.z);
  const sfAhead = toMap(sfPoint.x + sfTangent.x, sfPoint.z + sfTangent.z);
  let sfDx = sfAhead.x - sfMap.x;
  let sfDy = sfAhead.y - sfMap.y;
  const sfLen = Math.hypot(sfDx, sfDy) || 1;
  sfDx /= sfLen;
  sfDy /= sfLen;
  const sfNx = -sfDy;
  const sfNy = sfDx;
  const markSize = 9;

  ctx.save();
  ctx.lineCap = 'butt';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(sfMap.x - sfNx * markSize, sfMap.y - sfNy * markSize);
  ctx.lineTo(sfMap.x + sfNx * markSize, sfMap.y + sfNy * markSize);
  ctx.stroke();

  // Dash of black over the white line for a checkered look
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 5;
  ctx.setLineDash([2.5, 2.5]);
  ctx.beginPath();
  ctx.moveTo(sfMap.x - sfNx * markSize, sfMap.y - sfNy * markSize);
  ctx.lineTo(sfMap.x + sfNx * markSize, sfMap.y + sfNy * markSize);
  ctx.stroke();
  ctx.setLineDash([]);

  // Label next to the line
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('META', sfMap.x + sfNx * 14, sfMap.y + sfNy * 14);
  ctx.restore();

  // Draw AI cars
  aiStates.forEach((state) => {
    if (!state.active && !state.finished) return;
    const point = trackCurve.getPointAt(state.progress);
    const m = toMap(point.x, point.z);
    ctx.fillStyle = state.finished ? '#888888' : '#ff4444';
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

function beginPlayerFinish() {
  if (playerFinishing) return;
  playerFinishing = true;

  // Lock in the classification and points at the moment of crossing the line
  registerFinish('player');
  const classification = buildRaceClassification();
  awardRacePoints(classification);

  pendingPlayerFinish = {
    classification,
    playerPos: classification.indexOf('player') + 1,
    timeStr: formatRaceTime(raceTimer),
  };

  playFinishSound();
}

function updatePlayerFinishCoast(dt) {
  // The player keeps rolling across the line and brakes to a stop
  playerSpeed = Math.max(0, playerSpeed - 8 * dt);
  playerCar.position.x += Math.sin(playerAngle) * playerSpeed * dt;
  playerCar.position.z += Math.cos(playerAngle) * playerSpeed * dt;
  playerCar.rotation.y = playerAngle;

  if (playerCar.userData.taillightMaterial) {
    playerCar.userData.taillightMaterial.emissiveIntensity = playerSpeed > 0.3 ? 1.2 : 0;
  }

  updateEngineSound();
  skidIntensity = 0;
  updateSkidSound();

  const speedKmh = Math.abs(Math.round(playerSpeed * SPEED_DISPLAY_FACTOR));
  document.getElementById('speedValue').textContent = speedKmh;
  document.getElementById('gearDisplay').textContent =
    playerSpeed > 0.5 ? Math.min(8, Math.ceil(speedKmh / 44)) : 'N';

  if (playerSpeed <= 0.2) {
    finishRace();
  }
}

function finishRace() {
  if (isFinished) return;

  isFinished = true;
  playerFinishing = false;
  stopEngineSound();
  stopSkidSound();
  skidIntensity = 0;

  // Turn off the brake lights
  if (playerCar.userData.taillightMaterial) {
    playerCar.userData.taillightMaterial.emissiveIntensity = 0;
  }

  // Fallback if the race is finished directly (e.g. tests)
  if (!pendingPlayerFinish) {
    registerFinish('player');
    const classification = buildRaceClassification();
    awardRacePoints(classification);
    pendingPlayerFinish = {
      classification,
      playerPos: classification.indexOf('player') + 1,
      timeStr: formatRaceTime(raceTimer),
    };
  }

  const data = pendingPlayerFinish;
  showRaceResults(data.classification, data.playerPos, data.timeStr);
}

// ===================== SEMÁFORO =====================
function startCountdown() {
  isCountingDown = true;
  const countdownEl = document.getElementById('countdown');
  countdownEl.style.display = 'block';

  // Light up start lights
  const lights = worldGroup.children.filter(c => c.userData.isStartLight);
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

  pollGamepad();

  updatePlayer(currentDt);
  updateAI(currentDt);
  updateCollisions(currentDt);
  updateCamera();
  updateMirrorCamera();
  updateFlagPersonVisibility();
  updateTimer();
  updatePosition();
  drawMinimap();

  renderer.render(scene, camera);
  renderRearviewMirror();
}

// ===================== PARRILLA DE SALIDA =====================
const GRID_FIRST_ROW_GAP = 8;   // metros desde la línea hasta la primera fila
const GRID_ROW_SPACING = 9;     // separación entre filas
const GRID_LATERAL = 2.6;       // desplazamiento lateral de cada columna

function getGridSlot(slotIndex) {
  const row = Math.floor(slotIndex / 2);
  const col = slotIndex % 2; // 0 = izquierda, 1 = derecha
  const trackLength = trackCurve.getLength();
  const behind = GRID_FIRST_ROW_GAP + row * GRID_ROW_SPACING;
  const t = ((1 - behind / trackLength) % 1 + 1) % 1;

  const point = trackCurve.getPointAt(t);
  const tangent = trackCurve.getTangentAt(t);
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
  const lateral = col === 0 ? -GRID_LATERAL : GRID_LATERAL;

  return {
    t,
    col,
    lateral,
    tangent,
    position: point.clone().add(normal.clone().multiplyScalar(lateral)),
  };
}

function getGridOrder() {
  // The player always starts last; the rivals are ordered by the championship
  const player = driverById['player'];
  const rivals = drivers
    .filter(d => !d.isPlayer)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (a.bestFinish !== b.bestFinish) return a.bestFinish - b.bestFinish;
      return (a.seed || 0) - (b.seed || 0);
    });

  return [...rivals, player];
}

function placeCarsOnGrid() {
  cameraSpeedFactor = 0;
  playerLateral = 0;

  // Taillights off at the start
  if (playerCar.userData.taillightMaterial) {
    playerCar.userData.taillightMaterial.emissiveIntensity = 0;
  }

  const order = getGridOrder();
  playerGridSlot = order.findIndex(d => d.isPlayer);

  order.forEach((driver, slotIndex) => {
    const slot = getGridSlot(slotIndex);

    if (driver.isPlayer) {
      playerCar.position.copy(slot.position);
      playerAngle = Math.atan2(slot.tangent.x, slot.tangent.z);
      playerCar.rotation.y = playerAngle;
      playerCar.rotation.z = 0;
      playerPrevT = slot.t;
      playerCrossedStart = false;
      playerProgress = slot.t - 1 - slot.col * 0.0001;
      return;
    }

    const state = aiStates[driver.aiIndex];
    state.progress = slot.t;
    state.speed = 0;
    state.lap = 1;
    state.active = true;
    state.crossedStart = false;
    state.braking = false;
    state.finished = false;
    state.parkOffset = 0;
    state.lateral = slot.lateral;
    state.overtakeSide = 0;
    state.overtakeTimer = 0;
    state.overtakeCooldown = 0;
    state.totalProgress = slot.t - 1 - slot.col * 0.0001;
    state.wobble = Math.random() * Math.PI * 2;

    const aiCar = aiCars[driver.aiIndex];
    aiCar.position.copy(slot.position);
    aiCar.rotation.y = Math.atan2(slot.tangent.x, slot.tangent.z);
    aiCar.visible = true;
    if (aiCar.userData.taillightMaterial) {
      aiCar.userData.taillightMaterial.emissiveIntensity = 0;
    }
  });
}

// ===================== CAMPEONATO =====================
function formatRaceTime(t) {
  const minutes = Math.floor(t / 60);
  const seconds = t % 60;
  const ms = Math.floor((t % 1) * 1000);
  return (
    String(minutes).padStart(2, '0') + ':' +
    String(Math.floor(seconds)).padStart(2, '0') + '.' +
    String(ms).padStart(3, '0')
  );
}

function registerFinish(driverId) {
  if (!raceFinishOrder.includes(driverId)) raceFinishOrder.push(driverId);
}

function buildRaceClassification() {
  const finished = raceFinishOrder.slice();
  const remaining = drivers
    .filter(d => !finished.includes(d.id))
    .map(d => ({
      id: d.id,
      progress: d.isPlayer ? playerProgress : aiStates[d.aiIndex].totalProgress,
    }))
    .sort((a, b) => b.progress - a.progress);

  return finished.concat(remaining.map(r => r.id));
}

function awardRacePoints(classification) {
  raceResults = classification.map((id, index) => {
    const driver = driverById[id];
    const points = RACE_POINTS[index] || 0;
    driver.points += points;
    driver.bestFinish = Math.min(driver.bestFinish, index + 1);
    return {
      id,
      name: driver.name,
      isPlayer: driver.isPlayer,
      color: driver.color,
      position: index + 1,
      points,
    };
  });
  championshipHistory.push(raceResults);
}

function getStandings() {
  return drivers.slice().sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (a.bestFinish !== b.bestFinish) return a.bestFinish - b.bestFinish;
    return (a.seed || 0) - (b.seed || 0);
  });
}

function driverCell(driver) {
  const color = '#' + driver.color.toString(16).padStart(6, '0');
  return `<span class="colorDot" style="background:${color}"></span>${driver.name}`;
}

function showRaceResults(classification, playerPos, timeStr) {
  const circuit = CIRCUITS[currentCircuitIndex];
  const standings = getStandings();

  const raceRows = classification.map((id, idx) => {
    const driver = driverById[id];
    return `<tr class="${driver.isPlayer ? 'playerRow' : ''}">
      <td>${idx + 1}</td>
      <td>${driverCell(driver)}</td>
      <td>${RACE_POINTS[idx] || 0}</td>
    </tr>`;
  }).join('');

  const standingsRows = standings.map((driver, idx) => `
    <tr class="${driver.isPlayer ? 'playerRow' : ''}">
      <td>${idx + 1}</td>
      <td>${driverCell(driver)}</td>
      <td>${driver.points}</td>
    </tr>`).join('');

  const lastRace = currentCircuitIndex >= CIRCUITS.length - 1;
  const buttonText = lastRace ? 'VER RESULTADOS DEL CAMPEONATO' : 'SIGUIENTE CARRERA';
  const buttonAction = lastRace ? 'showChampionshipResults()' : 'nextRace()';

  document.getElementById('resultsContent').innerHTML = `
    <h2>🏁 RESULTADOS DE LA CARRERA</h2>
    <div class="resultsSubtitle">Carrera ${currentCircuitIndex + 1} de ${CIRCUITS.length} · ${circuit.name}</div>
    <div class="resultsInfo">Tu posición: <strong>${playerPos}º</strong> · Tiempo: <strong>${timeStr}</strong></div>
    <div class="resultsColumns">
      <div class="resultsPanel">
        <h3>Clasificación de la carrera</h3>
        <table class="resultTable">
          <thead><tr><th>Pos</th><th>Piloto</th><th>Pts</th></tr></thead>
          <tbody>${raceRows}</tbody>
        </table>
      </div>
      <div class="resultsPanel">
        <h3>Campeonato</h3>
        <table class="resultTable">
          <thead><tr><th>Pos</th><th>Piloto</th><th>Pts</th></tr></thead>
          <tbody>${standingsRows}</tbody>
        </table>
      </div>
    </div>
    <button class="resultsButton" onclick="${buttonAction}">${buttonText}</button>
  `;
  document.getElementById('finishScreen').style.display = 'flex';
}

function showChampionshipResults() {
  const standings = getStandings();
  const champion = standings[0];
  const player = driverById['player'];
  const playerPos = standings.findIndex(d => d.isPlayer) + 1;

  const rows = standings.map((driver, idx) => `
    <tr class="${driver.isPlayer ? 'playerRow' : ''} ${idx === 0 ? 'championRow' : ''}">
      <td>${idx + 1}</td>
      <td>${driverCell(driver)}</td>
      <td>${driver.points}</td>
    </tr>`).join('');

  document.getElementById('resultsContent').innerHTML = `
    <h2>🏆 CAMPEONATO FINALIZADO</h2>
    <div class="championLine">Campeón: <span class="championName">${champion.name}</span></div>
    <div class="resultsInfo">Has terminado <strong>${playerPos}º</strong> con <strong>${player.points}</strong> puntos</div>
    <div class="resultsPanel wide">
      <h3>Clasificación final del campeonato</h3>
      <table class="resultTable">
        <thead><tr><th>Pos</th><th>Piloto</th><th>Pts</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <button class="resultsButton" onclick="startChampionship()">NUEVO CAMPEONATO</button>
  `;
  document.getElementById('finishScreen').style.display = 'flex';
}

function nextRace() {
  document.getElementById('finishScreen').style.display = 'none';
  if (currentCircuitIndex < CIRCUITS.length - 1) {
    startRace(currentCircuitIndex + 1);
  } else {
    showChampionshipResults();
  }
}

function resetRaceState() {
  playerSpeed = 0;
  playerLap = 1;
  playerProgress = 0;
  playerCheckpoints = 0;
  playerNitro = 100;
  playerDrift = 0;
  playerSlip = 0;
  playerPrevT = 0;
  playerCrossedStart = false;
  playerFinishing = false;
  pendingPlayerFinish = null;
  raceFinishOrder = [];
  raceResults = [];
  raceTimer = 0;
  crashSoundCooldown = 0;
  currentDt = 0;
  lastTime = 0;
}

function snapCameraBehindPlayer() {
  const fx = Math.sin(playerAngle);
  const fz = Math.cos(playerAngle);
  camera.position.set(playerCar.position.x - fx * 8.0, 4.3, playerCar.position.z - fz * 8.0);
  camera.fov = 70;
  camera.updateProjectionMatrix();
  camera.lookAt(playerCar.position.x + fx * 15, 1, playerCar.position.z + fz * 15);
  cameraSpeedFactor = 0;

  const fxEl = document.getElementById('speedFX');
  if (fxEl) fxEl.style.opacity = '0';
}

function updateCircuitInfo() {
  const el = document.getElementById('circuitInfo');
  if (el) {
    el.textContent = `Carrera ${currentCircuitIndex + 1}/${CIRCUITS.length} · ${CIRCUITS[currentCircuitIndex].name}`;
  }
}

function startRace(index) {
  currentCircuitIndex = index;
  buildCircuit(CIRCUITS[index]);
  clearSkidMarks();
  resetRaceState();
  placeCarsOnGrid();
  snapCameraBehindPlayer();
  updateCircuitInfo();

  isFinished = false;
  isPaused = false;
  raceStarted = false;
  isCountingDown = false;
  window._lastPlayerPos = playerGridSlot + 1;

  document.getElementById('finishScreen').style.display = 'none';
  document.getElementById('pauseOverlay').style.display = 'none';
  document.getElementById('lapCount').textContent = '1';
  document.getElementById('posValue').textContent = playerGridSlot + 1;
  document.getElementById('timer').textContent = '00:00.000';
  document.getElementById('speedValue').textContent = '0';
  document.getElementById('gearDisplay').textContent = 'N';
  document.getElementById('nitroFill').style.width = '100%';

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  startEngineSound();
  startSkidSound();
  startCountdown();
}

function startChampionship() {
  document.getElementById('startScreen').style.display = 'none';

  if (!scene) {
    init();
  }

  // Apply the chosen colour (useful when starting a second championship)
  if (playerCar && driverById['player']) {
    (playerCar.userData.paintMaterials || []).forEach(m => m.color.setHex(selectedColor));
    driverById['player'].color = selectedColor;
  }

  championshipHistory = [];
  raceResults = [];
  drivers.forEach(driver => {
    driver.points = 0;
    driver.bestFinish = 99;
    driver.seed = Math.random();
  });

  startRace(0);
}

// Populate the colour picker before the game starts
setupColorPicker();

// Prevent scrolling
document.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
    e.preventDefault();
  }
});
