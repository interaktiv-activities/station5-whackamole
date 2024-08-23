// The following variables below are all the sound variables and mute/unmute fucntions 
let backgroundMusic = new Audio();
backgroundMusic.src = "sounds/bg-music.mp3";
let backgroundMusicStatus = 0;
let backgroundMusicInterval;

function playBackgroundMusic() {
    backgroundMusic.play();
    if (backgroundMusicStatus == 1) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = 0.5;
    }
}

function muteBackgroundMusic() {
    const muteBtnImg = document.getElementById("mute-btn-img");
    if (backgroundMusicStatus == 0) {
        muteBtnImg.setAttribute("src", "assets/HEADER/mute.png");
        backgroundMusic.volume = 0;
        backgroundMusicStatus++;
    } else {
        muteBtnImg.setAttribute("src", "assets/HEADER/unmute.png");
        backgroundMusic.volume = 0.5;
        backgroundMusicStatus--;
    }
}

document.getElementById("mute-header-btn").addEventListener("click", muteBackgroundMusic)
//END HERE

// Card Slot and Swipe Handling
const cardSlot = document.querySelector('.card-slot');
const swipeCard = document.getElementById('swipe-card');
let startX = 0;
let currentX = 0;
let isSwiping = false;
let cardSlotWidth = cardSlot.offsetWidth; 

// Event Listeners for Swipe Actions
swipeCard.addEventListener('mousedown', startSwipe);
swipeCard.addEventListener('touchstart', startSwipe);
swipeCard.addEventListener('mousemove', swipeMove);
window.addEventListener('touchmove', swipeMove);
window.addEventListener('mouseup', endSwipe);
swipeCard.addEventListener('touchend', endSwipe);
window.addEventListener('resize', updateCardSlotWidth);

// Swipe Functions
function updateCardSlotWidth() {
    cardSlotWidth = cardSlot.offsetWidth;
}

function startSwipe(event) {
    isSwiping = true;
    startX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function swipeMove(event) {
    if (!isSwiping) 
        {
            return
        } else if (isSwiping) {
            currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
            const deltaX = currentX - startX;
        
            // Check if swipe reached the threshold
            if (Math.abs(deltaX) > (cardSlotWidth/1.8) && isSwiping == true) {
                isSwiping = false;
                swipeCard.style.transitionDuration = `.5s`
                swipeCard.style.transform = `translateX(${cardSlotWidth}px)`;
                swipeCard.style.opacity = `0`
                startCardInterval();
            }
            else if (deltaX > 1)
            {
                swipeCard.style.transitionDuration = `0s`;
                swipeCard.style.transform = `translateX(${deltaX}px)`;
            }
        }


}

function endSwipe() {
    if (isSwiping) {
        isSwiping = false;
        swipeCard.style.transform = 'translateX(0)';
    }
}
//END HERE

// The following lines of codes include all of the functions and variables needed for you to transition from the start screen to the game board
let startScreenTimer

function startCardInterval() {
    startScreenTimer = setInterval(startGame, 500);
}

function hideStartScreen() {
    document.getElementById("start-screen").style.display = "none";
    playBackgroundMusic();
    backgroundMusicInterval = setInterval(playBackgroundMusic, 120000);
    clearInterval(startScreenTimer);
}
// END HERE

// The following lines of codes hides all the header and gameboard elements, and shows the end message
function endGame() {
    clearInterval(timer); // Stop the timer if the game ends early
    clearInterval(backgroundMusicInterval);
    backgroundMusic.volume = 0;
    backgroundMusicStatus = 1;
    document.getElementById("game-board").style.display = "none";
    document.getElementById("header").style.display = "none";
    if (score >= 100) {
        document.getElementById("pass-end-screen").style.display = "flex";
    } else {
        document.getElementById("fail-end-screen").style.display = "flex";
    }
}

// END HERE

// QUESTION BANK
let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let timer;
let timeLeft = 30;

window.onload = function() {
    setGame();
}

function setGame() {
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 999); // 1000 miliseconds = 1 second, every 1 second call setMole
    setInterval(setPlant, 999); // 2000 miliseconds = 2 seconds, every 2 second call setPlant
}

function getRandomTile() {
    //math.random --> 0-1 --> (0-1) * 9 = (0-9) --> round down to (0-8) integers
    let num = Math.floor(Math.random() * 6);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./number.gif";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./r.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = "SCORE: " + score; // update score html
    } else if (this == currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString(); // update score html
        gameOver = true;  // Fixed the typo here
        endGame();  // Trigger the end game screen
    }
}

function startTimer() {
    timer = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("game-timer-txt").innerText = `Time Left: ${timeLeft}`;
        } else {
            clearInterval(timer);
            endGame(); // End the game when the timer runs out
        }
    }, 1000); // Decrease time every second
}


// GAME FUNCTIONS PROPER

function startGame() {
    hideStartScreen();
    startTimer(); // Start the timer when the game starts
}