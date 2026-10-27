/**
 * Special Birthday Website for Girlfriend
 * Crafted with love ❤️
 */

// ==========================================================================
// STATE & CONFIGURATION
// ==========================================================================
const LETTER_FOR_MILENA = `happy birthday, my milena. ❤️🫶🏻

i genuinely don't even know where to start because there's so much i wanna tell you, but most importantly, i'm so, so glad you exist. out of all the people in this world, i'm really grateful i got to meet you and have you become such a special part of my life. you make me happy in ways you probably don't even realise, and sometimes just talking to you is enough to make my entire day better. I love so many things about you, even the little things you probably don't notice about yourself. i love getting to know you more every day, listening to you talk about random things, and just being able to share little moments with you. i hope you know how much i appreciate you, not just for the way you make me feel, but for the person you are. you mean so much more to me than i think i manage to put into words. I know you take love seriously, and that's something i genuinely respect about you. i don't wanna rush anything or make you feel like you have to be ready for something before you are. I'm just really happy i have you in my life, and i hope i get to keep making memories with you, annoying you, being clingy with you, and appreciating you in all the little ways i can. 😭❤️ i wish you nothing but happiness, milena. i hope this year brings us closer, and i hope you never forget how capable, special, and loved you are. i wish you could see yourself through my eyes, even just for a second, because maybe then you'd understand why i appreciate you so much.i genuinely don't know what the future holds, but i know that i'm really grateful for you and for what we have. i'm so glad you were born, and i'm even more glad i got to know you. thank you for being you, my favourite person. i like you so, so much, milena. happy birthday, pretty girl. ❤️🫶🏻`;

const APP_STATE = {
  soundEnabled: true,
  currentPage: 'page-1',
  envelopeStatus: {
    1: false, // Letter opened
    2: false, // Memories opened
    3: false  // Song opened
  },
  typewriter: {
    text: LETTER_FOR_MILENA,
    isTyping: false,
    timer: null,
    index: 0
  },
  activeModalPhotoIndex: null,
  music: {
    isPlaying: false,
    currentTime: 0,
    duration: 177, // ~2m 57s
    interval: null,
    currentVerseIndex: 0
  }
};

// Default polaroids matching the user's reference collage
const DEFAULT_PHOTOS = [
  { id: 0, url: 'assets/memory_1.jpg', fullUrl: 'assets/memory_1_full.jpg', caption: 'Your sweetest smile 💕', rot: -5, sticker: '🌸', delay: 0 },
  { id: 1, url: 'assets/memory_2.jpg', fullUrl: 'assets/memory_2_full.png', caption: 'Whitey Spears 🎶', rot: 3, sticker: '🎀', delay: 0.4 },
  { id: 2, url: 'assets/memory_3.jpg', fullUrl: 'assets/memory_3_full.png', caption: 'When you showed mooscles 💪', rot: -3, sticker: '💌', delay: 0.8 },
  { id: 3, url: 'assets/memory_4.jpg', fullUrl: 'assets/memory_4_full.jpg', caption: 'When you held my hand ❤️', rot: 4, sticker: '💮', delay: 1.2 },
  { id: 4, url: 'assets/memory_5.jpg', fullUrl: 'assets/memory_5_full.jpg', caption: 'Looking into your eyes 👀', rot: -4, sticker: '🐰', delay: 1.6 },
  { id: 5, url: 'assets/memory_6.jpg', fullUrl: 'assets/memory_6_full.jpg', caption: 'Every moment with you 💖', rot: 5, sticker: '🧸', delay: 2.0 }
];

// Default romantic song & lyrics that they always sing together
const DEFAULT_SONG = {
  title: "Sakkarakatti",
  artist: "Hiphop Tamizha",
  lyrics: [
    "🎵 [Intro Beat & Sweet Melody] 🎵",
    "Adiye sakkarakatti, nenjukulla stickera otti,",
    "yenathaan yenga kootiporiyo nee... ✨",
    "Adiye... ahaan... adiye... venaam... ahaan... 💃",
    "Adiye sakkarakatti, nenjukulla stickera otti,",
    "yenathaan yenga kootiporiyo nee... 🎶",
    "Needhaan en vellakatti, vaadi en sellakutti,",
    "unathaan unathaan theduren naan... 💖",
    "Naanum thedi paathen, ulagam thaandi paathen,",
    "unnapol azhagiya thaan paathadhilladi... ✨",
    "Kavitha paadi paathen, kalakkariyaadi paathen,",
    "adiye enna konjam paathu solladi vaa... 🌹",
    "Vaa en anjala naan unna kenjuren,",
    "nee enna konjada vaadi pulla... 🥰",
    "Vaa en anjala naan unna kenjuren,",
    "kaathal konjama thaadi pulla... ❤️✨"
  ],
  timedLyrics: [
    { time: 0, text: "🎵 [Intro Beat & Sweet Melody] 🎵" },
    { time: 4.2, text: "Adiye sakkarakatti, nenjukulla stickera otti," },
    { time: 7.8, text: "yenathaan yenga kootiporiyo nee... ✨" },
    { time: 11.2, text: "Adiye... ahaan... adiye... venaam... ahaan... 💃" },
    { time: 19.0, text: "Adiye sakkarakatti, nenjukulla stickera otti," },
    { time: 22.8, text: "yenathaan yenga kootiporiyo nee... 🎶" },
    { time: 26.3, text: "Needhaan en vellakatti, vaadi en sellakutti," },
    { time: 29.8, text: "unathaan unathaan theduren naan... 💖" },
    { time: 33.6, text: "Naanum thedi paathen, ulagam thaandi paathen," },
    { time: 37.4, text: "unnapol azhagiya thaan paathadhilladi... ✨" },
    { time: 41.2, text: "Kavitha paadi paathen, kalakkariyaadi paathen," },
    { time: 45.3, text: "adiye enna konjam paathu solladi vaa... 🌹" },
    { time: 49.0, text: "Vaa en anjala naan unna kenjuren," },
    { time: 52.8, text: "nee enna konjada vaadi pulla... 🥰" },
    { time: 56.5, text: "Vaa en anjala naan unna kenjuren," },
    { time: 60.5, text: "kaathal konjama thaadi pulla... ❤️✨" }
  ]
};

