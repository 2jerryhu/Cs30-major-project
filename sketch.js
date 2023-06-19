// HuType (Parody of MonkeyType)
// Jerry Hu
// June 19th, 2023
//
// Extra for Experts:
// I used various concepts not taught in class. One of these was using local storage for a high score system. Another was changing the colors
// of buttons using html functions.The ASCII table was used to display all of the letters. 

// this is the class that controls all letter displaying and accuracy mechanisms
class Letter {
  constructor(x, y, array, index, state) {
    this.x = x;
    this.y = y;
    this.array = array;
    this.index = index;
    this.state = state;
    this.letterSize = 20;
    this.textFont = "cambria"; // this is the best font ever
  }

  // The keys flip between states, depending on if they're neutral, correct, or incorrect, which changes their color
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

  // If the key that is pressed is equal to the key displayed, then return true. Else, return false. 
  updateNextLetter() {
    if (key === this.array[this.index] && keyIsPressed) {
      this.state = "correct";
      return true;
    }
    else if (key !== this.array[this.index] && keyIsPressed && keyCode > 47 && keyCode < 91 || keyCode === 32) {
      this.state = "incorrect";
      return false;
    }
  }
}

// This loads various prompts from movies and books. 
function preload() {
  promptArray.push(loadStrings("assets/forsty-the-snowman.txt"));
  promptArray.push(loadStrings("assets/be-or-not.txt"));
  promptArray.push(loadStrings("assets/ultron.txt"));
  promptArray.push(loadStrings("assets/sam-lotr.txt"));
  promptArray.push(loadStrings("assets/gatsby.txt"));
}

let promptArray = []; // array that stores prompts
let compareKeys = []; // array that stores each key class
let thePrompt = []; // each individual letter in the prompt
let theTextWidthArray = []; // stores the text width of each key
let characters = [" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", 
"9",":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", 
"V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", 
"r", "s", "t", "u", "v", "w", "x", "y", "z"];
let wordBank = ["the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "with", "as", "not", "on", "she", "at",
"by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can",
"more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year",
"some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think",
"most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much",
"should", "well", "people", "down", "out", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place",
"litte", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need",
"mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number",
"part", "turn", "real"]
let highScores;
// this creates the local storage high score system
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
let x, y, endingPosition, keyHeld, backspaceTimer, ctrlHeld, beginTime, startButton, instantDeathButton, randomButton, quoteButton, promptIndex, timer;
// let timerStart; this was originally supposed to be used for the timer, which didn't work out
let finishedTyping = false;
let buttonClicked = false;
let hasSorted = false;
let deathToggle = false;
let randomToggle = false;
let quoteToggle = true;
let dead = false;
let setValues = false;
let isHighlighted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(60);
  
  // various buttons needed for various modes
  startButton = createButton("Start");
  startButton.position(50, 140);
  startButton.mousePressed(displayPrompt);
  
  instantDeathButton = createButton('Instant Death Mode');
  instantDeathButton.position(10, 180);
  instantDeathButton.mousePressed(toggleColor);

  randomButton = createButton("Random Prompt");
  randomButton.position(20, 220);
  randomButton.mousePressed(togglePrompt);

  quoteButton = createButton("Text Quote");
  quoteButton.position(30, 260);
  quoteButton.mousePressed(togglePrompt);
  quoteButton.style('background-color', 'yellow');

  backspaceTimer = new Timer(350);
}

