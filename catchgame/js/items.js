/*
*  @class: Item
*  @description: Is responsible for tracking movment of the item and drawing it on the p5 canvas
*/
class Item {
    constructor(imageUri) {
        /*
        * Initialise the movement properties of the item
        */
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };

        /*
        * Load the image of the item (once when it is created, not every frame)
        */
        this.image = loadImage(imageUri);

        /*
        * Initialise the item's position and movement properties
        */
        this.reset();
    }
  
    reset() {
        /*
        * x : x position is a maximum distance of an 1/3 away from the centre of the screen 
        * y : y position is at the top of the screen
        */
        this.position = {
            x: innerWidth/2 + random(-innerWidth/3, innerWidth/3),
            y: block_width / 2
        };

        /*
        * x : no velocity in the x direction
        * y : y velocity is a random value between 0.5 and 1
        */
        this.velocity = {
            x: 0,
            y: 50
        };

        /*
        * x : no acceleration in the x direction
        * y : y acceleration is a random value between 0.0005 and 0.00075
        */
        this.acceleration = {
            x: 0,
            y: 98
        };
    }
  
    draw() {
        /*
        * Draw the item on the p5 canvas using p5's image function
        */
        image(this.image, this.position.x, this.position.y, block_width, block_width);

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