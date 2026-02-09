// Constants
const PLAYER_SPEED = 5;
const GHOST_SPEED = 2;
const PELLET_POINTS = 10;
const GHOST_POINTS = 50;
const POWER_UP_DURATION = 5000;
const INITIAL_LIVES = 3;

const canvas = document.querySelector("#PacManCanvas");
const c = canvas.getContext("2d");

const scoreEl = document.querySelector("#scoreEl");
const statusEl = document.querySelector("#statusEl");
const livesEl = document.querySelector("#livesEl");
const highScoreEl = document.querySelector("#highScoreEl");
const levelEl = document.querySelector("#levelEl");

canvas.width = 1200;
canvas.height = 600;

class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw() {
//         c.fillStyle = "blue"
//         c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)

    }
}

class Player{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0
        this.openRate = 0.12
        this.rotation = 0
    }
    draw(){
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)



        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = "yellow"
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.radians < 0 || this.radians > .75) this.openRate = -this.openRate
            this.radians += this.openRate
    }
}
class Ghost{
    static speed = GHOST_SPEED
    constructor({position, velocity, color = "red"}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = GHOST_SPEED
        this.scared = false
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2 )
        c.fillStyle = this.scared ? "blue" : this.color
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Pellet{
    constructor({ position }){
        this.position = position
        this.radius = 3
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2 )
        c.fillStyle = "white"
        c.fill()
        c.closePath()
    }
}
class PowerUp{
    constructor({ position }){
        this.position = position
        this.radius = 8
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2 )
        c.fillStyle = "yellow"
        c.fill()
        c.closePath()
    }
}
const pellets = []
const boundaries = []
const powerUps = []
const ghosts = []

