const STORAGE_KEY = "controleFinanceiro";

// =====================
// DADOS
// =====================

let tipoMovimentoAtual = "entrada";

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

// =====================
// STORAGE
// =====================

function salvarDados() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dados)
    );
}

function carregarDados() {

    const dadosSalvos =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (dadosSalvos) {

        dados =
        JSON.parse(dadosSalvos);
    }
}

// =====================
// FORMATAÇÃO
// =====================

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

// =====================
// RESUMO
// =====================

function atualizarResumo() {

    const entradas =
        dados.movimentacoes
        .filter(
            x =>
            x.tipo === "entrada"
        )
        .reduce(
            (total, item) =>
            total + item.valor,
            0
        );

    const saidas =
        dados.movimentacoes
        .filter(
            x =>
            x.tipo === "saida"
        )
        .reduce(
            (total, item) =>
            total + item.valor,
            0
        );

    const saldo =
        entradas - saidas;

    document.getElementById(
        "saldo"
    ).innerText =
        formatarMoeda(saldo);

    document.getElementById(
        "totalEntradas"
    ).innerText =
        formatarMoeda(entradas);

    document.getElementById(
        "totalSaidas"
    ).innerText =
        formatarMoeda(saidas);
}

// =====================
// CARD MOVIMENTO
// =====================

function criarCard(item) {

    return `
        <div class="item">

            <div class="item-data">
                ${formatarData(item.data)}
            </div>

            <div class="item-descricao">
                ${item.descricao}
            </div>

            <div class="item-categoria">
                ${item.categoria}
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

                ${formatarMoeda(item.valor)}

            </div>

        </div>
    `;
}

// =====================
// HISTÓRICO COMPLETO
// =====================

function renderizarMovimentacoes() {

    const lista =
        document.getElementById(
            "listaMovimentacoes"
        );

    if (!lista) return;

    lista.innerHTML = "";

    const movimentos =
        [...dados.movimentacoes]

        .sort(
            (a, b) =>
            new Date(b.data)
            - new Date(a.data)
        );

    movimentos.forEach(item => {

        lista.innerHTML +=
            criarCard(item);

    });
}

// =====================
// ÚLTIMOS 10
// =====================

function renderizarUltimos() {

    const lista =
        document.getElementById(
            "ultimosLancamentos"
        );

    if (!lista) return;

    lista.innerHTML = "";

    const ultimos =
        [...dados.movimentacoes]

        .sort(
            (a, b) =>
            new Date(b.data)
            - new Date(a.data)
        )

        .slice(0, 10);

    ultimos.forEach(item => {

        lista.innerHTML +=
            criarCard(item);

    });
}

// =====================
// DATA
// =====================

function formatarData(data) {

    const d =
        new Date(data);

    return d.toLocaleDateString(
        "pt-BR"
    );
}

// =====================
// TELA
// =====================

function atualizarTela() {

    atualizarResumo();

    renderizarUltimos();

    renderizarMovimentacoes();
}

// =====================
// NAVEGAÇÃO SPA
// =====================

const botoesNav =
document.querySelectorAll(
    ".nav-item"
);

botoesNav.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            const tela =
                botao.dataset.tela;

            document
            .querySelectorAll(".pagina")
            .forEach(p => {

                p.classList.remove(
                    "ativa"
                );

            });

            document
            .getElementById(tela)
            .classList.add("ativa");

            botoesNav.forEach(btn => {

                btn.classList.remove(
                    "ativo"
                );

            });

            botao.classList.add(
                "ativo"
            );

        }
    );
});

// =====================
// MODAL LANÇAMENTO
// =====================

function abrirModalLancamento() {

    document
    .getElementById(
        "modalLancamento"
    )
    .classList.remove(
        "oculto"
    );

    document
    .getElementById("data")
    .value =
    new Date()
        .toISOString()
        .split("T")[0];

    carregarCategoriasModal();
}

function fecharModalLancamento() {

    document
    .getElementById(
        "modalLancamento"
    )
    .classList.add(
        "oculto"
    );
}

// =====================
// MODAL CATEGORIA
// =====================

function abrirModalCategoria() {

    document
    .getElementById(
        "modalCategoria"
    )
    .classList.remove(
        "oculto"
    );
}

function fecharModalCategoria() {

    document
    .getElementById(
        "modalCategoria"
    )
    .classList.add(
        "oculto"
    );
}

// =====================
// CARREGAR CATEGORIAS
// =====================

function carregarCategoriasModal() {

    const select =
    document.getElementById(
        "categoria"
    );

    select.innerHTML = "";

    const categorias =
        tipoMovimentoAtual === "entrada"

        ? dados.categoriasEntrada

        : dados.categoriasSaida;

    categorias.forEach(cat => {

        select.innerHTML += `
            <option value="${cat}">
                ${cat}
            </option>
        `;

    });
}

// =====================
// BOTÕES
// =====================

document
.getElementById("btnEntrada")
.addEventListener(
    "click",
    () => {

        tipoMovimentoAtual =
            "entrada";

        document
        .getElementById(
            "tituloModal"
        )
        .innerText =
        "Nova Entrada";

        abrirModalLancamento();

    }
);

document
.getElementById("btnSaida")
.addEventListener(
    "click",
    () => {

        tipoMovimentoAtual =
            "saida";

        document
        .getElementById(
            "tituloModal"
        )
        .innerText =
        "Nova Saída";

        abrirModalLancamento();

    }
);

document
.getElementById(
    "btnNovaCategoria"
)
.addEventListener(
    "click",
    abrirModalCategoria
);

// =====================
// NOVO LANÇAMENTO
// =====================

document
.getElementById(
    "formLancamento"
)
.addEventListener(
    "submit",
    function(e) {

        e.preventDefault();

        const novaMovimentacao = {

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

        };

        dados.movimentacoes.push(
            novaMovimentacao
        );

        salvarDados();

        atualizarTela();

        fecharModalLancamento();

        this.reset();

    }
);

// =====================
// NOVA CATEGORIA
// =====================

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
        )
        .value;

        const nome =
        document
        .getElementById(
            "nomeCategoria"
        )
        .value
        .trim();

        if(!nome){

            return;
        }

        if(
            tipo === "entrada"
        ){

            dados
            .categoriasEntrada
            .push(nome);

        }
        else{

            dados
            .categoriasSaida
            .push(nome);

        }

        salvarDados();

        fecharModalCategoria();

        this.reset();

    }
);

// =====================
// INICIALIZAÇÃO
// =====================

carregarDados();

atualizarTela();
