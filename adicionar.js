document.getElementById("formCadastro").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

    const statusDiv = document.getElementById("status");
    statusDiv.textContent = '';
    statusDiv.className = '';

    if (nome && cpf && senha) {
        // Enviar para a API
        try {
            const response = await fetch('https://sheetdb.io/api/v1/h5v56l8j1qsll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nome: nome,
                    CPF: cpf,
                    Senha: senha
                })
            });

            if (response.ok) {
                statusDiv.textContent = 'Cadastro realizado com sucesso!';
                statusDiv.className = 'success';
                document.getElementById("formCadastro").reset();
            } else {
                statusDiv.textContent = 'Erro ao cadastrar. Tente novamente.';
                statusDiv.className = 'error';
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            statusDiv.textContent = 'Erro ao cadastrar. Tente novamente.';
            statusDiv.className = 'error';
        }
    } else {
        statusDiv.textContent = 'Por favor, preencha todos os campos.';
        statusDiv.className = 'error';
    }
});
