let mostrandoHistoricoPassado = false;

function alternarHistorico() {
  mostrandoHistoricoPassado = !mostrandoHistoricoPassado;
  exibirHistorico();
  const btnHistoricoPassado = document.getElementById('btnHistoricoPassado');
  btnHistoricoPassado.textContent = mostrandoHistoricoPassado ? 'Histórico Atual' : 'Histórico Passado';
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

Paciente ${nome} admitido às ${hora}hs, advindo do CC, por POI de ${procedimento}.

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
      alert('Erro ao copiar texto: ', err);
    });
}

function salvarNoHistorico(nome, texto) {
  const hoje = new Date().toLocaleDateString();
  let historico = JSON.parse(localStorage.getItem('historico')) || [];
  historico.unshift({ nome, texto, data: hoje });
  localStorage.setItem('historico', JSON.stringify(historico));
}

function exibirHistorico() {
  const historyList = document.getElementById('history');
  const hoje = new Date().toLocaleDateString();
  let historico = JSON.parse(localStorage.getItem('historico')) || [];
  let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];
  
  if (mostrandoHistoricoPassado) {
    historyList.innerHTML = '';
    historicoAntigo.forEach((item, index) => {
      let listItem = document.createElement('li');
      listItem.innerHTML = `Histórico do dia ${item.data}: ${item.nome} <button class="delete-button" onclick="deletarHistoricoAntigo(${index})">Deletar</button>`;
      listItem.onclick = () => {
        const output = document.getElementById('output');
        output.textContent = item.texto;
      };
      historyList.prepend(listItem);
    });
  } else {
    const ultimaData = localStorage.getItem('ultimaData');
    if (ultimaData && ultimaData !== hoje) {
      salvarHistoricoAntigo(historico, ultimaData);
      historico = [];
      localStorage.setItem('historico', JSON.stringify(historico));
    }

    localStorage.setItem('ultimaData', hoje);

    historico = historico.filter(item => item.data === hoje);
    localStorage.setItem('historico', JSON.stringify(historico));

    historyList.innerHTML = '';
    historico.forEach((item, index) => {
      let listItem = document.createElement('li');
      listItem.innerHTML = `${historico.length - index}: ${item.nome} <button class="delete-button" onclick="deletarTexto(${index})">Deletar</button>`;
      listItem.onclick = () => {
        const output = document.getElementById('output');
        output.textContent = item.texto;
        document.getElementById('editBtn').style.display = 'inline-block';
      };
      historyList.prepend(listItem);
    });
  }
}

function deletarTexto(index) {
  let historico = JSON.parse(localStorage.getItem('historico')) || [];
  historico.splice(index, 1);
  localStorage.setItem('historico', JSON.stringify(historico));
  exibirHistorico();
}

function salvarHistoricoAntigo(historico, data) {
  let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];
  historico.forEach(item => {
    if (item.data === data) {
      historicoAntigo.push(item);
    }
  });
  localStorage.setItem('historicoAntigo', JSON.stringify(historicoAntigo));
}

function deletarHistoricoAntigo(index) {
  let historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];
  historicoAntigo.splice(index, 1);
  localStorage.setItem('historicoAntigo', JSON.stringify(historicoAntigo));
  exibirHistorico();
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
  salvarNoHistorico('Edição', editArea.value);
  exibirHistorico();
}

document.addEventListener('DOMContentLoaded', () => {
  exibirHistorico();
});