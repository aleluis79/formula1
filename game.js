// ===================== CONFIGURACIÓN =====================
const TOTAL_LAPS = 3;
const NUM_AI = 9;
const TRACK_WIDTH = 18;
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
    mountains: true,
    points: [
      [267.9, 0.0], [193.2, 51.3], [130.5, 77.6], [104.0, 117.2],
      [73.3, 184.6], [0.0, 239.1], [-91.7, 231.0], [-145.3, 163.6],
      [-149.0, 88.5], [-151.9, 40.4], [-194.1, 0.0], [-246.2, -65.5],
      [-243.2, -144.6], [-167.5, -188.6], [-69.5, -174.9], [0.0, -138.9],
      [51.0, -128.5], [126.3, -142.2], [224.8, -133.6], [287.4, -76.4],
    ],
  },
  {
    name: 'Circuito de Las Vegas',
    sky: 0x8fa6d6,
    flatTrack: true,
    points: [
      [-160.8, 23.5], [-160.6, 46.6], [-160.5, 64.1], [-163.9, 155.7], [-164.9, 202.7], [-165.0, 226.2],
      [-165.9, 254.4], [-164.3, 256.7], [-162.1, 257.4], [-156.9, 257.4], [-153.0, 258.8], [-144.3, 267.5],
      [-136.7, 271.8], [-126.6, 273.7], [-82.7, 274.7], [-25.1, 274.0], [22.2, 274.3], [45.3, 273.9],
      [64.2, 271.3], [84.0, 267.6], [89.2, 265.2], [93.3, 262.7], [96.7, 259.5], [138.1, 213.0],
      [153.6, 195.7], [156.9, 192.0], [159.3, 188.0], [160.1, 183.3], [158.1, 179.1], [154.8, 176.4],
      [148.9, 174.2], [143.3, 173.3], [137.9, 173.6], [132.9, 175.1], [121.8, 181.7], [111.6, 191.8],
      [107.6, 194.3], [99.0, 196.3], [94.4, 196.2], [86.0, 193.4], [81.4, 190.8], [77.0, 187.1],
      [69.9, 177.5], [67.0, 169.4], [65.0, -71.8], [66.5, -75.4], [69.4, -77.3], [119.5, -76.3],
      [134.5, -76.4], [142.4, -78.2], [145.5, -80.9], [154.4, -89.5], [158.4, -95.1], [161.4, -101.1],
      [163.6, -106.4], [165.0, -113.3], [165.9, -121.4], [165.6, -126.2], [162.9, -127.9], [155.6, -128.8],
      [153.1, -130.3], [150.9, -133.7], [150.0, -138.9], [150.4, -142.7], [157.5, -154.8], [158.7, -158.0],
      [161.6, -163.5], [160.6, -169.4], [154.9, -173.1], [144.3, -174.3], [64.8, -176.3], [35.5, -180.5],
      [25.8, -185.2], [15.1, -196.1], [5.9, -214.4], [-8.1, -247.2], [-17.2, -256.6], [-26.5, -263.0],
      [-36.1, -266.5], [-51.0, -271.3], [-67.9, -274.7], [-70.2, -274.1], [-72.4, -272.4], [-74.1, -266.7],
      [-75.8, -262.8], [-93.4, -228.7], [-104.3, -208.5], [-110.0, -198.2], [-115.8, -188.3], [-125.9, -171.0],
      [-136.2, -147.6], [-141.7, -129.9], [-147.7, -109.6], [-151.8, -95.1], [-154.8, -80.6], [-157.2, -66.0],
      [-159.8, -44.5], [-160.4, -31.9], [-161.1, -17.0],
    ],
  }
];

// ===================== VARIABLES GLOBALES =====================
let scene, camera, renderer;
let worldGroup;
let playerCar, aiCars = [];
let trackPoints = [];
let trackCurve;
let trackCurvature = [];
let currentCircuitIndex = 0;

// Start menu: championship or single quick race
let gameMode = 'championship';
let quickCircuitIndex = 0;
let quickRaceMode = false;

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
let countdownToken = 0;
let renderLoopStarted = false;
let raceStarted = false;
let raceTimer = 0;
let lastTime = 0;
let currentDt = 0;
let audioCtx = null;
let isMuted = false;
let engineOsc = null, engineGain = null, engineFilter = null;
let ambientLight = null;
let weatherGroup = null;
let currentWeather = 'dry';
let selectedWeather = 'dry';
let championshipWeather = [];
let rainGroup = null, rainGeometry = null, rainPositions = null, rainDropCount = 0;
let engineOsc2 = null, engineOsc3 = null, engineTurboOsc = null, engineNoiseSource = null;
let engineTurboGain = null, engineNoiseGain = null, engineNoiseFilter = null, engineCompressor = null;

// Sequential gearbox + engine revs (1..8, 0 = neutral, -1 = reverse)
let currentGear = 0;
let gearRpm = 0.2;
let gearShiftCut = 0;
let gearShiftCooldown = 0;
const GEAR_TOP_KMH = [90, 130, 170, 208, 244, 278, 312, 350];

let skidSource = null, skidFilter = null, skidGain = null;
let rainSource = null, rainFilter = null, rainGain = null;
let skidIntensity = 0;
let skidMarkGroup, skidMarkPool = [], skidMarkIndex = 0;
let flagArmGroup = null, flagPivot = null, flagPersonGroup = null;
let stadiumFlags = [];
let mirrorCamera;
let sunLight;
let carShadowTexture;
let selectedColor = CAR_COLORS[0].value;
let cameraSpeedFactor = 0;

// Gamepad state
let gamepadInput = { connected: false, throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
let gamepadPrev = { pause: false, mute: false };
let gamepadNoticeTimer = null;
let gamepadNoticeHideTimer = null;

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

// Wrong-way warning
let wrongWayActive = false;
let wrongWayTimer = 0;
let wrongWayGrace = 0;
const WRONG_WAY_TIME = 3.0;   // seconds to turn around before being respawned
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
  ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(100, 150, 100);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 500;
  // Tight shadow frustum around the player so the car's shadow is crisp and
  // actually touches the ground (a huge frustum makes it blur away, which
  // makes the car look like it is floating).
  dirLight.shadow.camera.left = -70;
  dirLight.shadow.camera.right = 70;
  dirLight.shadow.camera.top = 70;
  dirLight.shadow.camera.bottom = -70;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.camera.updateProjectionMatrix();
  scene.add(dirLight);
  scene.add(dirLight.target);
  sunLight = dirLight;

  // All track/scenery objects go in this group so a circuit can be rebuilt
  worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Rain, stars and night floodlights live here and are rebuilt per weather
  weatherGroup = new THREE.Group();
  scene.add(weatherGroup);

  initSkidMarks();

  // Cars and championship drivers
  createDriversAndCars();

  // Setup audio
  setupAudio();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onWindowBlur);

  // The world is built and the render loop started by startRace(), once the
  // player has chosen a mode and a circuit.
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
  stadiumFlags = [];

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
      applyColorToPlayer(c.value);
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

  if (audioCtx.state === 'suspended') audioCtx.resume();

  // Master chain with a compressor so all the layers stay clean
  engineGain = audioCtx.createGain();
  engineGain.gain.value = 0;

  engineCompressor = audioCtx.createDynamicsCompressor();
  engineCompressor.threshold.value = -18;
  engineCompressor.knee.value = 24;
  engineCompressor.ratio.value = 6;
  engineCompressor.attack.value = 0.003;
  engineCompressor.release.value = 0.18;

  engineFilter = audioCtx.createBiquadFilter();
  engineFilter.type = 'lowpass';
  engineFilter.frequency.value = 900;
  engineFilter.Q.value = 2.4;

  // Main firing note + hard harmonic
  engineOsc = audioCtx.createOscillator();
  engineOsc.type = 'sawtooth';
  engineOsc.frequency.value = 90;
  const osc1Gain = audioCtx.createGain();
  osc1Gain.gain.value = 0.55;
  engineOsc.connect(osc1Gain);
  osc1Gain.connect(engineFilter);

  engineOsc2 = audioCtx.createOscillator();
  engineOsc2.type = 'sawtooth';
  engineOsc2.frequency.value = 135;
  engineOsc2.detune.value = 6;
  const osc2Gain = audioCtx.createGain();
  osc2Gain.gain.value = 0.16;
  engineOsc2.connect(osc2Gain);
  osc2Gain.connect(engineFilter);

  engineFilter.connect(engineGain);

  // Low rumble
  engineOsc3 = audioCtx.createOscillator();
  engineOsc3.type = 'triangle';
  engineOsc3.frequency.value = 45;
  const osc3Gain = audioCtx.createGain();
  osc3Gain.gain.value = 0.3;
  engineOsc3.connect(osc3Gain);
  osc3Gain.connect(engineGain);

  // Turbo / MGU-K whine
  engineTurboOsc = audioCtx.createOscillator();
  engineTurboOsc.type = 'sine';
  engineTurboOsc.frequency.value = 2200;
  engineTurboGain = audioCtx.createGain();
  engineTurboGain.gain.value = 0;
  engineTurboOsc.connect(engineTurboGain);
  engineTurboGain.connect(engineGain);

  // Intake / air noise
  const noiseBuffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 1.5), audioCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;

  engineNoiseSource = audioCtx.createBufferSource();
  engineNoiseSource.buffer = noiseBuffer;
  engineNoiseSource.loop = true;

  engineNoiseFilter = audioCtx.createBiquadFilter();
  engineNoiseFilter.type = 'bandpass';
  engineNoiseFilter.frequency.value = 1100;
  engineNoiseFilter.Q.value = 0.7;

  engineNoiseGain = audioCtx.createGain();
  engineNoiseGain.gain.value = 0;

  engineNoiseSource.connect(engineNoiseFilter);
  engineNoiseFilter.connect(engineNoiseGain);
  engineNoiseGain.connect(engineGain);

  engineGain.connect(engineCompressor);
  engineCompressor.connect(audioCtx.destination);

  engineOsc.start();
  engineOsc2.start();
  engineOsc3.start();
  engineTurboOsc.start();
  engineNoiseSource.start();

  engineGain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.12);
}

function updateEngineSound() {
  if (!engineOsc || !audioCtx || isMuted) return;

  const now = audioCtx.currentTime;
  const throttle = (keys['arrowup'] || keys['w']) ? 1 : gamepadInput.throttle;
  const rpm = Math.max(0, Math.min(1, gearRpm));

  // Warm, high-revving note: fundamental + a fifth above + a low rumble.
  // The throttle only opens the filter a little, so the pitch stays stable
  // and does not "warble" when the pedal is modulated.
  const base = 72 + rpm * 210;

  engineOsc.frequency.setTargetAtTime(base, now, 0.06);
  engineOsc2.frequency.setTargetAtTime(base * 1.5, now, 0.06);
  engineOsc3.frequency.setTargetAtTime(base * 0.5, now, 0.07);

  engineFilter.frequency.setTargetAtTime(420 + rpm * 1500 + throttle * 250, now, 0.06);
  engineFilter.Q.setTargetAtTime(1.4 + rpm * 0.8, now, 0.1);

  engineTurboOsc.frequency.setTargetAtTime(1300 + rpm * 1700, now, 0.08);
  engineTurboGain.gain.setTargetAtTime((0.01 + rpm * rpm * 0.09) * (0.35 + throttle * 0.65), now, 0.1);

  engineNoiseFilter.frequency.setTargetAtTime(700 + rpm * 1300, now, 0.1);
  engineNoiseGain.gain.setTargetAtTime(0.02 + rpm * 0.05, now, 0.1);

  const speedFactor = Math.min(Math.abs(playerSpeed) / MAX_SPEED, 1);
  let volume = 0.036 + speedFactor * 0.014 + rpm * 0.006;
  // Taper the very top end: the redline should feel fast, not piercing.
  volume *= 1 - 0.35 * Math.max(0, (rpm - 0.85) / 0.15);
  if (gearShiftCut > 0) volume *= 0.35;
  engineGain.gain.setTargetAtTime(volume, now, 0.04);
}

