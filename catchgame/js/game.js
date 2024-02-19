/*
*  @class: Game
*  @description: This class is responsible for the game logic and drawing.
*/
class Game {
    constructor() {
        // all items that can be displayed on the screen
        this.items = [];
        // item that is currently being displayed on the screen
        this.item = undefined;

        // player character
        this.player = new Player(innerWidth / 2, innerHeight - block_width/2);

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
  
    populateItems(good, bad) {
        good = Math.ceil(good / 3);

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
  
    cycleItem() {
        // randomly select an index and indexes the items array
        this.item = this.items[Math.floor(Math.random() * this.items.length)];
    }
  
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
            if (element.position.y > innerHeight - block_width/2) {
                element.reset();
                this.cycleItem();
                
                // if player misses a good item, increment missed counter
                if (element.collsion()) {
                    this.missed++;
                }
            }
        });
    }
  
    keys() {
        if (keymap["ArrowLeft"]) {
            // if the player is within the bounds of the screen, move the player to the left
            if (this.player.position.x - character_width/2 > 0) {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x -= 350 * (1 / frameRate());
            } else {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x = character_width/2;
            }
        }

        if (keymap["ArrowRight"]) {
            // if the player is within the bounds of the screen, move the player to the right
            if (this.player.position.x + character_width/2 < innerWidth) {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x += 350 * (1 / frameRate());
            } else {
                this.player.prev_position.x = this.player.position.x;
                this.player.position.x = innerWidth - character_width/2;
            }
        }
    }
  
    logic() {
        // if the player misses 5 items, end the game
        if (this.missed >= this.max_missed) {
            this.manageLeaderBoard();
            this.draw = this.drawGameOver;
        }
    }
  
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

    displayCaught() {
        textSize(50);
        text(this.player.caught, 50, 100);        
    }
  
    drawGame() {
        // draw the background image
        background(bg);

        this.logic(); // game logic
        this.keys(); // tracks input
        this.intersects(this.items); // checks for collisions
        this.displayHealth();
        this.displayCaught();

        // draw the items and player
        this.item.draw();
        this.player.draw();
    }
  
    drawStart() {
        // make start screen visible
        document.querySelector(".start").style.display = "flex";
    }

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

    manageLeaderBoard() {
        let highscore;
        let got_hs = false;
        let scores = localStorage.getItem("scores");
        let uname = document.getElementById("uname").value;

        if (scores == null) {
            highscore = this.player.caught;
            scores = [[uname, highscore]];
            got_hs = true;
        } else {
            scores = JSON.parse(scores);

            scores.push([uname, this.player.caught]);
            this.sort(scores);

            if (this.player.caught == scores[0][1]) {
                got_hs = true;
            }
        }

        localStorage.setItem("scores", JSON.stringify(scores));

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

        document.getElementById("scoretable").innerHTML = table_content;

        glob_is_hs = got_hs;
    }
  
    drawGameOver() {
        // make game over screen visible
        // hide p5 canvas
        document.querySelector(".gameover").style.display = "flex";
        document.querySelector('canvas').style.display = "none";
    }
  }