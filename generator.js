function generateMaze() {
    const rangeInput = document.querySelector("#range");
    const size = parseInt(rangeInput.value);
    const cells = document.querySelectorAll(".px");
    
    // Função auxiliar para pegar célula baseada em X, Y
    const getCell = (x, y) => {
        if (x < 0 || y < 0 || x >= size || y >= size) return null;
        return cells[y * size + x];
    };

    // 1. Preenche tudo com paredes (paredes = 1)
    cells.forEach(c => {
        c.style.background = "#000";
        c.setAttribute("cell", "1");
        c.setAttribute("g", ""); // Limpa custos anteriores
        c.setAttribute("status", "0");
        c.className = "px"; // Reseta classes (remove path/fechado)
        c.innerHTML = ""; // Remove textos de debug
    });

    // 2. Algoritmo Recursive Backtracker (DFS)
    const stack = [];
    const startX = 0;
    const startY = 0;
    
    // Marca o início como vazio (0) e adiciona à pilha
    let startCell = getCell(startX, startY);
    startCell.style.background = "#fff";
    startCell.setAttribute("cell", "0");
    stack.push({x: startX, y: startY});

    while(stack.length > 0) {
        let current = stack[stack.length - 1]; // Pega o último (sem remover)
        
        // Vizinhos possíveis (pula 2 células para deixar espaço para a parede)
        const directions = [
            {dx: 0, dy: -2, wx: 0, wy: -1}, // Cima
            {dx: 0, dy: 2, wx: 0, wy: 1},   // Baixo
            {dx: -2, dy: 0, wx: -1, wy: 0}, // Esquerda
            {dx: 2, dy: 0, wx: 1, wy: 0}    // Direita
        ];

        let validNeighbors = [];

        directions.forEach(dir => {
            let nx = current.x + dir.dx;
            let ny = current.y + dir.dy;
            let neighbor = getCell(nx, ny);

            // Se o vizinho existe e é uma parede (ainda não visitado)
            if (neighbor && neighbor.getAttribute("cell") == "1") {
                validNeighbors.push({
                    x: nx, 
                    y: ny, 
                    wallX: current.x + dir.wx, 
                    wallY: current.y + dir.wy
                });
            }
        });

        if (validNeighbors.length > 0) {
            // Escolhe um vizinho aleatório
            let chosen = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
            
            // Abre o vizinho
            let nextCell = getCell(chosen.x, chosen.y);
            nextCell.style.background = "#fff";
            nextCell.setAttribute("cell", "0");

            // Abre a parede entre o atual e o vizinho
            let wallCell = getCell(chosen.wallX, chosen.wallY);
            wallCell.style.background = "#fff";
            wallCell.setAttribute("cell", "0");

            // Empilha o vizinho para continuar dele
            stack.push({x: chosen.x, y: chosen.y});
        } else {
            // Se não tem vizinhos válidos, volta (backtrack)
            stack.pop();
        }
    }

    // 3. Define Início (Canto superior esquerdo) e Fim (Canto inferior direito)
    
    // Início
    let start = getCell(0, 0);
    start.setAttribute("cell", "8");
    start.style.background = "#0000ff";

    // Fim - Tenta pegar o canto extremo, garantindo que seja acessível
    // Se o tamanho do mapa for par, o canto exato pode ser uma parede no grid DFS
    // Então verificamos se é parede e abrimos se necessário
    let endX = size - 1;
    let endY = size - 1;
    let end = getCell(endX, endY);
    
    if (end.getAttribute("cell") == "1") {
        // Se o canto é parede, torna ele chão
        end.style.background = "#fff";
        end.setAttribute("cell", "0");
        
        // Precisamos conectar ele ao labirinto se ele estava isolado
        // Tenta conectar à esquerda ou cima
        let left = getCell(endX - 1, endY);
        if (left) { left.style.background = "#fff"; left.setAttribute("cell", "0"); }
    }
    
    end.setAttribute("cell", "9");
    end.style.background = "#4ff54f";
}

// Adiciona o evento ao carregar
document.addEventListener("DOMContentLoaded", () => {
    const btnGen = document.querySelector("#generate");
    if(btnGen) {
        btnGen.addEventListener("click", generateMaze);
    }
});