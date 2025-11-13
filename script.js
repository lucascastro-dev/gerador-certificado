let alunos = [];

function adicionarAluno() {
  const nome = document.getElementById("nome").value.trim();
  const faixa = document.getElementById("faixa").value;
  const professor = document.getElementById("professor").value;
  const medida = document.getElementById("medida").value;

  if (!professor) {
    alert("Por favor, selecione o professor antes de adicionar alunos.");
    return;
  }

  if (nome && faixa && medida) {
    alunos.push({ nome, faixa, medida });
    document.getElementById("professor").disabled = true;
    atualizarLista();
    document.getElementById("nome").value = "";
    document.getElementById("faixa").selectedIndex = 0;
    document.getElementById("medida").selectedIndex = 0;
  } else {
    alert("Por favor, preencha o nome do aluno e selecione a faixa.");
  }
}

function removerTodosAlunos() {
  alunos = [];
  atualizarLista();
  document.getElementById("professor").disabled = false;
}

function removerAluno(index) {
  alunos.splice(index, 1);
  atualizarLista();

  if (alunos.length === 0) {
    document.getElementById("professor").disabled = false;
  }
}

function atualizarLista() {
  const lista = document.getElementById("listaAlunos");
  const tabelaContainer = document.getElementById("tabelaContainer");
  lista.innerHTML = "";

  if (alunos.length === 0) {
    tabelaContainer.classList.add("hidden");
    return;
  }

  tabelaContainer.classList.remove("hidden");

  alunos.forEach((aluno, index) => {
    lista.innerHTML += `
      <tr>
        <td>${aluno.nome}</td>
        <td>${aluno.faixa}</td>
        <td>${aluno.medida}</td>
        <td class="actions">
          <button class="edit" onclick="editarAluno(${index})">Editar</button>
          <button class="delete-all" onclick="removerAluno(${index})">Excluir</button>
        </td>
      </tr>`;
  });
}

function editarAluno(index) {
  const aluno = alunos[index];
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("faixa").value = aluno.faixa;
  document.getElementById("medida").value = aluno.medida;
  alunos.splice(index, 1);
  atualizarLista();
}

function toggleProjetos() {
  const checkbox = document.getElementById("certificadoPersonalizado");
  const select = document.getElementById("projetos");
  select.classList.toggle("hidden", !checkbox.checked);
}

function gerarCertificados() {
  const professor = document.getElementById("professor").value;
  const dataEvento = document.getElementById("dataEvento").value;

  if (!professor) {
    alert("Por favor, selecione o professor.");
    return;
  }

  if (!dataEvento) {
    alert("Por favor, selecione a data do evento.");
    return;
  }

  if (alunos.length === 0) {
    alert("Adicione pelo menos um aluno antes de gerar os certificados.");
    return;
  }

  const personalizado = document.getElementById("certificadoPersonalizado").checked;
  const projeto = document.getElementById("projetos").value;

  const dados = {
    professor,
    dataEvento,
    personalizado,
    projeto: personalizado ? projeto : null,
    alunos
  };

  fetch("salvar_certificado.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })
    .then(response => response.text())
    .then(msg => {
      alert(msg);
      document.getElementById("dataEvento").value = "";
      document.getElementById("certificadoPersonalizado").checked = false;
      document.getElementById("projetos").classList.add("hidden");
      document.getElementById("professor").selectedIndex = 0;
      alunos = [];
      atualizarLista();
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao salvar certificado.");
    });
}
