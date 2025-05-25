import { GRID_SIZE } from './config.js';

export class Food {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.animationFrame = 0;
  }
  
  generate(snakeBody) {
    // Generate random position for food
    let newPosition;
    do {
      newPosition = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Check if position overlaps with snake
    } while (this.overlapsWithSnake(newPosition, snakeBody));
    
    this.position = newPosition;
    this.animationFrame = 0; // Reset animation
  }
  
  overlapsWithSnake(position, snakeBody) {
    return snakeBody.some(segment => 
      segment.x === position.x && segment.y === position.y
    );
  }
  
  draw(ctx, cellSize) {
    const x = this.position.x * cellSize;
    const y = this.position.y * cellSize;
    
    // Update animation frame
    this.animationFrame = (this.animationFrame + 0.05) % (Math.PI * 2);
    
    // Calculate pulse effect
    const pulseSize = 1 + Math.sin(this.animationFrame) * 0.1;
    const size = cellSize * 0.8 * pulseSize;
    const offset = (cellSize - size) / 2;

    // Center position
    const centerX = x + cellSize / 2;
    const centerY = y + cellSize / 2;

    // Draw Python logo
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Blue snake
    ctx.fillStyle = '#4584b6';
    ctx.beginPath();
    ctx.arc(
      -size/4,
      0,
      size/3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Yellow snake
    ctx.fillStyle = '#ffde57';
    ctx.beginPath();
    ctx.arc(
      size/4,
      0,
      size/3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Add shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(
      -size/4,
      -size/6,
      size/8,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}