// Load saved photos or fallback
function getSavedPhotos() {
  try {
    const saved = localStorage.getItem('bday_photos_list_v3');
    if (saved) return JSON.parse(saved);
    localStorage.removeItem('bday_photos_list');
    localStorage.removeItem('bday_photos_list_v2');
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return DEFAULT_PHOTOS;
}

function savePhotos(photos) {
  try {
    localStorage.setItem('bday_photos_list_v3', JSON.stringify(photos));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Load saved song or fallback
function getSavedSong() {
  try {
    const oldSaved = localStorage.getItem('bday_song_details');
    if (oldSaved) {
      const parsed = JSON.parse(oldSaved);
      if (parsed.title === "Until I Found You") {
        localStorage.removeItem('bday_song_details');
      }
    }
    const saved = localStorage.getItem('bday_song_details_v2') || localStorage.getItem('bday_song_details');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage song error:', e);
  }
  return DEFAULT_SONG;
}

function saveSong(song) {
  try {
    localStorage.setItem('bday_song_details_v2', JSON.stringify(song));
  } catch (e) {
    console.warn('LocalStorage save song error:', e);
  }
}

// ==========================================================================
// WEB AUDIO API SOUND GENERATOR (Zero External Dependencies)
// ==========================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Cute bubble pop sound for button clicks
function playClickSound() {
  if (!APP_STATE.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {
    // Ignore audio errors on autoplay restrictions
  }
}

// Subtle typewriter key click sound
function playTypeSound() {
  if (!APP_STATE.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Randomize pitch slightly for organic typing feel
    const freq = 600 + Math.random() * 300;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

// Envelope open celebratory sound
function playEnvelopeChime() {
  if (!APP_STATE.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
    });
  } catch (e) {}
}

// Built-in synthesized romantic melody loop
let synthMusicNodes = [];
let melodyStep = 0;
let melodyInterval = null;

// Gentle romantic chords (Cmaj7, Am7, Dm7, G7)
const ROMANTIC_CHORDS = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7
  [220.00, 261.63, 329.63, 392.00], // Am7
  [293.66, 349.23, 440.00, 523.25], // Dm7
  [196.00, 246.94, 293.66, 392.00]  // G7
];

function playRomanticChordStep() {
  const ctx = getAudioContext();
  if (!ctx || !APP_STATE.music.isPlaying) return;

  const chord = ROMANTIC_CHORDS[melodyStep % ROMANTIC_CHORDS.length];
  melodyStep++;

  chord.forEach((freq, i) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const vol = (document.getElementById('volumeSlider')?.value || 0.8) * 0.06;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.9);
      synthMusicNodes.push(osc);
    } catch (e) {}
  });

  // Keep array small
  if (synthMusicNodes.length > 30) synthMusicNodes.splice(0, 15);
}

function startBuiltInMelody() {
  if (melodyInterval) clearInterval(melodyInterval);
  playRomanticChordStep();
  melodyInterval = setInterval(playRomanticChordStep, 1500);
}

function stopBuiltInMelody() {
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
}

// ==========================================================================
// BACKGROUND HEARTS CANVAS PARTICLES
// ==========================================================================
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class HeartParticle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
    this.size = 10 + Math.random() * 18;
    this.speedY = 0.5 + Math.random() * 1.2;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.opacity = 0.2 + Math.random() * 0.5;
    this.rot = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.03;
    const colors = ['#f48fb1', '#ff80ab', '#fce4ec', '#f06292', '#ffffff', '#ffd54f'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    this.rot += this.rotSpeed;

    if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    // Draw small heart shape
    const s = this.size;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.2, 0, s);
    ctx.bezierCurveTo(s, s * 0.2, s * 0.5, -s * 0.3, 0, s * 0.3);
    ctx.fill();

    ctx.restore();
  }
}

