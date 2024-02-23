/**
 * @authors Rose & Dima
 * @date    2024-02-10
 * @description This file contains the item class which is resonsible for tracking the movement
 * of the item and drawing it on the p5 canvas. It also contains the classes for the different types of items.
*/

/**
*  @class Item
*  @description Is responsible for tracking movment of the item and drawing it on the p5 canvas
*/
class Item {
    constructor(image_uri) {
        /*
        * Initialise the movement properties of the item
        */
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };

        /*
        * Load the image of the item (once when it is created, not every frame)
        */
        this.image = loadImage(image_uri);

        // check if the character images were loaded
        if (this.image == undefined || this.image == null) {
            push();
            textAlign(CENTER);
            text("Failed to load character images", 100, 100);
            pop();
            
            throw new Error("Failed to load character image");
        }

        /*
        * Initialise the item's position and movement properties
        */
        this.reset();
    }
  
    /**
     * @description Resets the position and movement properties of the item
     * @returns {void} void
    */
    reset() {
        /*
        * x : x position is a maximum distance of an 1/3 away from the centre of the screen 
        * y : y position is at the top of the screen
        */
        this.position = {
            x: innerWidth/2 + random(-innerWidth/3, innerWidth/3),
            y: BLOCK_WIDTH / 2
        };

        this.velocity = {
            x: 0,
            y: 50
        };

        this.acceleration = {
            x: 0,
            y: 98
        };
    }
  

    /**
     * @description Draws the item on the p5 canvas based on the internal state of the item
     * @returns {void} void
    */ 
    draw() {
        /*
        * Draw the item on the p5 canvas using p5's image function
        */
        image(this.image, this.position.x, this.position.y, BLOCK_WIDTH, BLOCK_WIDTH);

        /*
        * increment the position of the item by the velocity depending on the frame rate
        */
        this.position.x += this.velocity.x * (1 / frameRate());
        this.position.y += this.velocity.y * (1 / frameRate());

        /*
        * increment the velocity of the item by the acceleration depending on the frame rate
        */
        this.velocity.x = this.velocity.x + (this.acceleration.x * (1 / frameRate()));
        this.velocity.y = this.velocity.y + (this.acceleration.y * (1 / frameRate()));
    }
}

class YellowFish extends Item {
    constructor() {
        // Call the constructor of the parent class
        super("assets/fish1.png");
        this.is_good = true;
    }

    // collision tells the game if the item is good or bad
    collsion() {
        return this.is_good;
    }
}

class BlueFish extends Item {
    constructor() {
        // Call the constructor of the parent class
        super("assets/fish2.png");
        this.is_good = true;
    }

    // collision tells the game if the item is good or bad
    collsion() {
        return this.is_good;
    }
}

class GreyFish extends Item {
    constructor() {
        // Call the constructor of the parent class
        super("assets/fish3.png");
        this.is_good = true;
    }

    // collision tells the game if the item is good or bad
    collsion() {
        return this.is_good;
    }
}

class Grenade extends Item {
    constructor() {
        // Call the constructor of the parent class
        super("assets/grenade.png");
        this.is_good = false;
    }

    // collision tells the game if the item is good or bad
    collsion() {
        return this.is_good;
    }
}