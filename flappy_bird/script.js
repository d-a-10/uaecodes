let bird;
let pipes = [];
let birdImg, topPipeImg, bottomPipeImg, bgImg;
let score = 0;
let gravity = 0.6;
let velocity = 0;
let lift = -15;
let gameOver = false;

function preload() {
  birdImg = loadImage('images/bird.png');
  topPipeImg = loadImage('images/toppipe.png');
  bottomPipeImg = loadImage('images/bottompipe.png');
  bgImg = loadImage('images/background.png');
}

function setup() {
  let canvas = createCanvas(360, 640);
  canvas.parent('game-container');
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(bgImg);

  // Draw and update pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].hits(bird)) {
      gameOver = true;
      noLoop(); // Stop the game
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
      score++;
    }
  }

  bird.update();
  bird.show();

  // Add new pipes
  if (frameCount % 100 === 0) {
    pipes.push(new Pipe());
  }

  // Display score
  fill(255);
  textSize(32);
  text('Score: ' + score, 10, 35);

  if (gameOver) {
    textSize(64);
    textAlign(CENTER);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2);

    textSize(32);
    text("Final Score: " + score, width / 2, height / 2 + 50);
    text("Press SPACE to reset", width / 2, height / 2 + 100);
  }
}

function keyPressed() {
  if (key === ' ' && !gameOver) {
    bird.up();
  } else if (key === ' ' && gameOver) {
    resetGame();
  }
}

class Bird {
  constructor() {
    this.x = width / 8;
    this.y = height / 2;
    this.r = 16;
  }

  show() {
    image(birdImg, this.x, this.y, 34, 24);
  }

  up() {
    velocity += lift;
  }

  update() {
    velocity += gravity;
    velocity *= 0.9;
    this.y += velocity;

    if (this.y > height) {
      this.y = height;
      velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      velocity = 0;
    }
  }
}

class Pipe {
  constructor() {
    this.spacing = 150;
    this.top = random(height / 6, (3 / 4) * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 40;
    this.speed = 3;
  }

  hits(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  offscreen() {
    return this.x < -this.w;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    image(topPipeImg, this.x, 0, this.w, this.top);
    image(bottomPipeImg, this.x, height - this.bottom, this.w, this.bottom);
  }
}

function resetGame() {
  gameOver = false;
  bird = new Bird();
  pipes = [];
  score = 0;
  pipes.push(new Pipe());
  loop();
}
