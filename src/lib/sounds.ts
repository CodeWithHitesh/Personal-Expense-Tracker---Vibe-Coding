// RPG Sound Effects Utility
// Using public domain/creative commons assets for the challenge

const SOUNDS = {
  DAMAGE: 'https://assets.mixkit.co/active_storage/sfx/2530/2530-preview.mp3', // Sword hit
  HEAL: 'https://assets.mixkit.co/active_storage/sfx/2531/2531-preview.mp3',   // Magic/Potion
  LEVEL_UP: 'https://assets.mixkit.co/active_storage/sfx/2532/2532-preview.mp3', // Success chime
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',    // UI Click
  HOVER: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',    // UI Hover/Tick
};

class SoundManager {
  private enabled: boolean = true;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  play(soundName: keyof typeof SOUNDS) {
    if (!this.enabled) return;
    
    try {
      let audio = this.audioCache.get(soundName);
      
      if (!audio) {
        audio = new Audio(SOUNDS[soundName]);
        this.audioCache.set(soundName, audio);
      }

      // Reset and play
      audio.currentTime = 0;
      audio.volume = 0.3;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => console.warn("Sound play blocked", e));
      }

      // Force stop after 1.5 seconds to ensure sounds aren't "too long"
      setTimeout(() => {
        if (audio && !audio.paused) {
          // Fade out
          const fadeInterval = setInterval(() => {
            if (audio.volume > 0.05) {
              audio.volume -= 0.05;
            } else {
              audio.pause();
              clearInterval(fadeInterval);
            }
          }, 50);
        }
      }, 1200);

    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }
}

export const soundManager = new SoundManager();
