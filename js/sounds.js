// Sound effects for the game

const soundEffects = {
  eat: new Audio(),
  gameOver: new Audio(),
  start: new Audio()
};

// Set up sound sources (using base64 would be ideal but we'll use URLs)
soundEffects.eat.src = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';
soundEffects.gameOver.src = 'https://assets.mixkit.co/active_storage/sfx/250/250-preview.mp3';
soundEffects.start.src = 'https://assets.mixkit.co/active_storage/sfx/1071/1071-preview.mp3';

// Preload sounds
Object.values(soundEffects).forEach(sound => {
  sound.load();
  sound.volume = 0.3;
});

let soundEnabled = true;

export function playSound(soundName) {
  if (!soundEnabled) return;
  
  const sound = soundEffects[soundName];
  if (sound) {
    // Reset the sound to the beginning if it's already playing
    sound.currentTime = 0;
    
    // Play the sound
    sound.play().catch(error => {
      // Browser might block autoplay
      console.log('Sound playback error:', error);
    });
  }
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}