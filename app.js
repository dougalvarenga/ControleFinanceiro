// =========================
// CONFIGURAÇÃO
// =========================

const STORAGE_KEY = "controleFinanceiro";

let tipoMovimentoAtual = "entrada";

let categoriaSelecionada = null;

let callbackConfirmacao = null;

// =========================
// DADOS
// =========================

let dados = {

    categoriasEntrada: [
        "Salário",
        "Freelance"
    ],

    categoriasSaida: [
        "Mercado",
        "Combustível",
        "Lazer"
    ],

    movimentacoes: []

};

// =========================
// STORAGE
// =========================

function salvarDados(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dados)
    );
}

function carregarDados(){

    const salvo =
        localStorage.getItem(STORAGE_KEY);

    if(salvo){

        dados =
            JSON.parse(salvo);
    }
}

// =========================
// FORMATAÇÃO
// =========================

function moeda(valor){

    return valor.toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );
}

function formatarData(data){

    return new Date(data)
        .toLocaleDateString("pt-BR");
}

// =========================
// NAVEGAÇÃO
// =========================

function abrirTela(id){

    document
    .querySelectorAll(".pagina")
    .forEach(p=>{

        p.classList.remove("ativa");

    });

    document
    .getElementById(id)
    .classList.add("ativa");

    document
    .querySelectorAll(".nav-item")
    .forEach(btn=>{

        btn.classList.remove("ativo");

        if(btn.dataset.tela === id){

            btn.classList.add("ativo");
        }

    });

}

document
.querySelectorAll(".nav-item")
.forEach(btn=>{

    btn.addEventListener(
        "click",
        ()=>{

            abrirTela(
                btn.dataset.tela
            );

        }
    );

});

// =========================
// RESUMO
// =========================

function atualizarResumo(){

    const entradas =
        dados.movimentacoes
        .filter(x => x.tipo === "entrada")
        .reduce(
            (t,x)=>t+x.valor,
            0
        );

    const saidas =
        dados.movimentacoes
        .filter(x => x.tipo === "saida")
        .reduce(
            (t,x)=>t+x.valor,
            0
        );

    const saldo =
        entradas - saidas;

    document.getElementById(
        "saldo"
    ).innerText =
    moeda(saldo);

    document.getElementById(
        "totalEntradas"
    ).innerText =
    moeda(entradas);

    document.getElementById(
        "totalSaidas"
    ).innerText =
    moeda(saidas);
}

// =========================
// CARD MOVIMENTO
// =========================

function gerarCard(item){

    return `
        <div class="item">

            <div class="item-data">
                ${formatarData(item.data)}
            </div>

            <div class="item-descricao">
                ${item.descricao}
            </div>

            <div class="item-categoria">
                Categoria: ${item.categoria}
            </div>

            <div class="${
                item.tipo === "entrada"
                ? "valor-entrada"
                : "valor-saida"
            }">

                ${
                    item.tipo === "entrada"
                    ? "+"
                    : "-"
                }

                ${moeda(item.valor)}

            </div>

        </div>
    `;
}

// =========================
// HISTÓRICO
// =========================

function renderizarUltimos(){

    const lista =
        document.getElementById(
            "ultimosLancamentos"
        );

    lista.innerHTML = "";

    const movimentos =
        [...dados.movimentacoes]
        .sort(
            (a,b)=>
            new Date(b.data)
            -
            new Date(a.data)
        )
        .slice(0,10);

    movimentos.forEach(item=>{

        lista.innerHTML +=
            gerarCard(item);

    });

}

function renderizarMovimentacoes(){

    const lista =
        document.getElementById(
            "listaMovimentacoes"
        );

    lista.innerHTML = "";

    const movimentos =
        [...dados.movimentacoes]
        .sort(
            (a,b)=>
            new Date(b.data)
            -
            new Date(a.data)
        );

    movimentos.forEach(item=>{

        lista.innerHTML +=
            gerarCard(item);

    });

}

// =========================
// CATEGORIAS
// =========================

function renderizarCategorias(){

    const entradas =
        document.getElementById(
            "categoriasEntrada"
        );

    const saidas =
        document.getElementById(
            "categoriasSaida"
        );

    entradas.innerHTML = "";
    saidas.innerHTML = "";

    dados.categoriasEntrada
    .forEach(cat=>{

        entradas.innerHTML += `
            <div class="categoria-item">

                <span>${cat}</span>

                <div class="categoria-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarCategoria(
                            'entrada',
                            '${cat}'
                        )">

                        ✏️

                    </button>

                    <button
                        class="btn-excluir"
                        onclick="confirmarExclusaoCategoria(
                            'entrada',
                            '${cat}'
                        )">

                        🗑️

                    </button>

                </div>

            </div>
        `;

    });

    dados.categoriasSaida
    .forEach(cat=>{

        saidas.innerHTML += `
            <div class="categoria-item">

                <span>${cat}</span>

                <div class="categoria-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarCategoria(
                            'saida',
                            '${cat}'
                        )">

                        ✏️

                    </button>

                    <button
                        class="btn-excluir"
                        onclick="confirmarExclusaoCategoria(
                            'saida',
                            '${cat}'
                        )">

                        🗑️

                    </button>

                </div>

            </div>
        `;

    });

    atualizarFiltroCategorias();

}

