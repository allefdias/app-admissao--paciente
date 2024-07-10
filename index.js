let mostrandoHistoricoPassado = false;

function alternarHistorico() {
    mostrandoHistoricoPassado = !mostrandoHistoricoPassado;
    exibirHistorico();
    const btnAlternarHistorico = document.getElementById('btnAlternarHistorico');

    if (mostrandoHistoricoPassado) {
        btnAlternarHistorico.textContent = 'Mostrar Histórico Atual';
    } else {
        btnAlternarHistorico.textContent = 'Mostrar Histórico Passado';
    }
}

function gerarTexto() {
    const form = document.getElementById('infoForm');
    const output = document.getElementById('output');
  
    const nome = form.elements['nome'].value;
    const hora = form.elements['hora'].value;
    const procedimento = form.elements['procedimento'].value;
    const anestesia = form.elements['anestesia'].value;
    const comorbidades = form.elements['comorbidades'].value;
    const alergias = form.elements['alergias'].value;
    const acesso = form.elements['acesso'].value;
    const picc = form.elements['picc'].value;
    const cateterCentral = form.elements['cateterCentral'].value;
    const diurese = form.elements['diurese'].value;
    const dreno = form.elements['dreno'].value;

    let texto = `
######### SALA DE RECUPERAÇÃO ###########

Paciente admitido às ${hora}hs, advindo do CC, por POI de ${procedimento}.

Anestesia: ${anestesia}
Comorbidades: ${comorbidades}
Alergias: ${alergias}

Admitido sonolento, despertável ao chamado, orientado, cooperativo, em ar ambiente, 
ligado à monitorização multiparamétrica, mantendo SSVV estáveis,
${acesso}com HV em curso,${picc}${cateterCentral}
em dieta zero, mantendo cabeceira elevada a 30º-45º. Abdômen flácido, diurese ${diurese} 
e evacuações ausentes, ${dreno}apresentando pele íntegra para LPP.

Segue aos cuidados da enfermagem.
`;

    output.textContent = texto;
    salvarNoHistorico(nome, texto);
    exibirHistorico();
}

function copiarTexto() {
    const output = document.getElementById('output');
    navigator.clipboard.writeText(output.textContent)
        .then(() => {
            alert('Texto copiado para a área de transferência!');
        })
        .catch(err => {
            alert('Erro ao copiar texto: ' + err);
        });
}

function salvarNoHistorico(nome, texto) {
    const hoje = new Date().toLocaleDateString();
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];
    const ultimaData = localStorage.getItem('ultimaData') || hoje;

    // Verifica se é um novo dia e move o histórico para o histórico antigo
    if (ultimaData !== hoje) {
        historico.forEach(item => {
            historicoAntigo.push(item);
        });
        historico = [];
        localStorage.setItem('historicoAntigo', JSON.stringify(historicoAntigo));
    }

    historico.unshift({ nome, texto, data: hoje });
    localStorage.setItem('historico', JSON.stringify(historico));
    localStorage.setItem('ultimaData', hoje);
}

function exibirHistorico() {
    const historyList = document.getElementById('history');
    const hoje = new Date().toLocaleDateString();
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];

    historyList.innerHTML = ''; // Limpa a lista antes de exibir

    if (mostrandoHistoricoPassado) {
        exibirHistoricoPassado(historyList, historicoAntigo);
    } else {
        exibirHistoricoAtual(historyList, hoje, historico);
    }
}

