// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// use p5play?

class Letter {
  constructor(x, y, array, index) {
    this.x = x;
    this.y = y;
    this.array = array;
    this.index = index;
    this.letterSize = 16;
    this.textFont = "cambria";
    this.rgb = 140;
  }

  display() {
    fill(this.rgb);
    textSize(this.letterSize);
    textFont(this.textFont);
    text(this.array[this.index], this.x, this.y);
  }

  updateNextLetter() {

  }
}

function preload() {
  frosty = loadStrings("assets/forsty-the-snowman.txt");
}

let frosty;
let promptArray = [];
let letters = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let x = 200;
let y = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  for (let i = 0; i < frosty.length; i++) {
    let letterNumber = 0;

    if (frosty[0].charCodeAt(i) === 32) {
      letterNumber = 0;
    }
    else {
      letterNumber = frosty[0].charCodeAt(i) - 96;
    }

    console.log(letterNumber);
    // compare typed letter with displayed letter
    let thisKey = new Letter(x, y, letters, letterNumber);
    promptArray.push(thisKey);

    thisKey.display();
    
    x += 16;

  }
}