// Mechanical "clack" of the sequential gearbox
function playShiftClack(up) {
  if (!audioCtx || isMuted) return;

  const now = audioCtx.currentTime;
  const duration = 0.085;
  const buffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * duration), audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const env = Math.pow(1 - i / data.length, 3);
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const src = audioCtx.createBufferSource();
  src.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = up ? 2400 : 1500;
  filter.Q.value = 1.2;

  const gain = audioCtx.createGain();
  gain.gain.value = up ? 0.055 : 0.045;

  src.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  src.start(now);
  src.stop(now + duration);
}

function stopEngineSound() {
  if (!engineOsc) return;

  const oscs = [engineOsc, engineOsc2, engineOsc3, engineTurboOsc];
  const sources = [engineNoiseSource];
  const nodes = [engineFilter, engineTurboGain, engineNoiseFilter, engineNoiseGain, engineGain, engineCompressor];
  const gain = engineGain;

  engineOsc = null;
  engineOsc2 = null;
  engineOsc3 = null;
  engineTurboOsc = null;
  engineNoiseSource = null;
  engineFilter = null;
  engineTurboGain = null;
  engineNoiseFilter = null;
  engineNoiseGain = null;
  engineGain = null;
  engineCompressor = null;

  if (!audioCtx || !gain) return;

  gain.gain.cancelScheduledValues(audioCtx.currentTime);
  gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);

  setTimeout(() => {
    oscs.forEach(o => {
      if (!o) return;
      try { o.stop(); } catch (e) {}
      try { o.disconnect(); } catch (e) {}
    });
    sources.forEach(s => {
      if (!s) return;
      try { s.stop(); } catch (e) {}
      try { s.disconnect(); } catch (e) {}
    });
    nodes.forEach(n => {
      if (!n) return;
      try { n.disconnect(); } catch (e) {}
    });
  }, 220);
}

// ===================== CAJA DE CAMBIOS =====================
function triggerGearShift(up) {
  gearShiftCut = 0.06;
  gearShiftCooldown = 0.12;
  playShiftClack(up);
}

function setGearDisplay() {
  const el = document.getElementById('gearDisplay');
  if (!el) return;
  el.textContent = currentGear < 0 ? 'R' : (currentGear === 0 ? 'N' : String(currentGear));
}

function updateShiftLights() {
  const holder = document.getElementById('shiftLights');
  if (!holder) return;

  if (holder.children.length === 0) {
    for (let i = 0; i < 8; i++) {
      const led = document.createElement('span');
      led.className = 'shiftLed';
      holder.appendChild(led);
    }
  }

  const rev = currentGear > 0 ? Math.max(0, (gearRpm - 0.5) / 0.5) : 0;
  const lit = Math.round(rev * 8);
  const redline = currentGear > 0 && rev > 0.95 && Math.floor(performance.now() / 90) % 2 === 0;

  for (let i = 0; i < 8; i++) {
    const led = holder.children[i];
    let cls = 'shiftLed';
    if (i < lit || (redline && i >= 6)) {
      cls += i < 4 ? ' green' : (i < 6 ? ' amber' : ' red');
    }
    led.className = cls;
  }
}

function updateGearbox(dt) {
  if (isPaused || isFinished) return;

  // While the lights are still red the car is stationary: keep the engine
  // idling instead of freezing the synth at its initial values.
  if (!raceStarted) {
    updateEngineSound();
    return;
  }

  if (gearShiftCut > 0) gearShiftCut = Math.max(0, gearShiftCut - dt);
  if (gearShiftCooldown > 0) gearShiftCooldown -= dt;

  const speedKmh = Math.abs(playerSpeed) * SPEED_DISPLAY_FACTOR;
  let gear = currentGear;

  if (playerSpeed < -0.5) {
    gear = -1;
  } else if (playerSpeed < 0.8) {
    gear = 0;
  } else {
    if (gear < 1) gear = 1;
    if (gear > GEAR_TOP_KMH.length) gear = GEAR_TOP_KMH.length;

    if (gearShiftCooldown <= 0) {
      if (gear < GEAR_TOP_KMH.length && speedKmh >= GEAR_TOP_KMH[gear - 1] - 0.5) {
        gear++;
        triggerGearShift(true);
      } else if (gear > 1 && speedKmh < GEAR_TOP_KMH[gear - 2] * 0.93) {
        gear--;
        triggerGearShift(false);
      }
    }
  }

  currentGear = gear;

  if (currentGear > 0) {
    const lo = currentGear === 1 ? 0 : GEAR_TOP_KMH[currentGear - 2];
    const hi = GEAR_TOP_KMH[currentGear - 1];
    const fraction = Math.min(1, Math.max(0, (speedKmh - lo) / Math.max(1, hi - lo)));
    gearRpm = 0.5 + 0.5 * fraction;
  } else {
    gearRpm = 0.2;
  }

  setGearDisplay();
  updateShiftLights();
  updateEngineSound();
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

  if (CIRCUITS[currentCircuitIndex] && CIRCUITS[currentCircuitIndex].flatTrack) {
    // Tight street circuits are drawn as a flat painted surface: a wide 3D
    // ribbon folds over itself on very sharp corners and makes the curbs
    // cross each other. A canvas texture keeps the markings continuous.
    generateFlatTrack();
  } else {
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.receiveShadow = true;
    road.userData.isRoad = true;
    road.userData.baseRoughness = roadMat.roughness;
    road.userData.baseMetalness = roadMat.metalness;
    worldGroup.add(road);

    // Generate curbs (bordillos)
    generateCurbs(segments);
  }

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

function generateFlatTrack() {
  const sampleCount = 1200;
  const points = [];
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < sampleCount; i++) {
    const p = trackCurve.getPointAt(i / sampleCount);
    points.push(p);
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  }

  const margin = 30;
  const span = Math.max(maxX - minX, maxZ - minZ) + margin * 2;
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const size = 2048;
  const scale = size / span;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const toX = x => (x - (centerX - span / 2)) * scale;
  const toY = z => (z - (centerZ - span / 2)) * scale;

  const path = new Path2D();
  points.forEach((p, i) => {
    const x = toX(p.x);
    const y = toY(p.z);
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  });
  path.closePath();

  ctx.lineJoin = 'round';
  // Butt caps keep the white dashes from spilling over the red gaps
  ctx.lineCap = 'butt';

  const roadWidth = TRACK_WIDTH * scale;
  const curbWidth = 4 * scale;

  // Red outer band, then white dashes, then the asphalt on top. The asphalt
  // covers the middle, leaving a continuous red/white curb on both edges.
  ctx.lineWidth = roadWidth + curbWidth * 2;
  ctx.setLineDash([]);
  ctx.strokeStyle = '#e10600';
  ctx.stroke(path);

  ctx.strokeStyle = '#f2f2f2';
  ctx.setLineDash([30, 30]);
  ctx.stroke(path);

  ctx.setLineDash([]);
  ctx.lineWidth = roadWidth;
  ctx.strokeStyle = '#3b3b3b';
  ctx.stroke(path);

  // Centre line
  ctx.lineWidth = Math.max(1.5, 0.25 * scale);
  ctx.strokeStyle = '#dddddd';
  ctx.setLineDash([10, 16]);
  ctx.stroke(path);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: false,
    alphaTest: 0.25,
    depthWrite: true,
    roughness: 0.9,
    metalness: 0.05,
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(span, span), material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(centerX, 0.048, centerZ);
  plane.receiveShadow = true;
  plane.userData.isRoad = true;
  plane.userData.baseRoughness = material.roughness;
  plane.userData.baseMetalness = material.metalness;
  worldGroup.add(plane);
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

  // Snow-capped mountains around the mountain circuit
  if (CIRCUITS[currentCircuitIndex] && CIRCUITS[currentCircuitIndex].mountains) {
    generateMountains();
  }

  // Grandstands, crowd, flags and start gantry around the start/finish line
  generateStartArea();
}

function generateMountains() {
  const rockMats = [
    new THREE.MeshStandardMaterial({ color: 0x5f6b73, roughness: 1, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x6f6253, roughness: 1, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x556b56, roughness: 1, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x7a7f86, roughness: 1, flatShading: true }),
  ];
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xf3f7ff, roughness: 0.75, flatShading: true });

  let cx = 0;
  let cz = 0;
  trackPoints.forEach(p => { cx += p.x; cz += p.z; });
  cx /= trackPoints.length;
  cz /= trackPoints.length;

  const placed = [];

  function addPeak(angle, distance, radius, height, segments) {
    const x = cx + Math.cos(angle) * distance;
    const z = cz + Math.sin(angle) * distance;

    if (getTrackPosition(x, z).dist < 115) return false;
    for (const p of placed) {
      if (Math.hypot(p.x - x, p.z - z) < radius + p.radius + 12) return false;
    }

    const rock = new THREE.Mesh(
      new THREE.ConeGeometry(radius, height, segments, 1),
      rockMats[Math.floor(Math.random() * rockMats.length)]
    );
    rock.position.set(x, height / 2 - 4, z);
    rock.rotation.y = Math.random() * Math.PI * 2;
    rock.castShadow = true;
    rock.receiveShadow = true;
    worldGroup.add(rock);

    // Snow cap aligned with the upper part of the cone
    if (height > 95) {
      const capHeight = height * (0.24 + Math.random() * 0.1);
      const capRadius = radius * (capHeight / height) * 1.03;
      const cap = new THREE.Mesh(
        new THREE.ConeGeometry(capRadius, capHeight, segments, 1),
        snowMat
      );
      cap.position.set(x, height - 4 - capHeight / 2, z);
      cap.rotation.y = rock.rotation.y;
      cap.castShadow = true;
      worldGroup.add(cap);
    }

    placed.push({ x, z, radius });
    return true;
  }

  // Main ring of peaks, then a few smaller foothills between them
  for (let i = 0; i < 22; i++) {
    const angle = (i / 22) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
    const distance = 370 + Math.random() * 210;
    const radius = 42 + Math.random() * 55;
    const height = 85 + Math.random() * 115;
    addPeak(angle, distance, radius, height, 5 + Math.floor(Math.random() * 4));
  }

  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 330 + Math.random() * 260;
    const radius = 24 + Math.random() * 34;
    const height = 45 + Math.random() * 55;
    addPeak(angle, distance, radius, height, 5 + Math.floor(Math.random() * 3));
  }
}

// ===================== ZONA DE LARGADA =====================
function makeCanvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function makeStadiumFlagTextures() {
  const defs = [
    { kind: 'checker' },
    { bg: '#d32f2f', fg: '#ffffff', text: 'F1' },
    { bg: '#1565c0', fg: '#ffffff', text: '' },
    { bg: '#f9a825', fg: '#111111', text: 'F1' },
    { bg: '#2e7d32', fg: '#ffffff', text: '' },
    { bg: '#eeeeee', fg: '#c62828', text: 'F1' },
    { bg: '#6a1b9a', fg: '#ffffff', text: '' },
    { bg: '#ef6c00', fg: '#ffffff', text: '' },
  ];

  return defs.map(d =>
    makeCanvasTexture(160, 96, (ctx, w, h) => {
      if (d.kind === 'checker') {
        const s = 16;
        for (let y = 0; y < h; y += s) {
          for (let x = 0; x < w; x += s) {
            ctx.fillStyle = ((x / s + y / s) % 2 === 0) ? '#ffffff' : '#111111';
            ctx.fillRect(x, y, s, s);
          }
        }
        return;
      }
      ctx.fillStyle = d.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h * 0.32);
      ctx.lineTo(0, h * 1.08);
      ctx.closePath();
      ctx.fill();
      if (d.text) {
        ctx.fillStyle = d.fg;
        ctx.font = 'bold 52px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.text, w / 2, h / 2 + 2);
      }
    })
  );
}