const player = new Player({
    position: {
        x: Boundary.width + (Boundary.width / 2),
        y: Boundary.height + (Boundary.height / 2)
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}

let lastKey = "";
let score = 0;
let lives = INITIAL_LIVES;
let highScore = parseInt(localStorage.getItem('pacmanHighScore')) || 0;
let isPaused = false;
let gameOver = false;

// ========================================
// LEVEL DESIGN
// ========================================
// YOUR ORIGINAL MAP - Easy to expand and modify!
// Grid is 30 columns × 15 rows (1200px × 600px at 40px per cell)
//
// Map symbols:
//   Walls: 1,2,3,4 (corners), - (horizontal), | (vertical)
//   Obstacles: b (block), [,],^,_ (caps), + (cross), 5,7 (connectors)
//   Items: . (pellet), p (power-up), ' ' (empty space)
// ========================================

const levels = [
  // LEVEL 1 - Your Original Design (expanded to 30x15)
  [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '[', '7', ']', '.', 'b', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '+', ']', '.', 'b', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '5', ']', '.', 'b', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ],

  // LEVEL 2 - Variation with more obstacles (copy Level 1 and modify as needed)
  [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '[', '7', ']', '.', 'b', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '.', '.', '.', '[', ']', '[', ']', '.', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '+', ']', '.', 'b', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', 'b', '.', 'b', '.', '.', '.', 'b', '.', '.', 'b', '.', '.', '.', 'b', '.', 'b', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '^', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', '[', ']', '.', '[', '5', ']', '.', '.', '.', '[', '5', ']', '.', '[', ']', '.', '[', '+', ']', '.', 'b', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

  // TO ADD MORE LEVELS: Copy a level above, paste it here with a comma, and modify the layout!
  // Remember: Each level should be 30 columns × 15 rows
]

let currentLevel = 0;

// Initialize UI
if (highScoreEl) highScoreEl.innerHTML = highScore;
if (livesEl) livesEl.innerHTML = lives;
if (levelEl) levelEl.innerHTML = currentLevel + 1;

function createImage(src){
    const image = new Image()
    image.src =  src
    return image
}

function loadLevel(levelIndex) {
    // Clear existing game objects
    pellets.length = 0;
    powerUps.length = 0;
    boundaries.length = 0;

    const currentMap = levels[levelIndex];

    // Build level from map
    currentMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case '-':
                    boundaries.push(new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./images/pipeHorizontal.png')
                    }));
                    break;
                case '|':
                    boundaries.push(new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./images/pipeVertical.png')
                    }));
                    break;
                case '1':
                    boundaries.push(new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./images/pipeCorner1.png')
                    }));
                    break;
                case '2':
                    boundaries.push(new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./images/pipeCorner2.png')
                    }));
                    break;
                case '3':
                    boundaries.push(new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./images/pipeCorner3.png')
                    }));
                    break;
                case '4':
                    boundaries.push(new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./images/pipeCorner4.png')
                    }));
                    break;
                case 'b':
                    boundaries.push(new Boundary({
                        position: { x: Boundary.width * j, y: Boundary.height * i },
                        image: createImage('./images/block.png')
                    }));
                    break;
                case '[':
                    boundaries.push(new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./images/capLeft.png')
                    }));
                    break;
                case ']':
                    boundaries.push(new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./images/capRight.png')
                    }));
                    break;
                case '_':
                    boundaries.push(new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./images/capBottom.png')
                    }));
                    break;
                case '^':
                    boundaries.push(new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./images/capTop.png')
                    }));
                    break;
                case '+':
                    boundaries.push(new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        image: createImage('./images/pipeCross.png')
                    }));
                    break;
                case '5':
                    boundaries.push(new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        color: 'blue',
                        image: createImage('./images/pipeConnectorTop.png')
                    }));
                    break;
                case '7':
                    boundaries.push(new Boundary({
                        position: { x: j * Boundary.width, y: i * Boundary.height },
                        color: 'blue',
                        image: createImage('./images/pipeConnectorBottom.png')
                    }));
                    break;
                case '.':
                    pellets.push(new Pellet({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    }));
                    break;
                case 'p':
                    powerUps.push(new PowerUp({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    }));
                    break;
            }
        });
    });

    // Reset ghosts with appropriate speed
    ghosts.length = 0;

    // Spawn ghosts based on level (30x15 maps)
    // Easy to customize - just change positions, speeds, and colors!
    if (levelIndex === 0) {
        // Level 1 - 2 ghosts, normal speed
        ghosts.push(
            new Ghost({
                position: {
                    x: Boundary.width * 15 + (Boundary.width / 2),
                    y: Boundary.height * 4 + (Boundary.height / 2)
                },
                velocity: { x: GHOST_SPEED, y: 0 },
                color: "red"
            }),
            new Ghost({
                position: {
                    x: Boundary.width * 8 + (Boundary.width / 2),
                    y: Boundary.height * 9 + (Boundary.height / 2)
                },
                velocity: { x: GHOST_SPEED, y: 0 },
                color: "pink"
            })
        );
    } else if (levelIndex === 1) {
        // Level 2 - 3 ghosts, 1.3x faster
        const speed = GHOST_SPEED * 1.3;
        ghosts.push(
            new Ghost({
                position: {
                    x: Boundary.width * 15 + (Boundary.width / 2),
                    y: Boundary.height * 4 + (Boundary.height / 2)
                },
                velocity: { x: speed, y: 0 },
                color: "red"
            }),
            new Ghost({
                position: {
                    x: Boundary.width * 8 + (Boundary.width / 2),
                    y: Boundary.height * 9 + (Boundary.height / 2)
                },
                velocity: { x: speed, y: 0 },
                color: "pink"
            }),
            new Ghost({
                position: {
                    x: Boundary.width * 22 + (Boundary.width / 2),
                    y: Boundary.height * 7 + (Boundary.height / 2)
                },
                velocity: { x: 0, y: speed },
                color: "cyan"
            })
        );
    }
    // Add more levels here! Just add another else if for levelIndex === 2, 3, etc.

    // Update ghost speed property
    ghosts.forEach(ghost => {
        ghost.speed = ghost.velocity.x !== 0 ? Math.abs(ghost.velocity.x) : Math.abs(ghost.velocity.y);
    });
}
// Initialize first level
loadLevel(currentLevel);

function circleCollidesWithRectangle({ circle, rectangle }) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
            circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
            circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
            circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
            circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

let animationId