// =========================
// FILTRO CATEGORIAS
// =========================

function atualizarFiltroCategorias(){

    const select =
        document.getElementById(
            "filtroCategoria"
        );

    select.innerHTML = `
        <option value="">
            Todas as Categorias
        </option>
    `;

    [
        ...dados.categoriasEntrada,
        ...dados.categoriasSaida
    ].forEach(cat=>{

        select.innerHTML += `
            <option value="${cat}">
                ${cat}
            </option>
        `;

    });

}

// =========================
// MODAL LANÇAMENTO
// =========================

function abrirModalLancamento(){

    document
    .getElementById(
        "modalLancamento"
    )
    .classList.remove("oculto");

    document
    .getElementById("data")
    .value =
    new Date()
    .toISOString()
    .split("T")[0];

    carregarCategoriasModal();
}

function fecharModalLancamento(){

    document
    .getElementById(
        "modalLancamento"
    )
    .classList.add("oculto");

}

// =========================
// MODAL CATEGORIA
// =========================

function abrirModalCategoria(){

    categoriaSelecionada = null;

    document
    .getElementById(
        "formCategoria"
    )
    .reset();

    document
    .getElementById(
        "modalCategoria"
    )
    .classList.remove("oculto");
}

function fecharModalCategoria(){

    document
    .getElementById(
        "modalCategoria"
    )
    .classList.add("oculto");
}

// =========================
// SELECT CATEGORIAS
// =========================

function carregarCategoriasModal(){

    const select =
        document
        .getElementById("categoria");

    select.innerHTML = "";

    const lista =
        tipoMovimentoAtual === "entrada"
        ? dados.categoriasEntrada
        : dados.categoriasSaida;

    lista.forEach(cat=>{

        select.innerHTML += `
            <option value="${cat}">
                ${cat}
            </option>
        `;

    });

}

// =========================
// ENTRADA / SAÍDA
// =========================

document
.getElementById("btnEntrada")
.addEventListener(
"click",
()=>{

    tipoMovimentoAtual =
    "entrada";

    document
    .getElementById(
        "tituloModal"
    )
    .innerText =
    "Nova Entrada";

    abrirModalLancamento();

});

document
.getElementById("btnSaida")
.addEventListener(
"click",
()=>{

    tipoMovimentoAtual =
    "saida";

    document
    .getElementById(
        "tituloModal"
    )
    .innerText =
    "Nova Saída";

    abrirModalLancamento();

});

// =========================
// NOVA MOVIMENTAÇÃO
// =========================

document
.getElementById(
    "formLancamento"
)
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    dados.movimentacoes.push({

        id: Date.now(),

        tipo:
        tipoMovimentoAtual,

        data:
        document
        .getElementById(
            "data"
        ).value,

        descricao:
        document
        .getElementById(
            "descricao"
        ).value,

        categoria:
        document
        .getElementById(
            "categoria"
        ).value,

        valor:
        Number(
            document
            .getElementById(
                "valor"
            ).value
        )

    });

    salvarDados();

    atualizarTela();

    fecharModalLancamento();

    this.reset();

});

// =========================
// NOVA CATEGORIA
// =========================

document
.getElementById(
    "btnNovaCategoria"
)
.addEventListener(
    "click",
    abrirModalCategoria
);

document
.getElementById(
    "formCategoria"
)
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    const tipo =
        document
        .getElementById(
            "tipoCategoria"
        ).value;

    const nome =
        document
        .getElementById(
            "nomeCategoria"
        )
        .value
        .trim();

    if(!nome) return;

    if(categoriaSelecionada){

        // Parte 2

        return;
    }

    if(tipo === "entrada"){

        dados
        .categoriasEntrada
        .push(nome);

    }else{

        dados
        .categoriasSaida
        .push(nome);

    }

    salvarDados();

    renderizarCategorias();

    fecharModalCategoria();

    this.reset();

});

// =========================
// EDIÇÃO PREPARADA
// =========================

function editarCategoria(
    tipo,
    categoria
){

    categoriaSelecionada = {

        tipo,
        categoria
    };

    document
    .getElementById(
        "tipoCategoria"
    ).value =
    tipo;

    document
    .getElementById(
        "nomeCategoria"
    ).value =
    categoria;

    document
    .getElementById(
        "modalCategoria"
    )
    .classList.remove(
        "oculto"
    );
}

// =========================
// EXCLUSÃO PREPARADA
// =========================

function confirmarExclusaoCategoria(
    tipo,
    categoria
){

    categoriaSelecionada = {

        tipo,
        categoria
    };

    document
    .getElementById(
        "textoConfirmacao"
    )
    .innerText =
    `Deseja excluir a categoria "${categoria}"?`;

    document
    .getElementById(
        "modalConfirmacao"
    )
    .classList.remove(
        "oculto"
    );
}

// =========================
// TELA
// =========================

