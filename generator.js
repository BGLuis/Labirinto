function getRange() {
    return parseInt(document.querySelector("#range").value);
}

function getCells() {
    return document.querySelectorAll(".px");
}

function getCell(x, y, size, cells) {
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    return cells[y * size + x];
}

function resetGrid(type = "wall") {
    const size = getRange();
    const cells = getCells();

    cells.forEach(c => {
        if (type === "wall") {
            c.style.background = "#000";
            c.setAttribute("cell", "1");
        } else {
            c.style.background = "#fff";
            c.setAttribute("cell", "0");
        }
        c.setAttribute("g", "");
        c.setAttribute("status", "0");
        c.className = "px";
        c.innerHTML = "";

        if (type === "empty") {
            const x = parseInt(c.getAttribute("x"));
            const y = parseInt(c.getAttribute("y"));
            if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
                c.style.background = "#000";
                c.setAttribute("cell", "1");
            }
        }
    });
    return { size, cells };
}

function setStartEnd(size, cells) {
    let start = getCell(1, 1, size, cells) || getCell(0, 0, size, cells);
    if(start) {
        start.setAttribute("cell", "8");
        start.style.background = "#0000ff";
    }

    let endX = size - 2;
    let endY = size - 2;
    let end = getCell(endX, endY, size, cells);

    if (!end || end.getAttribute("cell") == "1") {
        end = getCell(size-1, size-1, size, cells);
        if(end && end.getAttribute("cell") == "1") {
            end.style.background = "#fff";
            end.setAttribute("cell", "0");
        }
    }

    if(end) {
        end.setAttribute("cell", "9");
        end.style.background = "#4ff54f";
    }
    document.dispatchEvent(new Event('mazeUpdated'));
}


function generateDFS() {
    const { size, cells } = resetGrid("wall");
    const stack = [];
    const startX = 0;
    const startY = 0;

    let current = {x: 0, y: 0};

    let startCell = getCell(current.x, current.y, size, cells);
    if(startCell) {
        startCell.style.background = "#fff";
        startCell.setAttribute("cell", "0");
        stack.push(current);
    }

    while(stack.length > 0) {
        let curr = stack[stack.length - 1];

        const directions = [
            {dx: 0, dy: -2, wx: 0, wy: -1},
            {dx: 0, dy: 2, wx: 0, wy: 1},
            {dx: -2, dy: 0, wx: -1, wy: 0},
            {dx: 2, dy: 0, wx: 1, wy: 0}
        ];

        let validNeighbors = [];

        directions.forEach(dir => {
            let nx = curr.x + dir.dx;
            let ny = curr.y + dir.dy;
            let neighbor = getCell(nx, ny, size, cells);

            if (neighbor && neighbor.getAttribute("cell") == "1") {
                validNeighbors.push({x: nx, y: ny, wx: curr.x + dir.wx, wy: curr.y + dir.wy});
            }
        });

        if (validNeighbors.length > 0) {
            let chosen = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];

            let nextCell = getCell(chosen.x, chosen.y, size, cells);
            nextCell.style.background = "#fff";
            nextCell.setAttribute("cell", "0");

            let wallCell = getCell(chosen.wx, chosen.wy, size, cells);
            if(wallCell) {
                wallCell.style.background = "#fff";
                wallCell.setAttribute("cell", "0");
            }

            stack.push({x: chosen.x, y: chosen.y});
        } else {
            stack.pop();
        }
    }
    setStartEnd(size, cells);
}

function generatePrim() {
    const { size, cells } = resetGrid("wall");

    let frontier = [];

    let startX = Math.floor(Math.random() * size);
    let startY = Math.floor(Math.random() * size);

    let startCell = getCell(startX, startY, size, cells);
    startCell.style.background = "#fff";
    startCell.setAttribute("cell", "0");

    const addFrontier = (x, y) => {
        const dirs = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        dirs.forEach(([dx, dy]) => {
            let nx = x + dx;
            let ny = y + dy;
            let cell = getCell(nx, ny, size, cells);
            if (cell && cell.getAttribute("cell") == "1") {
                frontier.push({x: nx, y: ny, px: x, py: y});
            }
        });
    };

    addFrontier(startX, startY);

    while (frontier.length > 0) {
        let randIndex = Math.floor(Math.random() * frontier.length);
        let current = frontier[randIndex];
        frontier.splice(randIndex, 1);

        let cell = getCell(current.x, current.y, size, cells);

        if (cell.getAttribute("cell") == "1") {
            let inMazeNeighbors = [];
            const dirs = [
                {dx: 0, dy: -2, wx: 0, wy: -1},
                {dx: 0, dy: 2, wx: 0, wy: 1},
                {dx: -2, dy: 0, wx: -1, wy: 0},
                {dx: 2, dy: 0, wx: 1, wy: 0}
            ];

            dirs.forEach(d => {
                let nx = current.x + d.dx;
                let ny = current.y + d.dy;
                let neighbor = getCell(nx, ny, size, cells);
                if (neighbor && neighbor.getAttribute("cell") == "0") {
                    inMazeNeighbors.push({x: nx, y: ny, wx: current.x + d.wx, wy: current.y + d.wy});
                }
            });

            if (inMazeNeighbors.length > 0) {
                let connect = inMazeNeighbors[Math.floor(Math.random() * inMazeNeighbors.length)];

                cell.style.background = "#fff";
                cell.setAttribute("cell", "0");

                let wall = getCell(connect.wx, connect.wy, size, cells);
                if (wall) {
                    wall.style.background = "#fff";
                    wall.setAttribute("cell", "0");
                }

                addFrontier(current.x, current.y);
            }
        }
    }
    setStartEnd(size, cells);
}

