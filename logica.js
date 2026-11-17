
(function (global) {
    const CHAVE_CLIENTES = "agendaLash_clientes";
    const CHAVE_AGENDAMENTOS = "agendaLash_agendamentos";

    function carregarDados(chave, dadosIniciais) {
        if (typeof localStorage === "undefined") {
            return dadosIniciais;
        }

        try {
            const dadosSalvos = localStorage.getItem(chave);
            return dadosSalvos === null
                ? dadosIniciais
                : JSON.parse(dadosSalvos);
        } catch {
            return dadosIniciais;
        }
    }

    function salvarDados(chave, dados) {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(chave, JSON.stringify(dados));
        }
    }

    function carregarClientes(dadosIniciais = []) {
        return carregarDados(CHAVE_CLIENTES, dadosIniciais);
    }

    function salvarClientes(clientes) {
        salvarDados(CHAVE_CLIENTES, clientes);
    }

    function carregarAgendamentos(dadosIniciais = []) {
        return carregarDados(CHAVE_AGENDAMENTOS, dadosIniciais);
    }

    function salvarAgendamentos(agendamentos) {
        salvarDados(CHAVE_AGENDAMENTOS, agendamentos);
    }

    function cadastrarCliente(clientes, nome, telefone) {
        nome = nome.trim();
        telefone = telefone.trim();

        if (!nome || !telefone) {
            throw new Error("Nome e telefone são obrigatórios.");
        }

        return [...clientes, { nome, telefone }];
    }

    function cadastrarAgendamento(agendamentos, cliente, data, horario, clientes) {
        if (!cliente || !data || !horario) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        if (!clientes.some(item => item.nome === cliente)) {
            throw new Error("Cliente não cadastrado.");
        }

        return [...agendamentos, { cliente, data, horario }];
    }

    function formatarData(data) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            throw new Error("Data inválida.");
        }

        return data.split("-").reverse().join("/");
    }

    function consultarAgenda(agendamentos) {
        return agendamentos.map(item => ({
            cliente: item.cliente,
            data: formatarData(item.data),
            horario: item.horario
        }));
    }

    const logica = {
        carregarClientes,
        salvarClientes,
        carregarAgendamentos,
        salvarAgendamentos,
        cadastrarCliente,
        cadastrarAgendamento,
        formatarData,
        consultarAgenda
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = logica;
    } else {
        global.AgendaLash = logica;
    }
})(globalThis);
