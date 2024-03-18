const path = document.querySelector("#path")
let map=[];
let open=[];
let close=[];
let goal;
const cost = 1;

function mazeJson() {
    map = [];
    for (let x = 0; x < range.value; x++) {
        const blocks = document.querySelectorAll(`#maps .px[x="${x}"]`);
        let valores =[];
        blocks.forEach(b => {
            var cell = b.getAttribute("cell");
            if(cell == 8) {
                b.setAttribute("g",0);
                b.setAttribute("status",0);
                open.push(b)
            }
            if(cell == 9) {
                goal = b;
            } 
            valores.push(b);
        });
        map.push(valores)
    }
}


function distancia(cell) {
    console.log(goal)
    console.log(cell)
    return Math.sqrt(Math.pow(parseInt(goal.getAttribute("x"))-parseInt(cell.getAttribute("x")),2)+Math.pow(parseInt(goal.getAttribute("y"))-parseInt(cell.getAttribute("y")),2))
}
function openCells(atual) {
    var x = parseInt(atual.getAttribute("x"));
    var y = parseInt(atual.getAttribute("y"));
    var baixo = map.length
    var cima = -1
    var direita = map[0].length
    var esquerda    = -1

    // baixo
    if(y+1 < baixo && map[x][y+1].getAttribute("g") != 1 && map[x][y+1].getAttribute("status") == 0 && map[x][y+1].getAttribute("cell") != 1){
        open.push(map[x][y+1]);
        map[x][y+1].setAttribute("g",parseInt(atual.getAttribute("g"))+cost)
        map[x][y+1].setAttribute("path",atual.getAttribute("path")+","+map[x][y+1].getAttribute("number"))
    } 
    // cima
    if(y-1 > cima && map[x][y-1].getAttribute("g") != 1 && map[x][y-1].getAttribute("status") == 0 && map[x][y-1].getAttribute("cell") != 1){
        open.push(map[x][y-1]);
        map[x][y-1].setAttribute("g",parseInt(atual.getAttribute("g"))+cost)
        map[x][y-1].setAttribute("path",atual.getAttribute("path")+","+map[x][y-1].getAttribute("number"))
    } 
    // direita
    if(x+1 < direita && map[x+1][y].getAttribute("g") != 1 && map[x+1][y].getAttribute("status") == 0 && map[x+1][y].getAttribute("cell") != 1){
        open.push(map[x+1][y]);
        map[x+1][y].setAttribute("g",parseInt(atual.getAttribute("g"))+cost)
        map[x+1][y].setAttribute("path",atual.getAttribute("path")+","+map[x+1][y].getAttribute("number"))
    } 
    // esqurda
    if(x-1 > esquerda && map[x-1][y].getAttribute("g") != 1 && map[x-1][y].getAttribute("status") == 0 && map[x-1][y].getAttribute("cell") != 1){
        open.push(map[x-1][y]);
        map[x-1][y].setAttribute("g",parseInt(atual.getAttribute("g"))+cost)
        map[x-1][y].setAttribute("path",atual.getAttribute("path")+","+map[x-1][y].getAttribute("number"))
    } 
}

function minorValue(grup) {
    var min = Number.MAX_VALUE;
    let cellMin = -1
    grup.forEach(cell => {
        if(min > ((parseInt(cell.getAttribute("g")))/3 + distancia(cell))){
            min = ((parseInt(cell.getAttribute("g")))/3 + distancia(cell));
            cellMin = cell;
        }
    });
    return cellMin;
}

async function explore() {
    mazeJson();
    while (open.length > 0) {
        let atual = minorValue(open);
        console.log(atual)
        
        atual.classList.add("fechado")
        atual.setAttribute("status",1)
        atual.innerHTML = atual.getAttribute("g");
        
        open = open.toSpliced(open.indexOf(atual),1);
        console.log(open)
        close.push(atual);

        
        if(atual == goal){
            break;
        }
        else{
            openCells(atual);
        }
        await sleep(50)
    }
    console.log("fim")
    markThePath()
}

function markThePath(){
    let mark = goal.getAttribute("path").split(',')
    console.log(mark);
    close.forEach(element => {
        if(mark.includes(element.getAttribute("number"))){
            element.classList.add("path")
            element.innerHTML = "";
        }
    });
    for (let index = 0; index < goal.getAttribute("number"); index++) {

    }
}


path.addEventListener("click",()=>{
    explore()
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}