// script.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', armazenarDados);
    }

    if (window.location.pathname.includes('boletim.html')) {
        buscarDados();
    }
});

function armazenarDados(event) {
    event.preventDefault(); // Impede o envio do formulário

    const ra = document.getElementById('RA').value;
    const nascimento = document.getElementById('nascimento').value;

    // Armazena os dados no localStorage
    localStorage.setItem('RA', ra);
    localStorage.setItem('nascimento', nascimento);

    // Redireciona para a página boletim.html
    window.location.href = 'boletim.html';
}

async function buscarDados() {
    const ra = localStorage.getItem('RA');
    const nascimento = localStorage.getItem('nascimento');

    if (!ra || !nascimento) {
        alert('Dados de RA ou data de nascimento não encontrados.');
        return;
    }

    try {
        const response = await fetch('dadosaluno.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const student = xmlDoc.querySelector(`student[RA="${ra}"]`);

        if (!student) {
            alert('Aluno não encontrado.');
            return;
        }

        const nasc = student.querySelector('NASC').textContent;

        if (nascimento !== nasc) {
            alert('Data de nascimento não corresponde.');
            return;
        }

        const nome = student.querySelector('Nome') ? student.querySelector('Nome').textContent : 'Nome não disponível';
        const notas = {
            Portugues: student.querySelector('Portugues').textContent,
            Matematica: student.querySelector('Matematica').textContent,
            Biologia: student.querySelector('Biologia').textContent,
            Fisica: student.querySelector('Fisica').textContent,
            Quimica: student.querySelector('Quimica').textContent,
            Historia: student.querySelector('Historia').textContent
        };

        document.getElementById('nome-aluno').textContent = `Nome: ${nome}`;
        document.getElementById('ra-aluno').textContent = `RA: ${ra}`;

        const tabela = document.getElementById('tabela-notas');
        for (const [disciplina, nota] of Object.entries(notas)) {
            const row = tabela.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = disciplina;
            cell2.textContent = nota;
        }

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Verifique o console para mais detalhes.');
    }
}
