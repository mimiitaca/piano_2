let walls = [];
let ray;
let particle;

let wallCount = 7; // Number of vertical walls
let rayCount = 1; // Ray density
let blackKeys = []; // Array to store black key rectangles

// Sound variables
let Do, Re, Mi, Fa, Sol, La, Si;

/////KEY POSITION ////
let keyX
let keyY
let step

function preload() {
  doSound = loadSound("Do.mp3");
  reSound = loadSound("RE.mp3");
  miSound = loadSound("Mi.mp3");
  faSound = loadSound("Fa.mp3");
  solSound = loadSound("Sol.mp3");
  laSound = loadSound("La.mp3");
  siSound = loadSound("Si.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Fullscreen canvas
   step = width / (wallCount + 1); // Spacing between vertical walls
  let pianoHeight = height * 0.75; // Piano composition height (3/4 of the canvas height)

  for (let i = 0; i < wallCount; i++) {
    let x = step * (i + 1); // Calculate x-coordinate for this wall
    let y1 = height - pianoHeight; // Start y-coordinate (3/4 height of canvas)
    let y2 = height; // End y-coordinate (bottom edge of the canvas)
    walls[i] = new Boundary(x, y1, x, y2); // Create a vertical wall
  }

  // Adding border walls for the piano area
  walls.push(new Boundary(-1, height - pianoHeight, width, height - pianoHeight)); // Top border of piano area
  walls.push(new Boundary(width, height - pianoHeight, width, height)); // Right border
  walls.push(new Boundary(width, height, -1, height)); // Bottom border
  walls.push(new Boundary(-1, height, -1, height - pianoHeight)); // Left border

  // Adding black keys (rectangles)
  let blackKeyPositions = [1, 2, 4, 5, 6]; // Relative positions for black keys
  let keyWidth = step * 0.6; // Width of black key rectangles
  let keyHeight = pianoHeight / 2; // Height of black key rectangles (relative to the piano area)

  for (let octave = 0; octave < wallCount / 7; octave++) {
    for (let pos of blackKeyPositions) {
      let x = step * (pos + 7 * octave) - keyWidth / 2;
      let y = height - pianoHeight; // Align keys with the top of the piano area
      blackKeys.push(new BlackKey(x, y, keyWidth, keyHeight));
    }
  }

  particle = new Particle();

  noCursor();
}
function draw() {
  image (graphics, 0, 0)
}
function draw() {
  background(51, 0, 2); // Background color

  for (let wall of walls) {
    wall.show();
  }

  for (let key of blackKeys) {
    key.show();
    key.castRays(particle.pos);
  }

  particle.update(keyX, keyY); // Particle UPDATE
  particle.show();
  particle.look(walls);

  //TEXT

  
    fill(255, 255, 255);
    textSize(32); // Font size
    textAlign(CENTER, CENTER); // Center alignment
    text("Play a song:", width / 2, height/15);
  
  
    fill(255, 255, 255);
    textSize(32); // Font size
    textAlign(CENTER, CENTER); // Center alignment
    text("| A, S, D, A | D, F, G*| D, F, G* |", width / 2, height/8);


 
}

///////KEYBOARD INTERACTION!!!!
function keyPressed() {
  if (key === "A" || key === "a") {
    keyX= width/16
    keyY= height/1.3
    doSound.play()
  }if (key === "S" || key === "s") {
    keyX= width/5.3
    keyY= height/1.3
    reSound.play()
  }if (key === "D" || key === "d") {
      keyX= width/3.2
    keyY= height/1.3
    miSound.play()
  }if (key === "F" || key === "f") {
      keyX= width/2.3
    keyY= height/1.3
    faSound.play()
  }if (key === "G" || key === "g") {
      keyX= width/1.79
    keyY= height/1.3
    solSound.play()
  }if (key === "H" || key === "h") {
     keyX= width/1.46
    keyY= height/1.3
    laSound.play()
  }
  if (key === "J" || key === "j") {
     keyX= width/1.23
    keyY= height/1.3
    siSound.play()
  }
} ////////FUNCTION KEYPRESSED ENDS HERE

// Function to trigger raycasting interaction on the first vertical division
function triggerRaycasting() {

}

///////////////////////////////////////////////Walls
class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    stroke(255); // Wall color
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

///////////////////////////////////////////////BlackKey
class BlackKey {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.edges = [
      new Boundary(x, y, x + w, y),
      new Boundary(x + w, y, x + w, y + h),
      new Boundary(x + w, y + h, x, y + h),
      new Boundary(x, y + h, x, y)
    ];
  }

  show() {
    fill(254, 190, 255); // Black key color
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  castRays(source) {
    for (let edge of this.edges) {
      const pt = new Ray(createVector(source.x, source.y), 0).cast(edge);
      if (pt) {
        stroke(100, 100, 255, 150); // Light ray color
        ///line(source.x, source.y, pt.x, pt.y);
      }
    }
  }
}

///////////////////////////////////////////Rays
class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  lookAt(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  show() {
    stroke(255); // Light ray color
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 10, this.dir.y * 10);
    pop();
  }

  cast(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    } else {
      return;
    }
  }
}

////////////////////////////////////////////////////Particles
class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.rays = [];
    for (let a = 0; a < 360; a += rayCount) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  look(walls) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      if (closest) {
        stroke(254, 190, 255); // Ray color
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 4);
    for (let ray of this.rays) {
      ray.show();
    }
  }
}

document.getElementById("overlay").addEventListener("click", function () {
  this.style.display = "none";
});