for (let i = 0; i < 30; i++) {
  particles.push(new HeartParticle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================================================
// GATING & ENVELOPE PROGRESS LOGIC
// ==========================================================================
function areAllEnvelopesOpened() {
  return !!(APP_STATE.envelopeStatus[1] && APP_STATE.envelopeStatus[2] && APP_STATE.envelopeStatus[3]);
}

function getOpenedCount() {
  return [1, 2, 3].filter(n => APP_STATE.envelopeStatus[n]).length;
}

function getEnvelopeName(num) {
  if (num === 1) return 'Envelope #1: A Secret Letter 💌';
  if (num === 2) return 'Envelope #2: Best Memories 📸';
  if (num === 3) return 'Envelope #3: Our Song 🎵';
  return `Envelope #${num}`;
}

function updateHubProgressUI() {
  const count = getOpenedCount();
  const countEl = document.getElementById('progressCountText');
  if (countEl) {
    countEl.textContent = count === 3 
      ? 'All 3 Letters Opened! 🎉' 
      : `Letters Opened: ${count} / 3`;
  }

  // Update step badges
  for (let i = 1; i <= 3; i++) {
    const badge = document.getElementById(`stepBadge${i}`);
    if (badge) {
      if (APP_STATE.envelopeStatus[i]) {
        badge.classList.add('completed');
        const labels = ['', '1. Letter 💖', '2. Memories 💖', '3. Song 💖'];
        badge.textContent = labels[i];
      } else {
        badge.classList.remove('completed');
        const labels = ['', '1. Letter 🤍', '2. Memories 🤍', '3. Song 🤍'];
        badge.textContent = labels[i];
      }
    }
  }

  // Grand finale unlock card on Hub
  const unlockCard = document.getElementById('hubFinaleUnlockCard');
  if (unlockCard) {
    if (areAllEnvelopesOpened()) {
      unlockCard.classList.remove('hidden');
    } else {
      unlockCard.classList.add('hidden');
    }
  }

  // Update continue buttons if all 3 are opened
  const btnLetter = document.getElementById('btnContinueFromLetter');
  if (btnLetter && areAllEnvelopesOpened()) {
    btnLetter.innerHTML = '<span class="btn-text">view final promise</span><span class="heart-pulse">✨❤️</span>';
  }

  const btnMemories = document.getElementById('btnContinueFromMemories');
  if (btnMemories && areAllEnvelopesOpened()) {
    btnMemories.innerHTML = '<span>FINAL PROMISE ❤️</span>';
  }
}

function showCuteLockedNotice(customMsg = null) {
  playClickSound();
  const modal = document.getElementById('envelopesLockedModal');
  const textEl = document.getElementById('lockedModalText');
  const summaryEl = document.getElementById('lockedStatusSummary');

  if (textEl && customMsg) {
    textEl.textContent = customMsg;
  } else if (textEl) {
    textEl.textContent = "To view this secret page, make sure all the other letters are opened first! 💕";
  }

  if (summaryEl) {
    summaryEl.innerHTML = '';
    [1, 2, 3].forEach(num => {
      const row = document.createElement('div');
      const isDone = APP_STATE.envelopeStatus[num];
      row.className = `locked-item ${isDone ? 'done' : 'pending'}`;
      row.innerHTML = `
        <span>${getEnvelopeName(num)}</span>
        <span>${isDone ? 'Opened ✅' : 'Still Locked 🔒'}</span>
      `;
      summaryEl.appendChild(row);
    });
  }

  if (modal) {
    modal.classList.remove('hidden');
  }
}

// ==========================================================================
// NAVIGATION & PAGE ROUTING
// ==========================================================================
function goToPage(pageId) {
  // Gating rule: Page 7 cannot be shown unless all letters are opened!
  if (pageId === 'page-7') {
    if (!areAllEnvelopesOpened()) {
      showCuteLockedNotice("Hold on, my love! 💕 You need to open all 3 envelopes first before unlocking this secret page! ✨");
      if (APP_STATE.currentPage !== 'page-3') {
        goToPage('page-3');
      }
      return;
    }
  }

  playClickSound();

  const current = document.querySelector('.page.active');
  const target = document.getElementById(pageId);

  if (!target) return;

  if (current) {
    current.classList.remove('active');
  }

  target.classList.add('active');
  APP_STATE.currentPage = pageId;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Page Specific Inits
  if (pageId === 'page-4') {
    startRealtimeTyping();
  } else if (pageId === 'page-5') {
    renderClotheslinePolaroids();
  } else if (pageId === 'page-6') {
    initSongPage();
  } else if (pageId === 'page-7') {
    triggerFinaleCelebration();
  }
}

// ==========================================================================
// PAGE 1 & 2 EVENT HANDLERS
// ==========================================================================
document.getElementById('btnOpenMail')?.addEventListener('click', () => {
  goToPage('page-2');
});

document.getElementById('btnAgreeContinue')?.addEventListener('click', () => {
  goToPage('page-3');
});

// Sound Toggle Button
const soundToggleBtn = document.getElementById('soundToggleBtn');
soundToggleBtn?.addEventListener('click', () => {
  APP_STATE.soundEnabled = !APP_STATE.soundEnabled;
  const icon = soundToggleBtn.querySelector('.sound-icon');
  const label = soundToggleBtn.querySelector('.sound-label');
  if (APP_STATE.soundEnabled) {
    icon.textContent = '🔊';
    label.textContent = 'Sound On';
    playClickSound();
  } else {
    icon.textContent = '🔇';
    label.textContent = 'Muted';
  }
});

// Corner Cat Click Easter Egg
document.querySelector('.corner-cat-container')?.addEventListener('click', () => {
  playClickSound();
  const bubble = document.querySelector('.cat-speech-bubble');
  const meows = [
    "Meow! You are so loved! 💕",
    "Purrr... Best birthday ever! 🐾",
    "He thinks about you constantly! 🥺",
    "Happy Birthday Princess! 👑",
    "Paws up for you! 🐾✨"
  ];
  bubble.textContent = meows[Math.floor(Math.random() * meows.length)];
});

// ==========================================================================
// PAGE 3: 3 ENVELOPES HUB
// ==========================================================================
document.getElementById('envelopeCard1')?.addEventListener('click', () => {
  playEnvelopeChime();
  goToPage('page-4');
});

document.getElementById('envelopeCard2')?.addEventListener('click', () => {
  playEnvelopeChime();
  goToPage('page-5');
});

document.getElementById('envelopeCard3')?.addEventListener('click', () => {
  playEnvelopeChime();
  goToPage('page-6');
});

function markEnvelopeOpened(num) {
  APP_STATE.envelopeStatus[num] = true;
  const card = document.getElementById(`envelopeCard${num}`);
  const statusEl = document.getElementById(`statusEnv${num}`);
  if (card && statusEl) {
    card.classList.add('opened');
    statusEl.textContent = 'Opened ❤️';
  }
  updateHubProgressUI();
  if (areAllEnvelopesOpened()) {
    playEnvelopeChime();
  }
}

// Helper to safely split text into grapheme clusters (prevents splitting multi-char emojis like 🫶🏻 and ❤️)
function getGraphemeList(str) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(str), s => s.segment);
  }
  return Array.from(str);
}

