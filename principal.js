const form = document.getElementById('form-contato');
const contatosList = document.querySelector('#contatos ul');

const API_URL = "https://api.sheetbest.com/sheets/607c08d7-f76b-4297-b434-d3bf8e800e06";
const API_KEY = 'F-fTPvJjYME$Z0OY$6Y32AJzzM$P3j#Tytp7HgV!J2ufUGlE11XyjwjORvknt40l';
const LogoBranca = 'imagens/fanexlogo.png';

// Renderizar contato
function renderContact(contact) {
    const li = document.createElement('li');
    li.id = contact.telefone;  // Usando o telefone como ID para o card
    li.innerHTML = `
        <div class="logo"><img src="${LogoBranca}" alt="" /></div>
        <div class="nomeTel">
            <div class="nome">${contact.nome}</div>
            <div class="telefone">${contact.telefone}</div>
        </div>
        <div class="cursoVen">
            <div class="curso">${contact.curso}</div>
            <div class="vendedora">Vendedora: ${contact.vendedora}</div>
        </div>
    `;
    contatosList.prepend(li); // Adiciona no topo da lista (último contato)
}

// Buscar contatos da API
async function fetchContacts() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'X-Api-Key': API_KEY
            }
        });
        const contacts = await response.json();
        
        if (contacts.length > 0) {
            const lastContact = contacts[contacts.length - 1]; // Pega o último contato
            renderContact(lastContact); // Renderiza somente o último contato
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
});

// Inicializa o último contato
fetchContacts();
