const range = document.querySelector("#range")
const clear = document.querySelector("#clear")
const maps = document.querySelector("#maps")

let isMouseDown = false;

function makeMaze(){
    maps.innerHTML = "";
    const size = parseInt(range.value);

    maps.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const fragment = document.createDocumentFragment();
    let cont = 0;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const div = document.createElement('div');

            div.className = 'px';
            div.setAttribute('number', cont);
            div.setAttribute('x', x);
            div.setAttribute('y', y);
            div.setAttribute('cell', '0');
            div.setAttribute('status', '0');
            div.setAttribute('g', '');

            div.ondragstart = () => false;

            fragment.appendChild(div);
            cont++;
        }
    }

    maps.appendChild(fragment);
}

function applyTool(quadrante) {
    if (!quadrante) return;

    const operacao = document.querySelector('input[name="oper"]:checked').value;

    switch (operacao) {
        case "1":
            quadrante.style.background = "#000";
            quadrante.setAttribute("cell", 1);
            break;
        case "0":
            quadrante.style.background = "#fff";
            quadrante.setAttribute("cell", 0);
            break;
        case "8":
            document.querySelectorAll('#maps .px[cell="8"]').forEach(element => {
                element.style.background = "#fff";
                element.setAttribute("cell", 0);
            });
            quadrante.style.background = "#0000ff";
            quadrante.setAttribute("cell", 8);
            break;
        case "9":
            document.querySelectorAll('#maps .px[cell="9"]').forEach(element => {
                element.style.background = "#fff";
                element.setAttribute("cell", 0);
            });
            quadrante.style.background = "#4ff54f";
            quadrante.setAttribute("cell", 9);
            break;
    }
}

maps.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isMouseDown = true;
    const quadrante = e.target.closest('.px');
    applyTool(quadrante);
});

maps.addEventListener("mouseover", (e) => {
    if (isMouseDown) {
        const quadrante = e.target.closest('.px');
        applyTool(quadrante);
    }
});

window.addEventListener("mouseup", () => {
    isMouseDown = false;
});


clear.addEventListener("click", () => {
    makeMaze();
})

range.addEventListener("input", () => {
    makeMaze();
});
