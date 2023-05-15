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
    textAlign(CENTER);
    text(this.array[this.index], this.x, this.y);
  }

  updateNextLetter() {
    if (key === this.array[this.index] && keyIsPressed) {
      fill("yellow");
      textSize(this.letterSize);
      textFont(this.textFont);
      textAlign(CENTER);
      text(this.array[this.index], this.x, this.y);
    }
  }
}

function preload() {
  promptArray.push(loadStrings("assets/forsty-the-snowman.txt"));
  promptArray.push(loadStrings("assets/be-or-not.txt"));
}

// ASCII
let frosty;
let promptArray = [];
let compareKeys = [];
let thePrompt = [];
// combine these arrays when not lazy
let lowercaseLetters = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let upercaseLetters = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let punctuation = ["!", "'", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@"];
let x, y;
let startButton;
let promptIndex;

function setup() {
  createCanvas(windowWidth, windowHeight);
  startButton = createButton("Start");
  startButton.position(100, 100);
  startButton.mousePressed(displayPrompt);
}

function draw() {
  if (promptArray[promptIndex][0].length === thePrompt.length) {

  }
}

function displayPrompt() {
  thePrompt = [];
  background("white");
  x = 200;
  y = 200;
  promptIndex = Math.floor(random(promptArray.length));
  showPrompt(promptIndex);
  return promptIndex;
}

function showPrompt(u) {
  for (let i = 0; i < promptArray[u][0].length; i++) {
    let letterNumber = 0;

    if (promptArray[u][0][i].charCodeAt(0) === 32) {
      letterNumber = 0;
    }
    else {
      letterNumber = promptArray[u][0][i].charCodeAt(0) - 96;
    }
    
    // compare typed letter with displayed letter
    let thisKey = new Letter(x, y, lowercaseLetters, letterNumber);
    
    compareKeys.push(thisKey);
    thePrompt.push(promptArray[u][0][i]); 
    compareKeys[i].display();

    if (x >= windowWidth - 160 && thePrompt[i] === " ") {
      y += 40;
      x = 200;
    }
    else {
      x += 10;
    }

  }

}