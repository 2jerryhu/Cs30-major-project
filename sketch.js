// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// use p5play?

let frosty;

class Letter {
  constructor(x, y, array, index, prompt) {
    this.x = x;
    this.y = y;
    this.array = array;
    this.index = index;
    this.prompt = prompt;
    this.letterSize = 16;
    this.rgb = 140;
  }

  display() {
    fill(this.rgb);
    textSize(this.letterSize);
    text(this.array[this.index], this.x, this.y);
  }

  update() {

  }
}

function preload() {
  frosty = loadStrings("assets/forsty-the-snowman.txt");
}


let letters = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let thisKey = new Letter(200, 200, letters, 4);

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  thisKey.display();
  for (let snowmans in frosty.length) {
    
    let letterNumber = 0;

  }
}
