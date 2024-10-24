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
  createCanvas(360, 640);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  if (!bgImg) {
    background(135, 206, 235); // Fallback background
  } else {
    background(bgImg); // Use background image if loaded
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    
    if (pipes[i].hits(bird)) {
      console.log("Game Over");
      gameOver = true;
      noLoop();
      displayFinalScore(); // Display final score
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

  if (frameCount % 100 == 0 && !gameOver) {
    pipes.push(new Pipe());
    score++; // Increment score when a pipe passes
  }

  fill(255);
  textSize(32);
  text('Score: ' + score, 10, 35);

  if (gameOver) {
    textSize(64);
    textAlign(CENTER);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2);
  }
}

function keyPressed() {
  if (key == ' ' && !gameOver) {
    bird.up();
  } else if (key == ' ' && gameOver) {
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
    if (birdImg) {
      image(birdImg, this.x, this.y, 34, 24);
    } else {
      fill(255, 204, 0);
      ellipse(this.x, this.y, this.r * 2);
    }
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
    if (topPipeImg && bottomPipeImg) {
      image(topPipeImg, this.x, 0, this.w, this.top);
      image(bottomPipeImg, this.x, height - this.bottom, this.w, this.bottom);
    } else {
      fill(34, 139, 34);
      rect(this.x, 0, this.w, this.top);
      rect(this.x, height - this.bottom, this.w, this.bottom);
    }
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

function displayFinalScore() {
  document.getElementById('final-score').innerHTML = 'Final Score: ' + score;
  document.getElementById('restart-button').style.display = 'block';
}
