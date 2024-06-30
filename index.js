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
      document.getElementById('editBtn').style.display = 'inline-block';
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

    function editarTexto() {
      const output = document.getElementById('output');
      const editArea = document.getElementById('editArea');
      const saveEditBtn = document.getElementById('saveEditBtn');

      editArea.value = output.textContent;
      output.style.display = 'none';
      editArea.style.display = 'block';
      saveEditBtn.style.display = 'inline-block';
      document.getElementById('editBtn').style.display = 'none';
    }

    function salvarTextoEditado() {
      const output = document.getElementById('output');
      const editArea = document.getElementById('editArea');
      const saveEditBtn = document.getElementById('saveEditBtn');

      output.textContent = editArea.value;
      output.style.display = 'block';
      editArea.style.display = 'none';
      saveEditBtn.style.display = 'none';
      document.getElementById('editBtn').style.display = 'inline-block';
      
      // Atualizar o histórico com o texto editado
      let historico = JSON.parse(localStorage.getItem('historico')) || [];
      historico[historico.length - 1].texto = editArea.value;
      localStorage.setItem('historico', JSON.stringify(historico));
      exibirHistorico();
    }

    function salvarNoHistorico(nome, texto) {
      const hoje = new Date().toLocaleDateString();
      let historico = JSON.parse(localStorage.getItem('historico')) || [];
      historico.push({ nome, texto, data: hoje });
      localStorage.setItem('historico', JSON.stringify(historico));
    }

    function exibirHistorico() {
      const historyList = document.getElementById('history');
      const hoje = new Date().toLocaleDateString();
      let historico = JSON.parse(localStorage.getItem('historico')) || [];

      // Verificar se a data mudou e, se sim, salvar e limpar o histórico antigo
      const ultimaData = localStorage.getItem('ultimaData');
      if (ultimaData && ultimaData !== hoje) {
        salvarHistoricoAntigo(historico, ultimaData);
        historico = [];
        localStorage.setItem('historico', JSON.stringify(historico));
      }

      localStorage.setItem('ultimaData', hoje);

      // Filtrar itens do histórico pela data atual
      historico = historico.filter(item => item.data === hoje);
      localStorage.setItem('historico', JSON.stringify(historico));

      historyList.innerHTML = '';
      historico.forEach((item, index) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${index + 1}: ${item.nome} <button class="delete-button" onclick="deletarTexto(${index})">Deletar</button>`;
        listItem.onclick = () => {
          const output = document.getElementById('output');
          output.textContent = item.texto;
          document.getElementById('editBtn').style.display = 'inline-block';
        };
        historyList.appendChild(listItem);
      });
    }

    function deletarTexto(index) {
      let historico = JSON.parse(localStorage.getItem('historico')) || [];
      historico.splice(index, 1);
      localStorage.setItem('historico', JSON.stringify(historico));
      exibirHistorico();
    }

    function salvarHistoricoAntigo(historico, data) {
      const textoHistorico = historico.map(item => item.texto).join('\n\n');
      const historicoAntigo = JSON.parse(localStorage.getItem('historicoAntigo')) || [];
      historicoAntigo.push({ data, texto: textoHistorico });
      localStorage.setItem('historicoAntigo', JSON.stringify(historicoAntigo));
    }

    // Initialize the history on page load
    document.addEventListener('DOMContentLoaded', (event) => {
      exibirHistorico();
    });