function draw() {
  push();
  fill("yellow");
  textFont("cambria");
  textSize(60);
  textAlign(CENTER);
  text("HuType", width/2, 80);
  pop();

  // introduction text
  if (!buttonClicked) {
    push();
    fill(130);
    textFont("cambria");
    textSize(40);
    textAlign(CENTER);
    text("Welcome to HuType!", width/2, height/2 - height/4);

    push()
    textSize(30);
    text("Type as quickly as you can in the alotted time, or until the prompt ends.", width/2, height/2 - height/7.12142857143);
    text("Select the desired mode, and then click 'start' when ready or to restart a test.", width/2, height/2 - height/9.97);
    text("Aim for perfect accuracy in Instant Death Mode.", width/2, height/2 - height/16.6166666667);
    text("Shortcut: Hit ctrl + backspace to delete all incorrect words", width/2, height/2 - height/49.85);
    text("Shortcut: Hit tab + enter to restart the test quickly", width/2, height/2 + height/49.85);
    pop();
    pop();
  }

  // instant death mode
  if (deathToggle && wrongKeysCounter > 0) {
    dead = true;
    push();
    noStroke();
    fill("red");
    textFont("cambria");
    textSize(40);
    textAlign(CENTER);
    text("RESTART", width/2, height/2 - 300);
    pop();
  }

  // blinking line
  if (letterCounter === 0 && buttonClicked && millis() % 1000 < 500) {
    stroke("yellow");
    line(200, 300 + 1, 200, 300 - 15);
  }
  else {
    stroke(60);
    line(200, 300 + 1, 200, 300 - 15);
  }

  // displaying keys
  if (buttonClicked && !finishedTyping) {
    for (let keys in compareKeys) {
      smooth();
      compareKeys[keys].display();
    }
    }
  
  // timer that didn't work out
  // if (randomToggle && letterCounter > 0) {
  //   if (!setValues) {
  //     timerStart = millis();
  //     timer = 15;
  //     setValues = true;
  //   }
  //   let elapsed = floor((millis() - timerStart) / 1000);
  //   let remaining = timer - elapsed;

  //   push();
  
  //   push();
  //   noStroke();
  //   fill(60);
  //   rectMode(CORNER);
  //   rect(400, 230, 150, 25);
  //   pop();
    
  //   noStroke();
  //   fill(250, 200, 140);
  //   textSize(20);
  //   if (remaining > 0) {
  //     text(remaining, 400, 250);
  //   }
    
  //   pop();

  //   if (remaining <= 0) {
  //     finishedTyping = true;
  //     statsPage();
  //   }
  // }
  
  // tab - enter shortcut, highlights button when tab is clicked
  if (isHighlighted) {
    startButton.style('background-color', 'yellow');
  } 
  else {
    startButton.style('background-color', 'white');
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
      line(200 + dx, 300 + 1 + dy, 200 + dx, 300 - 15 + dy);
      pop();

      stroke("yellow");
      line(200 + correctDx, 300 + 1 + correctDy, 200 + correctDx, 300 - 15 + correctDy);
      dx = correctDx;
      dy = correctDy;

      letterCounter -= wrongKeysCounter;
      while (wrongKeysCounter !== 0) {
        compareKeys[letterCounter + wrongKeysCounter - 1].state = "neutral";
        wrongKeysCounter--;
      }
    }
  }

  // when finished typing, go to the stats page
  if (buttonClicked && letterCounter === thePrompt.length && compareKeys[thePrompt.length - 1].state === "correct") { 
    finishedTyping = true;
    statsPage();
  }
}

