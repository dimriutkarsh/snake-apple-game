export function setupControls(game) {
  // Keyboard controls
  document.addEventListener('keydown', (event) => {
    if (!handleKeyPress(event.key, game)) {
      // If not a game control key, don't prevent default
      return;
    }
    
    // Prevent default action for arrow keys (page scrolling)
    event.preventDefault();
  });
  
  // Touch controls for mobile
  setupTouchControls(game);
}

function handleKeyPress(key, game) {
  switch (key) {
    case 'ArrowUp':
      game.snake.changeDirection({ x: 0, y: -1 });
      return true;
    case 'ArrowDown':
      game.snake.changeDirection({ x: 0, y: 1 });
      return true;
    case 'ArrowLeft':
      game.snake.changeDirection({ x: -1, y: 0 });
      return true;
    case 'ArrowRight':
      game.snake.changeDirection({ x: 1, y: 0 });
      return true;
    case ' ': // Space key
      if (game.isRunning) {
        game.pause();
        document.getElementById('pause-button').textContent = 'Resume';
      } else {
        game.resume();
        document.getElementById('pause-button').textContent = 'Pause';
      }
      return true;
    default:
      return false;
  }
}

function setupTouchControls(game) {
  const gameBoard = document.getElementById('game-board');
  let touchStartX = 0;
  let touchStartY = 0;
  
  gameBoard.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    event.preventDefault();
  }, { passive: false });
  
  gameBoard.addEventListener('touchmove', (event) => {
    if (!game.isRunning) return;
    
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    
    handleSwipe(
      touchStartX,
      touchStartY,
      touchEndX,
      touchEndY,
      game
    );
    
    // Update touch start for continuous swiping
    touchStartX = touchEndX;
    touchStartY = touchEndY;
    
    event.preventDefault();
  }, { passive: false });
}

function handleSwipe(startX, startY, endX, endY, game) {
  const diffX = endX - startX;
  const diffY = endY - startY;
  
  // Only register swipe if movement is significant
  if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) return;
  
  // Determine direction of swipe
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0) {
      game.snake.changeDirection({ x: 1, y: 0 }); // Right
    } else {
      game.snake.changeDirection({ x: -1, y: 0 }); // Left
    }
  } else {
    // Vertical swipe
    if (diffY > 0) {
      game.snake.changeDirection({ x: 0, y: 1 }); // Down
    } else {
      game.snake.changeDirection({ x: 0, y: -1 }); // Up
    }
  }
}