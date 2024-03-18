const range = document.querySelector("#range")
const clear = document.querySelector("#clear")
const maps = document.querySelector("#maps")
const operacao = document.querySelector("#oper")

function makeMaze(){
    maps.innerHTML="";
    let cont = 0;
    const width = maps.clientWidth/range.value;
    for (let y = 0; y < range.value; y++) {
        for (let x = 0; x < range.value; x++) {
            maps.innerHTML+=`<div style="width: ${width}px;" number="${cont}" x="${x}" y="${y}" cell="0" status="0" g class="px"></div>`;
            cont++;
        }
    }

    const quadrantes = document.querySelectorAll("#maps .px")

    quadrantes.forEach(quadrante => {
        quadrante.addEventListener("click",()=>{
            const operacao = document.querySelector('input[name="oper"]:checked').value;

            switch (operacao) {
                case "1":
                    quadrante.style.background = "#000";
                    quadrante.setAttribute("cell",1);
                    break;
                case "0":
                    quadrante.style.background = "#fff";
                    quadrante.setAttribute("cell",0);
                    break;
                case "8":
                    document.querySelectorAll('#maps .px[cell="8"]').forEach(element => {
                        element.style.background = "#fff";
                        element.setAttribute("cell",0);
                    });
                    quadrante.style.background = "#0000ff";
                    quadrante.setAttribute("cell",8);
                break;
                case "9":
                    document.querySelectorAll('#maps .px[cell="9"]').forEach(element => {
                        element.style.background = "#fff";
                        element.setAttribute("cell",0);
                    });
                    quadrante.style.background = "#4ff54f";
                    quadrante.setAttribute("cell",9);
                break;
            }
        })
    });
}

clear.addEventListener("click",()=>{
    makeMaze()
})

range.addEventListener("click",()=>{
    makeMaze()
});