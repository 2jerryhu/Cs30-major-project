// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// use p5play?

class AKey {
  constructor(letter) {
    this.letter = letter;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  push();
  translate(mouseX, mouseY);
  text("belloooooo", 300, 300);
  pop();
}
