import { Snake } from './snake.js';
import { Food } from './food.js';
import { GRID_SIZE, CELL_SIZE, INITIAL_SPEED } from './config.js';
import { showGameOver } from './main.js';
import { playSound } from './sounds.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game-board');
    this.ctx = this.canvas.getContext('2d');
    this.scoreElement = document.getElementById('score');
    
    // Set canvas size based on CSS dimensions
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.reset();
  }
  
  resizeCanvas() {
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Make sure the canvas is square
    const size = Math.min(containerWidth, containerHeight);
    
    this.canvas.width = size;
    this.canvas.height = size;
    
    // Calculate cell size based on grid size and canvas dimensions
    this.cellSize = size / GRID_SIZE;
    
    // If game is already running, redraw
    if (this.isRunning) {
      this.draw();
    }
  }
  
  reset() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.scoreElement.textContent = this.score;
    this.gameOver = false;
    this.isRunning = false;
    this.speed = INITIAL_SPEED;
    this.lastRenderTime = 0;
    
    // Generate initial food
    this.food.generate(this.snake.body);
    
    // Draw initial state
    this.draw();
  }
  
  start() {
    if (this.gameOver) {
      this.reset();
    }
    
    this.isRunning = true;
    this.lastRenderTime = 0;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  pause() {
    this.isRunning = false;
  }
  
  resume() {
    if (!this.gameOver && !this.isRunning) {
      this.isRunning = true;
      this.lastRenderTime = 0;
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }
  
  gameLoop(currentTime) {
    if (!this.isRunning) return;
    
    requestAnimationFrame(this.gameLoop.bind(this));
    
    // Calculate time since last render
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    
    // If not enough time has passed, skip this frame
    if (secondsSinceLastRender < 1 / this.speed) return;
    
    this.lastRenderTime = currentTime;
    
    this.update();
    this.draw();
  }
  
  update() {
    // Move snake
    this.snake.move();
    
    // Check for food collision
    if (this.checkFoodCollision()) {
      this.snake.grow();
      this.food.generate(this.snake.body);
      this.updateScore();
      playSound('eat');
    }
    
    // Check for wall collision
    if (this.checkWallCollision()) {
      this.gameOver = true;
      this.isRunning = false;
      showGameOver(this.score);
      return;
    }
    
    // Check for self collision
    if (this.checkSelfCollision()) {
      this.gameOver = true;
      this.isRunning = false;
      showGameOver(this.score);
      return;
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid (subtle)
    this.drawGrid();
    
    // Draw food
    this.food.draw(this.ctx, this.cellSize);
    
    // Draw snake
    this.snake.draw(this.ctx, this.cellSize);
  }
  
  drawGrid() {
    this.ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--board-border');
    this.ctx.lineWidth = 0.5;
    this.ctx.globalAlpha = 0.1;
    
    // Draw vertical lines
    for (let i = 1; i < GRID_SIZE; i++) {
      const x = i * this.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let i = 1; i < GRID_SIZE; i++) {
      const y = i * this.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    
    this.ctx.globalAlpha = 1;
  }
  
  checkFoodCollision() {
    const head = this.snake.body[0];
    return head.x === this.food.position.x && head.y === this.food.position.y;
  }
  
  checkWallCollision() {
    const head = this.snake.body[0];
    return (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    );
  }
  
  checkSelfCollision() {
    const head = this.snake.body[0];
    return this.snake.body.slice(1).some(segment => 
      segment.x === head.x && segment.y === head.y
    );
  }
  
  updateScore() {
    this.score += 10;
    this.scoreElement.textContent = this.score;
    
    // Increase speed as score increases
    this.speed = INITIAL_SPEED + Math.floor(this.score / 50);
  }
}