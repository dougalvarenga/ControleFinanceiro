const STORAGE_KEY = "controle_financeiro";

let tipoAtual = "entrada";

let dados = {
    categoriasEntrada: [
        "Salário"
    ],

    categoriasSaida: [
        "Mercado",
        "Combustível"
    ],

    movimentacoes: []
};

carregar();
atualizarTela();

function carregar() {

    const salvo =
        localStorage.getItem(STORAGE_KEY);

    if(salvo){
        dados = JSON.parse(salvo);
    }
}

function salvar() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dados)
    );
}

function moeda(valor){

    return valor.toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );
}

function atualizarTela(){

    atualizarResumo();
    renderizarHistorico();
}

function atualizarResumo(){

    const entradas =
        dados.movimentacoes
        .filter(x => x.tipo === "entrada")
        .reduce((s,x)=>s+x.valor,0);

    const saidas =
        dados.movimentacoes
        .filter(x => x.tipo === "saida")
        .reduce((s,x)=>s+x.valor,0);

    const saldo =
        entradas - saidas;

    document.getElementById("saldo").innerText =
        moeda(saldo);

    document.getElementById("totalEntradas").innerText =
        moeda(entradas);

    document.getElementById("totalSaidas").innerText =
        moeda(saidas);
}

function renderizarHistorico(){

    const lista =
        document.getElementById("historico");

    lista.innerHTML = "";

    const movimentos =
        [...dados.movimentacoes]
        .sort((a,b)=>
            new Date(b.data) - new Date(a.data)
        );

    movimentos.forEach(item=>{

        lista.innerHTML += `
            <div class="item">

                <div class="item-data">
                    ${item.data}
                </div>

                <div class="item-descricao">
                    ${item.descricao}
                </div>

                <div class="item-categoria">
                    ${item.categoria}
                </div>

                <div class="${
                    item.tipo==="entrada"
                        ? "valor-entrada"
                        : "valor-saida"
                }">

                    ${
                        item.tipo==="entrada"
                        ? "+"
                        : "-"
                    }

                    ${moeda(item.valor)}

                </div>

            </div>
        `;
    });
}

document
.getElementById("btnEntrada")
.addEventListener("click", ()=>{

    tipoAtual = "entrada";

    abrirModal(
        dados.categoriasEntrada
    );
});

document
.getElementById("btnSaida")
.addEventListener("click", ()=>{

    tipoAtual = "saida";

    abrirModal(
        dados.categoriasSaida
    );
});

function abrirModal(categorias){

    document
        .getElementById("modal")
        .classList
        .remove("oculto");

    const select =
        document.getElementById("categoria");

    select.innerHTML = "";

    categorias.forEach(cat=>{

        select.innerHTML += `
            <option>
                ${cat}
            </option>
        `;
    });

    document.getElementById("data").value =
        new Date()
        .toISOString()
        .split("T")[0];
}

function fecharModal(){

    document
        .getElementById("modal")
        .classList
        .add("oculto");
}

document
.getElementById("formMovimentacao")
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    dados.movimentacoes.push({

        id: Date.now(),

        tipo: tipoAtual,

        data:
            document
            .getElementById("data")
            .value,

        descricao:
            document
            .getElementById("descricao")
            .value,

        categoria:
            document
            .getElementById("categoria")
            .value,

        valor:
            Number(
                document
                .getElementById("valor")
                .value
            )
    });

    salvar();

    atualizarTela();

    fecharModal();

    this.reset();
});
