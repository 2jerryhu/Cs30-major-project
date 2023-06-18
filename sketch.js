// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

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
      push();
      stroke(60);
      strokeWeight(0.5);
      line(this.x, this.y + 2, this.x  + textWidth(this.array[this.index]) + 2, this.y + 2);
      pop();
    }
    else if (this.state === "correct") {
      fill("yellow");
    }
    else if (this.state === "incorrect") {
      fill("red");
      push();
      stroke("red");
      strokeWeight(0.5);
      line(this.x, this.y + 2, this.x  + textWidth(this.array[this.index]) + 2, this.y + 2);
      pop();
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
let theTextWidthArray = [];
// combine these arrays when not lazy
let lowercaseLetters = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let upercaseLetters = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let punctuation = ["!", "'", "#", "$", "%", "&", "\"", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@"];
let highScores;

if (localStorage.getItem("high scores") === null) {
  highScores = [];
  localStorage.setItem("high scores", JSON.stringify(highScores));
}
else {
  highScores = JSON.parse(localStorage.getItem("high scores"));
}

let letterCounter = 0;
let dx = 0;
let dy = 0;
let correctDx = 0;
let correctDy = 0;
let wrongKeysCounter = 0;
let correctTypedCounter = 0;
let totalTypedCounter = 0;
let wpm = 0;
let rawWpm = 0;
let accuracy = 0;
let incorrect = 0;
let x, y, endingPosition, keyHeld, backspaceTimer, ctrlHeld, beginTime, startButton, promptIndex;
let finishedTyping = false;
let buttonClicked = false;
let hasSorted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(60);
  
  startButton = createButton("Start");
  startButton.position(100, 200);
  startButton.mousePressed(displayPrompt);
  
  // eslint-disable-next-line no-undef
  backspaceTimer = new Timer(350);
}

function draw() {
  // blinking line
  if (letterCounter === 0 && buttonClicked && millis() % 1000 < 500) {
    stroke("yellow");
    line(200, 200 + 1, 200, 200 - 15);
  }
  else {
    stroke(60);
    line(200, 200 + 1, 200, 200 - 15);
  }

  // displaying keys
  if (buttonClicked && !finishedTyping) {
    for (let keys in compareKeys) {
      smooth();
      compareKeys[keys].display();
    }
  }

  // backspace holding
  if (keyHeld && wrongKeysCounter !== 0 && backspaceTimer.expired()) {
    backspaceKey();
  }

  // ctrl backspace
  if (ctrlHeld && wrongKeysCounter !== 0) {
    if (keyIsPressed && keyCode === 8) {

      push();
      stroke(60);
      strokeWeight(2.5);
      line(200 + dx, 200 + 1 + dy, 200 + dx, 200 - 15 + dy);
      pop();

      stroke("yellow");
      line(200 + correctDx, 200 + 1 + correctDy, 200 + correctDx, 200 - 15 + correctDy);
      dx = correctDx;
      dy = correctDy;

      letterCounter -= wrongKeysCounter;
      while (wrongKeysCounter !== 0) {
        compareKeys[letterCounter + wrongKeysCounter - 1].state = "neutral";
        wrongKeysCounter--;
      }
    }
  }

  if (buttonClicked && letterCounter === thePrompt.length && compareKeys[thePrompt.length - 1].state === "correct") { 
    finishedTyping = true;
    statsPage();
  }
}


function keyPressed() {
  // moveLine  makes it so special characters don't move
  let moveLine = false; 

  if (letterCounter < thePrompt.length && keyIsPressed && (keyCode > 47 && keyCode < 91 || keyCode === 32)) {   
    if (!compareKeys[letterCounter].updateNextLetter() || wrongKeysCounter !== 0) {
      wrongKeysCounter++;
    }

    if (wrongKeysCounter === 0) {
      compareKeys[letterCounter].updateNextLetter();
      correctTypedCounter++;
    }
    else {
      compareKeys[letterCounter].state = "incorrect";
    }
    letterCounter++;
    totalTypedCounter++;
    moveLine = true;
  }

  if (letterCounter === 1) {
    beginTime = millis();
  }

  // right key
  if (letterCounter !== 0 && moveLine) {
    stroke("yellow");

    push();
    stroke(60);
    strokeWeight(2.5);
    line(200 + dx, 200 + 1 + dy, 200 + dx, 200 - 15 + dy);
    pop();

    if (200 + dx >= windowWidth - 160 && thePrompt[letterCounter - 1] === " ") {
      dy += 40;
      endingPosition = dx;
      dx = -1 * (theTextWidthArray[letterCounter - 1] + 2);
    }

    dx += theTextWidthArray[letterCounter - 1] + 2;
    line(200 + dx, 200 + 1 + dy, 200 + dx, 200 - 15 + dy);

    if (compareKeys[letterCounter - 1].state === "correct" && letterCounter > 0) {
      correctDx = dx;
      correctDy = dy;
    }

    // wpm stuff
    wpm = Math.round(correctTypedCounter / 4.5 / ((millis() - beginTime) / 60000));

    push();
  
    push();
    noStroke();
    fill(60);
    rectMode(CORNER);
    rect(200, 130, 150, 25);
    pop();
    
    noStroke();
    fill(250, 200, 140);
    textSize(20);
    if (wpm > 0) {
      text("WPM: " + wpm, 200, 150);
    }
    
    pop();
  }

  // ctrl held
  if (keyCode === 17 && wrongKeysCounter !== 0) {
    ctrlHeld = true;
  }

  // backspace
  if (keyIsDown && keyCode === 8 && wrongKeysCounter !== 0) {
    backspaceKey();
    keyHeld = true;
    backspaceTimer.start();
  }
}

function keyReleased() {
  if (keyCode === 8) {
    keyHeld = false;
    backspaceTimer.reset();
  }
  if (keyCode === 17) {
    ctrlHeld = false;
  }
}

function backspaceKey() {
  letterCounter--;
  wrongKeysCounter--;
  stroke("yellow");

  push();
  stroke(60);
  strokeWeight(2.5);
  line(200 + dx, 200 + 1 + dy, 200 + dx, 200 - 15 + dy);
  pop();
  
  dx += -1 * theTextWidthArray[letterCounter] - 2;
  if (dx === -1 * (theTextWidthArray[letterCounter] + 2) && thePrompt[letterCounter] === " ") {
    dy -= 40; 
    dx = endingPosition;
  }
  line(200 + dx, 200 + 1 + dy, 200 + dx, 200 - 15 + dy);
  compareKeys[letterCounter].state = "neutral";
}

function statsPage() {
  background(60);
  accuracy = Math.round((correctTypedCounter / totalTypedCounter) * 100);
  incorrect = totalTypedCounter - correctTypedCounter;

  push();
  textAlign(LEFT)
  textSize(25);
  text("WPM: " + wpm, width/4 - 50, height/4 - 40);
  text("Accuracy: " + accuracy + "%", width/4 - 50, height/4);
  text("Correct/Incorrect: " + correctTypedCounter + "/" + incorrect, width/4 - 50, height/4 + 40);
  pop();

  if (highScores.length === 0 && !hasSorted) {
    highScores.push(wpm);
  }
  else if (highScores.length < 5 && !hasSorted) {
    highScores.push(wpm);
    selectionSort(highScores);
  }
  else if (highScores.length === 5 && !hasSorted) {
    highScores.push(wpm);
    selectionSort(highScores);
    highScores.pop();
  }
  hasSorted = true;
  localStorage.setItem("high scores", JSON.stringify(highScores));

  let barWidth = (width / 3) / 5;
  
  // Draw bars for each high score
  for (let i = 0; i < highScores.length; i++) {
    let barX = i * barWidth + width/2;
    let barY = height/2 + 50;
    let barHeight = map(highScores[i], 0, max(highScores), 0, -height / 2 + 100);

    // Set a different color for the current high score bar
    if (i === 0) {
      fill("yellow"); 
    } else {
      fill(130); 
    }
    
    // Draw the bar
    rect(barX, barY, barWidth, barHeight);
    
    // Display the score value above the bar
    push();
    textAlign(CENTER);
    text(highScores[i], barX + barWidth / 2, barY + 20);
    pop();
  }
  push()
  textSize(30);
  textAlign(CENTER);
  text("LEADERBOARD", width/2 + barWidth * 2.5, height/2 + 125);
  pop();
}

function selectionSort(aList) {
  let swapLocation = 0;
  
  while (swapLocation < aList.length - 1) {
    let largestLocation = swapLocation;
    
    for (let i = swapLocation + 1; i < aList.length; i++) {
      if (aList[i] > aList[largestLocation]) {
        largestLocation = i;
      }
    }
    
    let tempValue = aList[swapLocation];
    aList[swapLocation] = aList[largestLocation];
    aList[largestLocation] = tempValue;
    
    swapLocation++;
  }
}

function displayPrompt() {
  background(60);
  // resetting stuff
  finishedTyping = false;
  hasSorted = false;
  letterCounter = 0;
  thePrompt = [];
  compareKeys.splice(0, compareKeys.length);
  theTextWidthArray.splice(0, theTextWidthArray.length);
  x = 200;
  y = 200;
  dx = 0;
  dy = 0;
  wrongKeysCounter = 0;
  correctTypedCounter = 0;
  totalTypedCounter = 0;

  // new stuff
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
    let thisKey = new Letter(x, y, lowercaseLetters, letterNumber, "neutral"); 
    
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