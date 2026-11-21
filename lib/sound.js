// Studio-grade tactile UI sounds (CC0, Kenney / soundcn) with synchronous Web Audio API playback + HTMLAudio fallback

export const METAL_CLICK_DATA_URI =
  "data:audio/mpeg;base64,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";

export const CLICK_SOFT_DATA_URI =
  "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/+1DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAIAAAJxAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr//////////////////////////////////////////////////////////////////wAAAABMYXZjNjIuMTEAAAAAAAAAAAAAAAAkBYYAAAAAAAACcU7MYgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAACghZUlTHgAGDlWufHzAAAVWgJg3EszX3mlF95pSk7enve+GBDEMNMg4R8BLACwAsA7BVjjOhDEMQxWKx5EcJwfB/KBiU8/wI7QH+BHaA/ynv6PB8/LgQEMgD78CHO/oGiAIBAQBAYFAA1hDi4z22DmJ7Et+PSEd1f8Y4PmLI5uDYKAWyCmBlSZJ3gAmD0RBEUDS/HKFzC5iZIr/5FTIvE0Yl3/8ipkXi8Yl0u/xEFQVER7/WCoiCoKiL/4VBURPOqgAQuacbblgZh//7UsQEg8aUBv9cMIAgAAA0gAAABIKqErhFDZUNQ7PRK4S8s8r1HiuGlHuSnenrcW9yvO/PcFflep5XqPKfrO9NTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

export const U_MINI_MAP_OPEN_DATA_URI =
  "data:audio/mpeg;base64,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";

export const PEN_SCRATCH_DATA_URI =
  "data:audio/mpeg;base64,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";

let audioContext = null;
const bufferCache = new Map();
const pendingDecodes = new Map();
let prewarmed = false;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  return audioContext;
}

export function isSoundEnabled() {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem("seavik_sound_muted") !== "true";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("seavik_sound_muted", enabled ? "false" : "true");
  } catch {}
}

export async function decodeDataUri(dataUri) {
  const cached = bufferCache.get(dataUri);
  if (cached) return cached;

  const inflight = pendingDecodes.get(dataUri);
  if (inflight) return inflight;

  const ctx = getAudioContext();
  if (!ctx) return null;

  const promise = (async () => {
    try {
      const base64 = dataUri.split(",")[1];
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
      bufferCache.set(dataUri, audioBuffer);
      return audioBuffer;
    } catch {
      return null;
    } finally {
      pendingDecodes.delete(dataUri);
    }
  })();

  pendingDecodes.set(dataUri, promise);
  return promise;
}

export function prewarmSounds() {
  if (prewarmed || typeof window === "undefined") return;
  prewarmed = true;
  try {
    void decodeDataUri(METAL_CLICK_DATA_URI);
    void decodeDataUri(CLICK_SOFT_DATA_URI);
    void decodeDataUri(U_MINI_MAP_OPEN_DATA_URI);
    void decodeDataUri(PEN_SCRATCH_DATA_URI);
  } catch {}
}

// Immediately pre-decode on client load so buffers are ready before the first click
if (typeof window !== "undefined") {
  setTimeout(prewarmSounds, 0);
  const unlock = () => {
    prewarmSounds();
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}

function playBufferSync(ctx, buffer, { volume = 1, playbackRate = 1, onEnd } = {}) {
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(ctx.destination);

  if (onEnd) {
    source.onended = onEnd;
  }

  source.start(0);
  return {
    stop: () => {
      try {
        source.stop();
      } catch {}
    },
  };
}

function playHtmlAudioFallback(dataUri, { volume = 1, playbackRate = 1, onEnd } = {}) {
  try {
    const audio = new Audio(dataUri);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.playbackRate = playbackRate;
    if (onEnd) {
      audio.onended = onEnd;
    }
    void audio.play().catch(() => {});
    return {
      stop: () => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch {}
      },
    };
  } catch {
    return null;
  }
}

export function playSound(dataUri, options = {}) {
  if (typeof window === "undefined" || !isSoundEnabled()) {
    return Promise.resolve(null);
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return Promise.resolve(playHtmlAudioFallback(dataUri, options));
    }

    // Resume synchronously within the user-activation event stack (do NOT await before start(0))
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const cachedBuffer = bufferCache.get(dataUri);
    if (cachedBuffer) {
      // 100% synchronous buffer start inside the click/tap gesture
      const handle = playBufferSync(ctx, cachedBuffer, options);
      return Promise.resolve(handle);
    }

    // If buffer isn't decoded yet on the very first instant click, play via HTMLAudio synchronously
    // and decode in the background for subsequent clicks
    void decodeDataUri(dataUri);
    return Promise.resolve(playHtmlAudioFallback(dataUri, options));
  } catch {
    return Promise.resolve(playHtmlAudioFallback(dataUri, options));
  }
}

/** Mechanical isometric 3D CAD blueprint press sound */
export function playMetalClick() {
  return playSound(METAL_CLICK_DATA_URI, { volume: 0.85, playbackRate: 1 });
}

/** Crisp tactile soft click for navigation, theme toggle, and buttons */
export function playSoftClick() {
  return playSound(CLICK_SOFT_DATA_URI, { volume: 0.35, playbackRate: 1 });
}

/** Subtle high-frequency micro-tick for filter pills, copy actions, and tags */
export function playTickClick() {
  return playSound(CLICK_SOFT_DATA_URI, { volume: 0.25, playbackRate: 1.24 });
}

/** Pitch-up tactile expand sound for accordion rows */
export function playExpandSound() {
  return playSound(CLICK_SOFT_DATA_URI, { volume: 0.3, playbackRate: 1.12 });
}

/** Pitch-down tactile collapse sound for accordion rows */
export function playCollapseSound() {
  return playSound(CLICK_SOFT_DATA_URI, { volume: 0.28, playbackRate: 0.88 });
}

/** Studio UI whoosh-click for Command Palette (⌘K), TOC Minimap hover, and modals */
export function playMiniMapOpen() {
  return playSound(U_MINI_MAP_OPEN_DATA_URI, { volume: 0.3, playbackRate: 1 });
}

/** Technical Rotring pen-on-paper drawing sound for signature */
export function playPenScratch(options = {}) {
  return playSound(PEN_SCRATCH_DATA_URI, {
    volume: 0.2,
    playbackRate: 1,
    ...options,
  });
}

/** Pronounces "Mao Seavik" with Web Speech API + tactile studio cue */
export function playNamePronunciation(onEnd) {
  playSoftClick();
  if (typeof window === "undefined") return;
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Mao Seavik");
      utterance.lang = "en-US";
      utterance.rate = 0.94;
      utterance.pitch = 1.0;
      utterance.volume = isSoundEnabled() ? 0.9 : 0;
      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }
      window.speechSynthesis.speak(utterance);
      return;
    }
  } catch {}
  if (onEnd) {
    setTimeout(onEnd, 600);
  }
}
