import { Game } from './game.js';
import { setupControls } from './controls.js';
import { playSound } from './sounds.js';

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  setupControls(game);
  setupButtons(game);
});

function setupButtons(game) {
  const startButton = document.getElementById('start-button');
  const pauseButton = document.getElementById('pause-button');
  const restartButton = document.getElementById('restart-button');

  startButton.addEventListener('click', () => {
    game.start();
    playSound('start');
    startButton.blur(); // Remove focus from button
  });

  pauseButton.addEventListener('click', () => {
    if (game.isRunning) {
      game.pause();
      pauseButton.textContent = 'Resume';
    } else {
      game.resume();
      pauseButton.textContent = 'Pause';
    }
    pauseButton.blur();
  });

  restartButton.addEventListener('click', () => {
    hideGameOver();
    game.reset();
    game.start();
    playSound('start');
    pauseButton.textContent = 'Pause';
  });
}

export function showGameOver(score) {
  const gameOverElement = document.getElementById('game-over');
  const finalScoreElement = document.getElementById('final-score');
  
  finalScoreElement.textContent = score;
  gameOverElement.classList.remove('hidden');
  
  playSound('gameOver');
}

export function hideGameOver() {
  const gameOverElement = document.getElementById('game-over');
  gameOverElement.classList.add('hidden');
}