function makeStartBannerTexture(circuitName) {
  return makeCanvasTexture(1024, 128, (ctx, w, h) => {
    ctx.fillStyle = '#0b1a2b';
    ctx.fillRect(0, 0, w, h);

    // Checkered ends
    const s = 16;
    for (let y = 0; y < h; y += s) {
      for (let x = 0; x < 5 * s; x += s) {
        ctx.fillStyle = ((x / s + y / s) % 2 === 0) ? '#ffffff' : '#111111';
        ctx.fillRect(x, y, s, s);
        ctx.fillRect(w - 5 * s + x, y, s, s);
      }
    }

    ctx.fillStyle = '#e53935';
    ctx.fillRect(5 * s, 0, w - 10 * s, 5);
    ctx.fillRect(5 * s, h - 5, w - 10 * s, 5);

    const name = (circuitName || 'GRAND PRIX').toUpperCase();
    let size = 56;
    ctx.font = `bold ${size}px Arial`;
    while (ctx.measureText(name).width > w - 240 && size > 24) {
      size -= 2;
      ctx.font = `bold ${size}px Arial`;
    }
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, w / 2, h / 2 - 12);

    ctx.fillStyle = '#ffd54f';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('START · FINISH', w / 2, h / 2 + 33);
  });
}

function makeAdTextures() {
  const defs = [
    { bg: '#c62828', fg: '#ffffff', text: 'F1' },
    { bg: '#0d47a1', fg: '#ffffff', text: 'GRAND PRIX' },
    { bg: '#f9a825', fg: '#111111', text: 'TURBO' },
    { bg: '#111111', fg: '#ffffff', text: 'START · FINISH' },
  ];
  return defs.map(d =>
    makeCanvasTexture(512, 128, (ctx, w, h) => {
      ctx.fillStyle = d.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.fillStyle = d.fg;
      let size = 58;
      ctx.font = `bold ${size}px Arial`;
      while (ctx.measureText(d.text).width > w - 50 && size > 22) {
        size -= 2;
        ctx.font = `bold ${size}px Arial`;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.text, w / 2, h / 2 + 2);
    })
  );
}

function generateStartArea() {
  const startPoint = trackCurve.getPointAt(0);
  const startTangent = trackCurve.getTangentAt(0);
  const trackLength = trackCurve.getLength();

  // ---------- Start/finish line ----------
  const sfGeo = new THREE.PlaneGeometry(TRACK_WIDTH, 3);
  const sfTex = makeCanvasTexture(128, 32, (ctx) => {
    for (let x = 0; x < 128; x += 16) {
      for (let y = 0; y < 32; y += 16) {
        ctx.fillStyle = ((x / 16 + y / 16) % 2 === 0) ? '#fff' : '#000';
        ctx.fillRect(x, y, 16, 16);
      }
    }
  });
  const sfMat = new THREE.MeshStandardMaterial({ map: sfTex });
  const sf = new THREE.Mesh(sfGeo, sfMat);
  sf.rotation.x = -Math.PI / 2;
  sf.position.copy(startPoint);
  sf.position.y = 0.07;
  sf.rotation.z = Math.atan2(startTangent.x, startTangent.z);
  worldGroup.add(sf);

  // ---------- Grandstands ----------
  // The stand is built in bays that follow the track, so it adapts to the
  // curvature of every circuit instead of clipping into the road.
  const bays = 8;
  const bayLength = 7;
  const rows = 7;
  const tierDepth = 1.45;
  const tierBase = 1.35;
  const tierRise = 0.72;
  const frontLateral = TRACK_WIDTH / 2 + 4.2;
  const startDistance = -42; // metres behind the finish line

  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a4, roughness: 0.92, metalness: 0.03, side: THREE.DoubleSide });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x565c61, roughness: 0.75, metalness: 0.15 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x7f858a, roughness: 0.9 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x474d52, roughness: 0.55, metalness: 0.55 });
  const fenceMat = new THREE.MeshStandardMaterial({
    color: 0xc7ced2, roughness: 0.6, metalness: 0.2,
    transparent: true, opacity: 0.28, depthWrite: false,
  });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
  const crowdBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
  const crowdHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.78 });
  const fasciaMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 });
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xfff1c1, emissiveIntensity: 0.85, roughness: 0.4,
  });

  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const unitSphere = new THREE.SphereGeometry(1, 6, 5);

  const seatInstances = [];
  const bodyInstances = [];
  const headInstances = [];
  const roofInstances = [];
  const wallInstances = [];
  const columnInstances = [];
  const fasciaInstances = [];
  const postInstances = [];
  const railInstances = [];
  const fenceInstances = [];

  const seatColors = [0xc62828, 0xf5f5f5, 0x1565c0, 0xf5f5f5, 0xf9a825, 0xf5f5f5, 0x2e7d32];
  const fasciaColors = [0xc62828, 0xf5f5f5, 0x1565c0, 0xf9a825, 0xf5f5f5, 0x2e7d32, 0xc62828, 0x1565c0];
  const bodyColors = [
    0xd32f2f, 0xc62828, 0x1565c0, 0x1e88e5, 0xf9a825, 0xfdd835,
    0xf5f5f5, 0xeeeeee, 0x2e7d32, 0x43a047, 0xff6d00, 0x6a1b9a,
    0x00acc1, 0x212121, 0xec407a, 0x8d6e63,
  ];
  const headColors = [0xffdbac, 0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524, 0xd8a37a];

  const flagTextures = makeStadiumFlagTextures();
  const adTextures = makeAdTextures();
  const adMaterials = adTextures.map(tex => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }));

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  for (let side = -1; side <= 1; side += 2) {
    for (let b = 0; b < bays; b++) {
      const dist = startDistance + (b + 0.5) * bayLength;
      const t = ((dist / trackLength) % 1 + 1) % 1;
      const point = trackCurve.getPointAt(t);
      const tangent = trackCurve.getTangentAt(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Local +X points away from the track and local -X towards it.
      const yaw = Math.atan2(tangent.x, tangent.z) + (side === 1 ? Math.PI : 0);
      const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
      const origin = point.clone().add(normal.multiplyScalar(side * frontLateral));

      const worldPos = (lx, ly, lz) => {
        const p = new THREE.Vector3(lx, 0, lz).applyQuaternion(quat).add(origin);
        p.y = ly;
        return p;
      };
      const instanceMatrix = (lx, ly, lz, sx, sy, sz) =>
        new THREE.Matrix4().compose(worldPos(lx, ly, lz), quat, new THREE.Vector3(sx, sy, sz));

      // --- Stepped concrete tiers ---
      for (let r = 0; r < rows; r++) {
        const topY = tierBase + r * tierRise;
        const seatX = 1.7 + r * tierDepth + 0.42;
        // Coloured bench running the full length of the bay
        seatInstances.push({
          matrix: instanceMatrix(seatX, topY + 0.06, 0, 0.62, 0.12, bayLength - 0.9),
          color: seatColors[r % seatColors.length],
        });

        // Seated crowd with some empty seats
        for (let z = -bayLength / 2 + 0.55; z <= bayLength / 2 - 0.55; z += 0.78) {
          if (Math.random() < 0.13) continue;
          const pz = z + (Math.random() - 0.5) * 0.14;
          const px = seatX + (Math.random() - 0.5) * 0.12;
          const py = topY + 0.13;

          bodyInstances.push({
            matrix: instanceMatrix(px, py + 0.27, pz, 0.34, 0.55, 0.28),
            color: pick(bodyColors),
          });
          headInstances.push({
            matrix: instanceMatrix(px, py + 0.55 + 0.105, pz, 0.115, 0.115, 0.115),
            color: pick(headColors),
          });
        }
      }

      // --- Roof, back wall and supports ---
      roofInstances.push({ matrix: instanceMatrix(6.4, 7.55 + b * 0.004, 0, 11.4, 0.3, bayLength + 2.6) });
      wallInstances.push({ matrix: instanceMatrix(12.0, 3.75, 0, 0.35, 7.5, bayLength + 0.8) });
      columnInstances.push({ matrix: instanceMatrix(12.25, 3.75, -bayLength / 2 + 0.7, 0.3, 7.5, 0.3) });
      columnInstances.push({ matrix: instanceMatrix(12.25, 3.75, bayLength / 2 - 0.7, 0.3, 7.5, 0.3) });

      // --- Coloured fascia on the roof edge ---
      fasciaInstances.push({
        matrix: instanceMatrix(0.72 + b * 0.003, 7.32, 0, 0.2, 0.55, bayLength + 1.2),
        color: fasciaColors[(b + (side === 1 ? 4 : 0)) % fasciaColors.length],
      });

      // --- Pit-lane style fence in front of the stand ---
      for (let p = 0; p < 3; p++) {
        const fz = -bayLength / 2 + 0.4 + p * (bayLength - 0.8) / 2;
        postInstances.push({ matrix: instanceMatrix(0.4, 0.95, fz, 0.08, 1.9, 0.08) });
      }
      railInstances.push({ matrix: instanceMatrix(0.4, 0.78, 0, 0.07, 0.07, bayLength - 0.1) });
      railInstances.push({ matrix: instanceMatrix(0.4, 1.58, 0, 0.07, 0.07, bayLength - 0.1) });
      fenceInstances.push({ matrix: instanceMatrix(0.4, 0.9, 0, 0.02, 1.72, bayLength - 0.2) });

      // --- Bay group for non-instanced details (boards, flags, masts) ---
      const bayGroup = new THREE.Group();
      bayGroup.position.copy(origin);
      bayGroup.rotation.y = yaw;
      worldGroup.add(bayGroup);

      // Advertising board facing the track
      const ad = new THREE.Mesh(
        new THREE.PlaneGeometry(bayLength - 0.7, 0.95),
        adMaterials[(b + (side === 1 ? 2 : 0)) % adMaterials.length]
      );
      ad.position.set(0.46, 0.95, 0);
      ad.rotation.y = -Math.PI / 2;
      bayGroup.add(ad);

      // Flag on the roof
      const flagZ = (b % 2 === 0 ? -1.7 : 1.7);
      const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.5, 5), steelMat);
      flagPole.position.set(1.15, 8.8, flagZ);
      bayGroup.add(flagPole);

      const pivot = new THREE.Group();
      pivot.position.set(1.15, 9.9, flagZ);
      bayGroup.add(pivot);
      const flagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.9),
        new THREE.MeshBasicMaterial({ map: flagTextures[(b + side + 8) % flagTextures.length], side: THREE.DoubleSide })
      );
      flagMesh.position.x = 0.75;
      pivot.add(flagMesh);
      stadiumFlags.push({
        pivot,
        phase: Math.random() * Math.PI * 2,
        speed: 2.1 + Math.random() * 1.6,
      });

      // Floodlight mast at each end of the grandstand
      if (b === 0 || b === bays - 1) {
        const mz = b === 0 ? -bayLength / 2 - 1.0 : bayLength / 2 + 1.0;
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 12.5, 8), steelMat);
        mast.position.set(12.8, 6.25, mz);
        mast.castShadow = true;
        bayGroup.add(mast);

        const head = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.7), steelMat);
        head.position.set(12.8, 12.5, mz);
        bayGroup.add(head);

        for (let li = 0; li < 4; li++) {
          const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.1), lampMat);
          lamp.position.set(12.8 + (li % 2 === 0 ? -0.62 : 0.62), 12.4, mz + (li < 2 ? -0.28 : 0.28));
          bayGroup.add(lamp);
        }
      }
    }
  }

  // The concrete steps are built as continuous curved ribbons (instead of one
  // box per bay) so the sections never show gaps on the outside of a bend.
  const stepSamples = [];
  {
    const steps = 56;
    const spanStart = startDistance;
    const spanLength = bays * bayLength;
    for (let i = 0; i <= steps; i++) {
      const t = (((spanStart + spanLength * (i / steps)) / trackLength) % 1 + 1) % 1;
      const p = trackCurve.getPointAt(t);
      const tan = trackCurve.getTangentAt(t);
      const n = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      stepSamples.push({ p, n });
    }
  }

  for (let side = -1; side <= 1; side += 2) {
    const verts = [];
    const uvs = [];
    const indices = [];
    const steps = stepSamples.length - 1;

    for (let r = 0; r < rows; r++) {
      const topY = tierBase + r * tierRise;
      const frontOffset = frontLateral + 1.7 + r * tierDepth;
      const backOffset = frontOffset + tierDepth;
      const riserBottom = r === 0 ? 0 : topY - tierRise;

      // Horizontal tread
      let base = verts.length / 3;
      for (let i = 0; i <= steps; i++) {
        const { p, n } = stepSamples[i];
        const fx = p.x + n.x * side * frontOffset;
        const fz = p.z + n.z * side * frontOffset;
        const bx = p.x + n.x * side * backOffset;
        const bz = p.z + n.z * side * backOffset;
        verts.push(fx, topY, fz, bx, topY, bz);
        uvs.push(0, i / steps, 1, i / steps);
      }
      for (let i = 0; i < steps; i++) {
        const b = base + i * 2;
        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }

      // Vertical riser facing the track
      base = verts.length / 3;
      for (let i = 0; i <= steps; i++) {
        const { p, n } = stepSamples[i];
        const fx = p.x + n.x * side * frontOffset;
        const fz = p.z + n.z * side * frontOffset;
        verts.push(fx, riserBottom, fz, fx, topY, fz);
        uvs.push(0, i / steps, 1, i / steps);
      }
      for (let i = 0; i < steps; i++) {
        const b = base + i * 2;
        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const tiers = new THREE.Mesh(geo, concreteMat);
    tiers.castShadow = true;
    tiers.receiveShadow = true;
    worldGroup.add(tiers);
  }

  // Pack the repeated geometry into a handful of instanced meshes
  function buildInstanced(geometry, material, instances, castShadow) {
    const mesh = new THREE.InstancedMesh(geometry, material, instances.length);
    const color = new THREE.Color();
    for (let i = 0; i < instances.length; i++) {
      mesh.setMatrixAt(i, instances[i].matrix);
      if (instances[i].color !== undefined) {
        color.setHex(instances[i].color);
        mesh.setColorAt(i, color);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = !!castShadow;
    mesh.receiveShadow = !!castShadow;
    worldGroup.add(mesh);
    return mesh;
  }

  buildInstanced(unitBox, seatMat, seatInstances, false);
  buildInstanced(unitBox, crowdBodyMat, bodyInstances, false);
  buildInstanced(unitSphere, crowdHeadMat, headInstances, false);
  buildInstanced(unitBox, roofMat, roofInstances, true);
  buildInstanced(unitBox, wallMat, wallInstances, true);
  buildInstanced(unitBox, steelMat, columnInstances, false);
  buildInstanced(unitBox, fasciaMat, fasciaInstances, false);
  buildInstanced(unitBox, steelMat, postInstances, false);
  buildInstanced(unitBox, steelMat, railInstances, false);
  buildInstanced(unitBox, fenceMat, fenceInstances, false);

  // Continuous soffit under the roof panels: the bays follow the curvature of
  // the track, so without it the seams between sections can show sky.
  for (let side = -1; side <= 1; side += 2) {
    const soffitGeo = new THREE.BufferGeometry();
    const verts = [];
    const uvs = [];
    const indices = [];
    const steps = 48;
    const spanStart = startDistance - 1.3;
    const spanLength = bays * bayLength + 2.6;

    for (let i = 0; i <= steps; i++) {
      const t = (((spanStart + spanLength * (i / steps)) / trackLength) % 1 + 1) % 1;
      const p = trackCurve.getPointAt(t);
      const tan = trackCurve.getTangentAt(t);
      const n = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      const inner = p.clone().add(n.clone().multiplyScalar(side * (frontLateral + 0.75)));
      const outer = p.clone().add(n.clone().multiplyScalar(side * (frontLateral + 12.15)));
      verts.push(inner.x, 7.38, inner.z, outer.x, 7.38, outer.z);
      uvs.push(0, i / steps, 1, i / steps);
      if (i < steps) {
        const b = i * 2;
        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }

    soffitGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    soffitGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    soffitGeo.setIndex(indices);
    soffitGeo.computeVertexNormals();
    const soffit = new THREE.Mesh(soffitGeo, new THREE.MeshStandardMaterial({
      color: 0x484e53, roughness: 0.85, metalness: 0.1, side: THREE.DoubleSide,
    }));
    soffit.receiveShadow = true;
    worldGroup.add(soffit);
  }

  // ---------- Start gantry with the five lights ----------
  const gantry = new THREE.Group();
  gantry.position.copy(startPoint);
  gantry.rotation.y = Math.atan2(startTangent.x, startTangent.z);
  worldGroup.add(gantry);

  const gantryMat = new THREE.MeshStandardMaterial({ color: 0x343a40, metalness: 0.55, roughness: 0.45 });
  [-1, 1].forEach(s => {
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8.4, 0.5), gantryMat);
    pole.position.set(s * (TRACK_WIDTH / 2 + 2.4), 4.2, 0);
    pole.castShadow = true;
    gantry.add(pole);
  });

  const beam = new THREE.Mesh(new THREE.BoxGeometry(TRACK_WIDTH + 5.2, 0.55, 0.75), gantryMat);
  beam.position.y = 8.1;
  beam.castShadow = true;
  gantry.add(beam);

  const bannerTex = makeStartBannerTexture(CIRCUITS[currentCircuitIndex].name);
  const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
  const bannerGeo = new THREE.PlaneGeometry(TRACK_WIDTH - 1.5, 1.3);
  for (let s = -1; s <= 1; s += 2) {
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 8.1, s * 0.4);
    banner.rotation.y = s === 1 ? 0 : Math.PI;
    gantry.add(banner);
  }

  const lightPanel = new THREE.Mesh(new THREE.BoxGeometry(TRACK_WIDTH - 3, 0.8, 0.3), gantryMat);
  lightPanel.position.set(0, 7.35, 0);
  gantry.add(lightPanel);

  const gantryQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, gantry.rotation.y, 0));
  for (let i = 0; i < 5; i++) {
    const lx = (i - 2) * 2.2;
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0x333333,
      emissiveIntensity: 0,
    });
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), lightMat);
    const lp = new THREE.Vector3(lx, 0, -0.28).applyQuaternion(gantryQuat).add(startPoint);
    light.position.set(lp.x, 7.35, lp.z);
    light.userData.isStartLight = true;
    light.userData.lightIndex = i;
    worldGroup.add(light);
  }

  // Person waving the checkered flag at the finish line
  generateFlagPerson();
}

