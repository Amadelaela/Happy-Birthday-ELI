/* ─── Config ───────────────────────────────────────────────────────────── */
// April 11, 2026 00:00:00 Israel Daylight Time (UTC+3) = April 10 21:00 UTC
const TARGET_UTC = new Date('2026-04-10T21:00:00Z');

// To test the unlock flow, uncomment the line below:
// const TARGET_UTC = new Date(Date.now() + 8000);

const TZ_ISRAEL      = 'Asia/Jerusalem';
const TZ_SWITZERLAND = 'Europe/Zurich';

/* ─── DOM refs ──────────────────────────────────────────────────────────── */
const clockIl          = document.getElementById('clock-il');
const clockCh          = document.getElementById('clock-ch');
const digitDays        = document.getElementById('main-days');
const digitHours       = document.getElementById('main-hours');
const digitMins        = document.getElementById('main-mins');
const digitSecs        = document.getElementById('main-secs');
const countdownSection = document.getElementById('countdown-section');
const unlockSection    = document.getElementById('unlock-section');
const contentSection   = document.getElementById('content-section');
const unlockBtn        = document.getElementById('unlock-btn');

/* ─── Clock formatter ───────────────────────────────────────────────────── */
const clockFmt = (tz) => new Intl.DateTimeFormat('en-GB', {
  timeZone: tz,
  hour:   '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const ilFmt = clockFmt(TZ_ISRAEL);
const chFmt = clockFmt(TZ_SWITZERLAND);

function updateClocks() {
  const now = new Date();
  clockIl.textContent = ilFmt.format(now);
  clockCh.textContent = chFmt.format(now);
}

/* ─── Countdown ─────────────────────────────────────────────────────────── */
function getRemainingTime() {
  const diff = TARGET_UTC - Date.now();
  if (diff <= 0) return null;
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000)  / 60000),
    secs:  Math.floor((diff % 60000)    / 1000),
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

const prevDigits = {};

function updateDigit(el, key, val) {
  const s = pad(val);
  if (prevDigits[key] === s) return;
  prevDigits[key] = s;
  el.textContent = s;
  el.classList.remove('flip');
  void el.offsetWidth;
  el.classList.add('flip');
}

function renderCountdown(t) {
  updateDigit(digitDays,  'days',  t.days);
  updateDigit(digitHours, 'hours', t.hours);
  updateDigit(digitMins,  'mins',  t.mins);
  updateDigit(digitSecs,  'secs',  t.secs);
}

/* ─── Countdown complete → unlock prompt ───────────────────────────────── */
let countdownDone = false;

function onCountdownComplete() {
  if (countdownDone) return;
  countdownDone = true;

  countdownSection.classList.add('fade-out');
  setTimeout(() => {
    countdownSection.classList.add('hidden');
    countdownSection.classList.remove('fade-out');
    unlockSection.classList.remove('hidden');
    unlockSection.classList.add('fade-in');
  }, 520);
}

/* ─── Unlock ────────────────────────────────────────────────────────────── */
unlockBtn.addEventListener('click', () => {
  unlockSection.classList.add('fade-out');
  setTimeout(() => {
    unlockSection.classList.add('hidden');
    unlockSection.classList.remove('fade-out');
    contentSection.classList.remove('hidden');
    contentSection.classList.add('fade-in');
    contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 520);
});

/* ─── Main tick ─────────────────────────────────────────────────────────── */
function tick() {
  updateClocks();
  const t = getRemainingTime();
  if (t) {
    renderCountdown(t);
  } else if (!countdownDone) {
    ['days','hours','mins','secs'].forEach((k, i) => {
      updateDigit([digitDays, digitHours, digitMins, digitSecs][i], k, 0);
    });
    onCountdownComplete();
  }
}

tick();
setInterval(tick, 1000);
