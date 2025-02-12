// Wait for the DOM to load before starting the game
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    const tileSize = 30;
    const rows = Math.floor(canvas.height / tileSize);
    const cols = Math.floor(canvas.width / tileSize);
    
    // Update the initial gameState definition
    const gameState = {
        running: true,
        pacman: {
            x: tileSize,
            y: tileSize,
            radius: tileSize / 2,
            speed: 3,
            dx: 0,
            dy: 0,
            nextDirection: null,
            angle: 0,
            powerMode: false
        },
        ghosts: [], // Start with empty ghosts array
        fruits: [],
        powerModeTimer: null
    };

    // Add ghost respawn position in the middle of the labyrinth
    const ghostSpawnPoint = {
        x: Math.floor(cols/2) * tileSize,
        y: Math.floor(rows/2) * tileSize
    };

    // Initialize fruits
    function initializeFruits() {
        gameState.fruits = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (labyrinth[row][col] === 0 && Math.random() < 0.0667) { // Reduced probability
                    gameState.fruits.push({
                        x: col * tileSize,
                        y: row * tileSize,
                        radius: tileSize / 3,
                        active: true
                    });
                }
            }
        }
    }

    // Add a function to check if a position is too close to Pacman
    function isTooCloseToPlayer(x, y, minDistance) {
        const dx = gameState.pacman.x - x;
        const dy = gameState.pacman.y - y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
    }

    // Add a function to initialize ghosts with safe distances
    function initializeGhosts() {
        const minDistance = 8 * tileSize; // Minimum safe distance from Pacman
        const ghostColors = ['red', 'pink', 'cyan', 'orange'];
        const possiblePositions = [
            { x: 5 * tileSize, y: 5 * tileSize },
            { x: 20 * tileSize, y: 5 * tileSize },
            { x: 5 * tileSize, y: 15 * tileSize },
            { x: 20 * tileSize, y: 15 * tileSize }
        ];

        gameState.ghosts = [];

        ghostColors.forEach((color, index) => {
            let position = possiblePositions[index];
            
            // If position is too close to Pacman, try the opposite side of the map
            if (isTooCloseToPlayer(position.x, position.y, minDistance)) {
                position = {
                    x: canvas.width - position.x,
                    y: canvas.height - position.y
                };
            }

            gameState.ghosts.push({
                x: position.x,
                y: position.y,
                radius: tileSize / 2,
                speed: 2,
                dx: 2 * (index % 2 ? -1 : 1), // Alternate initial direction
                dy: 0,
                color: color,
                respawning: false,
                lastMove: Date.now()
            });
        });
    }

    // Update the resetGame function to use the new ghost initialization
    function resetGame() {
        gameState.running = true;
        
        // Reset Pacman
        Object.assign(gameState.pacman, {
            x: tileSize,
            y: tileSize,
            dx: 0,
            dy: 0,
            angle: 0,
            powerMode: false
        });
        
        // Initialize ghosts with safe distances
        initializeGhosts();
        
        // Reset fruits
        initializeFruits();
        
        // Hide restart button
        document.getElementById('restartButton').style.display = 'none';
        
        // Start game loop
        requestAnimationFrame(update);
    }

    // Define labyrinth first
    const labyrinth = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
        [1,1,1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // Teleport tunnel
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    function drawLabyrinth() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (labyrinth[row][col] === 1) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                }
            }
        }
    }
    
    function drawPacman() {
        const mouthAngle = 0.2 * Math.PI;
        ctx.save();
        ctx.translate(gameState.pacman.x + gameState.pacman.radius, gameState.pacman.y + gameState.pacman.radius);
        ctx.rotate(gameState.pacman.angle);
        ctx.beginPath();
        ctx.arc(0, 0, gameState.pacman.radius, mouthAngle, 2 * Math.PI - mouthAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.restore();
    }
    
    function drawGhosts() {
        gameState.ghosts.forEach(ghost => {
            ctx.save();
            ctx.translate(ghost.x + ghost.radius, ghost.y + ghost.radius);
            
            // Ghost body
            ctx.beginPath();
            ctx.arc(0, -ghost.radius/2, ghost.radius, Math.PI, 0, false);
            ctx.lineTo(ghost.radius, ghost.radius/2);
            
            // Wavy bottom
            for(let i = 0; i < 3; i++) {
                ctx.quadraticCurveTo(
                    ghost.radius - (ghost.radius/1.5) * i, 
                    ghost.radius/2 + ghost.radius/4,
                    ghost.radius - (ghost.radius/1.5) * (i + 0.5), 
                    ghost.radius/2
                );
                ctx.quadraticCurveTo(
                    ghost.radius - (ghost.radius/1.5) * (i + 1), 
                    ghost.radius/2 - ghost.radius/4,
                    ghost.radius - (ghost.radius/1.5) * (i + 1), 
                    ghost.radius/2
                );
            }
            
            ctx.lineTo(-ghost.radius, -ghost.radius/2);
            ctx.fillStyle = ghost.color;
            if (gameState.pacman.powerMode) {
                ctx.fillStyle = 'blue';
            }
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(-ghost.radius/2, -ghost.radius/2, ghost.radius/3, 0, Math.PI * 2);
            ctx.arc(ghost.radius/2, -ghost.radius/2, ghost.radius/3, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-ghost.radius/2, -ghost.radius/2, ghost.radius/6, 0, Math.PI * 2);
            ctx.arc(ghost.radius/2, -ghost.radius/2, ghost.radius/6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    function drawFruits() {
        gameState.fruits.forEach(fruit => {
            ctx.beginPath();
            ctx.arc(fruit.x + fruit.radius, fruit.y + fruit.radius, fruit.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();
        });
    }
    
    // Update movement function for smoother turns
    function movePacman() {
        if (gameState.pacman.nextDirection) {
            const nextX = gameState.pacman.x + gameState.pacman.nextDirection.dx;
            const nextY = gameState.pacman.y + gameState.pacman.nextDirection.dy;
            const gridX = Math.floor(nextX / tileSize);
            const gridY = Math.floor(nextY / tileSize);

            if (labyrinth[gridY] && labyrinth[gridY][gridX] === 0) {
                gameState.pacman.dx = gameState.pacman.nextDirection.dx;
                gameState.pacman.dy = gameState.pacman.nextDirection.dy;
                gameState.pacman.nextDirection = null;
            }
        }

        let nextX = gameState.pacman.x + gameState.pacman.dx;
        let nextY = gameState.pacman.y + gameState.pacman.dy;

        // Handle teleportation only in tunnel row
        if (Math.floor(nextY / tileSize) === 5) {
            if (nextX < 0) nextX = canvas.width - tileSize;
            if (nextX > canvas.width - tileSize) nextX = 0;
        }

        const gridX = Math.floor(nextX / tileSize);
        const gridY = Math.floor(nextY / tileSize);

        // Only move if next position is a valid path (0)
        if (labyrinth[gridY] && labyrinth[gridY][gridX] === 0) {
            gameState.pacman.x = nextX;
            gameState.pacman.y = nextY;
        } else {
            // Stop Pacman if hitting a wall
            gameState.pacman.dx = 0;
            gameState.pacman.dy = 0;
        }
    }
    
    // Update checkFruitCollision to change ghost behavior
    function checkFruitCollision() {
        gameState.fruits.forEach((fruit, index) => {
            const dx = gameState.pacman.x - fruit.x;
            const dy = gameState.pacman.y - fruit.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < gameState.pacman.radius + fruit.radius) {
                gameState.fruits.splice(index, 1);
                
                // Clear existing power mode timer if any
                if (gameState.powerModeTimer) {
                    clearTimeout(gameState.powerModeTimer);
                }
                
                gameState.pacman.powerMode = true;
                gameState.ghosts.forEach(ghost => {
                    ghost.speed = 4;  // Faster when fleeing
                });
                
                
                // Set new power mode timer
                gameState.powerModeTimer = setTimeout(() => {
                    gameState.pacman.powerMode = false;
                    gameState.ghosts.forEach(ghost => {
                        ghost.speed = 2;  // Back to normal speed
                    });
                    gameState.powerModeTimer = null;
                }, 5000);
            }
        });
    }
    
    // Update the checkGhostCollision function to respawn ghosts instead of removing them
    function checkGhostCollision() {
        gameState.ghosts.forEach((ghost, index) => {
            const dx = gameState.pacman.x - ghost.x;
            const dy = gameState.pacman.y - ghost.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < gameState.pacman.radius + ghost.radius) {
                if (gameState.pacman.powerMode) {
                    // Respawn ghost at center instead of removing it
                    ghost.x = ghostSpawnPoint.x;
                    ghost.y = ghostSpawnPoint.y;
                    ghost.dx = 0;
                    ghost.dy = 0;
                    
                    // Add visual feedback (optional)
                    ghost.respawning = true;
                    setTimeout(() => {
                        ghost.respawning = false;
                    }, 1000);
                } else {
                    gameState.running = false;
                    document.getElementById('restartButton').style.display = 'block';
                    alert('The hero has fallen, abandon all hope!');
                }
            }
        });
    }
    
    function update() {
        if (!gameState.running) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Debug output
        console.log('Game state:', {
            pacmanPos: { x: gameState.pacman.x, y: gameState.pacman.y },
            ghostsCount: gameState.ghosts.length,
            fruitsCount: gameState.fruits.length,
            gameRunning: gameState.running
        });
        
        drawLabyrinth();
        drawPacman();
        drawGhosts();
        drawFruits();
        movePacman();
        moveGhosts();
        checkFruitCollision();
        checkGhostCollision();
        
        requestAnimationFrame(update);
    }
    
    // Update ghost movement to be autonomous
    // Update moveGhosts function to chase or flee from Pacman
    function moveGhosts() {
        const now = Date.now();
        gameState.ghosts.forEach(ghost => {
            if (!gameState.running) return;
            
            // Ensure ghosts move at consistent intervals
            if (now - ghost.lastMove < 16) return; // About 60fps
            ghost.lastMove = now;
    
            // Calculate direction to or from Pacman
            const dx = gameState.pacman.x - ghost.x;
            const dy = gameState.pacman.y - ghost.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            // Determine target direction based on power mode
            let targetX, targetY;
            if (gameState.pacman.powerMode) {
                // Move randomly when Pacman is in power mode
                const randomDirection = Math.floor(Math.random() * 4);
                switch (randomDirection) {
                    case 0:
                        targetX = ghost.speed;
                        targetY = 0;
                        break;
                    case 1:
                        targetX = -ghost.speed;
                        targetY = 0;
                        break;
                    case 2:
                        targetX = 0;
                        targetY = ghost.speed;
                        break;
                    case 3:
                        targetX = 0;
                        targetY = -ghost.speed;
                        break;
                }
            } else {
                // Chase Pacman when not in power mode
                targetX = dx;
                targetY = dy;
            }
    
            // Normalize direction and get possible moves
            const possibleMoves = [
                { dx: ghost.speed, dy: 0 },
                { dx: -ghost.speed, dy: 0 },
                { dx: 0, dy: ghost.speed },
                { dx: 0, dy: -ghost.speed }
            ];
    
            // Sort moves by how well they align with target direction
            possibleMoves.sort((a, b) => {
                const scoreA = (a.dx * targetX + a.dy * targetY) / distance;
                const scoreB = (b.dx * targetX + b.dy * targetY) / distance;
                return scoreB - scoreA;
            });
    
            // Try moves in order until finding a valid one
            let moved = false;
            for (const move of possibleMoves) {
                const nextX = ghost.x + move.dx;
                const nextY = ghost.y + move.dy;
                const gridX = Math.floor(nextX / tileSize);
                const gridY = Math.floor(nextY / tileSize);
    
                if (labyrinth[gridY] && labyrinth[gridY][gridX] === 0) {
                    // Handle teleportation in tunnel row
                    if (gridY === 5) {
                        if (nextX < 0) ghost.x = canvas.width - tileSize;
                        else if (nextX > canvas.width - tileSize) ghost.x = 0;
                        else ghost.x = nextX;
                    } else {
                        ghost.x = nextX;
                    }
                    ghost.y = nextY;
                    ghost.dx = move.dx;
                    ghost.dy = move.dy;
                    moved = true;
                    break;
                }
            }
    
            // If no valid move found, stop ghost
            if (!moved) {
                ghost.dx = 0;
                ghost.dy = 0;
            }
        });
    }
    
    // Update key handler for smoother turns
    function keyDownHandler(e) {
        if (!gameState.running) return;
        
        const newDirection = {
            'ArrowRight': { dx: gameState.pacman.speed, dy: 0, angle: 0 },
            'ArrowLeft': { dx: -gameState.pacman.speed, dy: 0, angle: Math.PI },
            'ArrowUp': { dx: 0, dy: -gameState.pacman.speed, angle: -Math.PI/2 },
            'ArrowDown': { dx: 0, dy: gameState.pacman.speed, angle: Math.PI/2 }
        }[e.key];
    
        if (newDirection) {
            if (gameState.pacman.dx === 0 && gameState.pacman.dy === 0) {
                // If Pacman is not moving, try to move immediately
                gameState.pacman.dx = newDirection.dx;
                gameState.pacman.dy = newDirection.dy;
                gameState.pacman.angle = newDirection.angle;
            } else {
                // If Pacman is moving, store the next direction
                gameState.pacman.nextDirection = newDirection;
                gameState.pacman.angle = newDirection.angle;
            }
        }
    }
    
    function keyUpHandler(e) {
        if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            gameState.pacman.dx = 0;
            gameState.pacman.dy = 0;
        }
    }
    
    // Add event listeners
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    document.getElementById('restartButton').addEventListener('click', resetGame);
    
    // Initialize game
    initializeGhosts();
    initializeFruits();

    // Start the game loop
    console.log('Starting game...');
    update();
});