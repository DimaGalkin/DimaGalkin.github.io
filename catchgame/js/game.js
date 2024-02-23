/**
 * @authors Dima & Rose
 * @date    2024-02-19
 * @description This file contains the game class which encapsulates the player and item classes and manages core game logic.
*/

/**
*  @class Game
*  @description This class is responsible for the game logic and drawing.
*/
class Game {
    constructor() {
        // all items that can be displayed on the screen
        this.items = [];
        // item that is currently being displayed on the screen
        this.item = undefined;

        // player character
        this.player = new Player(innerWidth / 2, innerHeight - BLOCK_WIDTH/2);

        // amount of missed items
        this.missed = 0;
        this.max_missed = 5;

        // generate items
        this.populateItems(20, 10);
        // randomly select an item
        this.cycleItem();

        // set draw function to start screen
        this.draw = this.drawStart;
    }

    /**
     * @description Populates the items array with good and bad items
     * @param {int} good number of good items 
     * @param {int} bad number of bad items 
     */
    populateItems(good, bad) {
        good = Math.ceil(good / 3); // good items are appended in groups of 3

        // generate all good items
        for (let i = 0; i < good; i++) {
            this.items.push(new YellowFish());
            this.items.push(new BlueFish());
            this.items.push(new GreyFish());
        }

        // generate all bad items
        for (let i = 0; i < bad; i++) {
            this.items.push(new Grenade());
        }
    }

    /**
     * @description Randomly selects an item from the items array and assigns it to the item property
     * @returns {void}
    */
    cycleItem() {
        this.item = this.items[Math.floor(Math.random() * this.items.length)];
    }
  
    /**
     * @description Checks for collisions between the player and items then checks if items are off the screen
     * @param {array} items (array of items to check for collision with player)
     * @returns {void} void
    */
    intersects(items) {
        // check if items and player intersect, method returns true if a bad item is caught
        let caughtBadItem = this.player.intersects(items, this.cycleItem.bind(this));

        // if a bad item is caught, end the game
        if (caughtBadItem) {
            this.manageLeaderBoard();
            this.draw = this.drawGameOver;
            return;
        }

        items.forEach(element => {
            if (element.position.y > innerHeight - BLOCK_WIDTH/2) {
                element.reset();
                this.cycleItem();
                
                // if player misses a good item, increment missed counter
                if (element.collsion()) {
                    this.missed++;
                }
            }
        });
    }
  
    /**
     * @description Tracks the parseKeymap pressed by the player and moves the player accordingly
     * @returns {void} void
     */
    parseKeymap() {
        if (KEYMAP["ArrowLeft"]) {
            // if the player is within the bounds of the screen, move the player to the left
            if (this.player.position.x - CHARACTER_WIDTH/2 > 0) {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x -= 350 * (1 / frameRate());
            } else {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x = CHARACTER_WIDTH/2;
            }
        }

        if (KEYMAP["ArrowRight"]) {
            // if the player is within the bounds of the screen, move the player to the right
            if (this.player.position.x + CHARACTER_WIDTH/2 < innerWidth) {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x += 350 * (1 / frameRate());
            } else {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x = innerWidth - CHARACTER_WIDTH/2;
            }
        }
    }
  
    /**
     * @description Checks if the game should end and ends the game if the player has missed too many items
     * @returns {void} void
     */
    logic() {
        // if the player misses 5 items, end the game
        if (this.missed >= this.max_missed) {
            this.manageLeaderBoard();
            this.draw = this.drawGameOver;
        }
    }
  
    /**
     * @description Displays the health bar of the player (number of items allowed to be missed before game ends)
     * @returns {void} void
    */
    displayHealth() {
        let max_bar_width = (3*(innerWidth/4)) - (innerWidth/4);
        // calculate the width of the health bar based on the number of missed items
        let bar_width = ((this.max_missed - this.missed) / this.max_missed) * max_bar_width;

        // draw background health bar
        push();
        strokeWeight(15);
        line(innerWidth/4, 40, max_bar_width + (innerWidth/4), 40);
        pop();

        // draw health bar
        push();
        if (bar_width == 0) return;
        stroke(255, 80, 80);
        strokeWeight(15);
        line(innerWidth/4, 40, bar_width + (innerWidth/4), 40);
        pop();
    }

    /**
     * @description Displays the number of items caught by the player
     * @returns {void} void
    */ 
    displayCaught() {
        textSize(50);
        text(this.player.caught, 50, 100);
    }
  
    /**
     * @description Draws the game state
     * @returns {void} void
    */
    drawGame() {
        // draw the background image
        background(BG);

        this.logic(); // game logic
        this.parseKeymap(); // tracks input
        this.intersects(this.items); // checks for collisions

        this.displayHealth();
        this.displayCaught();

        // draw the items and player
        this.item.draw();
        this.player.draw();
    }
  
    /**
     * @description Makes the html of the start screen visible
     * @returns {void} void
    */
    drawStart() {
        document.querySelector(".start").style.display = "flex";
    }

    /**
     * @description Sorts pairs of [name, score] in descending order by score value
     * @param {*} items array of items to sort
     * @returns {void} void
     */
    sort(items) {
        for (let i = 0; i < items.length; ++i) {
            let key = items[i];
            let j = i - 1;

            while (j >= 0 && items[j][1] < key[1]) {
                items[j + 1] = items[j];
                --j;
            }

            items[j + 1] = key;
        }
    }

    /**
     * @description Manages the leader board by adding the player's score to the leader board and displaying the leader board
     * @returns {void} void
    */
    manageLeaderBoard() {
        let scores = localStorage.getItem("scores"); // retrieve scores from local storage
        let uname = document.getElementById("uname").value; // get the username from the input field

        // if scores was not stored in local storage, create a new array with the player's score
        if (scores == null) {
            scores = [[uname, this.player.caught]];
        } else { // if scores was stored in local storage, parse the string into an array and add the player's score
            scores = JSON.parse(scores);

            scores.push([uname, this.player.caught]);

            // sort the scores in descending order
            this.sort(scores);
        }

        // store the scores in local storage
        localStorage.setItem("scores", JSON.stringify(scores));

        // generate the html for the score table
        let table_content = `<tr>
                                <th>Name</th>
                                <th>Score</th>
                             </tr>`;

        for (let score_pair of scores) {
            let row = "<tr>";
            row += `<td>${score_pair[0]}</td>`;
            row += `<td>${score_pair[1]}</td>`;
            row += "</tr>";

            table_content += row;
        }

        // insert the html into the score table
        document.getElementById("scoretable").innerHTML = table_content;
    }
  
    /**
     * @description Makes the html of the game over screen visible and hides the p5 canvas
     * @returns {void} void
    */
    drawGameOver() {
        document.querySelector(".gameover").style.display = "flex";
        document.querySelector('canvas').style.display = "none";
    }
  }