function animate(){
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    // Handle player movement with refactored collision detection
    if (!isPaused) {
    if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({
                circle: {
                    ...player,
                    velocity: {
                        x: -PLAYER_SPEED,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -PLAYER_SPEED;
            }
        }
    } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({
                circle: {
                    ...player,
                    velocity: {
                        x: PLAYER_SPEED,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = PLAYER_SPEED;
            }
        }
    } else if (keys.ArrowUp.pressed && lastKey === "ArrowUp") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({
                circle: {
                    ...player,
                    velocity: {
                        x: 0,
                        y: -PLAYER_SPEED
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -PLAYER_SPEED;
            }
        }
    } else if (keys.ArrowDown.pressed && lastKey === "ArrowDown") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({
                circle: {
                    ...player,
                    velocity: {
                        x: 0,
                        y: PLAYER_SPEED
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = PLAYER_SPEED;
            }
        }
    }
    // Detect collisions between ghost and player
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i];
        if (Math.hypot(
            ghost.position.x - player.position.x,
            ghost.position.y - player.position.y
        ) < ghost.radius + player.radius) {
            if (ghost.scared) {
                ghosts.splice(i, 1);
                score += GHOST_POINTS;
                scoreEl.innerHTML = score;
            } else {
                lives--;
                livesEl.innerHTML = lives;
                if (lives <= 0) {
                    gameOver = true;
                    cancelAnimationFrame(animationId);
                    console.log("Game Over!");
                    statusEl.style = "visibility:visible;";
                    statusEl.innerHTML = "Game Over!<br>Score: " + score + "<br>Press R to Restart";
                    if (score > highScore) {
                        highScore = score;
                        highScoreEl.innerHTML = highScore;
                        localStorage.setItem('pacmanHighScore', highScore);
                    }
                } else {
                    // Respawn player
                    player.position.x = Boundary.width + (Boundary.width / 2);
                    player.position.y = Boundary.height + (Boundary.height / 2);
                    player.velocity.x = 0;
                    player.velocity.y = 0;
                }
            }
        }
    }
    // Win scenario - level completion
    if (pellets.length === 0) {
        if (currentLevel < levels.length - 1) {
            // Advance to next level
            currentLevel++;
            levelEl.innerHTML = currentLevel + 1;
            isPaused = true;
            statusEl.style = "visibility:visible;";
            statusEl.innerHTML = "Level " + currentLevel + " Complete!<br>Press Space to Continue";

            // Wait for space key to continue
            const continueHandler = (e) => {
                if (e.key === " ") {
                    isPaused = false;
                    statusEl.style = "visibility:hidden;";
                    player.position.x = Boundary.width + (Boundary.width / 2);
                    player.position.y = Boundary.height + (Boundary.height / 2);
                    player.velocity.x = 0;
                    player.velocity.y = 0;
                    loadLevel(currentLevel);
                    addEventListener('keydown', continueHandler, { once: true });
                    removeEventListener('keydown', continueHandler);
                }
            };
            addEventListener('keydown', continueHandler, { once: true });
        } else {
            // Beat all levels!
            gameOver = true;
            cancelAnimationFrame(animationId);
            console.log("You WIN!!");
            statusEl.style = "visibility:visible;";
            statusEl.innerHTML = "You Beat All Levels!<br>Score: " + score + "<br>Press R to Restart";
            if (score > highScore) {
                highScore = score;
                highScoreEl.innerHTML = highScore;
                localStorage.setItem('pacmanHighScore', highScore);
            }
        }
    }

    // Power-ups
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i];
        powerUp.draw();
        // Player collides with powerUp
        if (Math.hypot(
            powerUp.position.x - player.position.x,
            powerUp.position.y - player.position.y
        ) < powerUp.radius + player.radius) {
            powerUps.splice(i, 1);
            // Make ghosts scared
            ghosts.forEach(ghost => {
                ghost.scared = true;
                setTimeout(() => {
                    ghost.scared = false;
                }, POWER_UP_DURATION);
            });
        }
    }

    // Collect pellets
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i];
        pellet.draw();
        if (Math.hypot(
            pellet.position.x - player.position.x,
            pellet.position.y - player.position.y
        ) < pellet.radius + player.radius) {
            pellets.splice(i, 1);
            score += PELLET_POINTS;
            scoreEl.innerHTML = score;
        }
    }

    } // end of !isPaused block

    // Drawing (happens even when paused)
    boundaries.forEach(boundary => {
        boundary.draw()

        if (!isPaused && circleCollidesWithRectangle({
           circle: player,
           rectangle: boundary
        })) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()

    if (!isPaused) {
        ghosts.forEach(ghost =>{
            ghost.update()



        const collisions = []
        boundaries.forEach(boundary => {
            if (
                !collisions.includes("right") &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                            velocity: {
                                x: ghost.speed,
                                y: 0
                            }
                    },
                    rectangle: boundary
                })
            ){
                collisions.push("right")
            }
            if (
                !collisions.includes("up") &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                            velocity: {
                                x: 0,
                                y: -ghost.speed
                            }
                    },
                    rectangle: boundary
                })
            ){
                collisions.push("up")
            }
            if (
                !collisions.includes("down") &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                            velocity: {
                                x: 0,
                                y: ghost.speed
                            }
                    },
                    rectangle: boundary
                })
            ){
                collisions.push("down")
            }
            if (
                !collisions.includes("left") &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                            velocity: {
                                x: -ghost.speed,
                                y: 0
                            }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push("left")
            }
        })

        if(collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            //console.log("gogo")

            if (ghost.velocity.x > 0) ghost.prevCollisions.push("right")
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push("left")
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push("up")
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push("down")

//              console.log(collisions)
//              console.log(ghost.prevCollisions)

            const pathways = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })
