const pathBtn = document.querySelector("#path");
let map = [];
let open = [];
let close = [];
let goal;
const cost = 1;


function getSettings() {
    const heuristicSelect = document.querySelector("#heuristic");
    const heatmapCheck = document.querySelector("#heatmap");
    return {
        heuristic: heuristicSelect ? heuristicSelect.value : 'euclidean',
        heatmap: heatmapCheck ? heatmapCheck.checked : false
    };
}

function mazeJson() {
    map = [];
    open = [];
    close = [];
    goal = null;
    let obj = 0;
    let ini = 0;

    const rangeVal = document.querySelector("#range").value;

    for (let x = 0; x < rangeVal; x++) {
        const blocks = document.querySelectorAll(`#maps .px[x="${x}"]`);

        const sortedBlocks = Array.from(blocks).sort((a, b) => {
            return parseInt(a.getAttribute('y')) - parseInt(b.getAttribute('y'));
        });

        let valores = [];
        sortedBlocks.forEach(b => {
            b.classList.remove("fechado", "path");
            b.style.backgroundColor = "";
            b.innerHTML = "";

            var cell = b.getAttribute("cell");

            if (cell == "1") b.style.background = "#000";
            else if (cell == "8") b.style.background = "#0000ff";
            else if (cell == "9") b.style.background = "#4ff54f";
            else b.style.background = "#fff";

            if(cell == 8) {
                b.setAttribute("g", 0);
                b.setAttribute("status", 0);
                b.setAttribute("path", b.getAttribute("number"));
                open.push(b);
                ini++;
            }
            if(cell == 9) {
                goal = b;
                obj++;
            }
            valores.push(b);
        });
        map.push(valores);
    }

    if(obj == 1 && ini == 1){
        return true;
    }
    alert("Defina 1 Início (Azul) e 1 Objetivo (Verde)!");
    return false;
}

function calculateHeuristic(cell) {
    const type = getSettings().heuristic;

    const x1 = parseInt(cell.getAttribute("x"));
    const y1 = parseInt(cell.getAttribute("y"));
    const x2 = parseInt(goal.getAttribute("x"));
    const y2 = parseInt(goal.getAttribute("y"));

    if (type === 'dijkstra') {
        return 0;
    } else if (type === 'manhattan') {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    } else {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}

function openCells(atual) {
    var x = parseInt(atual.getAttribute("x"));
    var y = parseInt(atual.getAttribute("y"));

    const vizinhos = [
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 }
    ];

    vizinhos.forEach(dir => {
        const nx = x + dir.dx;
        const ny = y + dir.dy;

        if (nx >= 0 && nx < map.length && ny >= 0 && ny < map[0].length) {
            const vizinho = map[nx][ny];

            if (vizinho.getAttribute("cell") != 1 && vizinho.getAttribute("status") == 0) {
                if (!open.includes(vizinho)) {
                    vizinho.setAttribute("g", parseInt(atual.getAttribute("g")) + cost);
                    vizinho.setAttribute("path", atual.getAttribute("path") + "," + vizinho.getAttribute("number"));
                    open.push(vizinho);
                }
            }
        }
    });
}

function getBestNode(nodes) {
    let minF = Number.MAX_VALUE;
    let bestNode = null;

    nodes.forEach(cell => {
        const g = parseInt(cell.getAttribute("g"));
        const h = calculateHeuristic(cell);
        const f = g + h;

        if (f < minF) {
            minF = f;
            bestNode = cell;
        }
    });
    return bestNode;
}

function getHeatColor(g) {
    const hue = Math.max(0, 240 - (g * 5));
    return `hsl(${hue}, 100%, 50%)`;
}

async function explore() {
    if(!mazeJson()) return;

    const settings = getSettings();
    const timeDisplay = document.querySelector("#bot-time");
    timeDisplay.innerHTML = "Resolvendo...";
    timeDisplay.removeAttribute('data-time');
    const startTime = performance.now();

    while (open.length > 0) {
        let atual = getBestNode(open);

        open.splice(open.indexOf(atual), 1);
        close.push(atual);

        atual.classList.add("fechado");
        atual.setAttribute("status", 1);

        if (atual != goal && atual.getAttribute("cell") != 8) {
            if (settings.heatmap) {
                const g = parseInt(atual.getAttribute("g"));
                atual.style.backgroundColor = getHeatColor(g);
                atual.classList.add("heatmap-active");
            }
             atual.innerHTML = atual.getAttribute("g");
             atual.style.fontSize = "10px";
             atual.style.display = "flex";
             atual.style.alignItems = "center";
             atual.style.justifyContent = "center";
        }

        if(atual == goal){
            const endTime = performance.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            timeDisplay.innerHTML = `Resolvido em ${duration}s`;
            timeDisplay.setAttribute('data-time', duration);


            const playerTimeEl = document.getElementById('player-time');
            const playerDuration = parseFloat(playerTimeEl.getAttribute('data-time'));

            if (playerDuration) {
                const diff = (playerDuration - duration).toFixed(2);
                const diffEl = document.getElementById('time-diff');

                if (diff < 0) {
                    diffEl.innerHTML = `(${diff}s)`;
                    diffEl.style.color = "green";
                } else {
                    diffEl.innerHTML = `(+${diff}s)`;
                    diffEl.style.color = "red";
                }
            }

            console.log("Objetivo alcançado!");
            break;
        }

        openCells(atual);

        const speedVal = parseInt(document.querySelector("#speed-range").value);
        const delay = 200 - speedVal;

        await sleep(delay);
    }

    if (open.length === 0 && !close.includes(goal)) {
        timeDisplay.innerHTML = "Sem caminho!";
    }

    markThePath();
}

function markThePath(){
    if(!goal.getAttribute("path")) return;

    let mark = goal.getAttribute("path").split(',');

    document.querySelectorAll(".path").forEach(el => el.classList.remove("path"));

    close.forEach(element => {
        if(mark.includes(element.getAttribute("number"))){
            element.classList.add("path");
            element.innerHTML = "";
            element.style.backgroundColor = "";
        }
    });

    goal.classList.add("path");
    goal.style.backgroundColor = "#4ff54f";
}


pathBtn.addEventListener("click", async () => {

    const blocks = document.querySelectorAll('#maps .px');
    blocks.forEach(b => {
        b.classList.remove("fechado", "path", "heatmap-active");
        b.innerHTML = "";
        b.style.backgroundColor = "";


        const cell = b.getAttribute("cell");
        if (cell == "1") b.style.background = "#000";
        else if (cell == "8") b.style.background = "#0000ff";
        else if (cell == "9") b.style.background = "#4ff54f";
        else b.style.background = "#fff";


        b.setAttribute("g", "");
        b.setAttribute("status", "0");
        b.setAttribute("path", "");
    });


    document.dispatchEvent(new Event('mazeUpdated'));


    document.getElementById('player-time').removeAttribute('data-time');

    const playerActive = document.getElementById('toggle-player').checked;

    if (playerActive) {

        const countdownEl = document.getElementById('countdown');
        countdownEl.style.display = 'flex';


        countdownEl.innerText = "3";
        await sleep(1000);


        countdownEl.innerText = "2";
        await sleep(1000);


        countdownEl.innerText = "1";
        await sleep(1000);


        countdownEl.innerText = "GO!";
        await sleep(500);

        countdownEl.style.display = 'none';
        explore();
    } else {

        explore();
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
