const contatosList = document.querySelector('#contatos ul');
const whats = "imagens/whats.png";
const ok = "imagens/ok.png";

// Função para renderizar os contatos
function renderContact(contact) {
    const li = document.createElement('li');
    
    // Verifique se o atendimento já foi finalizado
    const atendimentoFinalizado = contact.finalizado === 'finalizado' 
        ? `<div class="finalizado">Atendimento feito! - ${contact.nome} (${contact.telefone})</div>` 
        : '';

    li.id = contact.telefone;  // Usando o telefone como ID para o card
    li.innerHTML = `
        <div class="nomeTel">
            <div class="nome">${contact.nome}</div>
            <div class="telefone">${contact.telefone}</div>
        </div>
        <div class="cursoVen">
            <div class="curso">${contact.curso}</div>
            <div class="vendBut">
            <div class="vendedora">Vendedora: ${contact.vendedora}</div>
            <div class="butoes">
                <button class="btn-whatsapp" onclick="openWhatsapp('${contact.telefone}')"><img src="${whats}" alt="" /></button>
                <button class="btn-delete" onclick="deleteContactFromAPI('${contact.telefone}')"><img src="${ok}" alt="" /></button>
            </div>
            </div>
        </div>
        ${atendimentoFinalizado}  <!-- Exibe a mensagem se o atendimento foi finalizado -->
    `;
    contatosList.appendChild(li);
}

// Função para abrir o WhatsApp
function openWhatsapp(phone) {
    const url = `https://wa.me/55${phone.replace(/\D/g, '')}`;
    window.open(url, '_blank');
}

// Função para marcar atendimento como finalizado
async function finishAttending(telefone, button) {
    try {
        // Exibir a mensagem no cartão (alterar o conteúdo do botão)
        const li = button.closest('li');
        
        // Criar a mensagem "Atendimento feito!" com nome e telefone
        const mensagem = document.createElement('div');
        mensagem.classList.add('finalizado');
        mensagem.textContent = `Atendimento feito! - ${li.querySelector('.nome').textContent} (${li.querySelector('.telefone').textContent})`;
        li.appendChild(mensagem);

        // Marcar o atendimento como finalizado no card
        li.querySelector('.btn-finish').disabled = true;

        // Persistir a atualização
        await updateFinalizeInAPI(telefone);

        // Não é necessário o alert, a mensagem já está visível na interface
    } catch (error) {
        console.error('Erro ao finalizar atendimento:', error);
    }
}

// Função para adicionar "finalizado" na coluna "finalizar" da API
async function updateFinalizeInAPI(telefone) {
    try {
        const response = await fetch('https://sheetdb.io/api/v1/utdtj3xa28fjx', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar contatos: ${response.statusText}`);
        }

        const contatos = await response.json();

        // Encontrar o contato com o telefone especificado
        const contactToUpdate = contatos.find(contact => contact.telefone === telefone);
        if (!contactToUpdate) {
            throw new Error('Contato não encontrado.');
        }

        // Atualizar a coluna "finalizado" na planilha
        const updateResponse = await fetch(`https://sheetdb.io/api/v1/utdtj3xa28fjx/telefone/${telefone}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                finalizado: 'finalizado' // Atualizar a coluna "finalizado"
            })
        });

        if (!updateResponse.ok) {
            throw new Error(`Erro ao atualizar o contato na API: ${updateResponse.statusText}`);
        }

    } catch (error) {
        console.error('Erro ao atualizar a coluna "finalizar" na API:', error);
    }
}

// Função para excluir um contato da API
async function deleteContactFromAPI(telefone) {
    try {
        // Passo 1: Excluir o contato diretamente da API
        const deleteResponse = await fetch(`https://sheetdb.io/api/v1/utdtj3xa28fjx/telefone/${telefone}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!deleteResponse.ok) {
            throw new Error(`Erro ao excluir o contato: ${deleteResponse.statusText}`);
        }

        // Excluir o item visualmente da página
        const li = document.getElementById(telefone);
        if (li) {
            li.remove();
        }

        alert('Contato excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir contato:', error);
        alert('Erro ao excluir contato!');
    }
}

// Função para buscar contatos e renderizar na página
async function fetchContacts() {
    try {
        const response = await fetch('https://sheetdb.io/api/v1/utdtj3xa28fjx', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar contatos: ${response.statusText}`);
        }

        const contatos = await response.json();
        contatosList.innerHTML = ''; // Limpar a lista atual

        // Filtrar e renderizar apenas os contatos com a vendedora "Mariane"
        contatos.filter(contact => contact.vendedora === 'Mariane').forEach(contact => {
            renderContact(contact); // Renderiza apenas os contatos de Mariane
        });
    } catch (error) {
        console.error('Erro ao buscar contatos:', error);
    }
}

// Inicializa a lista de contatos ao carregar a página
fetchContacts();
