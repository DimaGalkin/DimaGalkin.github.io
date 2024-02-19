// stores keys pressed by the player
let keymap = {};

let glob_scores = undefined;
let glob_is_hs = false;

// game class and background image
let game = undefined;
let bg = undefined;

// dimentions of items
let block_width = 50;
let block_height = 50;

// dimensions of player
let character_height = 80;
let character_width = 80;

// event listeners for key presses
onkeydown = onkeyup = function(e){
  keymap[e.key] = e.type == 'keydown';
}

// event listener for window resize
window.onresize = function() {
  resizeCanvas(innerWidth, innerHeight);
  game.player.position.y = innerHeight - character_height/1.4;
}

// run once before the game starts
function setup() {
  // cap FPS otherwise tearing occurs
  frameRate(60);

  // load background image
  bg = loadImage("assets/background.jpg");

  // create canvas
  createCanvas(innerWidth, innerHeight);
  rectMode(CENTER);

  // create game
  game = new Game();
}

// run every frame
function draw() {
  // draw game state
  game.draw();
}