function atualizarTela(){

    atualizarResumo();

    renderizarUltimos();

    renderizarMovimentacoes();

    renderizarCategorias();
}

// =========================
// INICIAR
// =========================

carregarDados();

atualizarTela();
// =========================
// MODAL DE CONFIRMAÇÃO
// =========================

function fecharConfirmacao(){

    document
    .getElementById("modalConfirmacao")
    .classList.add("oculto");

    callbackConfirmacao = null;
}

// =========================
// EDITAR CATEGORIA
// =========================

document
.getElementById(
    "formCategoria"
)
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    const tipo =
        document
        .getElementById(
            "tipoCategoria"
        ).value;

    const nome =
        document
        .getElementById(
            "nomeCategoria"
        ).value
        .trim();

    if(!nome) return;

    // =====================
    // EDIÇÃO
    // =====================

    if(categoriaSelecionada){

        const categoriaAntiga =
            categoriaSelecionada.categoria;

        if(
            categoriaSelecionada.tipo
            === "entrada"
        ){

            const index =
                dados
                .categoriasEntrada
                .indexOf(
                    categoriaAntiga
                );

            if(index !== -1){

                dados
                .categoriasEntrada[
                    index
                ] = nome;
            }

        }else{

            const index =
                dados
                .categoriasSaida
                .indexOf(
                    categoriaAntiga
                );

            if(index !== -1){

                dados
                .categoriasSaida[
                    index
                ] = nome;
            }
        }

        dados.movimentacoes
        .forEach(m=>{

            if(
                m.categoria
                === categoriaAntiga
            ){

                m.categoria = nome;
            }

        });

        categoriaSelecionada = null;

    }

    // =====================
    // NOVA CATEGORIA
    // =====================

    else{

        if(tipo === "entrada"){

            if(
                dados.categoriasEntrada
                .includes(nome)
            ){

                alert(
                    "Esta categoria já existe."
                );

                return;
            }

            dados
            .categoriasEntrada
            .push(nome);

        }

        else{

            if(
                dados.categoriasSaida
                .includes(nome)
            ){

                alert(
                    "Esta categoria já existe."
                );

                return;
            }

            dados
            .categoriasSaida
            .push(nome);

        }

    }

    salvarDados();

    renderizarCategorias();

    carregarCategoriasModal();

    atualizarTela();

    fecharModalCategoria();

    this.reset();

});

// =========================
// CONFIRMAR EXCLUSÃO
// =========================

function confirmarExclusaoCategoria(
    tipo,
    categoria
){

    categoriaSelecionada = {

        tipo,
        categoria
    };

    document
    .getElementById(
        "textoConfirmacao"
    )
    .innerText =
    `Deseja excluir a categoria "${categoria}"?`;

    callbackConfirmacao =
    function(){

        excluirCategoria();
    };

    document
    .getElementById(
        "modalConfirmacao"
    )
    .classList.remove("oculto");
}

// =========================
// EXCLUIR CATEGORIA
// =========================

function excluirCategoria(){

    if(!categoriaSelecionada){

        return;
    }

    const categoria =
        categoriaSelecionada.categoria;

    // BLOQUEIO

    const utilizada =
        dados.movimentacoes
        .some(
            mov =>
            mov.categoria
            === categoria
        );

    if(utilizada){

        alert(
            "Esta categoria possui movimentações associadas e não pode ser excluída."
        );

        fecharConfirmacao();

        return;
    }

    if(
        categoriaSelecionada.tipo
        === "entrada"
    ){

        dados.categoriasEntrada =
            dados.categoriasEntrada
            .filter(
                cat =>
                cat !== categoria
            );

    }

    else{

        dados.categoriasSaida =
            dados.categoriasSaida
            .filter(
                cat =>
                cat !== categoria
            );

    }

    salvarDados();

    renderizarCategorias();

    carregarCategoriasModal();

    atualizarTela();

    fecharConfirmacao();
}

// =========================
// BOTÃO CONFIRMAR EXCLUSÃO
// =========================

document
.getElementById(
    "btnConfirmarExclusao"
)
.addEventListener(
"click",
()=>{

    if(callbackConfirmacao){

        callbackConfirmacao();
    }

});

// =========================
// ATUALIZAR FILTRO
// =========================

function atualizarFiltroCategorias(){

    const select =
    document.getElementById(
        "filtroCategoria"
    );

    const valorAtual =
        select.value;

    select.innerHTML = `
        <option value="">
            Todas as Categorias
        </option>
    `;

    [
        ...dados.categoriasEntrada,
        ...dados.categoriasSaida
    ]
    .sort()
    .forEach(cat=>{

        select.innerHTML += `
            <option value="${cat}">
                ${cat}
            </option>
        `;
    });

    select.value = valorAtual;
}

// =========================
// RECARREGAR TELA
// =========================

const atualizarTelaOriginal =
atualizarTela;

atualizarTela =
function(){

    atualizarTelaOriginal();

    atualizarFiltroCategorias();
};

// =========================
// REPROCESSA DADOS
// =========================

renderizarCategorias();

atualizarFiltroCategorias();

atualizarTela();
