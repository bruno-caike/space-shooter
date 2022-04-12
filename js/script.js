const your_ship = document.querySelector('.player-shooter'),
      play_area = document.querySelector('#main-play-area'),
      aliens_img = ['img/monster-1.png', 'img/monster-3.png', 'img/monster-3.png'],
      instructions_text = document.querySelector('.game-instructions'),
      start_button = document.querySelector('.start-button');

let alien_interval

// move to short nave
function flyShip(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key === ' ') {
        event.preventDefault();
        fireLaser();
    }
}


function moveUp() {
    let top_position = getComputedStyle(your_ship).getPropertyValue('top');
    if (parseInt(top_position) <= 0) {
        return 
    } else {
        let position = parseInt(top_position);
        position -= 20;
        your_ship.style.top = `${position}px`;
    }
}

function moveDown() {
    let top_position = getComputedStyle(your_ship).getPropertyValue('top');
    if (top_position === '450px') {
        return 
    } else {
        let position = parseInt(top_position);
        position += 20;
        your_ship.style.top = `${position}px`;
    }
}

function fireLaser() {
    let laser = createLaserElement();
    play_area.appendChild(laser);
    moveLaser(laser);    
}

function createLaserElement() {
    let x_position = parseInt(window.getComputedStyle(your_ship).getPropertyValue('left')),
        y_position = parseInt(window.getComputedStyle(your_ship).getPropertyValue('top')),
        new_laser = document.createElement('img');

    new_laser.src = 'img/shoot.png'
    new_laser.classList.add('laser');
    new_laser.style.left = `${x_position}px`;
    new_laser.style.top = `${y_position - 10}px`;
    return new_laser;
}

function moveLaser(laser) {
    let laser_interval = setInterval(() => {
        let x_position = parseInt(laser.style.left),
            aliens = document.querySelectorAll('.alien');
        
        aliens.forEach(alien => {
            if (checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        });
        if (x_position === 340) {
            laser.remove();
        } else {
            laser.style.left = `${x_position + 8}px`
        }
    }, 10)
}

function createAliens() {
    let new_alien = document.createElement('img'),
        alien_sprite = aliens_img[Math.floor(Math.random() * aliens_img.length)];

    new_alien.src = alien_sprite;
    new_alien.classList.add('alien');
    new_alien.classList.add('alien-transition');
    new_alien.style.left = '370px';
    new_alien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    play_area.appendChild(new_alien);
    moveAlien(new_alien);
}

function moveAlien(alien) {
    let move_alien_interval = setInterval(() => {
        let x_position = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if (x_position <= 50) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            } 
        } else {
            alien.style.left = `${x_position - 4}px`;
        }
    }, 30)
}

function checkLaserCollision(laser, alien) {
    let laser_top = parseInt(laser.style.top), 
        laser_left = parseInt(laser.style.left),
        laser_bottom = laser_top - 20,
        alien_top = parseInt(alien.style.top), 
        alien_left = parseInt(alien.style.left),
        alien_bottom = alien_top - 30;

    if (laser_left != 340 && laser_left + 40 >= alien_left) {
        if (laser_top <= alien_top && laser_top >= alien_bottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

start_button.addEventListener('click', event => {
    playGame();
});

function playGame() {
    start_button.style.display = 'none';
    instructions_text.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alien_interval = setInterval(() => {
        createAliens();
    }, 2000)
}

function gameOver(){
    window.addEventListener('keydown', flyShip);
    clearInterval(alien_interval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach(alien => alien.remove());
    let lasers = document.querySelectorAll('.lasers ');
    lasers.forEach(laser => laser.remove());
    setTimeout(() => {
        alert("Game Over");
        your_ship.style.top = "250px";
        start_button.style.display = 'block';
        instructions_text.style.display = 'block';
    })
}