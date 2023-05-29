// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// use p5play?

// !!!!!  Text width, font kerning !!!!!!!!!!

class Letter {
  constructor(x, y, array, index, state) {
    this.x = x;
    this.y = y;
    this.array = array;
    this.index = index;
    this.state = state;
    this.letterSize = 20;
    this.textFont = "cambria";
  }

  display() {
    noStroke();
    if (this.state === "neutral") {
      fill(130);
    }
    else if (this.state === "correct") {
      fill("yellow");
    }
    else if (this.state === "incorrect") {
      fill("red");
    }
    textSize(this.letterSize);
    textFont(this.textFont);
    text(this.array[this.index], this.x, this.y);
  }

  updateNextLetter() {
    if (key === this.array[this.index] && keyIsPressed) {
      this.state = "correct";
      return true;
    }
    // search up special characters
    else if (key !== this.array[this.index] && keyIsPressed && keyCode > 47 && keyCode < 91 || keyCode === 32) {
      this.state = "incorrect";
      return false;
    }
  }
}

function preload() {
  promptArray.push(loadStrings("assets/forsty-the-snowman.txt"));
  promptArray.push(loadStrings("assets/be-or-not.txt"));
}

// ASCII
let promptArray = []; // array that stores prompts
let compareKeys = []; // array that stores each key class
let thePrompt = []; // each individual letter in the prompt
// combine these arrays when not lazy
let lowercaseLetters = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let upercaseLetters = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let punctuation = ["!", "'", "#", "$", "%", "&", "\"", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@"];
let x, y;
let startButton;
let promptIndex;
let buttonClicked = false;
let letterCounter = 0;
let theTextWidthArray = [];
let dx = 0;
let dy = 0;
let wrongKeysCounter = 0;
let endingPosition;

function setup() {
  createCanvas(windowWidth, windowHeight);
  startButton = createButton("Start");
  startButton.position(100, 100);
  startButton.mousePressed(displayPrompt);
}


function draw() {
  if (letterCounter === 0 && buttonClicked) {
    stroke("yellow");
    line(200, 200 + 5, 200, 200 - 15);
  }
  if (buttonClicked) {
    for (let keys in compareKeys) {
      compareKeys[keys].display();
    }
  }
}

function keyPressed() {
  // moveLine  makes it so special characters don't move
  let moveLine = false;

  if (keyIsPressed && keyCode > 47 && keyCode < 91 || keyCode === 32) {   
    if (!compareKeys[letterCounter].updateNextLetter() || wrongKeysCounter !== 0) {
      wrongKeysCounter++;
    }

    if (wrongKeysCounter === 0) {
      compareKeys[letterCounter].updateNextLetter();
    }
    else {
      compareKeys[letterCounter].state = "incorrect";
    }

    letterCounter++;
    moveLine = true;
  }

  // right key
  if (letterCounter !== 0 && moveLine) {
    stroke("yellow");
    push();
    stroke(60);
    strokeWeight(2.5);
    line(200 + dx, 200 + 5 + dy, 200 + dx, 200 - 15 + dy);
    pop();

    // breaks when letter counter is space
    if (200 + dx >= windowWidth - 160 && thePrompt[letterCounter - 1] === " ") {
      dy += 40;
      endingPosition = dx;
      dx = -1 * (theTextWidthArray[letterCounter - 1] + 2);
    }

    dx += theTextWidthArray[letterCounter - 1] + 2;
    line(200 + dx, 200 + 5 + dy, 200 + dx, 200 - 15 + dy);
  }

  // backspace
  if (keyIsPressed && keyCode === 8 && wrongKeysCounter !== 0) {
    letterCounter--;
    wrongKeysCounter--;
    stroke("yellow");

    push();
    stroke(60);
    strokeWeight(2.5);
    line(200 + dx, 200 + 5 + dy, 200 + dx, 200 - 15 + dy);
    pop();
    
    console.log(endingPosition);
    dx += -1 * theTextWidthArray[letterCounter] - 2;
    if (dx === -1 * (theTextWidthArray[letterCounter] + 2) && thePrompt[letterCounter] === " ") {
      dy -= 40;
      dx = endingPosition;
      console.log(dx);
    }
    line(200 + dx, 200 + 5 + dy, 200 + dx, 200 - 15 + dy);
    compareKeys[letterCounter].state = "neutral";
    compareKeys[letterCounter].display();
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
    let thisKey = new Letter(x, y, lowercaseLetters, letterNumber, "neutral"); // here
    
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