function keyPressed() {
  // moveLine  makes it so special characters (like ctrl) don't move the line
  let moveLine = false; 

  // the most important if statement in the program. Controls all the logic of key typing.
  if (!dead && !finishedTyping && letterCounter < thePrompt.length && keyIsPressed && (keyCode > 47 && keyCode < 91 || keyCode > 186 && keyCode < 223 || keyCode === 32)) {   
    if (!compareKeys[letterCounter].updateNextLetter() || wrongKeysCounter !== 0) {
      wrongKeysCounter++;
    }
    // If one key is wrong, then the following keys will be incorrect until they are corrected.
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

  // starting the wpm calculator timer
  if (letterCounter === 1) {
    beginTime = millis();
  }

  // if the correct key is typed, then move the line
  if (letterCounter !== 0 && moveLine && !finishedTyping) {
    stroke("yellow");

    push();
    stroke(60);
    strokeWeight(2.5);
    line(200 + dx, 300 + 1 + dy, 200 + dx, 300 - 15 + dy);
    pop();

    // accounts for line breaks
    if (200 + dx >= windowWidth - 160 && thePrompt[letterCounter - 1] === " ") {
      dy += 40;
      endingPosition = dx;
      dx = -1 * (theTextWidthArray[letterCounter - 1] + 2);
    }

    dx += theTextWidthArray[letterCounter - 1] + 2;
    line(200 + dx, 300 + 1 + dy, 200 + dx, 300 - 15 + dy);

    if (compareKeys[letterCounter - 1].state === "correct" && letterCounter > 0) {
      correctDx = dx;
      correctDy = dy;
    }

    // wpm calculations and displaying
    wpm = Math.round(correctTypedCounter / 4.5 / ((millis() - beginTime) / 60000));

    push();
  
    push();
    noStroke();
    fill(60);
    rectMode(CORNER);
    rect(200, 230, 150, 25);
    pop();
    
    noStroke();
    fill(250, 200, 140);
    textSize(20);
    if (wpm > 0) {
      text("WPM: " + wpm, 200, 250);
    }
    
    pop();
  }

  // ctrl held
  if (!dead && keyCode === 17 && !finishedTyping && wrongKeysCounter !== 0) {
    ctrlHeld = true;
  }

  // backspace
  if (!dead && keyIsDown && keyCode === 8 && !finishedTyping && wrongKeysCounter !== 0) {
    backspaceKey();
    keyHeld = true;
    backspaceTimer.start();
  }

  // tab
  if (keyCode === 9) {
    isHighlighted = true;
  }

  // enter
  if (keyCode === 13 && isHighlighted) {
    displayPrompt();
    isHighlighted = false;
  }
}

function keyReleased() {
  // if backspace is held, then repeatedly delete keys
  if (keyCode === 8) {
    keyHeld = false;
    backspaceTimer.reset();
  }
  // if ctrl is held, then the ctrl backspace shortcut can be used
  if (keyCode === 17) {
    ctrlHeld = false;
  }
}

// essentially the same moving line logic as hitting the right key, expect for hitting the wrong key
function backspaceKey() {
  letterCounter--;
  wrongKeysCounter--;
  stroke("yellow");

  push();
  stroke(60);
  strokeWeight(2.5);
  line(200 + dx, 300 + 1 + dy, 200 + dx, 300 - 15 + dy);
  pop();
  
  dx += -1 * theTextWidthArray[letterCounter] - 2;
  if (dx === -1 * (theTextWidthArray[letterCounter] + 2) && thePrompt[letterCounter] === " ") {
    dy -= 40; 
    dx = endingPosition;
  }
  line(200 + dx, 300 + 1 + dy, 200 + dx, 300 - 15 + dy);
  compareKeys[letterCounter].state = "neutral";
}

// stats page
function statsPage() {
  background(60);
  push()
  fill("yellow");
  textFont("cambria");
  textSize(60);
  textAlign(CENTER);
  text("HuType", width/2, 80);
  pop()
  accuracy = Math.round((correctTypedCounter / totalTypedCounter) * 100);
  incorrect = totalTypedCounter - correctTypedCounter;

  push();
  textAlign(LEFT)
  textSize(25);

  if (wpm > highScores[0] && highScores.length > 1) {
    push()
    fill("yellow");    
    text("WPM: " + wpm, width/4 - 50, height/4 - 40);
    pop();
  }
  else {
    text("WPM: " + wpm, width/4 - 50, height/4 - 40);
  }

  text("Accuracy: " + accuracy + "%", width/4 - 50, height/4);
  text("Correct/Incorrect: " + correctTypedCounter + "/" + incorrect, width/4 - 50, height/4 + 40);
  pop();

    // Local storage system
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

// Used to sort the high scores (basically ripped from my class demos)
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

  // resetting required variables to their original state
  finishedTyping = false;
  hasSorted = false;
  dead = false;
  setValues = false;
  letterCounter = 0;
  thePrompt = [];
  compareKeys.splice(0, compareKeys.length);
  theTextWidthArray.splice(0, theTextWidthArray.length);
  x = 200;
  y = 300;
  dx = 0;
  dy = 0;
  correctDx = 0;
  correctDy = 0;
  wrongKeysCounter = 0;
  correctTypedCounter = 0;
  totalTypedCounter = 0;

  // creating a new prompt depending on the mode
  if (quoteToggle) {
    promptIndex = Math.floor(random(promptArray.length));
    showPrompt(promptIndex);
  }
  else if (randomToggle) {
    showRandomPrompt();
  }

  buttonClicked = true;
}

// this toggles the instant death mode button
function toggleColor() {
  deathToggle = !deathToggle;
  
  if (deathToggle) {
    instantDeathButton.style('background-color', 'red');
  } 
  else {
    instantDeathButton.style('background-color', 'white');
  }
}

// this toglges the switching colors of the 2 prompt modes
function togglePrompt() {
  randomToggle = !randomToggle;
  quoteToggle = !quoteToggle;
  
  if (!quoteToggle) {
    randomButton.style('background-color', 'yellow');
    quoteButton.style('background-color', 'white');
  } 
  else {
    randomButton.style('background-color', 'white');
    quoteButton.style('background-color', 'yellow');
  }
}

// this is the text/movie/book prompt displayer. Looks through every letter and displays it
function showPrompt(u) {
  for (let i = 0; i < promptArray[u][0].length; i++) {
    let letterNumber = 0;
    letterNumber = promptArray[u][0][i].charCodeAt(0) - 32;
    
    let thisKey = new Letter(x, y, characters, letterNumber, "neutral"); 
    
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

// this is the random prompt displayer. Picks a random word from the word bank, and displays it
function showRandomPrompt() {
  let wordIndexes = [];
  for (let u = 0; u < 50; u++) {
    let wordIndex = Math.floor(random(wordBank.length));
    // this makes sure no 2 words are repeated in a prompt
    if (wordIndexes.length > 0) {
      for (w = 0; w < wordIndexes.length; w++) {
        if (wordIndex === wordIndexes[w]) {
          wordIndex = Math.floor(random(wordBank.length));
        }
      }
    }
    wordIndexes.push(wordIndex);
    for (let i = 0; i < wordBank[wordIndex].length + 1; i++) {
      if (i !== wordBank[wordIndex].length) {
        let letterNumber = 0;
        letterNumber = wordBank[wordIndex].charCodeAt(i) - 32;
        
        let thisKey = new Letter(x, y, characters, letterNumber, "neutral"); 
        
        compareKeys.push(thisKey);
        thePrompt.push(wordBank[wordIndex][i]); 
        compareKeys[i].display(130);
        
        theTextWidthArray.push(textWidth(characters[letterNumber]));
        x += textWidth(characters[letterNumber]) + 2;
      }
      else if (u !== 49) {
        let thisKey = new Letter(x, y, characters, 0, "neutral"); 

        compareKeys.push(thisKey);
        thePrompt.push(" "); 
        compareKeys[i].display(130);

        theTextWidthArray.push(textWidth(" "));

        if (x >= windowWidth - 160)  {
          y += 40;
          x = 200;
        }
        else {
          x += textWidth(" ") + 2;
        }
      }
    }
  }
}