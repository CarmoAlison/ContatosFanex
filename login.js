
// Função para formatar o CPF enquanto o usuário digita
function formatarCPF(cpf) {
    // Remove qualquer caractere não numérico
    cpf = cpf.replace(/\D/g, '');

    // Aplica a máscara de CPF: xxx.xxx.xxx-xx
    if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    return cpf;
}

// Adiciona evento ao campo de CPF
document.getElementById("cpf").addEventListener("input", (e) => {
    let cpf = e.target.value;
    cpf = formatarCPF(cpf);  // Aplica a formatação
    e.target.value = cpf;  // Atualiza o valor do campo com a formatação
});


// Função para validar o login via API SheetDB
async function validarLogin(cpf, senha) {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block"; // Mostra o spinner enquanto aguarda a resposta

    // Remover qualquer formatação do CPF antes de enviá-lo para a API
    const cpfSemFormatacao = cpf.replace(/\D/g, '');

    try {
        // Requisição à API do SheetDB para validar o login
        const response = await fetch('https://sheetdb.io/api/v1/h5v56l8j1qsll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const usuarios = await response.json();
        const usuario = usuarios.find(u => u.CPF.replace(/\D/g, '') === cpfSemFormatacao && u.Senha === senha);

        if (usuario) {
            // Sucesso, validou o login
            // A resposta da API deve informar o nome do usuário
            switch (usuario.Nome) {
                case "Amanda":
                    window.location.href = "principal.html";
                    break;
                case "Monik":
                    window.location.href = "principal.html";
                    break;
                case "Zilda":
                    window.location.href = "principal.html";
                    break;
                case "Miria":
                    window.location.href = "miria.html";
                    break;
                case "Mariane":
                    window.location.href = "mariane.html";
                    break;
                case "Alison":
                    window.location.href = "admin.html";
                    break;
                case "Brunna":
                    window.location.href = "admin.html";
                    break;
                default:
                    alert("Nome de usuário não reconhecido!");
            }
        } else {
            alert("CPF ou senha inválidos!"); // Exibe mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao validar o login:', error);
        alert("Ocorreu um erro. Tente novamente mais tarde.");
    }

    spinner.style.display = "none"; // Oculta o spinner após a resposta
}

// Adiciona evento ao botão de login
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector("button");
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Obtém os valores dos campos
        const cpf = document.getElementById("cpf").value; // Agora com o id correto
        const senha = document.getElementById("senha").value;

        if (cpf && senha) {
            validarLogin(cpf, senha);
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });
});
