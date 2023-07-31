'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_livro')) ?? []
const setLocalStorage = (dblivro) => localStorage.setItem("db_livro", JSON.stringify(dblivro))

// CRUD - create read update delete
const deletelivro = (index) => {
    const dblivro = readlivro()
    dblivro.splice(index, 1)
    setLocalStorage(dblivro)
}

const updatelivro = (index, livro) => {
    const dblivro = readlivro()
    dblivro[index] = livro
    setLocalStorage(dblivro)
}

const readlivro = () => getLocalStorage()

const createlivro = (livro) => {
    const dblivro = getLocalStorage()
    dblivro.push (livro)
    setLocalStorage(dblivro)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const savelivro = () => {
    debugger
    if (isValidFields()) {
        const livro = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createlivro(livro)
            updateTable()
            closeModal()
        } else {
            updatelivro(index, livro)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (livro, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${livro.nome}</td>
        <td>${livro.email}</td>
        <td>${livro.celular}</td>
        <td>${livro.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tablelivro>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tablelivro>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dblivro = readlivro()
    clearTable()
    dblivro.forEach(createRow)
}

const fillFields = (livro) => {
    document.getElementById('nome').value = livro.nome
    document.getElementById('autor').value = livro.email
    document.getElementById('Celular de contato').value = livro.celular
    document.getElementById('data').value = livro.cidade
    document.getElementById('categoria').dataset.index = livro.index
}

const editlivro = (index) => {
    const livro = readlivro()[index]
    livro.index = index
    fillFields(livro)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editlivro(index)
        } else {
            const livro = readlivro()[index]
            const response = confirm(`Deseja realmente excluir o livro ${livro.nome}`)
            if (response) {
                deletelivro(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarlivro')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', savelivro)

document.querySelector('#tablelivro>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)