function generateDivision() {
    const { size, cells } = resetGrid("empty");

    const divide = (x, y, w, h) => {
        if (w < 3 || h < 3) return;

        let horizontal = Math.random() < 0.5;
        if (w > h) horizontal = false;
        else if (h > w) horizontal = true;

        if (horizontal) {
            let wallY = Math.floor(Math.random() * (h - 2)) + y + 1;
            let holeX = Math.floor(Math.random() * w) + x;

            for (let i = x; i < x + w; i++) {
                if (i !== holeX) {
                    let c = getCell(i, wallY, size, cells);
                    if(c) {
                        c.style.background = "#000";
                        c.setAttribute("cell", "1");
                    }
                }
            }

            divide(x, y, w, wallY - y);
            divide(x, wallY + 1, w, y + h - wallY - 1);

        } else {
            let wallX = Math.floor(Math.random() * (w - 2)) + x + 1;
            let holeY = Math.floor(Math.random() * h) + y;

            for (let i = y; i < y + h; i++) {
                if (i !== holeY) {
                    let c = getCell(wallX, i, size, cells);
                    if(c) {
                        c.style.background = "#000";
                        c.setAttribute("cell", "1");
                    }
                }
            }

            divide(x, y, wallX - x, h);
            divide(wallX + 1, y, x + w - wallX - 1, h);
        }
    };

    divide(1, 1, size - 2, size - 2);
    setStartEnd(size, cells);
}

function openMazeCell(x, y, size, cells) {
    const c = getCell(x, y, size, cells);
    if (c) {
        c.style.background = "#fff";
        c.setAttribute("cell", "0");
    }
}

function generateKruskal() {
    const { size, cells } = resetGrid("wall");

    const key = (x, y) => `${x},${y}`;
    const parent = new Map();

    const find = (k) => {
        while (parent.get(k) !== k) {
            parent.set(k, parent.get(parent.get(k)));
            k = parent.get(k);
        }
        return k;
    };

    const union = (a, b) => {
        const ra = find(a);
        const rb = find(b);
        if (ra === rb) return false;
        parent.set(ra, rb);
        return true;
    };

    const edges = [];

    for (let y = 0; y < size; y += 2) {
        for (let x = 0; x < size; x += 2) {
            parent.set(key(x, y), key(x, y));

            if (x + 2 < size) edges.push({ ax: x, ay: y, bx: x + 2, by: y, wx: x + 1, wy: y });
            if (y + 2 < size) edges.push({ ax: x, ay: y, bx: x, by: y + 2, wx: x, wy: y + 1 });
        }
    }

    for (let i = edges.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [edges[i], edges[j]] = [edges[j], edges[i]];
    }

    edges.forEach(edge => {
        if (union(key(edge.ax, edge.ay), key(edge.bx, edge.by))) {
            openMazeCell(edge.ax, edge.ay, size, cells);
            openMazeCell(edge.bx, edge.by, size, cells);
            openMazeCell(edge.wx, edge.wy, size, cells);
        }
    });

    setStartEnd(size, cells);
}

function generateWilson() {
    const { size, cells } = resetGrid("wall");

    const cellPositions = [];
    for (let y = 0; y < size; y += 2) {
        for (let x = 0; x < size; x += 2) {
            cellPositions.push({ x, y });
        }
    }

    const key = (x, y) => `${x},${y}`;
    const inMaze = new Set();
    const dirs = [{ dx: 0, dy: -2 }, { dx: 0, dy: 2 }, { dx: -2, dy: 0 }, { dx: 2, dy: 0 }];

    const first = cellPositions[Math.floor(Math.random() * cellPositions.length)];
    inMaze.add(key(first.x, first.y));
    openMazeCell(first.x, first.y, size, cells);

    cellPositions.forEach(start => {
        if (inMaze.has(key(start.x, start.y))) return;

        let path = [start];
        let current = start;

        while (!inMaze.has(key(current.x, current.y))) {
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            const next = { x: current.x + dir.dx, y: current.y + dir.dy };

            if (next.x < 0 || next.y < 0 || next.x >= size || next.y >= size) continue;

            const loopIndex = path.findIndex(p => p.x === next.x && p.y === next.y);
            path = loopIndex !== -1 ? path.slice(0, loopIndex + 1) : [...path, next];
            current = next;
        }

        path.forEach((p, i) => {
            inMaze.add(key(p.x, p.y));
            openMazeCell(p.x, p.y, size, cells);
            if (i > 0) {
                const prev = path[i - 1];
                openMazeCell((prev.x + p.x) / 2, (prev.y + p.y) / 2, size, cells);
            }
        });
    });

    setStartEnd(size, cells);
}

function generateMaze() {
    const algo = document.querySelector("#gen-algo").value;

    if (algo === 'prim') {
        generatePrim();
    } else if (algo === 'division') {
        generateDivision();
    } else if (algo === 'kruskal') {
        generateKruskal();
    } else if (algo === 'wilson') {
        generateWilson();
    } else {
        generateDFS();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnGen = document.querySelector("#generate");
    if(btnGen) {
        btnGen.addEventListener("click", generateMaze);
    }
});