// ==========================================================================
// PAGE 4 (ENVELOPE 1): REAL-TIME TYPING TEXT FILE
// ==========================================================================
const typewriterTarget = document.getElementById('typewriterTarget');
const btnContinueFromLetter = document.getElementById('btnContinueFromLetter');
const btnSkipTyping = document.getElementById('btnSkipTyping');
const typingSoundIndicator = document.getElementById('typingSoundIndicator');

function startRealtimeTyping() {
  if (APP_STATE.typewriter.timer) {
    clearTimeout(APP_STATE.typewriter.timer);
    APP_STATE.typewriter.timer = null;
  }

  typewriterTarget.textContent = '';
  APP_STATE.typewriter.index = 0;
  APP_STATE.typewriter.isTyping = true;
  btnContinueFromLetter.classList.add('hidden');
  btnSkipTyping.style.display = 'inline-block';
  typingSoundIndicator.textContent = '⌨️ Typing for Milena...';

  const graphemes = getGraphemeList(APP_STATE.typewriter.text);
  const notepadBody = document.querySelector('.notepad-body');

  function typeChar() {
    if (APP_STATE.typewriter.index < graphemes.length) {
      const char = graphemes[APP_STATE.typewriter.index];
      typewriterTarget.textContent += char;
      APP_STATE.typewriter.index++;

      // Play soft keystroke sound every 3-4 chars or on spaces
      if (APP_STATE.typewriter.index % 3 === 0 || char === ' ') {
        playTypeSound();
      }

      // Smooth auto-scroll to keep cursor in view as the letter grows
      if (notepadBody) {
        notepadBody.scrollTop = notepadBody.scrollHeight;
      }

      // Natural, smooth typing delay
      let delay = 22 + Math.random() * 16;
      if (char === '.' || char === '!' || char === '?') {
        delay = 180; // natural sentence pause
      } else if (char === ',') {
        delay = 100; // brief comma pause
      } else if (char === '\n') {
        delay = 240; // paragraph pause
      }

      APP_STATE.typewriter.timer = setTimeout(typeChar, delay);
    } else {
      finishTyping();
    }
  }

  typeChar();
}

