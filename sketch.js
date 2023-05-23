// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// use p5play?

// !!!!!  Text width, font kerning !!!!!!!!!!

class Letter {
  constructor(x, y, array, index) {
    this.x = x;
    this.y = y;
    this.array = array;
    this.index = index;
    this.letterSize = 20;
    this.textFont = "cambria";
    this.rgb = 140;
  }

  display(rgb) {
    noStroke();
    // fill("white");
    // textSize(this.letterSize + 1);
    // textFont(this.textFont);
    // textAlign(CENTER);
    // text(this.array[this.index], this.x, this.y);

    fill(rgb);
    textSize(this.letterSize);
    textFont(this.textFont);
    // textAlign(CENTER);
    text(this.array[this.index], this.x, this.y);
  }

  updateNextLetter() {
    if (key === this.array[this.index] && keyIsPressed) {
      this.display("yellow");
      return true;
    }
    else if (key !== this.array[this.index] && keyIsPressed) {
      this.display("red");
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
let buttonClicked = false;
let letterCounter = 0;
let theTextWidthArray = [];
let dx = 0;
let dy = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  startButton = createButton("Start");
  startButton.position(100, 100);
  startButton.mousePressed(displayPrompt);
}


function keyPressed() {
  let moveLine = false;
  if (keyIsPressed) {
    compareKeys[letterCounter].updateNextLetter();
  }
  if (compareKeys[letterCounter].updateNextLetter()) {
    letterCounter++;
    moveLine = true;
  }
  console.log(letterCounter);

  stroke("yellow");
  if (letterCounter !== 0 && moveLine) {
    push();
    stroke(60);
    strokeWeight(2.5);
    line(200 + dx, 200 + 5 + dy, 200 + dx, 200 - 15 + dy);
    pop();

    if (200 + dx >= windowWidth - 160 && thePrompt[letterCounter - 1] === " ") {
      dy += 40;
      dx = -1 * (theTextWidthArray[letterCounter - 1] + 2);
    }

    dx += theTextWidthArray[letterCounter - 1] + 2;
    line(200 + dx, 200 + 5 + dy, 200 + dx, 200 - 15 + dy);
  }
}

function draw() {
  if (letterCounter === 0 && buttonClicked) {
    stroke("yellow");
    line(200, 200 + 5, 200, 200 - 15);
  }
}

function displayPrompt() {
  thePrompt = [];
  background(60);
  x = 200;
  y = 200;
  promptIndex = Math.floor(random(promptArray.length));
  showPrompt(promptIndex);
  buttonClicked = true;
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
    compareKeys[i].display(130);

    theTextWidthArray.push(textWidth(thePrompt[i]));

    if (x >= windowWidth - 160 && thePrompt[i] === " ") {
      y += 40;
      x = 200;
    }
    else {
      x += theTextWidthArray[i] + 2;
    }

  }

}