class SnakeGame {
    constructor() {
        let grid = document.getElementById("snakearea");
        let grid_data = window.getComputedStyle(grid);
        this.rows = parseInt(grid_data.gridTemplateRows.split(" ").length);
        this.columns = parseInt(grid_data.gridTemplateColumns.split(" ").length);

        this.fillsnakearea();

        this.setParams();

        this.drawSnake();
        this.placeApple();
    }

    setParams() {
        let middle = {
            x: 25,
            y: 25
        }

        this.clearPos = {
            x: 25,
            y: 25
        }

        this.snakePos = [
            {x: middle.x, y: middle.y},
            {x: middle.x + 1, y: middle.y},
            {x: middle.x + 2, y: middle.y}
        ];

        this.snakePosSet = new Set();

        this.snakePosSet.add(this.genSqID(middle.x, middle.y));
        this.snakePosSet.add(this.genSqID(middle.x + 1, middle.y));
        this.snakePosSet.add(this.genSqID(middle.x + 2, middle.y));

        this.vec2 = {
            x: 1,
            y: 0
        }

        this.applePos = {
            x: 0,
            y: 0
        }

        this.snakeLength = 3;

        let highStored = localStorage.getItem("snakeHS");
        if (highStored != null) {
            this.highscore = highStored;
        } else {
            this.highscore = 0;
        }

        this.currentKey = 39;
        this.eventKey = 39;

        this.otb = false; // out of bounds
        this.gameOverStatus = false;
    }

    randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    genSqID(x, y) {
        let id = (x << 16) + y;
        return id.toString();
    }

    createCell(x, y) {
        let cell = document.createElement("div");
        cell.id = this.genSqID(x, y);
        cell.className = "cell";

        return cell;
    }

    appleCollision() {
        let last = this.snakePos[this.snakePos.length - 1];

        if (last.x == this.applePos.x && last.y == this.applePos.y) {
            let newPos = {x: last.x + this.vec2.x, y: last.y + this.vec2.y};
            this.snakePos.push(newPos);
            this.snakePosSet.add(this.genSqID(newPos.x, newPos.y));
            this.getCell(this.applePos.x, this.applePos.y).style.backgroundColor = "black";
            this.placeApple();

            ++this.snakeLength;
        }
    }

    placeApple() {
        let aX = this.randInt(0, this.columns);
        let aY = this.randInt(5, this.rows);

        while (this.snakePosSet.has(this.genSqID(aX, aY))) {
            ++aX;

            if (aX > this.columns) {
                aX = 0;
                ++aY;
            }

            if (aY > this.rows) {
                aY = 0;
            }
        }

        this.applePos.x = aX;
        this.applePos.y = aY;

        let apple = this.getCell(aX, aY);
        console.log(apple);
        apple.style.visibility = "visible";
        apple.style.backgroundColor = "red";
    }

    getCell(x, y) {
        return document.getElementById(this.genSqID(x, y));
    }

    fillsnakearea() {
        let game_snakearea = document.getElementById("snakearea");

        for (let y = 0; y < this.rows; ++y) {
            for (let x = 0; x < this.columns; ++x) {
                game_snakearea.appendChild(this.createCell(x, y));
            }
        }
    }

    checkBounds() {
        this.appleCollision();

        let last = this.snakePos[this.snakePos.length - 1];
        console.log(last.x);
        if (last.x < 0 || last.y < 0 || last.x > this.columns || last.y > this.rows) {
            this.otb = true;
            this.stop();
        }

        if (this.snakePosSet.size < this.snakeLength) {
            this.otb = true;
            this.stop();
        }
    }

    drawSnake() {
        if (this.otb) {
            return
        }
        for (let index = 0; index < this.snakePos.length; ++index) {
            let cell = this.getCell(this.snakePos[index].x, this.snakePos[index].y);

            cell.style.visibility = "visible";
        }
    }

    moveSnake() {
        if (this.otb) {
            return;
        }

        this.getCell(this.clearPos.x, this.clearPos.y).style.visibility = "hidden";
        this.snakePosSet.delete(this.genSqID(this.clearPos.x, this.clearPos.y));

        let last = this.snakePos[this.snakePos.length - 1];
        this.snakePos.push({
            x: last.x + this.vec2.x,
            y: last.y + this.vec2.y
        });
        this.snakePosSet.add(this.genSqID(last.x + this.vec2.x, last.y + this.vec2.y));

        this.snakePos.shift();


        this.clearPos.x = this.snakePos[0].x;
        this.clearPos.y = this.snakePos[0].y;
    }

    userInput() {
        if (38 == this.currentKey) {
            this.vec2.y = -1;
            this.vec2.x = 0;
            this.eventKey = this.currentKey;
        } else if (40 == this.currentKey) {
            this.vec2.y = 1;
            this.vec2.x = 0;
            this.eventKey = this.currentKey;
        } else if (37 == this.currentKey) {
            this.vec2.y = 0;
            this.vec2.x = -1;
            this.eventKey = this.currentKey;
        } else if (39 == this.currentKey) {
            this.vec2.y = 0;
            this.vec2.x = 1;
            this.eventKey = this.currentKey;
        }
    }

    game() {
        this.hamiltonianInput();

        this.moveSnake();

        this.checkBounds();
        this.drawSnake();
    }

    play() {
        this.gameInterval = setInterval(() => this.game(), 200);

        document.addEventListener("keydown", (e) => this.assignKey(e), false);
    }

    stop() {
        clearInterval(this.gameInterval);
        
        this.gameOver();
    }

    hamiltonianInput() {
    }

};