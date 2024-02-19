/*
*   @class: Player
*   @description: This class is responsible for the player's character and its interactions with the game.
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
  
    intersects(items, cycleItem) {
        for (let item of items) {
            if (
                item.position.y > this.position.y - character_height/2 &&
                item.position.y < this.position.y + character_height/2 &&
                item.position.x > this.position.x - character_width/2 &&    
                item.position.x < this.position.x + character_width/2
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
            image(this.frames[this.walk_num], -(this.position.x + character_width/2), this.position.y - character_height/1.4, character_width, character_height);
        } else {
            // if the player has moved right, display the character image normally
            image(this.frames[this.walk_num], this.position.x - character_width/2, this.position.y - character_height/1.4, character_width, character_height);
        }
        pop();

        // update the previous position of the player
        this.prev_position.x = this.position.x;
    }
}