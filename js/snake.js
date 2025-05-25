import { GRID_SIZE, INITIAL_SNAKE_LENGTH } from './config.js';

export class Snake {
  constructor() {
    this.body = [];
    this.initialize();
    this.direction = { x: 1, y: 0 }; // Initial direction: right
    this.nextDirection = { x: 1, y: 0 };
  }
  
  initialize() {
    // Create snake at the center of the grid
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);
    
    // Start with head and add segments to the left
    this.body = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      this.body.push({ x: centerX - i, y: centerY });
    }
  }
  
  move() {
    // Update direction from nextDirection
    this.direction = { ...this.nextDirection };
    
    // Create new head
    const head = { ...this.body[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;
    
    // Add new head to the beginning of the body
    this.body.unshift(head);
    
    // Remove tail (unless growing)
    if (this.growing) {
      this.growing = false;
    } else {
      this.body.pop();
    }
  }
  
  changeDirection(direction) {
    // Prevent 180-degree turns
    if (
      (direction.x === 1 && this.direction.x === -1) ||
      (direction.x === -1 && this.direction.x === 1) ||
      (direction.y === 1 && this.direction.y === -1) ||
      (direction.y === -1 && this.direction.y === 1)
    ) {
      return;
    }
    
    this.nextDirection = direction;
  }
  
  grow() {
    this.growing = true;
  }
  
  draw(ctx, cellSize) {
    const snakeColor = getComputedStyle(document.documentElement).getPropertyValue('--snake-color');
    
    // Draw each segment of the snake
    this.body.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      // Use a slightly different color for the head
      if (index === 0) {
        ctx.fillStyle = snakeColor;
      } else {
        // Make the body segments slightly darker
        ctx.fillStyle = snakeColor;
        ctx.globalAlpha = 0.9 - (index / (this.body.length * 2));
      }
      
      // Draw rounded rectangle for segments
      const radius = cellSize / 5;
      const size = cellSize * 0.9;
      const offset = (cellSize - size) / 2;
      
      this.roundRect(
        ctx, 
        x + offset, 
        y + offset, 
        size, 
        size, 
        radius
      );
      
      ctx.globalAlpha = 1;
    });
    
    // Draw eyes on the head
    this.drawEyes(ctx, cellSize);
  }
  
  drawEyes(ctx, cellSize) {
    const head = this.body[0];
    const x = head.x * cellSize;
    const y = head.y * cellSize;
    const eyeSize = cellSize / 6;
    const eyeOffset = cellSize / 4;
    
    ctx.fillStyle = '#ffffff';
    
    // Eye positions depend on direction
    let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
    
    if (this.direction.x === 1) { // Right
      leftEyeX = x + cellSize - eyeOffset;
      leftEyeY = y + eyeOffset;
      rightEyeX = x + cellSize - eyeOffset;
      rightEyeY = y + cellSize - eyeOffset;
    } else if (this.direction.x === -1) { // Left
      leftEyeX = x + eyeOffset;
      leftEyeY = y + eyeOffset;
      rightEyeX = x + eyeOffset;
      rightEyeY = y + cellSize - eyeOffset;
    } else if (this.direction.y === 1) { // Down
      leftEyeX = x + eyeOffset;
      leftEyeY = y + cellSize - eyeOffset;
      rightEyeX = x + cellSize - eyeOffset;
      rightEyeY = y + cellSize - eyeOffset;
    } else { // Up
      leftEyeX = x + eyeOffset;
      leftEyeY = y + eyeOffset;
      rightEyeX = x + cellSize - eyeOffset;
      rightEyeY = y + eyeOffset;
    }
    
    // Draw eyes
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, eyeSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
  }
}