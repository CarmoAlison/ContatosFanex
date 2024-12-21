const form = document.getElementById('form-contato');
const contatosList = document.querySelector('#contatos ul');
const modal = document.getElementById('modal');
const abrirModal = document.getElementById('abrir-modal');
const fecharModal = document.querySelector('.fechar');
const API_URL = "https://api.sheetbest.com/sheets/607c08d7-f76b-4297-b434-d3bf8e800e06";
const API_KEY = 'F-fTPvJjYME$Z0OY$6Y32AJzzM$P3j#Tytp7HgV!J2ufUGlE11XyjwjORvknt40l';
const LogoBranca = 'imagens/fanexlogo.png';
const whats = "imagens/whats.png";
const ok = "imagens/ok.png";

// Abrir e fechar modal
abrirModal.addEventListener('click', () => modal.style.display = 'block');
fecharModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Função para renderizar os contatos
function renderContact(contact) {
    const li = document.createElement('li');
    li.id = contact.telefone;

    // Verifique se o atendimento foi finalizado
    const atendimentoFinalizado = contact.finalizado === 'finalizado' 
        ? `<div class="finalizado">Atendimento feito! - ${contact.nome} (${contact.telefone})</div>` 
        : '';

    li.innerHTML = `
        <div class="logo"><img src="${LogoBranca}" alt="" /></div>
        <div class="nomeTel">
            <div class="nome"><h1 id="nomeNome">${contact.nome}</h1></div>
            <div class="vendedora">Vendedora: ${contact.vendedora}</div>
        </div>
        <div class="cursoVen">
            <div class="curso"><h1 id="cursoCurso">${contact.curso}<h1/></div>
            <div class="butoes">
                <button class="btn-whatsapp" onclick="openWhatsapp('${contact.telefone}')"><img src="${whats}" alt="" /></button>
                <button class="btn-delete" onclick="deleteContactFromAPI('${contact.telefone}')"><img src="${ok}" alt="" /></button>
            </div>
        </div>
        ${atendimentoFinalizado}
    `;
    contatosList.prepend(li); // Adiciona no topo da lista
}

// Função para abrir o WhatsApp
function openWhatsapp(phone) {
    const url = `https://wa.me/55${phone.replace(/\D/g, '')}`;
    window.open(url, '_blank');
}

// Função para excluir um contato da API e da página
async function deleteContactFromAPI(telefone) {
    try {
        const deleteResponse = await fetch(`https://sheetdb.io/api/v1/utdtj3xa28fjx/telefone/${telefone}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!deleteResponse.ok) {
            throw new Error(`Erro ao excluir o contato: ${deleteResponse.statusText}`);
        }

        const li = document.getElementById(telefone);
        if (li) {
            li.remove(); // Remove o contato visualmente
        }
        alert('Atendimento Realizado!');
    } catch (error) {
        console.error('Erro ao excluir contato:', error);
        alert('Erro ao excluir contato!');
    }
}

// Função para buscar e renderizar contatos
async function fetchContacts() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'X-Api-Key': API_KEY
            }
        });
        const contacts = await response.json();
        
        if (contacts.length > 0) {
            contacts.forEach(contact => {
                renderContact(contact); // Renderiza todos os contatos
            });
        }
    } catch (error) {
        console.error('Erro ao buscar contatos:', error);
    }
}

// Salvar novo contato
async function saveContact(contact) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': API_KEY
            },
            body: JSON.stringify(contact)
        });
        renderContact(contact); // Renderiza o novo contato após ser salvo
    } catch (error) {
        console.error('Erro ao salvar contato:', error);
    }
}

// Listener para o formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const contact = {
        nome: form.nome.value,
        telefone: form.telefone.value,
        curso: form.curso.value,
        vendedora: form.vendedora.value
    };

    saveContact(contact); // Salva o novo contato
    form.reset();
    modal.style.display = 'none';
});


// Inicializa a lista de contatos ao carregar a página
fetchContacts();
