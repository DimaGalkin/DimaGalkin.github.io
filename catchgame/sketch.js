/**
 * @authors Rose
 * @date    2024-02-19
 * @description This file contains boilerplate code for the game and default p5.js functions.
*/

// stores keys pressed by the player
let KEYMAP = {};

// game class and background image
let GAME = undefined;
let BG = undefined;

// dimentions of items
let BLOCK_WIDTH = 50;
let BLOCK_HEIGHT = 50;

// dimensions of player
let CHARACTER_HEIGHT = 80;
let CHARACTER_WIDTH = 80;

// event listeners for key presses
onkeydown = onkeyup = function(e){
  KEYMAP[e.key] = e.type == 'keydown';
}

// event listener for window resize
window.onresize = function() {
  resizeCanvas(innerWidth, innerHeight);
  GAME.player.position.y = innerHeight - CHARACTER_HEIGHT/1.4;
}

// run once before the game starts
function setup() {
  // cap FPS otherwise tearing occurs
  frameRate(60);

  // load background image
  BG = loadImage("assets/background.jpg");

  // create canvas
  createCanvas(innerWidth, innerHeight);
  rectMode(CENTER);

  // create game
  GAME = new Game();
}

// run every frame
function draw() {
  // draw game state
  GAME.draw();
}