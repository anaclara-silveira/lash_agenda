
const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
    cadastrarCliente,
    cadastrarAgendamento,
    formatarData,
    consultarAgenda,
    carregarClientes,
    salvarClientes,
    carregarAgendamentos,
    salvarAgendamentos
} = require("./logica.js");

test("Deve cadastrar um cliente corretamente", () => {
    const resultado = cadastrarCliente([], "Marina Costa", "(31) 90000-0000");

    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].nome, "Marina Costa");
});

test("Não deve cadastrar cliente sem nome", () => {
    assert.throws(
        () => cadastrarCliente([], "", "(31) 90000-0000"),
        /obrigatórios/
    );
});

test("Deve registrar um agendamento para cliente cadastrado", () => {
    const clientes = [{ nome: "Marina Costa", telefone: "(31) 90000-0000" }];

    const resultado = cadastrarAgendamento(
        [],
        "Marina Costa",
        "2026-11-20",
        "14:00",
        clientes
    );

    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].horario, "14:00");
});

test("Não deve agendar para cliente inexistente", () => {
    assert.throws(
        () => cadastrarAgendamento(
            [],
            "Cliente inexistente",
            "2026-11-20",
            "14:00",
            []
        ),
        /Cliente não cadastrado/
    );
});

test("Deve formatar a data corretamente", () => {
    assert.equal(formatarData("2026-11-20"), "20/11/2026");
});

test("Deve consultar os agendamentos registrados", () => {
    const agendamentos = [
        {
            cliente: "Marina Costa",
            data: "2026-11-20",
            horario: "14:00"
        }
    ];

    const resultado = consultarAgenda(agendamentos);

    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].data, "20/11/2026");
});

test("Deve permitir o fluxo completo de cadastro e agendamento", () => {
    const clientes = cadastrarCliente(
        [],
        "Marina Costa",
        "(31) 90000-0000"
    );

    const agendamentos = cadastrarAgendamento(
        [],
        "Marina Costa",
        "2026-11-20",
        "14:00",
        clientes
    );

    const agenda = consultarAgenda(agendamentos);

    assert.equal(clientes.length, 1);
    assert.equal(agendamentos.length, 1);
    assert.equal(agenda[0].cliente, "Marina Costa");
    assert.equal(agenda[0].horario, "14:00");
});

test("Deve salvar e carregar clientes e agendamentos no LocalStorage", () => {
    const armazenamento = new Map();

    const localStorageOriginal = Object.getOwnPropertyDescriptor(
        globalThis,
        "localStorage"
    );

    Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: {
            getItem(chave) {
                return armazenamento.has(chave)
                    ? armazenamento.get(chave)
                    : null;
            },

            setItem(chave, valor) {
                armazenamento.set(chave, String(valor));
            }
        }
    });

    try {
        const clientes = [
            { nome: "Marina Costa", telefone: "(31) 90000-0000" }
        ];

        const agendamentos = [
            {
                cliente: "Marina Costa",
                data: "2026-11-20",
                horario: "14:00"
            }
        ];

        salvarClientes(clientes);
        salvarAgendamentos(agendamentos);

        const clientesSalvos = carregarClientes();
        const agendamentosSalvos = carregarAgendamentos();

        assert.deepEqual(clientesSalvos, clientes);
        assert.deepEqual(agendamentosSalvos, agendamentos);

    } finally {
        if (localStorageOriginal) {
            Object.defineProperty(
                globalThis,
                "localStorage",
                localStorageOriginal
            );
        } else {
            delete globalThis.localStorage;
        }
    }
});