function updateStadiumFlags() {
  if (stadiumFlags.length === 0) return;
  const time = performance.now() * 0.001;
  for (let i = 0; i < stadiumFlags.length; i++) {
    const f = stadiumFlags[i];
    f.pivot.rotation.y = Math.sin(time * f.speed + f.phase) * 0.4;
    f.pivot.rotation.z = Math.sin(time * f.speed * 1.6 + f.phase) * 0.09;
  }
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
    cloud.userData.isCloud = true;
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
  // On the flat Las Vegas layout the painted curb is 4 m wide per side, so
  // signs need to be further out to keep their boards off the track.
  const flatTrack = !!(CIRCUITS[currentCircuitIndex] && CIRCUITS[currentCircuitIndex].flatTrack);
  const paintedHalfWidth = TRACK_WIDTH / 2 + (flatTrack ? 4 : 2);
  // Board half-width (1.9 m) plus a small margin.
  const signLateral = paintedHalfWidth + 3;
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
    if (getTrackPosition(pos.x, pos.z).dist < paintedHalfWidth + 2.5) return;

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
    const lateral = (sideDot > 0 ? -1 : 1) * signLateral;

    const t100 = ((corner.startT - 100 / trackLength) % 1 + 1) % 1;
    const t50 = ((corner.startT - 50 / trackLength) % 1 + 1) % 1;

    addSign(t100, lateral, tex100);
    addSign(t50, lateral, tex50);
  });
}

// ===================== CREACIÓN DE AUTOS =====================
function getCarShadowTexture() {
  if (carShadowTexture) return carShadowTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.85)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.45)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  carShadowTexture = new THREE.CanvasTexture(canvas);
  return carShadowTexture;
}

