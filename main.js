import axios from "https://cdn.jsdelivr.net/npm/axios/+esm";

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10; // Quants ítems per pàgina vols mostrar
const items = []

// Referències als elements del DOM:
// apiSelector, searchInput, fetchButton, loadingElement, errorElement, resultsContainer, paginationContainer
// ... (Obtén les referències amb document.getElementById)

const apiSelector = document.getElementById("selection-id")
const searchInput = document.getElementById("search-input-id")
const fetchButton = document.getElementById("search-btn-id")
const loadingElement = document.getElementById("load-element-id")
const errorElement = document.getElementById("error-message-id")
const resultsContainer = document.getElementById("result-api-id")
const paginationContainer = document.getElementById("pages-id")

// Event Listener per al botó "Obtenir Dades"
// ... (Afegeix l'event listener al fetchButton per cridar fetchData)

fetchButton.addEventListener('click', fetchData)

// Funció per mostrar l'indicador de càrrega
function showLoading() {
    // ... (Elimina la classe 'hidden' de loadingElement)
    loadingElement.classList.remove('hidden')
}

// Funció per amagar l'indicador de càrrega
function hideLoading() {
    // ... (Afegeix la classe 'hidden' a loadingElement)
    loadingElement.classList.add('hidden')
}

// Funció per mostrar missatges d'error
function showError(message) {
    // ... (Actualitza el text de errorElement i elimina la classe 'hidden')
    errorElement.innerHTML = `Error: No s'han pogut obtenir les dades: ${message}`

    errorElement.classList.remove('hidden')
}

// Funció per amagar missatges d'error
function hideError() {
    // ... (Afegeix la classe 'hidden' a errorElement)
    errorElement.classList.add('hidden')
}

// Funció principal per obtenir dades (a implementar)
async function fetchData() {
    const searchTerm = searchInput.value.toLowerCase() /* ... (Obtén el valor de searchInput) */;
    let useAxios;
    /* ... (Comprova si apiSelector.value és 'axios') */;
    if(apiSelector.value === 'axios'){
        useAxios = true
    } else{
        useAxios = false
    }


    showLoading();
    hideError();
    // ... (Neteja resultats anteriors i paginació anterior)
    resultsContainer.innerHTML = ''
    paginationContainer.innerHTML = ''

    try {
        if (useAxios) {
            // ... (Crida la funció per obtenir dades amb Axios)
            await fetchDataWithAxios(searchTerm)
        } else {
            // ... (Crida la funció per obtenir dades amb Fetch)
            await fetchDataWithFetch(searchTerm)
        }
    } catch (error) {
        // ... (Gestiona errors inesperats si s'escapen de les funcions específiques de Fetch/Axios)
        showError(error.message)
    } finally {
        hideLoading();
    }
}

// Funció per a la visualització dels resultats i la paginació (a implementar)
function displayResults(items, totalItems) {
    // ... (Implementa la lògica per mostrar cada "ítem" com una targeta i per cridar setupPagination)
    resultsContainer.innerHTML = ''
    const itemCard = items.map(p => `
    <div class="card" data-user="${p.userId}" data-id="${p.id}" data-title="${p.title.toLowerCase()}" data-body="${p.body.toLowerCase()}">
      <div class="card-body">
        <h3>${p.userId}</h3>
        <p class="id">${p.id}</p>
        <p class="title">${p.title.toLowerCase()}</p>
        <p class="body">${p.body.toLowerCase()}</p>
      </div>
    </div>
    `).join('')

    if(items.length === 0){
        resultsContainer.innerHTML = `No s'han trobat resultats`
    }else{
        resultsContainer.innerHTML = `${itemCard}`
    }

    setupPagination(totalItems)
}

function setupPagination(totalItems) {
    // ... (Implementa la lògica per crear els botons de paginació)

    paginationContainer.innerHTML = ''

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    for(let i = 1; i <= totalPages;  i++){
        const btnPage = document.createElement('button')
        btnPage.textContent = i

        if(i === currentPage){
            btnPage.disabled = true
        }

        btnPage.addEventListener('click', () => {
            currentPage = i
            fetchData()
        })

        paginationContainer.appendChild(btnPage)
    }


}

// Funció per obtenir dades amb Fetch (a implementar)
async function fetchDataWithFetch(searchTerm) {
    // ... (Implementa la petició amb Fetch API)
    
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${itemsPerPage}&q=${searchTerm}`)

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        const totalItems = response.headers.get('X-Total-Count')

        displayResults(data, totalItems)
    }
    
    catch(error){
        showError(error.message)
    }    
}

// Funció per obtenir dades amb Axios (a implementar)                   
async function fetchDataWithAxios(searchTerm) {
    // ... (Implementa la petició amb Axios)
}