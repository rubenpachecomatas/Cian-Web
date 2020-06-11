document.addEventListener('keydown', function(event) {
    if (event.keyCode == 32) {
        if (level.gameOver == false) {
            if (character.jumping == false) {
                jump();
            }
        }
    } else if (event.keyCode == 13) {
        start = true;
        if (level.gameOver == true) {
            level.speed = 9;
            cloud.speed = 1;
            background.speed = 2;
            obstacle.x = screenWidth + 100;
            cloud.x = screenWidth + 10;
            level.score = 0;
            level.gameOver = false;
        }
    } else if (event.keyCode == 27) {
        start = false;
        level.speed = 9;
        cloud.speed = 1;
        background.speed = 2;
        obstacle.x = screenWidth + 100;
        cloud.x = screenWidth + 10;
        level.score = 0;
        level.gameOver = false;
    }
});

var imgCharacter;
var imgCloud;
var imgObstacle01;
var imgFloor;

function loadAssets() {
    imgCharacter = new Image();
    imgCharacterBlack = new Image();
    imgFloor = new Image();
    imgCloud = new Image();
    imgObstacle = new Image();
    imgBackground = new Image();
    imgHomeLogo = new Image();

    imgCharacter.src = 'assets/GameAssets/character/player/greyPants.png';
    imgCharacterBlack.src = 'assets/GameAssets/character/armor/blackRobe.png';
    imgFloor.src = 'assets/GameAssets/alphaFloor.png';
    imgCloud.src = 'assets/GameAssets/cloud02.png';
    imgObstacle.src = 'assets/GameAssets/spikes.png';
    imgBackground.src = 'assets/GameAssets/FreeUseAtt/city_backgrounds/city_background_sunsetEdit.png'
    imgHomeLogo.src = 'assets/GameAssets/homeLogo.png'
}

var canvas;
var ctx;

function inicialize() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    loadAssets();
}

var screenWidth = 700;
var screenHeight = 300;

function deleteCanvas() {
    canvas.width = screenWidth;
    canvas.height = screenHeight;
}

var floor = 220;
var character = {
    y: floor,
    vy: 0,
    gravity: 2,
    jump: 28,
    vymax: 9,
    jumping: false
};
var level = {
    speed: 9,
    score: 0,
    gameOver: false
};
var obstacle = {
    x: screenWidth + 100, 
    y: floor + 8.667
};
var cloud = {
    x: screenWidth + 10,
    y: 30,
    speed: 1
};

var background = {
    x: 0,
    y: 0,
    speed: 2
};

var gFloor = {
    x: 0,
    y: floor + 50
};

function drawCharacter() {
    ctx.drawImage(imgCharacter, xi, yi, xf, yf, 100, character.y - 25 + 3, 69, 75);
    ctx.drawImage(imgCharacterBlack, xi, yi, xf, yf, 100, character.y - 25 + 3, 69, 75);
}

xi = 0;
xf = 46;
yi = 150;
yf = 50;

function characterLogic() {
    if (xi < 322) {
        xi += 46;
    } else {
        xi = 0;
    }

    if (character.jumping == true) {
        yi = 0;
        yf = 50;
        xi = 276;
    } else {
        yi = 150;
        yf = 50;
    }
}

function drawObstacle() {
    ctx.drawImage(imgObstacle, 0, 0, 370, 130, obstacle.x, obstacle.y, 61.67, 43.33);
}

function obstacleLogic() {
    if (obstacle.x < -100) {
        obstacle.x = screenWidth + 100;
        level.score++;
        level.speed+= 1;
        console.log(level.speed);
    } else {
        obstacle.x -= level.speed;
    }
}

function drawFloor() {
    ctx.drawImage(imgFloor, gFloor.x, 0, 700, 70, 0, gFloor.y, 700, 70);
}

function floorLogic() {
    if (gFloor.x > 690) {
        gFloor.x = 0;
    } else {
        gFloor.x += level.speed;
    }
}

function drawCloud() {
    ctx.drawImage(imgCloud, 0, 0, 1728, 960, cloud.x, cloud.y, 123.43, 68.57);
}

function cloudLogic() {
    if (cloud.x < -100) {
        cloud.x = screenWidth + 100;
    } else {
        cloud.x -= cloud.speed;
    }
}

function drawBackground() {
    ctx.drawImage(imgBackground, 0, 100, 3772, 384, background.x, background.y, 3772, 384);
}

function backgroundLogic() {
    if (background.x < screenWidth-3772) {
        background.x = 0;
    } else {
        background.x -= background.speed;
    }
}

function jump() {
    character.jumping = true;
    character.vy = character.jump;
}

function gravity() {
    if (character.jumping == true) {
        if ((character.y - character.vy - character.gravity) > floor) {
            character.jumping = false;
            character.vy = 0;
            character.y = floor;
        } else {
            character.vy -= character.gravity;
            character.y -= character.vy;
        }
    }
}

function collision() {
    if (obstacle.x >= 50 && obstacle.x <= 150) {
        if(character.y >= (floor - 43.33)) {
            level.gameOver = true;
            level.speed = 0;
            cloud.speed = 0;
            background.speed = 0;
        }
    }
}

function score() {
    ctx.font = "30px impact";
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillText(`${level.score}`, 600, 50)

    if (level.gameOver == true) {
        ctx.font = "60px impact";
        ctx.fillText('GAME OVER', 230, 150)
        //ctx.strokeText('GAME OVER', 240, 150)
        ctx.font = "30px impact";
        ctx.fillText('Press enter to restart | esc to exit', 160, 190)
        //ctx.strokeText('Press space to restart', 240, 190)
    }
}

// Main Loop

var FPS = 60;
var start = false;

setInterval(function() {
    main();
}, 1000/FPS);

setInterval(function() {
    if (level.speed > 0) {
        characterLogic();
    }
}, 1000/(FPS / 4));

function main() {

    if (start == true) {
        deleteCanvas();
        gravity();
        collision();
        backgroundLogic();
        obstacleLogic();
        cloudLogic();
        floorLogic();
        drawBackground();
        drawFloor();
        drawObstacle();
        drawCloud();
        drawCharacter();
        score();
    } else {
        ctx.drawImage(imgBackground, 0, 50, 3772, 384, background.x, background.y, 3772, 384);
        ctx.drawImage(imgHomeLogo, 50, 30);
        ctx.font = "30px impact";
        ctx.fillStyle = 'white';
        ctx.fillText('Press enter to start', 220, 180)
        ctx.font = "20px impact";
        ctx.fillText('( Jump with space )', 260, 280)
    }
}