function mergeMeshParts(parts) {
  const byMaterial = new Map();

  for (const part of parts) {
    if (!byMaterial.has(part.material)) byMaterial.set(part.material, []);
    byMaterial.get(part.material).push(part);
  }

  const group = new THREE.Group();

  byMaterial.forEach((list, material) => {
    const positions = [];
    const normals = [];
    const uvs = [];

    for (const mesh of list) {
      mesh.updateMatrix();
      const geo = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      geo.applyMatrix4(mesh.matrix);

      const pos = geo.attributes.position;
      const nor = geo.attributes.normal;
      const uv = geo.attributes.uv;

      for (let i = 0; i < pos.count; i++) {
        positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        if (nor) normals.push(nor.getX(i), nor.getY(i), nor.getZ(i));
        if (uv) uvs.push(uv.getX(i), uv.getY(i));
      }

      geo.dispose();
      mesh.geometry.dispose();
    }

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    if (normals.length === positions.length) {
      merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    } else {
      merged.computeVertexNormals();
    }
    if (uvs.length / 2 === positions.length / 3) {
      merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    }

    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  return group;
}

function createCar(color, isPlayer) {
  const carGroup = new THREE.Group();

  const accentColor = accentColorFor(color);

  // Materials (shared by every part of this car, so the merge below keeps the
  // whole model at a handful of draw calls)
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.65 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.5, metalness: 0.3 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x17181b, roughness: 0.85, metalness: 0.2 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xa9b1b8, roughness: 0.25, metalness: 0.9 });
  const helmetMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.35, metalness: 0.25 });
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x07080a, roughness: 0.08, metalness: 0.9 });
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xcfe3f2, roughness: 0.1, metalness: 1 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.95 });
  const sidewallMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.6 });

  const parts = [];
  const addBox = (w, h, d, x, y, z, mat, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parts.push(mesh);
    return mesh;
  };
  const addCylinder = (radiusTop, radiusBottom, height, segments, x, y, z, mat, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parts.push(mesh);
    return mesh;
  };
  const addSphere = (radius, x, y, z, mat, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 9), mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    parts.push(mesh);
    return mesh;
  };
  const addRod = (ax, ay, az, bx, by, bz, radius, mat) => {
    const a = new THREE.Vector3(ax, ay, az);
    const b = new THREE.Vector3(bx, by, bz);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 5), mat);
    mesh.position.copy(a).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    parts.push(mesh);
    return mesh;
  };

  // ---------- Floor, skirts and chassis ----------
  addBox(1.7, 0.12, 4.3, 0, 0.12, 0.1, darkMat);
  for (let x = -1; x <= 1; x += 2) {
    addBox(0.1, 0.2, 3.4, x * 0.87, 0.2, 0.1, darkMat);
  }

  // Monocoque + nose
  addBox(0.92, 0.42, 2.6, 0, 0.58, 0.7, bodyMat);
  addBox(0.54, 0.3, 1.6, 0, 0.5, 2.5, bodyMat);
  addBox(0.32, 0.2, 0.5, 0, 0.47, 3.3, bodyMat);

  // Sidepods with dark inlets
  for (let s = -1; s <= 1; s += 2) {
    addBox(0.52, 0.38, 1.8, s * 0.62, 0.5, -0.35, bodyMat);
    addBox(0.4, 0.18, 1.25, s * 0.6, 0.72, -0.45, bodyMat);
    addBox(0.46, 0.26, 0.1, s * 0.62, 0.55, 0.56, darkMat);
    // Barge board
    addBox(0.035, 0.3, 0.5, s * 0.5, 0.32, 1.25, darkMat);
  }

  // Engine cover and airbox
  addBox(0.5, 0.34, 1.5, 0, 0.8, -0.7, bodyMat);
  addBox(0.3, 0.22, 0.6, 0, 0.8, -1.6, bodyMat);
  addBox(0.22, 0.2, 0.45, 0, 0.6, -1.9, bodyMat);        // rear crash structure
  addBox(0.42, 0.3, 0.5, 0, 1.0, -0.25, darkMat);        // airbox
  addCylinder(0.12, 0.12, 0.08, 10, 0, 1.03, 0.02, darkMat, Math.PI / 2, 0, 0); // intake
  addBox(0.14, 0.07, 0.2, 0, 1.2, -0.22, darkMat);       // T-cam

  // Rear diffuser and strakes
  addBox(1.2, 0.14, 0.5, 0, 0.17, -2.0, darkMat);
  for (let x = -1; x <= 1; x += 1) {
    addBox(0.03, 0.14, 0.5, x * 0.4, 0.17, -2.0, darkMat);
  }
  addCylinder(0.06, 0.06, 0.2, 8, 0, 0.68, -2.2, metalMat, Math.PI / 2, 0, 0); // exhaust

  // ---------- Cockpit, driver and halo ----------
  addBox(0.74, 0.2, 0.95, 0, 0.86, 0.45, darkMat);

  // Driver
  addBox(0.34, 0.22, 0.3, 0, 0.96, 0.38, darkMat);
  addBox(0.5, 0.1, 0.2, 0, 1.04, 0.34, darkMat);
  addBox(0.16, 0.025, 0.05, 0, 1.0, 0.52, accentMat);
  for (let s = -1; s <= 1; s += 2) {
    addBox(0.1, 0.1, 0.34, s * 0.2, 0.99, 0.55, darkMat, -0.25, 0, 0);
    addBox(0.09, 0.09, 0.1, s * 0.14, 0.95, 0.73, darkMat);
  }

  // Helmet, visor and stripe
  addSphere(0.17, 0, 1.16, 0.44, helmetMat, 1, 1.05, 1.08);
  const visor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.188, 0.188, 0.1, 14, 1, true, -Math.PI * 0.42, Math.PI * 0.84),
    visorMat
  );
  visor.position.set(0, 1.155, 0.44);
  parts.push(visor);
  addBox(0.07, 0.025, 0.33, 0, 1.345, 0.44, bodyMat);

  // Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.035, 6, 20), darkMat);
  halo.position.set(0, 1.2, 0.42);
  halo.rotation.x = Math.PI / 2;
  parts.push(halo);
  addRod(0, 0.94, 0.86, 0, 1.2, 0.87, 0.035, darkMat);

  // Mirrors with reflective faces
  for (let s = -1; s <= 1; s += 2) {
    addBox(0.17, 0.1, 0.07, s * 0.62, 0.93, 0.62, darkMat);
    const mirror = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.07), mirrorMat);
    mirror.position.set(s * 0.62, 0.93, 0.583);
    mirror.rotation.y = Math.PI;
    parts.push(mirror);
    addRod(s * 0.38, 0.9, 0.55, s * 0.58, 0.93, 0.62, 0.025, darkMat);
  }

  // ---------- Front wing (contrasting colour to the body) ----------
  addBox(2.0, 0.045, 0.62, 0, 0.14, 3.18, accentMat);
  addBox(1.8, 0.04, 0.34, 0, 0.24, 3.02, accentMat, -0.12, 0, 0);
  for (let s = -1; s <= 1; s += 2) {
    addBox(0.055, 0.34, 0.66, s * 0.97, 0.24, 3.16, accentMat);
    addBox(0.05, 0.22, 0.16, s * 0.18, 0.3, 2.95, darkMat);
  }

  // ---------- Rear wing (contrasting colour to the body) ----------
  addBox(1.05, 0.05, 0.42, 0, 1.06, -2.1, accentMat);
  addBox(1.0, 0.04, 0.26, 0, 1.17, -2.13, accentMat, 0.25, 0, 0);
  addBox(0.85, 0.035, 0.18, 0, 0.62, -2.15, darkMat);
  for (let s = -1; s <= 1; s += 2) {
    addBox(0.05, 0.52, 0.6, s * 0.54, 1.02, -2.1, accentMat);
    addBox(0.06, 0.4, 0.08, s * 0.28, 0.82, -2.02, darkMat);
  }

  // ---------- Suspension arms ----------
  for (let s = -1; s <= 1; s += 2) {
    for (const wz of [1.8, -1.5]) {
      addRod(s * 0.2, 0.74, wz + (wz > 0 ? 0.15 : -0.15), s * 1.02, 0.62, wz, 0.03, darkMat);
      addRod(s * 0.2, 0.34, wz + (wz > 0 ? 0.15 : -0.15), s * 1.02, 0.22, wz, 0.03, darkMat);
    }
  }

  // ---------- Wheels ----------
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 18);
  for (let s = -1; s <= 1; s += 2) {
    for (const wz of [1.8, -1.5]) {
      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.position.set(s * 1.1, 0.4, wz);
      tire.rotation.z = Math.PI / 2;
      parts.push(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 14), metalMat);
      rim.position.set(s * 1.1, 0.4, wz);
      rim.rotation.z = Math.PI / 2;
      parts.push(rim);

      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.22, 16), metalMat);
      disc.position.set(s * 1.302, 0.4, wz);
      disc.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2;
      parts.push(disc);

      const band = new THREE.Mesh(new THREE.RingGeometry(0.235, 0.33, 18), sidewallMat);
      band.position.set(s * 1.303, 0.4, wz);
      band.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2;
      parts.push(band);

      addCylinder(0.055, 0.055, 0.04, 8, s * 1.33, 0.4, wz, accentMat, 0, 0, Math.PI / 2);
    }
  }

  // Player number on the nose
  if (isPlayer) {
    const plateCanvas = document.createElement('canvas');
    plateCanvas.width = 128;
    plateCanvas.height = 80;
    const pCtx = plateCanvas.getContext('2d');
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, 128, 80);
    pCtx.fillStyle = '#000000';
    pCtx.font = 'bold 54px Arial';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillText('1', 64, 42);
    const plateTex = new THREE.CanvasTexture(plateCanvas);
    const plateMat = new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.6 });
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.34), plateMat);
    plate.position.set(0, 0.666, 2.75);
    plate.rotation.order = 'YXZ';
    plate.rotation.y = Math.PI;
    plate.rotation.x = -Math.PI / 2;
    parts.push(plate);
  }

  // Merge every static part by material to keep the draw calls low
  carGroup.add(mergeMeshParts(parts));

  // Contact shadows: a soft blob under the chassis plus one dark patch per
  // wheel. The wheel patches are what really make the tyres read as touching
  // the asphalt instead of hovering over it.
  const shadowTex = getCarShadowTexture();

  // The holder lets us cancel the car's body roll so the shadows always stay
  // flat on the asphalt (otherwise one side sinks into the road and the other
  // lifts off, which looks like floating again).
  const shadowHolder = new THREE.Group();
  carGroup.add(shadowHolder);
  carGroup.userData.shadowHolder = shadowHolder;

  function addContactShadow(x, z, sx, sz, opacity) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity,
        depthWrite: false,
      })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.0525, z);
    mesh.scale.set(sx, sz, 1);
    mesh.renderOrder = 1;
    shadowHolder.add(mesh);
  }

  addContactShadow(0, 0.1, 2.6, 5.2, 0.4);
  addContactShadow(-1.1, 1.8, 1.15, 1.5, 0.65);
  addContactShadow(1.1, 1.8, 1.15, 1.5, 0.65);
  addContactShadow(-1.1, -1.5, 1.15, 1.5, 0.65);
  addContactShadow(1.1, -1.5, 1.15, 1.5, 0.65);

  // Rain light (kept separate because it glows while braking)
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0x550000,
    emissive: 0xff0000,
    emissiveIntensity: 0,
  });
  carGroup.userData.taillightMaterial = taillightMat;

  const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.04), taillightMat);
  taillight.position.set(0, 0.62, -2.27);
  carGroup.add(taillight);

  // Materials that carry the car's paint colour (used to recolour the player)
  carGroup.userData.paintMaterials = [bodyMat];
  carGroup.userData.accentMaterials = [accentMat, helmetMat];

  return carGroup;
}

// ===================== LÓGICA DEL JUEGO =====================
const keys = {};

function onKeyDown(e) {
  keys[e.key.toLowerCase()] = true;
  keys[e.code] = true;

  // Ignore keyboard auto-repeat, otherwise holding P or M would toggle
  // pause/mute over and over.
  if (e.repeat) return;

  if (e.key.toLowerCase() === 'p') togglePause();
  if (e.key.toLowerCase() === 'm') toggleMute();
}

function togglePause() {
  if (isFinished || isCountingDown) return;
  isPaused = !isPaused;
  document.getElementById('pauseOverlay').style.display = isPaused ? 'flex' : 'none';
}

function isRaceSessionActive() {
  return !!scene && !isFinished && (raceStarted || isCountingDown);
}

function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    if (audioCtx && engineGain) engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    if (audioCtx && skidGain) skidGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    if (audioCtx && rainGain) rainGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
  } else {
    // Never resurrect the engine/rain/skid loops from the menu or the
    // results screen: only a running race should make noise.
    if (!isRaceSessionActive()) return;
    if (!engineOsc) startEngineSound();
    else updateEngineSound();
    if (!skidSource) startSkidSound();
    updateSkidSound();
    if (currentWeather === 'rain') {
      if (rainSource && rainGain) {
        rainGain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.3);
      } else {
        startRainSound();
      }
    }
  }
}

function onKeyUp(e) {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
}

