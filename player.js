let playerStartTime = 0;
let playerEndTime = 0;
let botFinalTime = 0;

function syncMaps() {
    const botMap = document.getElementById('maps');
    const playerMap = document.getElementById('maps-player');

    if (!botMap || !playerMap) return;

    playerMap.innerHTML = botMap.innerHTML;
    playerMap.style.gridTemplateColumns = botMap.style.gridTemplateColumns;

    const cells = playerMap.querySelectorAll('.px');
    cells.forEach(c => {
        c.classList.remove('fechado', 'path', 'heatmap-active');
        c.innerHTML = "";
        c.style.backgroundColor = "";

        const cellType = c.getAttribute('cell');
        if (cellType == "1") c.style.background = "#000";
        else if (cellType == "8") {
            c.style.background = "#0000ff";
            c.classList.add('player-active');
        }
        else if (cellType == "9") c.style.background = "#4ff54f";
        else c.style.background = "#fff";

        c.removeAttribute('g');
        c.removeAttribute('status');
        c.removeAttribute('path');
    });

    document.getElementById('player-time').innerHTML = "";
    document.getElementById('time-diff').innerHTML = "";
    playerStartTime = 0;
    playerEndTime = 0;
}


document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById('toggle-player');
    const playerWrapper = document.getElementById('maps-player').parentElement;

    function updateVisibility() {
        if(toggle && toggle.checked) {
            playerWrapper.style.display = "flex";
        } else if (playerWrapper) {
            playerWrapper.style.display = "none";
        }
    }

    if(toggle) {
        toggle.addEventListener('change', updateVisibility);
        updateVisibility();
    }

    requestAnimationFrame(gameLoop);
});



const keysPressed = {};
let lastMoveTime = 0;
const MOVE_DELAY = 80;

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        keysPressed[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        keysPressed[e.key] = false;
    }
});

function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    if (timestamp - lastMoveTime < MOVE_DELAY) return;

    const toggle = document.getElementById('toggle-player');
    if (toggle && !toggle.checked) return;

    const countdown = document.getElementById('countdown');
    if (countdown && countdown.style.display !== 'none') return;

    if (playerStartTime === 0 && countdown && countdown.style.display === 'none') {
        const botTime = document.getElementById('bot-time').innerText;
        if (botTime === "Resolvendo...") {
            playerStartTime = performance.now();
        }
    }

    const playerMap = document.getElementById('maps-player');
    if (!playerMap) return;

    const player = playerMap.querySelector('.player-active');
    if (!player) return;

    const x = parseInt(player.getAttribute('x'));
    const y = parseInt(player.getAttribute('y'));

    let nextX = x;
    let nextY = y;
    let moved = false;

    if (keysPressed['ArrowUp']) { nextY--; moved = true; }
    else if (keysPressed['ArrowDown']) { nextY++; moved = true; }
    else if (keysPressed['ArrowLeft']) { nextX--; moved = true; }
    else if (keysPressed['ArrowRight']) { nextX++; moved = true; }

    if (!moved) return;

    const nextCell = playerMap.querySelector(`.px[x="${nextX}"][y="${nextY}"]`);

    if (nextCell) {
        const type = nextCell.getAttribute('cell');

        if (type !== "1") {
            player.classList.remove('player-active');
            if (player.getAttribute('cell') == '8') player.style.background = "#0000ff";
            else if (player.getAttribute('cell') == '9') player.style.background = "#4ff54f";
            else player.style.background = "#fff";

            nextCell.classList.add('player-active');
            lastMoveTime = timestamp;

            if (type === "9") {
                playerEndTime = performance.now();
                finishGame();
            }
        }
    }
}

function finishGame() {
    Object.keys(keysPressed).forEach(k => keysPressed[k] = false);

    const duration = ((playerEndTime - playerStartTime) / 1000).toFixed(2);
    const playerTimeEl = document.getElementById('player-time');
    playerTimeEl.innerHTML = `Tempo: ${duration}s`;
    playerTimeEl.setAttribute('data-time', duration);

    const botTimeEl = document.getElementById('bot-time');
    const botDuration = parseFloat(botTimeEl.getAttribute('data-time'));
    if (botDuration) {
        const diff = (duration - botDuration).toFixed(2);
        const diffEl = document.getElementById('time-diff');

        if (diff < 0) {
            diffEl.innerHTML = `(${diff}s)`;
            diffEl.style.color = "green";
        } else {
            diffEl.innerHTML = `(+${diff}s)`;
            diffEl.style.color = "red";
        }
    } else {
        const diffEl = document.getElementById('time-diff');
        diffEl.innerHTML = "(Aguardando Bot...)";
        diffEl.style.color = "green";
    }
}

document.addEventListener('mazeUpdated', syncMaps);