function finishTyping() {
  if (APP_STATE.typewriter.timer) {
    clearTimeout(APP_STATE.typewriter.timer);
    APP_STATE.typewriter.timer = null;
  }
  typewriterTarget.textContent = APP_STATE.typewriter.text;
  APP_STATE.typewriter.isTyping = false;
  typingSoundIndicator.textContent = '💌 With All My Love';
  btnSkipTyping.style.display = 'none';

  const notepadBody = document.querySelector('.notepad-body');
  if (notepadBody) {
    notepadBody.scrollTop = notepadBody.scrollHeight;
  }

  // Animate continue button with heart
  setTimeout(() => {
    btnContinueFromLetter.classList.remove('hidden');
    playEnvelopeChime();
  }, 400);

  markEnvelopeOpened(1);
}

btnSkipTyping?.addEventListener('click', () => {
  finishTyping();
});

// Continue button goes back to 3 envelopes page (or to finale if all letters opened)
btnContinueFromLetter?.addEventListener('click', () => {
  if (areAllEnvelopesOpened()) {
    goToPage('page-7');
  } else {
    goToPage('page-3');
  }
});

// ==========================================================================
// PAGE 5 (ENVELOPE 2): BEST MEMORIES CLOTHESLINE
// ==========================================================================
const polaroidsRow = document.getElementById('polaroidsRow');
const fairyLightsRow = document.getElementById('fairyLightsRow');

// Render Fairy Lights bulbs along clothesline
function renderFairyLights() {
  fairyLightsRow.innerHTML = '';
  const numBulbs = 14;
  for (let i = 0; i < numBulbs; i++) {
    const bulb = document.createElement('div');
    bulb.className = 'fairy-bulb';
    const percentX = (i / (numBulbs - 1)) * 96 + 2;
    // Calculate parabolic sag for wire y
    const normalized = (percentX - 50) / 50;
    const sagY = 35 + (1 - normalized * normalized) * 45;

    bulb.style.left = `${percentX}%`;
    bulb.style.top = `${sagY}px`;
    bulb.style.animationDelay = `${(i * 0.2).toFixed(1)}s`;
    fairyLightsRow.appendChild(bulb);
  }
}
renderFairyLights();