//              console.log({ pathways })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]
//             console.log({ direction })
            switch (direction){
                case "down":
                ghost.velocity.y = ghost.speed
                ghost.velocity.x = 0
                break
                case "up":
                ghost.velocity.y = -ghost.speed
                ghost.velocity.x = 0
                break
                case "left":
                ghost.velocity.y = 0
                ghost.velocity.x = -ghost.speed
                break
                case "right":
                ghost.velocity.y = 0
                ghost.velocity.x = ghost.speed
                break
            }
            ghost.prevCollisions = []
        }
    })

        if (player.velocity.x > 0) player.rotation = 0
        else if (player.velocity.x < 0) player.rotation = Math.PI
        else if (player.velocity.y > 0) player.rotation = Math.PI / 2
        else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
    } // end of !isPaused block
} // end of animate

function restartGame() {
    // Reset game state
    currentLevel = 0;
    lives = INITIAL_LIVES;
    score = 0;
    gameOver = false;
    isPaused = false;
    scoreEl.innerHTML = score;
    livesEl.innerHTML = lives;
    levelEl.innerHTML = currentLevel + 1;
    statusEl.style = "visibility:hidden;";

    // Reset player position
    player.position.x = Boundary.width + (Boundary.width / 2);
    player.position.y = Boundary.height + (Boundary.height / 2);
    player.velocity.x = 0;
    player.velocity.y = 0;

    // Load first level
    loadLevel(currentLevel);

    // Restart animation
    if (animationId) cancelAnimationFrame(animationId);
    animate();
}

animate();

addEventListener('keydown', ({key}) => {
    switch (key) {
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            lastKey = "ArrowLeft";
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            lastKey = "ArrowRight";
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = true;
            lastKey = "ArrowUp";
            break;
        case "ArrowDown":
            keys.ArrowDown.pressed = true;
            lastKey = "ArrowDown";
            break;
        case " ":
            if (!gameOver) {
                isPaused = !isPaused;
                if (isPaused) {
                    statusEl.style = "visibility:visible;";
                    statusEl.innerHTML = "PAUSED<br>Press Space to Resume";
                } else {
                    statusEl.style = "visibility:hidden;";
                }
            }
            break;
        case "r":
        case "R":
            restartGame();
            break;
    }
})
addEventListener('keyup', ({key}) => {
            switch (key){
                case "ArrowLeft":
                    keys.ArrowLeft.pressed = false;
                break
                case "ArrowRight":
                    keys.ArrowRight.pressed = false;
                break
                case "ArrowUp":
                    keys.ArrowUp.pressed = false;
                break
                case "ArrowDown":
                    keys.ArrowDown.pressed = false;
                break
            }

})
