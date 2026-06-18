const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 12;

const apiSelector = document.getElementById("selection-id")
const searchInput = document.getElementById("search-input-id")
const fetchButton = document.getElementById("search-btn-id")
const loadingElement = document.getElementById("load-element-id")
const errorElement = document.getElementById("error-message-id")
const resultsContainer = document.getElementById("result-api-id")
const paginationContainer = document.getElementById("pagination-id")

const btnArrowLeft = document.getElementById("btn__arrow-left")
const btnArrowRight = document.getElementById("btn__arrow-right")

fetchButton.addEventListener('click', fetchData)

btnArrowLeft.addEventListener('click', () => {
    if(currentPage > 1){
        currentPage--
        fetchData()
    }
})

btnArrowRight.addEventListener('click', () => {
    currentPage++
    fetchData()
})

function showLoading() {
    loadingElement.classList.remove('hidden')
}

function hideLoading() {
    loadingElement.classList.add('hidden')
}

function showError(message) {

    const errorMessage = message instanceof Error? message.message: message

    errorElement.innerHTML = `Error: ${errorMessage}`

    errorElement.classList.remove('hidden')
}

function hideError() {
    errorElement.classList.add('hidden')
}

async function fetchData() {
    const searchTerm = searchInput.value.toLowerCase()
    let useAxios;
    if(apiSelector.value === 'axios'){
        useAxios = true
    } else{
        useAxios = false
    }

    showLoading();
    hideError();
    resultsContainer.innerHTML = ''
    paginationContainer.innerHTML = ''

    try {
        if (useAxios) {
            await fetchDataWithAxios(searchTerm)
        } else {
            await fetchDataWithFetch(searchTerm)
        }
    } catch (error) {
        showError(error)
    } finally {
        hideLoading();
    }
}

function displayResults(items, totalItems) {
    resultsContainer.innerHTML = ''
    const itemCard = items.map(p => `
    <div class="card" data-id="${p.id}" data-title="${p.title.toLowerCase()}" data-body="${p.body.toLowerCase()}">
      <div class="card-body">
        <h3>${p.id}</h3>
        <h4 class="title">${p.title.toLowerCase()}</h4>
        <p class="body">${p.body.toLowerCase()}</p>
      </div>
    </div>
    `).join('')

    if(items.length === 0){
        showError(`No s'han trobat resultats`)
    }else{
        resultsContainer.innerHTML = `${itemCard}`
    }

    setupPagination(totalItems)
}

function setupPagination(totalItems) {
    paginationContainer.innerHTML = ''

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    if(totalPages <= 1){
        btnArrowLeft.classList.add('hidden')
        btnArrowRight.classList.add('hidden')
        
    } else{
        btnArrowLeft.classList.remove('hidden')
        btnArrowRight.classList.remove('hidden')
    }

    btnArrowLeft.disabled = (currentPage === 1)
    btnArrowRight.disabled = (currentPage === totalPages)

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

async function fetchDataWithFetch(searchTerm) {
    
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
        showError(error)
    }    
}

async function fetchDataWithAxios(searchTerm) {
    try {
        const response = await axios.get(API_URL,
        {
            params: {
            _page: currentPage,
            _limit: itemsPerPage,
            q: searchTerm
            },
        }
        );

        const totalItems = response.headers['x-total-count']
        displayResults(response.data, totalItems)

    } catch (error) {
        const errmessage = error.response?.statusText || error.message
        showError(errmessage)
    }
}