// Render Polaroids on Clothesline
function renderClotheslinePolaroids() {
  const photos = getSavedPhotos();
  polaroidsRow.innerHTML = '';

  photos.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';
    card.style.setProperty('--rot', `${photo.rot || 0}deg`);
    card.style.setProperty('--delay', `${photo.delay || 0}s`);

    card.innerHTML = `
      <div class="wooden-peg"></div>
      <div class="polaroid-frame">
        <span class="corner-sticker top-right">${photo.sticker || '🌸'}</span>
        <div class="polaroid-photo-wrapper">
          <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
          <div class="photo-overlay-hint">🔍 View / Edit</div>
        </div>
        <div class="polaroid-caption">${photo.caption}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      openPolaroidModal(idx);
    });

    polaroidsRow.appendChild(card);
  });
}

// Back to Envelopes button
document.getElementById('btnBackToEnvelopesFromMemories')?.addEventListener('click', () => {
  goToPage('page-3');
});

// Red Capsule CONTINUE Button -> Marks envelope 2 complete
document.getElementById('btnContinueFromMemories')?.addEventListener('click', () => {
  markEnvelopeOpened(2);
  if (areAllEnvelopesOpened()) {
    goToPage('page-7');
  } else {
    goToPage('page-3');
  }
});

// Batch Upload Photos
const photoBatchUpload = document.getElementById('photoBatchUpload');
photoBatchUpload?.addEventListener('change', (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const photos = getSavedPhotos();
  let loadedCount = 0;

  Array.from(files).forEach((file, fileIdx) => {
    if (fileIdx >= photos.length) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      photos[fileIdx].url = event.target.result;
      photos[fileIdx].caption = file.name.replace(/\.[^/.]+$/, '').slice(0, 20);
      loadedCount++;
      if (loadedCount === Math.min(files.length, photos.length)) {
        savePhotos(photos);
        renderClotheslinePolaroids();
        alert('✨ Photos updated successfully! They will stay saved for your girlfriend.');
      }
    };
    reader.readAsDataURL(file);
  });
});

// Reset to Default Photos
document.getElementById('btnResetDefaultPhotos')?.addEventListener('click', () => {
  if (confirm('Reset polaroids to original default photos?')) {
    savePhotos(DEFAULT_PHOTOS);
    renderClotheslinePolaroids();
  }
});

// View Original Collage Modal
const collageModal = document.getElementById('collageModal');
document.getElementById('btnViewSampleCollage')?.addEventListener('click', () => {
  collageModal.classList.remove('hidden');
});
document.getElementById('btnCloseCollageModal')?.addEventListener('click', () => {
  collageModal.classList.add('hidden');
});

// Polaroid Lightbox & Single Edit Modal
const polaroidModal = document.getElementById('polaroidModal');
const modalPolaroidImg = document.getElementById('modalPolaroidImg');
const modalPolaroidCaption = document.getElementById('modalPolaroidCaption');
const modalSinglePhotoUpload = document.getElementById('modalSinglePhotoUpload');

function openPolaroidModal(index) {
  const photos = getSavedPhotos();
  const photo = photos[index];
  if (!photo) return;

  APP_STATE.activeModalPhotoIndex = index;
  modalPolaroidImg.src = photo.fullUrl || photo.url;
  modalPolaroidCaption.value = photo.caption;
  polaroidModal.classList.remove('hidden');
}

document.getElementById('btnClosePolaroidModal')?.addEventListener('click', () => {
  polaroidModal.classList.add('hidden');
});

document.getElementById('btnSavePolaroidCaption')?.addEventListener('click', () => {
  if (APP_STATE.activeModalPhotoIndex !== null) {
    const photos = getSavedPhotos();
    photos[APP_STATE.activeModalPhotoIndex].caption = modalPolaroidCaption.value.trim() || 'A Sweet Memory ❤️';
    savePhotos(photos);
    renderClotheslinePolaroids();
    polaroidModal.classList.add('hidden');
  }
});

modalSinglePhotoUpload?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file || APP_STATE.activeModalPhotoIndex === null) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const photos = getSavedPhotos();
    photos[APP_STATE.activeModalPhotoIndex].url = event.target.result;
    photos[APP_STATE.activeModalPhotoIndex].fullUrl = event.target.result;
    savePhotos(photos);
    modalPolaroidImg.src = event.target.result;
    renderClotheslinePolaroids();
  };
  reader.readAsDataURL(file);
});

// ==========================================================================
// PAGE 6 (ENVELOPE 3): FAVORITE SONG & LYRICS
// ==========================================================================
const romanticAudioPlayer = document.getElementById('romanticAudioPlayer');
const vinylDisc = document.getElementById('vinylDisc');
const btnPlayPause = document.getElementById('btnPlayPause');
const playPauseIcon = document.getElementById('playPauseIcon');
const currentSongTitle = document.getElementById('currentSongTitle');
const currentArtistName = document.getElementById('currentArtistName');
const vinylLabelTitle = document.getElementById('vinylLabelTitle');
const lyricsScrollBox = document.getElementById('lyricsScrollBox');
const audioScrubber = document.getElementById('audioScrubber');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const durationDisplay = document.getElementById('durationDisplay');
const volumeSlider = document.getElementById('volumeSlider');
const customAudioUpload = document.getElementById('customAudioUpload');

function initSongPage() {
  const song = getSavedSong();
  currentSongTitle.textContent = song.title;
  currentArtistName.textContent = song.artist;
  vinylLabelTitle.textContent = song.title.slice(0, 12);
  renderLyrics(song.lyrics);

  // Set the audio player src to our uploaded song if not custom
  if (!romanticAudioPlayer.src || (!APP_STATE.music.hasCustomUpload && romanticAudioPlayer.src.indexOf('assets/our_song.mp3') === -1)) {
    romanticAudioPlayer.src = 'assets/our_song.mp3';
  }

  // Auto start music when entering song page
  toggleMusicPlay(true);
}

function renderLyrics(lyricsArray) {
  lyricsScrollBox.innerHTML = '';
  const song = getSavedSong();
  lyricsArray.forEach((line, index) => {
    const lineEl = document.createElement('div');
    lineEl.className = 'lyrics-line';
    if (index === 0) lineEl.classList.add('active');
    lineEl.textContent = line;
    lineEl.dataset.index = index;

    lineEl.addEventListener('click', () => {
      setActiveLyric(index);
      if (song.timedLyrics && song.timedLyrics[index]) {
        const t = song.timedLyrics[index].time;
        if (romanticAudioPlayer.src) romanticAudioPlayer.currentTime = t;
        APP_STATE.music.currentTime = t;
      }
    });

    lyricsScrollBox.appendChild(lineEl);
  });
}

function setActiveLyric(index) {
  const lines = lyricsScrollBox.querySelectorAll('.lyrics-line');
  lines.forEach((l, i) => {
    if (i === index) {
      l.classList.add('active');
      l.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      l.classList.remove('active');
    }
  });
  APP_STATE.music.currentVerseIndex = index;
}

function toggleMusicPlay(forcePlay = null) {
  const shouldPlay = forcePlay !== null ? forcePlay : !APP_STATE.music.isPlaying;

  if (shouldPlay) {
    APP_STATE.music.isPlaying = true;
    vinylDisc.classList.add('playing');
    playPauseIcon.textContent = '⏸️';

    // If an uploaded audio source exists, play it, otherwise use built-in romance chords
    if (romanticAudioPlayer.src) {
      const playPromise = romanticAudioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          startBuiltInMelody();
        });
      }
    } else {
      startBuiltInMelody();
    }

    startTimerAndLyrics();
  } else {
    APP_STATE.music.isPlaying = false;
    vinylDisc.classList.remove('playing');
    playPauseIcon.textContent = '▶️';

    if (romanticAudioPlayer.src) {
      romanticAudioPlayer.pause();
    } else {
      stopBuiltInMelody();
    }

    if (APP_STATE.music.interval) {
      clearInterval(APP_STATE.music.interval);
      APP_STATE.music.interval = null;
    }
  }
}

btnPlayPause?.addEventListener('click', () => {
  toggleMusicPlay();
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function startTimerAndLyrics() {
  if (APP_STATE.music.interval) clearInterval(APP_STATE.music.interval);

  const song = getSavedSong();
  const totalVerses = song.lyrics.length;

  APP_STATE.music.interval = setInterval(() => {
    if (!APP_STATE.music.isPlaying) return;

    if (romanticAudioPlayer.src && !romanticAudioPlayer.paused) {
      APP_STATE.music.currentTime = romanticAudioPlayer.currentTime;
      APP_STATE.music.duration = romanticAudioPlayer.duration || 65;
    } else {
      APP_STATE.music.currentTime = (APP_STATE.music.currentTime + 0.25) % (APP_STATE.music.duration || 65);
    }

    // Update scrubber
    const currentDur = APP_STATE.music.duration || 65;
    const pct = (APP_STATE.music.currentTime / currentDur) * 100;
    audioScrubber.value = Math.min(100, pct);
    currentTimeDisplay.textContent = formatTime(APP_STATE.music.currentTime);
    durationDisplay.textContent = formatTime(currentDur);

    // Sync lyrics line
    if (song.timedLyrics && song.timedLyrics.length > 0) {
      let activeIdx = 0;
      for (let i = 0; i < song.timedLyrics.length; i++) {
        if (APP_STATE.music.currentTime >= song.timedLyrics[i].time) {
          activeIdx = i;
        } else {
          break;
        }
      }
      if (activeIdx !== APP_STATE.music.currentVerseIndex) {
        setActiveLyric(activeIdx);
      }
    } else {
      const verseDuration = currentDur / Math.max(1, totalVerses);
      const activeIdx = Math.floor(APP_STATE.music.currentTime / verseDuration);
      if (activeIdx !== APP_STATE.music.currentVerseIndex && activeIdx < totalVerses) {
        setActiveLyric(activeIdx);
      }
    }
  }, 250);
}

// Scrubber seeking
audioScrubber?.addEventListener('input', (e) => {
  const pct = e.target.value;
  APP_STATE.music.currentTime = (pct / 100) * (APP_STATE.music.duration || 65);
  if (romanticAudioPlayer.src) {
    romanticAudioPlayer.currentTime = APP_STATE.music.currentTime;
  }
  currentTimeDisplay.textContent = formatTime(APP_STATE.music.currentTime);
});

// Previous / Next Verse Buttons
document.getElementById('btnPrevVerse')?.addEventListener('click', () => {
  const song = getSavedSong();
  const newIdx = Math.max(0, APP_STATE.music.currentVerseIndex - 1);
  setActiveLyric(newIdx);
  if (song.timedLyrics && song.timedLyrics[newIdx]) {
    const t = song.timedLyrics[newIdx].time;
    if (romanticAudioPlayer.src) romanticAudioPlayer.currentTime = t;
    APP_STATE.music.currentTime = t;
  }
});

document.getElementById('btnNextVerse')?.addEventListener('click', () => {
  const song = getSavedSong();
  const newIdx = Math.min(song.lyrics.length - 1, APP_STATE.music.currentVerseIndex + 1);
  setActiveLyric(newIdx);
  if (song.timedLyrics && song.timedLyrics[newIdx]) {
    const t = song.timedLyrics[newIdx].time;
    if (romanticAudioPlayer.src) romanticAudioPlayer.currentTime = t;
    APP_STATE.music.currentTime = t;
  }
});

// Audio element event listeners
romanticAudioPlayer?.addEventListener('loadedmetadata', () => {
  if (romanticAudioPlayer.duration) {
    APP_STATE.music.duration = romanticAudioPlayer.duration;
    durationDisplay.textContent = formatTime(romanticAudioPlayer.duration);
  }
});

romanticAudioPlayer?.addEventListener('ended', () => {
  romanticAudioPlayer.currentTime = 0;
  romanticAudioPlayer.play().catch(() => {});
});

// Volume Slider
volumeSlider?.addEventListener('input', (e) => {
  const vol = parseFloat(e.target.value);
  romanticAudioPlayer.volume = vol;
});

// Custom Audio File Upload
customAudioUpload?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  romanticAudioPlayer.src = url;
  APP_STATE.music.hasCustomUpload = true;
  stopBuiltInMelody();
  toggleMusicPlay(true);
  alert(`🎵 Now playing: ${file.name}`);
});

// Back to Envelopes
document.getElementById('btnBackToEnvelopesFromSong')?.addEventListener('click', () => {
  toggleMusicPlay(false);
  goToPage('page-3');
});

// Continue to Finale Page (Gated: only if all letters are opened!)
document.getElementById('btnContinueToFinale')?.addEventListener('click', () => {
  markEnvelopeOpened(3);
  toggleMusicPlay(false);

  if (areAllEnvelopesOpened()) {
    goToPage('page-7');
  } else {
    showCuteLockedNotice("Song completed! 🎶 But you haven't opened all the letters yet. Open all 3 envelopes to unlock our finale promise ❤️");
    goToPage('page-3');
  }
});

// Open Finale from Hub Button (Appears when all 3 envelopes are opened)
document.getElementById('btnOpenFinaleFromHub')?.addEventListener('click', () => {
  if (areAllEnvelopesOpened()) {
    goToPage('page-7');
  } else {
    showCuteLockedNotice();
  }
});

// Locked Modal Close Buttons
document.getElementById('btnCloseLockedModal')?.addEventListener('click', () => {
  document.getElementById('envelopesLockedModal')?.classList.add('hidden');
  goToPage('page-3');
});

document.getElementById('btnCloseLockedModalX')?.addEventListener('click', () => {
  document.getElementById('envelopesLockedModal')?.classList.add('hidden');
});

// Edit Song Details Modal
const songEditModal = document.getElementById('songEditModal');
const inputSongTitle = document.getElementById('inputSongTitle');
const inputArtistName = document.getElementById('inputArtistName');
const inputLyrics = document.getElementById('inputLyrics');

function openSongEditModal() {
  const song = getSavedSong();
  inputSongTitle.value = song.title;
  inputArtistName.value = song.artist;
  inputLyrics.value = song.lyrics.join('\n');
  songEditModal.classList.remove('hidden');
}

document.getElementById('btnEditSongDetails')?.addEventListener('click', openSongEditModal);
document.getElementById('btnEditLyricsQuick')?.addEventListener('click', openSongEditModal);

document.getElementById('btnCloseSongEditModal')?.addEventListener('click', () => {
  songEditModal.classList.add('hidden');
});

document.getElementById('btnSaveSongDetails')?.addEventListener('click', () => {
  const lines = inputLyrics.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const updatedSong = {
    title: inputSongTitle.value.trim() || 'Our Special Song',
    artist: inputArtistName.value.trim() || 'Us',
    lyrics: lines.length > 0 ? lines : DEFAULT_SONG.lyrics
  };
  saveSong(updatedSong);
  songEditModal.classList.add('hidden');
  initSongPage();
});

document.getElementById('btnResetDefaultSong')?.addEventListener('click', () => {
  if (confirm('Reset to default song & lyrics?')) {
    saveSong(DEFAULT_SONG);
    songEditModal.classList.add('hidden');
    initSongPage();
  }
});

// ==========================================================================
// PAGE 7: FINALE / "i will meet you soon, imissu"
// ==========================================================================
function triggerFinaleCelebration() {
  playEnvelopeChime();

  // Burst of celebratory particles on the canvas
  for (let i = 0; i < 40; i++) {
    const p = new HeartParticle();
    p.y = canvas.height * 0.5 + (Math.random() - 0.5) * 200;
    p.x = canvas.width * 0.5 + (Math.random() - 0.5) * 300;
    p.speedY = 1.5 + Math.random() * 2.5;
    particles.push(p);
  }
}

// "Start again" button -> resets state and goes back to Page 1
document.getElementById('btnStartAgain')?.addEventListener('click', () => {
  playClickSound();
  // Reset envelope status
  APP_STATE.envelopeStatus = { 1: false, 2: false, 3: false };
  [1, 2, 3].forEach(num => {
    const card = document.getElementById(`envelopeCard${num}`);
    const status = document.getElementById(`statusEnv${num}`);
    if (card) card.classList.remove('opened');
    if (status) status.textContent = 'Click to open ✨';
  });

  const btnLetter = document.getElementById('btnContinueFromLetter');
  if (btnLetter) {
    btnLetter.innerHTML = '<span class="btn-text">continue</span><span class="heart-pulse">❤️</span>';
  }
  const btnMemories = document.getElementById('btnContinueFromMemories');
  if (btnMemories) {
    btnMemories.innerHTML = '<span>CONTINUE</span>';
  }

  updateHubProgressUI();
  goToPage('page-1');
});

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Ensure default photos exist in state
  if (!localStorage.getItem('bday_photos_list_v3')) {
    savePhotos(DEFAULT_PHOTOS);
  }
  // Ensure default song exists in state (upgrade to our new song)
  const oldSong = localStorage.getItem('bday_song_details');
  if (oldSong) {
    try {
      const parsed = JSON.parse(oldSong);
      if (parsed.title === "Until I Found You") {
        localStorage.removeItem('bday_song_details');
      }
    } catch (e) {}
  }
  if (!localStorage.getItem('bday_song_details_v2')) {
    saveSong(DEFAULT_SONG);
  }
  updateHubProgressUI();
});
