import { hidePreloader, main, cardsContainer, createCard, searchEventHandler, cardAnimation, createModalPlayer, showHidePlayer, authorInfos } from "./dom.js";

// DOM Elements - Filter
export const sorting = document.getElementById('sort');
export const nation = document.getElementById('nation');

// DOM Elements - Pagination
const prevPage = document.querySelector('.left-arrow');
const nextPage = document.querySelector('.right-arrow');
export const pagesLabel = document.getElementById('pages-label');
export const pageNum = document.getElementById('pageNumber');

// TMDB API
export const TMDB_API_KEY = 'api_key=6a55627a0b1d370a7f55c28d1eeb36d1';
const TMDB_API_URL = 'https://api.themoviedb.org/3/discover/movie?';

function errorMessage(message) {
    const pagination = document.querySelector('.pagination');
    pagination.style.display = 'none';
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.innerHTML = message;
    cardsContainer.appendChild(errorMessage);
}

// Search Query
export function searchQuery(terms, lang = 'en-US') {
    try {
        fetch(`https://api.themoviedb.org/3/search/movie?${TMDB_API_KEY}&query=${encodeURI(terms)}&language=${lang}`, {
            method: 'GET'
        }).then(res => {
            if (res.status !== 200) {
                throw new Error('Sorry an error occured. Try again later...');
            }
            return res.json();
        }).then(data => {
            console.log('Search ', data);
            if (data.results.length === 0) {
                errorMessage(`Sorry, no movies available for <span style="font-style: italic; font-weight: 700;">"${terms.split('+').join(' ')}"</span> word(s) : (`);
            } else {
                data.results.forEach(movieData => {
                    createCard(movieData.id, movieData.title, movieData.poster_path, movieData.release_date, movieData.vote_average, nation.value);
                });
                const modalPlayer = document.querySelector('modal-player');
                cardAnimation();
                if (main.contains(modalPlayer)) modalPlayer.remove();
                createModalPlayer();
                showHidePlayer();
            }
        })
    } catch(error) {
        console.log(error);
    }
}

// Fetch data from TMDB API
function fetchData(page, sort = 'popularity.desc', lang = 'en-US') {
    try {
        fetch(`${TMDB_API_URL}sort_by=${sort}&${TMDB_API_KEY}&page=${page}&language=${lang}`, {
            method: 'GET'
        }).then(res => {
            if (res.status !== 200) {
                errorMessage('Sorry an error occured. Try again later : (');
                throw new Error('Sorry an error occured. Try again later...');
            }
            return res.json();
        }).then(data => {
            pagesLabel.textContent = `/${data.total_pages}`;
            data.results.forEach(movieData => {
                createCard(movieData.id, movieData.title, movieData.poster_path, movieData.release_date, movieData.vote_average, nation.value);
            });
            const modalPlayer = document.querySelector('modal-player');
            cardAnimation();
            if (main.contains(modalPlayer)) modalPlayer.remove();
            createModalPlayer();
            showHidePlayer();
        })
    } catch(error) {
        console.log(error);
    }
}

fetchData(pageNum.value);

searchEventHandler();

prevPage.addEventListener('click', () => {
    if (+pageNum.value <= 1) return;
    pageNum.value = +pageNum.value - 1;
    cardsContainer.innerHTML = '';
    fetchData(pageNum.value, sorting.value, nation.value);
});

pageNum.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
        cardsContainer.innerHTML = '';
       fetchData(pageNum.value, sorting.value, nation.value);
    }
});

nextPage.addEventListener('click', () => {
    const pages = +Array.from(pagesLabel.textContent).splice(1).join('');
    if (+pageNum.value >= pages) return;
    pageNum.value = +pageNum.value + 1;
    cardsContainer.innerHTML = '';
    fetchData(pageNum.value, sorting.value, nation.value);
});

sorting.addEventListener('change', () => {
    pageNum.value = '1';
    cardsContainer.innerHTML = '';
    fetchData(pageNum.value, sorting.value, nation.value);
});

nation.addEventListener('change', () => {
    pageNum.value = '1';
    cardsContainer.innerHTML = '';
    fetchData(pageNum.value, sorting.value, nation.value);
});

hidePreloader();

authorInfos();