function exibirHistoricoAtual(historyList, hoje, historico) {
    historico = historico.filter(item => item.data === hoje);
    historico.forEach((item, index) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${historico.length - index}: ${item.nome} <button class="delete-button" onclick="deletarTexto(${index})">Deletar</button>`;
        listItem.onclick = () => {
            const output = document.getElementById('output');
            output.textContent = item.texto;
            document.getElementById('editBtn').style.display = 'inline-block';
        };
        historyList.appendChild(listItem);
    });
}

function exibirHistoricoPassado(historyList, historicoAntigo) {
    let historicoAgrupado = {};
    historicoAntigo.forEach(item => {
        if (!historicoAgrupado[item.data]) {
            historicoAgrupado[item.data] = [];
        }
        historicoAgrupado[item.data].push(item);
    });

    // Exibir botões para cada data no histórico agrupado
    Object.keys(historicoAgrupado).forEach(data => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `<button onclick="exibirHistoricoPorData('${data}')">${data}</button>`;
        historyList.appendChild(listItem);
    });
}

function deletarTexto(index) {
    const senha = prompt('Por favor, digite a senha para confirmar a exclusão:');
    if (senha === 'deletar123') {
        let historico = JSON.parse(localStorage.getItem('historico')) || [];
        historico.splice(index, 1);
        localStorage.setItem('historico', JSON.stringify(historico));
        exibirHistorico();
    } else {
        alert('Senha incorreta. Exclusão cancelada.');
    }
}

function deletarHistoricoAntigo(index) {
    const senha = prompt('Por favor, digite a senha para confirmar a exclusão:');
    if (senha === 'deletar123') {
        let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];
        historicoAntigo.splice(index, 1);
        localStorage.setItem('historicoAntigo', JSON.stringify(historicoAntigo));
        exibirHistorico();
    } else {
        alert('Senha incorreta. Exclusão cancelada.');
    }
}

function editarTexto() {
    const output = document.getElementById('output');
    const editArea = document.getElementById('editArea');
    editArea.value = output.textContent;
    output.style.display = 'none';
    editArea.style.display = 'block';
    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('saveEditBtn').style.display = 'inline-block';
}

function salvarTextoEditado() {
    const editArea = document.getElementById('editArea');
    const output = document.getElementById('output');
    output.textContent = editArea.value;
    editArea.style.display = 'none';
    output.style.display = 'block';
    document.getElementById('editBtn').style.display = 'inline-block';
    document.getElementById('saveEditBtn').style.display = 'none';
    exibirHistorico();
}

function exibirHistoricoPorData(data) {
    const historyList = document.getElementById('history');
    let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];

    historyList.innerHTML = ''; // Limpa a lista antes de exibir

    historicoAntigo = historicoAntigo.filter(item => item.data === data);
    historicoAntigo.forEach((item, index) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${index + 1}: ${item.nome} <button class="delete-button" onclick="deletarHistoricoAntigo(${index})">Deletar</button>`;
        listItem.onclick = () => {
            const output = document.getElementById('output');
            output.textContent = item.texto;
            document.getElementById('editBtn').style.display = 'none'; // Esconde o botão de edição ao exibir histórico antigo
        };
        historyList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    verificarData();
    exibirHistorico();
});

function verificarData() {
    const hoje = new Date().toLocaleDateString();
    const ultimaData = localStorage.getItem('ultimaData');

    if (ultimaData !== hoje) {
        let historico = JSON.parse(localStorage.getItem('historico')) || [];
        let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];

        historico.forEach(item => {
            historicoAntigo.push(item);
        });

        localStorage.setItem('historicoAntigo', JSON.stringify(historicoAntigo));
        localStorage.setItem('historico', JSON.stringify([])); // Limpa o histórico atual
        localStorage.setItem('ultimaData', hoje);
    }
}

function pesquisarHistorico() {
    const termoPesquisado = document.getElementById('inputPesquisaNome').value.toLowerCase();
    const historyList = document.getElementById('history');
    historyList.innerHTML = '';

    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];
    let resultados = [];

    // Busca no histórico atual por nome ou data
    historico.forEach(item => {
        if (item.nome.toLowerCase().includes(termoPesquisado) || item.data.includes(termoPesquisado)) {
            resultados.push(item);
        }
    });

    // Busca no histórico antigo por nome ou data
    historicoAntigo.forEach(item => {
        if (item.nome.toLowerCase().includes(termoPesquisado) || item.data.includes(termoPesquisado)) {
            resultados.push(item);
        }
    });

    // Exibe os resultados encontrados
    resultados.forEach((item, index) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${index + 1}: ${item.nome} (${item.data}) <button class="delete-button" onclick="deletarTexto(${index})">Deletar</button>`;
        listItem.onclick = () => {
            const output = document.getElementById('output');
            output.textContent = item.texto;
            document.getElementById('editBtn').style.display = 'inline-block';
        };
        historyList.appendChild(listItem);
    });

    // Limpa o campo de pesquisa
    document.getElementById('inputPesquisaNome').value = '';
}