// If the window loses focus mid-corner the keyup may never arrive, so clear
// every input to avoid the car accelerating/warning on its own afterwards.
function onWindowBlur() {
  for (const key in keys) keys[key] = false;
  gamepadInput.throttle = 0;
  gamepadInput.brake = 0;
  gamepadInput.steer = 0;
  gamepadInput.handbrake = false;
  gamepadInput.nitro = false;
  gamepadPrev.pause = false;
  gamepadPrev.mute = false;
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
  if (gamepadNoticeHideTimer) clearTimeout(gamepadNoticeHideTimer);
  gamepadNoticeTimer = setTimeout(() => {
    el.style.opacity = '0';
    gamepadNoticeHideTimer = setTimeout(() => { el.style.display = 'none'; }, 300);
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

function setWrongWayUI(visible, seconds) {
  const el = document.getElementById('wrongWay');
  if (!el) return;
  el.style.display = visible ? 'block' : 'none';
  if (visible) {
    const countEl = document.getElementById('wrongWayCount');
    if (countEl) countEl.textContent = String(Math.max(1, Math.ceil(seconds)));
  }
}

function respawnPlayerOnTrack(t) {
  const point = trackCurve.getPointAt(t);
  const tangent = trackCurve.getTangentAt(t);

  playerCar.position.x = point.x;
  playerCar.position.z = point.z;
  playerAngle = Math.atan2(tangent.x, tangent.z);
  playerCar.rotation.y = playerAngle;
  playerCar.rotation.z = 0;
  if (playerCar.userData.shadowHolder) {
    playerCar.userData.shadowHolder.rotation.z = 0;
  }

  // Back on the track, stopped and facing the right way
  playerSpeed = 0;
  playerDrift = 0;
  playerSlip = 0;
  playerLateral = 0;
  playerPrevT = t;

  wrongWayActive = false;
  wrongWayTimer = WRONG_WAY_TIME;
  wrongWayGrace = 1.2;
  setWrongWayUI(false, 0);
  playTone(330, 0.18, 0.09);
}

function updateWrongWay(dt, t) {
  if (!raceStarted || isPaused || isFinished || playerFinishing) {
    if (wrongWayActive) {
      wrongWayActive = false;
      wrongWayTimer = WRONG_WAY_TIME;
      setWrongWayUI(false, 0);
    }
    return;
  }

  const tangent = trackCurve.getTangentAt(t);
  const heading = Math.sin(playerAngle) * tangent.x + Math.cos(playerAngle) * tangent.z;
  const headingWrong = heading < -0.4;

  // Brief grace period right after a respawn so it cannot trigger again
  if (wrongWayGrace > 0) {
    wrongWayGrace -= dt;
    return;
  }

  // Start the countdown only while actually driving the wrong way, but once
  // it has started keep it running until the car faces the right direction.
  if (!wrongWayActive && headingWrong && playerSpeed > 2.5) {
    wrongWayActive = true;
    wrongWayTimer = WRONG_WAY_TIME;
  }

  if (!wrongWayActive) return;

  if (!headingWrong) {
    // Turned around in time
    wrongWayActive = false;
    wrongWayTimer = WRONG_WAY_TIME;
    setWrongWayUI(false, 0);
    return;
  }

  wrongWayTimer -= dt;
  if (wrongWayTimer <= 0) {
    // The player did not turn around in time: put the car back on the track
    respawnPlayerOnTrack(t);
    return;
  }
  setWrongWayUI(true, wrongWayTimer);
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
  const handbrake = keys['Space'] || keys['shift'];

  // Keyboard and gamepad inputs combined
  const throttle = accel ? 1 : gamepadInput.throttle;
  const brakeAmount = brake ? 1 : gamepadInput.brake;
  const handbrakeActive = handbrake || gamepadInput.handbrake;
  const nitroActive = keys['z'] || gamepadInput.nitro;
  const nitroRequested = nitroActive && throttle > 0.05;
  const nitroBoosting = playerNitro > 0 && nitroRequested;

  // Taillights only glow while braking
  const taillightMat = playerCar.userData.taillightMaterial;
  if (taillightMat) {
    taillightMat.emissiveIntensity = (brakeAmount > 0.1 || handbrakeActive) ? 1.2 : 0;
  }

  // Acceleration (with a short automatic launch at the green light)
  if (throttle > 0.05) {
    const nitroBoost = nitroBoosting ? 8 : 0;
    // Aero drag: acceleration tapers off as the car approaches its top speed,
    // so the last gears feel long and F1-like instead of hitting a hard wall.
    const speedRatio = Math.min(Math.max(playerSpeed, 0) / MAX_SPEED, 1);
    const dragFactor = 1 - 0.5 * speedRatio * speedRatio;
    playerSpeed += (PLAYER_ACCEL * throttle * (currentWeather === 'rain' ? 0.9 : 1) * dragFactor + nitroBoost) * dt;
  } else if (brakeAmount < 0.05 && !handbrakeActive && raceTimer < LAUNCH_ASSIST_TIME) {
    playerSpeed += LAUNCH_ASSIST * dt;
  } else {
    playerSpeed -= 5 * dt;
  }

  // Braking
  if (brakeAmount > 0.01) {
    playerSpeed -= 18 * brakeAmount * weatherBrakeFactor() * dt;
  }

  // Handbrake
  if (handbrakeActive) {
    playerSpeed -= 10 * dt;
    playerDrift = Math.min(playerDrift + dt * 3, 1);
  } else {
    playerDrift = Math.max(playerDrift - dt * 5, 0);
  }

  // Nitro only drains while the button is held (with throttle); otherwise it
  // recharges. Draining while empty (instead of recharging) prevents the boost
  // from stuttering on/off around 0%.
  if (nitroRequested) {
    playerNitro = Math.max(0, playerNitro - 15 * dt);
  } else {
    playerNitro = Math.min(100, playerNitro + 10 * dt);
  }

  // Speed limits
  playerSpeed = Math.max(-5, Math.min(MAX_SPEED * weatherSpeedFactor(), playerSpeed));

  // Off-track penalty (track the car locally so the crossing can't steal its progress)
  const pos = getTrackPosition(playerCar.position.x, playerCar.position.z, playerPrevT);
  if (pos.dist > TRACK_WIDTH / 2) {
    // dt-based slowdown so the penalty does not depend on the frame rate
    playerSpeed *= Math.max(0, 1 - 1.8 * dt);
  }

  // ----- Steering with a cornering grip limit -----
  const keyboardSteer = (left ? 1 : 0) - (right ? 1 : 0);
  const steerInput = Math.max(-1, Math.min(1, keyboardSteer + gamepadInput.steer));
  const speedAbs = Math.abs(playerSpeed);

  // Steering becomes less sensitive as speed rises
  const steeringAuthority = 3.2 / (1 + speedAbs / 16) + playerDrift * 0.9;

  // Maximum yaw rate the tires can sustain at this speed
  // (the handbrake makes the rear slide, allowing a bit more rotation)
  const gripYaw = (GRIP_LATERAL * weatherGripFactor() + playerDrift * 8) / Math.max(speedAbs, 4);

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
  // Keep the contact shadows flat on the road while the body rolls
  if (playerCar.userData.shadowHolder) {
    playerCar.userData.shadowHolder.rotation.z = -playerCar.rotation.z;
  }

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

  // Lap display
  document.getElementById('lapCount').textContent = Math.min(playerLap, TOTAL_LAPS);
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
  const weatherGrip = weatherGripFactor();
  const weatherSpeed = weatherSpeedFactor();
  const weatherBrake = weatherBrakeFactor();

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
    const baseTarget = (state.baseSpeed + speedVariation) * MAX_SPEED * weatherSpeed;
    const lookAheadT = state.progress + (state.speed * 0.45) / trackLength;
    const curvature = getTrackCurvature(lookAheadT);
    const cornerSpeed = Math.sqrt((state.grip * weatherGrip) / Math.max(curvature, 0.0001));
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
      const speedRatio = Math.min(state.speed / MAX_SPEED, 1);
      const dragFactor = 1 - 0.5 * speedRatio * speedRatio;
      state.speed = Math.min(targetSpeed, state.speed + AI_ACCEL * (currentWeather === 'rain' ? 0.9 : 1) * dragFactor * dt);
    } else {
      state.speed = Math.max(targetSpeed, state.speed - AI_BRAKE * weatherBrake * dt);
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
  const camDist = 8.0 - cameraSpeedFactor * 1.4;
  const camHeight = 4.3 - cameraSpeedFactor * 0.5;

  const targetX = playerCar.position.x - Math.sin(playerAngle) * camDist;
  const targetZ = playerCar.position.z - Math.cos(playerAngle) * camDist;

  // Follow the car more tightly as speed increases, otherwise the camera lags
  // behind and the car appears to shrink into the distance until it catches up.
  const follow = 0.08 + cameraSpeedFactor * 0.22;
  camera.position.x += (targetX - camera.position.x) * follow;
  camera.position.z += (targetZ - camera.position.z) * follow;
  camera.position.y += (camHeight - camera.position.y) * (follow + 0.06);

  // Hard limit on how far the camera can trail behind the car.
  const maxLag = camDist + 1.2;
  const offX = camera.position.x - playerCar.position.x;
  const offZ = camera.position.z - playerCar.position.z;
  const lagDist = Math.hypot(offX, offZ);
  if (lagDist > maxLag) {
    const k = maxLag / lagDist;
    camera.position.x = playerCar.position.x + offX * k;
    camera.position.z = playerCar.position.z + offZ * k;
  }

  // Wider field of view at speed, but only slightly so the car does not shrink
  const targetFov = 70 + cameraSpeedFactor * 3;
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

function updateSunLight() {
  if (!sunLight || !playerCar) return;
  // Keep the shadow frustum centred on the player, otherwise driving away
  // from the origin leaves the car without a proper shadow. Snapping to a
  // coarse grid avoids the shadow map "swimming" as the light moves.
  const snap = 2;
  const px = Math.round(playerCar.position.x / snap) * snap;
  const pz = Math.round(playerCar.position.z / snap) * snap;
  sunLight.target.position.set(px, 0, pz);
  sunLight.position.set(px + 60, 120, pz + 60);
  sunLight.target.updateMatrixWorld();
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
  // The main render already refreshed the shadow map this frame; reusing it
  // avoids rendering every shadow-casting object a second time for the mirror.
  const shadowAutoUpdate = renderer.shadowMap.autoUpdate;
  renderer.shadowMap.autoUpdate = false;
  renderer.render(scene, mirrorCamera);
  renderer.shadowMap.autoUpdate = shadowAutoUpdate;
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
}

function updatePosition() {
  // Keep showing the classified position while the player coasts to a stop
  if (playerFinishing && pendingPlayerFinish) {
    document.getElementById('posValue').textContent = pendingPlayerFinish.playerPos;
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

  // A lapped player (fewer laps completed) is always classified behind the
  // cars that have lapped him: passing them on track does not gain a position
  // until the missing lap is recovered. Show the deficit so it is clear why.
  let leaderLap = playerLap;
  aiStates.forEach(s => { if (s.lap > leaderLap) leaderLap = s.lap; });
  const deficitEl = document.getElementById('lapDeficit');
  if (deficitEl) {
    const deficit = leaderLap - playerLap;
    deficitEl.textContent = deficit > 0
      ? (deficit === 1 ? '−1 VUELTA' : '−' + deficit + ' VUELTAS')
      : '';
  }

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
  if (!quickRaceMode) awardRacePoints(classification);

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

  skidIntensity = 0;
  updateSkidSound();

  const speedKmh = Math.abs(Math.round(playerSpeed * SPEED_DISPLAY_FACTOR));
  document.getElementById('speedValue').textContent = speedKmh;
  document.getElementById('gearDisplay').textContent =
    currentGear < 0 ? 'R' : (currentGear === 0 ? 'N' : String(currentGear));

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
  stopRainSound();
  skidIntensity = 0;

  // Turn off the brake lights
  if (playerCar.userData.taillightMaterial) {
    playerCar.userData.taillightMaterial.emissiveIntensity = 0;
  }

  // Fallback if the race is finished directly (e.g. tests)
  if (!pendingPlayerFinish) {
    registerFinish('player');
    const classification = buildRaceClassification();
    if (!quickRaceMode) awardRacePoints(classification);
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
  // Clear the previous "¡GO!" so it does not flash before the new countdown
  countdownEl.textContent = '';
  countdownEl.style.display = 'block';

  // Invalidate any setTimeout still pending from a previous countdown
  const token = ++countdownToken;

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
    if (token !== countdownToken) return;

    if (step >= steps.length) {
      countdownEl.style.display = 'none';
      isCountingDown = false;
      return;
    }

    const current = steps[step];
    countdownEl.textContent = current.text;

    if (step > 0) {
      if (step === steps.length - 1) {
        // The lights go green exactly when GO appears: hand control over
        // immediately instead of half a second later.
        raceStarted = true;
        isCountingDown = false;
        playGoBeep();

        lights.forEach(l => {
          l.material.emissive.setHex(0x00ff00);
          l.material.emissiveIntensity = 1;
        });
      } else {
        playCountdownBeep(false);
      }
    }

    step++;
    setTimeout(nextStep, current.delay);
  }

  setTimeout(nextStep, 500);
}

// ===================== GAME LOOP =====================
function startRenderLoop() {
  if (renderLoopStarted) return;
  renderLoopStarted = true;
  requestAnimationFrame(gameLoop);
}

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
  updateGearbox(currentDt);
  updateWrongWay(currentDt, playerPrevT);
  updateRain(currentDt);
  updateStadiumFlags();
  updateAI(currentDt);
  updateCollisions(currentDt);
  updateCamera();
  updateSunLight();
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
      if (playerCar.userData.shadowHolder) {
        playerCar.userData.shadowHolder.rotation.z = 0;
      }
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
  const isQuick = quickRaceMode;
  const standings = isQuick ? [] : getStandings();

  const raceRows = classification.map((id, idx) => {
    const driver = driverById[id];
    return `<tr class="${driver.isPlayer ? 'playerRow' : ''}">
      <td>${idx + 1}</td>
      <td>${driverCell(driver)}</td>
      ${isQuick ? '' : `<td>${RACE_POINTS[idx] || 0}</td>`}
    </tr>`;
  }).join('');

  const standingsRows = standings.map((driver, idx) => `
    <tr class="${driver.isPlayer ? 'playerRow' : ''}">
      <td>${idx + 1}</td>
      <td>${driverCell(driver)}</td>
      <td>${driver.points}</td>
    </tr>`).join('');

  const pointsHeader = isQuick ? '' : '<th>Pts</th>';
  const lastRace = !isQuick && currentCircuitIndex >= CIRCUITS.length - 1;
  const buttonText = isQuick
    ? 'VOLVER AL MENÚ'
    : (lastRace ? 'VER RESULTADOS DEL CAMPEONATO' : 'SIGUIENTE CARRERA');
  const buttonAction = isQuick
    ? 'returnToMenu()'
    : (lastRace ? 'showChampionshipResults()' : 'nextRace()');

  const subtitle = (isQuick
    ? `Carrera rápida · ${circuit.name}`
    : `Carrera ${currentCircuitIndex + 1} de ${CIRCUITS.length} · ${circuit.name}`)
    + ` · ${weatherLabel(currentWeather)}`;

  const standingsPanel = isQuick ? '' : `
      <div class="resultsPanel">
        <h3>Campeonato</h3>
        <table class="resultTable">
          <thead><tr><th>Pos</th><th>Piloto</th><th>Pts</th></tr></thead>
          <tbody>${standingsRows}</tbody>
        </table>
      </div>`;

  document.getElementById('resultsContent').innerHTML = `
    <h2>🏁 RESULTADOS DE LA CARRERA</h2>
    <div class="resultsSubtitle">${subtitle}</div>
    <div class="resultsInfo">Tu posición: <strong>${playerPos}º</strong> · Tiempo: <strong>${timeStr}</strong></div>
    <div class="resultsColumns">
      <div class="resultsPanel${isQuick ? ' wide' : ''}">
        <h3>Clasificación de la carrera</h3>
        <table class="resultTable">
          <thead><tr><th>Pos</th><th>Piloto</th>${pointsHeader}</tr></thead>
          <tbody>${raceRows}</tbody>
        </table>
      </div>
      ${standingsPanel}
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
    <button class="resultsButton" onclick="returnToMenu()">VOLVER AL MENÚ</button>
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
  currentGear = 0;
  gearRpm = 0.2;
  gearShiftCut = 0;
  gearShiftCooldown = 0;
  setGearDisplay();
  updateShiftLights();
  wrongWayActive = false;
  wrongWayTimer = WRONG_WAY_TIME;
  wrongWayGrace = 0;
  setWrongWayUI(false, 0);
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
    el.textContent = (quickRaceMode
      ? `Carrera rápida · ${CIRCUITS[currentCircuitIndex].name}`
      : `Carrera ${currentCircuitIndex + 1}/${CIRCUITS.length} · ${CIRCUITS[currentCircuitIndex].name}`)
      + ` · ${weatherLabel(currentWeather)}`;
  }
}

function startRace(index) {
  currentCircuitIndex = index;
  currentWeather = quickRaceMode
    ? selectedWeather
    : (championshipWeather[index] || randomWeather());

  buildCircuit(CIRCUITS[index]);
  clearSkidMarks();
  resetRaceState();
  placeCarsOnGrid();
  applyWeather(currentWeather);
  snapCameraBehindPlayer();
  updateCircuitInfo();

  isFinished = false;
  isPaused = false;
  raceStarted = false;
  isCountingDown = false;

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
  if (currentWeather === 'rain') startRainSound();
  else stopRainSound();
  startCountdown();
  startRenderLoop();
}

// ===================== MENÚ INICIAL =====================
function setGameMode(mode) {
  gameMode = mode === 'quick' ? 'quick' : 'championship';
  const quick = gameMode === 'quick';

  document.querySelectorAll('.modeBtn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.mode === gameMode);
  });

  const picker = document.getElementById('circuitPicker');
  if (picker) picker.classList.toggle('visible', quick);

  const hint = document.getElementById('circuitHint');
  if (hint) hint.style.display = quick ? 'block' : 'none';

  const weatherPicker = document.getElementById('weatherPicker');
  if (weatherPicker) weatherPicker.classList.toggle('visible', quick);

  const weatherHint = document.getElementById('weatherHint');
  if (weatherHint) weatherHint.style.display = quick ? 'block' : 'none';

  const subtitle = document.getElementById('menuSubtitle');
  if (subtitle) {
    subtitle.textContent = quick ? 'Carrera rápida · elige circuito y clima' : 'Campeonato · 5 circuitos';
  }

  const info = document.getElementById('menuInfo');
  if (info) {
    info.textContent = quick
      ? '3 vueltas · 10 pilotos · Una sola carrera'
      : '3 vueltas por carrera · 10 pilotos · Clima aleatorio';
  }

  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.textContent = quick ? 'INICIAR CARRERA RÁPIDA' : 'INICIAR CAMPEONATO';
  }
}

function selectQuickCircuit(index) {
  quickCircuitIndex = Math.max(0, Math.min(CIRCUITS.length - 1, index));
  document.querySelectorAll('.circuitOption').forEach((el, i) => {
    el.classList.toggle('selected', i === quickCircuitIndex);
  });
}

function selectQuickWeather(weather) {
  selectedWeather = weather === 'rain' || weather === 'night' ? weather : 'dry';
  document.querySelectorAll('.weatherOption').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.weather === selectedWeather);
  });
}

function setupStartMenu() {
  const picker = document.getElementById('circuitPicker');
  if (picker && picker.children.length === 0) {
    CIRCUITS.forEach((circuit, index) => {
      const btn = document.createElement('button');
      btn.className = 'circuitOption' + (index === quickCircuitIndex ? ' selected' : '');
      btn.textContent = circuit.name;
      btn.addEventListener('click', () => selectQuickCircuit(index));
      picker.appendChild(btn);
    });
  }
  selectQuickWeather(selectedWeather);
  setGameMode(gameMode);
}

function accentColorFor(color) {
  const lum = (((color >> 16) & 255) * 0.299 + ((color >> 8) & 255) * 0.587 + (color & 255) * 0.114) / 255;
  return lum > 0.62 ? 0x1b1b1b : 0xf2f2f2;
}

function applyColorToPlayer(color) {
  if (!playerCar) return;
  const accent = accentColorFor(color);
  (playerCar.userData.paintMaterials || []).forEach(m => m.color.setHex(color));
  (playerCar.userData.accentMaterials || []).forEach(m => m.color.setHex(accent));
  const driver = driverById['player'];
  if (driver) driver.color = color;
}

function applyPlayerColor() {
  applyColorToPlayer(selectedColor);
}

function startGame() {
  if (gameMode === 'quick') {
    startQuickRace(quickCircuitIndex);
  } else {
    startChampionship();
  }
}

function returnToMenu() {
  document.getElementById('finishScreen').style.display = 'none';
  document.getElementById('pauseOverlay').style.display = 'none';
  document.getElementById('startScreen').style.display = 'flex';
  document.getElementById('hud').style.display = '';
  isPaused = false;
  isFinished = true;
  stopEngineSound();
  stopSkidSound();
  stopRainSound();
}

// ===================== CLIMA =====================
const WEATHER_LABELS = { dry: 'Seco', rain: 'Lluvia', night: 'Noche' };

function weatherLabel(weather = currentWeather) {
  return WEATHER_LABELS[weather] || 'Seco';
}

function randomWeather() {
  const r = Math.random();
  if (r < 0.55) return 'dry';
  if (r < 0.8) return 'rain';
  return 'night';
}

function buildChampionshipWeather() {
  const list = CIRCUITS.map(() => randomWeather());
  // Guarantee at least one race with a different condition
  if (!list.some(w => w !== 'dry')) {
    list[Math.floor(Math.random() * list.length)] = Math.random() < 0.6 ? 'rain' : 'night';
  }
  return list;
}

function weatherGripFactor() {
  return currentWeather === 'rain' ? 0.62 : 1;
}

function weatherBrakeFactor() {
  return currentWeather === 'rain' ? 0.72 : 1;
}

function weatherSpeedFactor() {
  return currentWeather === 'rain' ? 0.95 : 1;
}

function clearWeatherVisuals() {
  rainGroup = null;
  rainGeometry = null;
  rainPositions = null;
  rainDropCount = 0;

  if (!weatherGroup) return;
  while (weatherGroup.children.length > 0) {
    const child = weatherGroup.children[0];
    weatherGroup.remove(child);
    disposeObject(child);
  }
}

function applyWeather(weather) {
  currentWeather = weather === 'rain' || weather === 'night' ? weather : 'dry';
  clearWeatherVisuals();

  const circuit = CIRCUITS[currentCircuitIndex] || CIRCUITS[0];
  const drySky = circuit.sky;

  if (currentWeather === 'rain') {
    const sky = 0x8c98a6;
    scene.background = new THREE.Color(sky);
    scene.fog = new THREE.Fog(sky, 85, 520);
    if (ambientLight) {
      ambientLight.color.setHex(0xcfd9e4);
      ambientLight.intensity = 0.64;
    }
    if (sunLight) {
      sunLight.color.setHex(0xe7eef6);
      sunLight.intensity = 0.6;
    }
  } else if (currentWeather === 'night') {
    const sky = 0x070d1a;
    scene.background = new THREE.Color(sky);
    scene.fog = new THREE.Fog(sky, 100, 560);
    if (ambientLight) {
      ambientLight.color.setHex(0x8fa8ff);
      ambientLight.intensity = 0.35;
    }
    if (sunLight) {
      sunLight.color.setHex(0xbfd3ff);
      sunLight.intensity = 0.35;
    }
  } else {
    scene.background = new THREE.Color(drySky);
    scene.fog = new THREE.Fog(drySky, 200, 800);
    if (ambientLight) {
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.6;
    }
    if (sunLight) {
      sunLight.color.setHex(0xffffff);
      sunLight.intensity = 0.8;
    }
  }

  // Wet tarmac: darker and glossier
  worldGroup.traverse(obj => {
    // Clouds use fog:false, so at night they would stay bright and ruin the
    // dark sky. Hide them once the stars/moon take over.
    if (obj.userData.isCloud) {
      obj.visible = currentWeather !== 'night';
    }
    if (!obj.isMesh || !obj.userData.isRoad || !obj.material) return;
    const mat = obj.material;
    if (currentWeather === 'rain') {
      mat.roughness = 0.38;
      mat.metalness = 0.28;
      mat.color.setHex(0xc4ced6);
    } else {
      mat.roughness = obj.userData.baseRoughness !== undefined ? obj.userData.baseRoughness : 0.8;
      mat.metalness = obj.userData.baseMetalness !== undefined ? obj.userData.baseMetalness : 0.1;
      mat.color.setHex(0xffffff);
    }
    mat.needsUpdate = true;
  });

  if (currentWeather === 'rain') {
    createRain();
  } else if (currentWeather === 'night') {
    createNightWeather();
  }
}

function createRain() {
  const drops = 900;
  const positions = new Float32Array(drops * 6);
  for (let i = 0; i < drops; i++) {
    const x = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    const y = Math.random() * 55;
    const len = 1 + Math.random() * 1.4;
    const b = i * 6;
    positions[b] = x;
    positions[b + 1] = y;
    positions[b + 2] = z;
    positions[b + 3] = x + 0.45;
    positions[b + 4] = y - len;
    positions[b + 5] = z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: 0xa9c8e8,
    transparent: true,
    opacity: 0.5,
    fog: true,
  });

  rainGeometry = geometry;
  rainPositions = positions;
  rainDropCount = drops;
  rainGroup = new THREE.LineSegments(geometry, material);
  rainGroup.frustumCulled = false;
  if (playerCar) rainGroup.position.set(playerCar.position.x, 0, playerCar.position.z);
  weatherGroup.add(rainGroup);
}

function updateRain(dt) {
  if (isPaused || currentWeather !== 'rain' || !rainGroup || !rainPositions) return;
  const arr = rainPositions;
  const fall = 58;
  for (let i = 0; i < rainDropCount; i++) {
    const b = i * 6;
    arr[b + 1] -= fall * dt;
    arr[b + 4] -= fall * dt;
    if (arr[b + 1] < 0) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      const y = 45 + Math.random() * 15;
      const len = 1 + Math.random() * 1.4;
      arr[b] = x;
      arr[b + 1] = y;
      arr[b + 2] = z;
      arr[b + 3] = x + 0.45;
      arr[b + 4] = y - len;
      arr[b + 5] = z;
    }
  }
  rainGeometry.attributes.position.needsUpdate = true;
  if (playerCar) rainGroup.position.set(playerCar.position.x, 0, playerCar.position.z);
}

function createNightWeather() {
  // Stars
  const starPositions = [];
  for (let i = 0; i < 220; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 550 + Math.random() * 330;
    starPositions.push(
      Math.cos(angle) * radius,
      110 + Math.random() * 480,
      Math.sin(angle) * radius
    );
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.85,
    fog: false,
  }));
  weatherGroup.add(stars);

  // Moon
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(14, 14, 10),
    new THREE.MeshBasicMaterial({ color: 0xf4f6ff, fog: false })
  );
  moon.position.set(360, 290, -520);
  weatherGroup.add(moon);

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x3c434a, roughness: 0.6, metalness: 0.5 });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff3c4, fog: false });

  // Soft pools of light on the tarmac
  const poolCanvas = document.createElement('canvas');
  poolCanvas.width = 128;
  poolCanvas.height = 128;
  const poolCtx = poolCanvas.getContext('2d');
  const grad = poolCtx.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,244,200,0.9)');
  grad.addColorStop(0.45, 'rgba(255,244,200,0.3)');
  grad.addColorStop(1, 'rgba(255,244,200,0)');
  poolCtx.fillStyle = grad;
  poolCtx.fillRect(0, 0, 128, 128);
  const poolTex = new THREE.CanvasTexture(poolCanvas);
  const poolMat = new THREE.MeshBasicMaterial({
    map: poolTex,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: false,
  });

  // Glow around each lamp head
  const glowTex = new THREE.CanvasTexture(poolCanvas);
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: 0xfff3c4,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });

  const stations = 24;              // both sides can be lit: up to 48 masts
  const poleGeo = new THREE.CylinderGeometry(0.24, 0.36, 21, 6);
  const headGeo = new THREE.BoxGeometry(4.2, 0.6, 0.8);
  const lampGeo = new THREE.BoxGeometry(0.62, 0.18, 0.55);
  const poolGeo = new THREE.PlaneGeometry(1, 1);

  // Masts are placed outside the painted curb. The flat Las Vegas layout
  // paints a 4 m curb band on each side (the normal tracks use 2 m), so its
  // towers need to be pushed further out or the lamp heads sit on the track.
  const flatTrack = !!(CIRCUITS[currentCircuitIndex] && CIRCUITS[currentCircuitIndex].flatTrack);
  const paintedHalfWidth = TRACK_WIDTH / 2 + (flatTrack ? 4 : 2);
  const mastLateral = paintedHalfWidth + (flatTrack ? 5 : 3);
  // Clearance from any other branch: pole and lamp head must stay outside the
  // painted edge of every stretch of track.
  const minMastDistance = paintedHalfWidth + 2.5;

  const stationData = [];
  const mastSpots = [];

  for (let i = 0; i < stations; i++) {
    const t = 0.035 + (i / stations) * 0.93;
    const point = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t);
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const yaw = Math.atan2(tangent.x, tangent.z);
    stationData.push({ point, yaw });

    for (let side = -1; side <= 1; side += 2) {
      const mx = point.x + normal.x * side * mastLateral;
      const mz = point.z + normal.z * side * mastLateral;

      // The mast's own branch is always `mastLateral` away, so anything closer
      // than this (or than the clearance) belongs to another part of the track.
      if (getTrackPosition(mx, mz).dist < minMastDistance) continue;

      mastSpots.push({ x: mx, z: mz, yaw, side, station: i });
    }
  }

  const mastCount = mastSpots.length;
  const poleInst = new THREE.InstancedMesh(poleGeo, poleMat, mastCount);
  const headInst = new THREE.InstancedMesh(headGeo, poleMat, mastCount);
  const lampInst = new THREE.InstancedMesh(lampGeo, lampMat, mastCount * 5);
  const poolInst = new THREE.InstancedMesh(poolGeo, poolMat, stations + 4);

  const m4 = new THREE.Matrix4();
  const qMast = new THREE.Quaternion();
  const qPool = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  const one = new THREE.Vector3(1, 1, 1);
  const poolScale = new THREE.Vector3();
  const pos = new THREE.Vector3();

  let mastIndex = 0;
  let lampIndex = 0;
  let poolIndex = 0;
  let lightCount = 0;

  // Soft pools of light stay on the track, one per station.
  stationData.forEach(({ point }) => {
    poolScale.set(72, 72, 1);
    m4.compose(pos.set(point.x, 0.06, point.z), qPool, poolScale);
    poolInst.setMatrixAt(poolIndex++, m4);
  });

  mastSpots.forEach(spot => {
    qMast.setFromEuler(new THREE.Euler(0, spot.yaw, 0));

    m4.compose(pos.set(spot.x, 10.5, spot.z), qMast, one);
    poleInst.setMatrixAt(mastIndex, m4);

    m4.compose(pos.set(spot.x, 21, spot.z), qMast, one);
    headInst.setMatrixAt(mastIndex, m4);

    const cosYaw = Math.cos(spot.yaw);
    const sinYaw = Math.sin(spot.yaw);
    for (let l = 0; l < 5; l++) {
      const lx = (l - 2) * 0.76;
      m4.compose(
        pos.set(spot.x + cosYaw * lx, 20.66, spot.z - sinYaw * lx),
        qMast,
        one
      );
      lampInst.setMatrixAt(lampIndex++, m4);
    }

    const glow = new THREE.Sprite(glowMat);
    glow.position.set(spot.x, 21, spot.z);
    glow.scale.set(9, 9, 1);
    weatherGroup.add(glow);

    if (spot.side === 1 && spot.station % 4 === 0 && lightCount < 6) {
      const light = new THREE.PointLight(0xffe9b8, 1.0, 105, 2);
      light.position.set(spot.x, 20.6, spot.z);
      weatherGroup.add(light);
      lightCount++;
    }

    mastIndex++;
  });

  // Extra pools over the start/finish and the grid
  [0, 0.99, 0.965, 0.94].forEach(t => {
    const p = trackCurve.getPointAt((t + 1) % 1);
    poolScale.set(86, 86, 1);
    m4.compose(pos.set(p.x, 0.061, p.z), qPool, poolScale);
    poolInst.setMatrixAt(poolIndex++, m4);
  });

  poleInst.instanceMatrix.needsUpdate = true;
  headInst.instanceMatrix.needsUpdate = true;
  lampInst.instanceMatrix.needsUpdate = true;
  poolInst.instanceMatrix.needsUpdate = true;

  weatherGroup.add(poleInst);
  weatherGroup.add(headInst);
  weatherGroup.add(lampInst);
  weatherGroup.add(poolInst);
}

function startRainSound() {
  if (!audioCtx || isMuted || rainSource) return;

  const bufferSize = audioCtx.sampleRate * 2.5;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  rainSource = audioCtx.createBufferSource();
  rainSource.buffer = buffer;
  rainSource.loop = true;

  rainFilter = audioCtx.createBiquadFilter();
  rainFilter.type = 'lowpass';
  rainFilter.frequency.value = 2400;
  rainFilter.Q.value = 0.4;

  rainGain = audioCtx.createGain();
  rainGain.gain.value = 0;

  rainSource.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(audioCtx.destination);
  rainSource.start();
  rainGain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.5);
}

function stopRainSound() {
  if (!rainSource) return;

  const src = rainSource;
  const filter = rainFilter;
  const gain = rainGain;
  rainSource = null;
  rainFilter = null;
  rainGain = null;

  if (!audioCtx) return;
  gain.gain.cancelScheduledValues(audioCtx.currentTime);
  gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);

  setTimeout(() => {
    try { src.stop(); } catch (e) {}
    try { src.disconnect(); } catch (e) {}
    try { filter.disconnect(); } catch (e) {}
    try { gain.disconnect(); } catch (e) {}
  }, 320);
}

function startChampionship() {
  if (!scene) {
    init();
  }

  quickRaceMode = false;
  applyPlayerColor();
  championshipWeather = buildChampionshipWeather();

  championshipHistory = [];
  raceResults = [];
  drivers.forEach(driver => {
    driver.points = 0;
    driver.bestFinish = 99;
    driver.seed = Math.random();
  });

  startRace(0);
  // Only cover the start screen once the world has been built, so a WebGL/CDN
  // failure leaves the menu visible instead of a black page.
  document.getElementById('startScreen').style.display = 'none';
}

function startQuickRace(index) {
  if (!scene) {
    init();
  }

  quickRaceMode = true;
  applyPlayerColor();

  championshipHistory = [];
  raceResults = [];
  drivers.forEach(driver => {
    driver.points = 0;
    driver.bestFinish = 99;
    driver.seed = Math.random();
  });

  startRace(Math.max(0, Math.min(CIRCUITS.length - 1, index)));
  document.getElementById('startScreen').style.display = 'none';
}

// Populate the colour picker and the start menu before the game starts
setupColorPicker();
setupStartMenu();

// Prevent scrolling
document.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
    e.preventDefault();
  }
});
