/**
 * @authors Dima & Rose
 * @date    2024-02-16
 * @description This file contains the player class which is responsible for drawing and animating the player.
*/

/**
*   @class Player
*   @description This class is responsible for the player's character and its interactions with the game.
*/
class Player {
    constructor(x, y) {
        this.position = { x: x, y: y };
        this.prev_position = { x: x, y: y };

        // character image
        this.frames = [
            loadImage("assets/penguin_front.png"),
            loadImage("assets/one.png"),
            loadImage("assets/two.png"),
            loadImage("assets/three.png"),
        ];

        this.walk_num = 0;
        this.walk_frames = 0;
        this.walking = false;

        // amount of items caught
        this.caught = 0;
    }
  
    /**
     * @description Checks if item is colliding with the player
     * @param {*} items (array of items to check for collision with player)
     * @param {*} cycleItem (function to randomly select a new item)
     * @returns {boolean} (true if a bad item is caught, false otherwise)
    */
    intersects(items, cycleItem) {
        for (let item of items) {
            if (
                item.position.y > this.position.y - CHARACTER_HEIGHT/2 &&
                item.position.y < this.position.y + CHARACTER_HEIGHT/2 &&
                item.position.x > this.position.x - CHARACTER_WIDTH/2 &&    
                item.position.x < this.position.x + CHARACTER_WIDTH/2
            ) {
                // reset item to top of screen
                item.reset();
                // randomly select new item
                cycleItem();

                // end game if item that was caught was a bad item
                if (item.collsion()) {
                    this.caught++;
                } else {
                    // tells the game that a bad item was caught
                    return true;
                }
            }
        }

        // tells the game that no bad items were caught
        return false;
    }

    /**
     * @description Draws the player character on the canvas at player.position
     * @returns void 
    */
    draw() {
        if (this.prev_position.x == this.position.x) {
            // tells the game that the player is not walking: no animation
            this.walk_frames = 0;
            this.walk_num = 0;
            this.walking = false;
        } else if (this.walking) {
            // tells the game that the player is walking: add to number of frames
            this.walk_frames++;
        } else {
            // tells that the game that this is the first frame of walking
            this.walking = true;
            this.walk_num = 1;
        }

        // if the player has walked for an 1/8 of the frame rate, change the animation
        if (this.walk_frames > frameRate() / 8) {
            this.walk_frames = 0;
            this.walk_num++;

            // loop the animation frame
            if (this.walk_num > 3) {
                this.walk_num = 1;
            }
        }
        
        push();
        if (this.prev_position.x > this.position.x) {
            // if the player has moved left, flip the character image
            scale(-1, 1);
            image(this.frames[this.walk_num], -(this.position.x + CHARACTER_WIDTH/2), this.position.y - CHARACTER_HEIGHT/1.4, CHARACTER_WIDTH, CHARACTER_HEIGHT);
        } else {
            // if the player has moved right, display the character image normally
            image(this.frames[this.walk_num], this.position.x - CHARACTER_WIDTH/2, this.position.y - CHARACTER_HEIGHT/1.4, CHARACTER_WIDTH, CHARACTER_HEIGHT);
        }
        pop();

        // update the previous position of the player
        this.prev_position.x = this.position.x;
    }
}