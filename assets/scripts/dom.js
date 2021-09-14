import { nation, pagesLabel, pageNum, searchQuery } from './script.js';

// DOM Elements - Body
export const preloaderContainer = document.querySelector('.preloader-container');
export const main = document.querySelector('main');

// DOM Elements - Navbar
const nav = document.querySelector('nav');
const searchInput = document.querySelector('.search');
const searchIcon = document.querySelector('.search-icon');
const filterIcon = document.querySelector('.filter-icon');

// DOM Elements - Cards
export const cardsContainer = document.querySelector('.cards-container');

// DOM Elements - Footer
const footerTag = document.querySelector('footer');
const upArrow = document.querySelector('.up-arrow');
const author = document.querySelector('.author');

export function hidePreloader() {
    window.addEventListener('load', () => {
        preloaderContainer.classList.add('hide');
    });
}

export function authorInfos() {
    author.innerHTML = `Made with ❤️ by <a href="https://github.com/RTX3070" target="_blank">RTX3070</a> &copy;${new Date().getFullYear()} All Rights Reserved`;
}

export function createModalPlayer() {
    const ModalPlayerEl = document.createElement('modal-player');
    ModalPlayerEl.dataset.movieId = '';
    ModalPlayerEl.dataset.nation = '';
    main.insertAdjacentElement('afterbegin', ModalPlayerEl);
}

export function showHidePlayer() {
    const cards = document.querySelectorAll('.card');
    const playIcons = document.querySelectorAll('.play-icon');
    const modalPlayer = document.querySelector('modal-player');
    playIcons.forEach((playIcon, i) => {
        playIcon.addEventListener('click', () => {
            document.body.style.overflow = 'hidden';
            modalPlayer.setAttribute('opened', '');
            modalPlayer.dataset.movieId = cards[i].dataset.movieId;
            modalPlayer.dataset.nation = cards[i].dataset.nation;
        });
   });
}

export function cardAnimation() {
    const cards = document.querySelectorAll('.card');
    const cardMenuIcons = document.querySelectorAll('.menu-icon');
    const cardMenus = document.querySelectorAll('.menu');
    const playIcons = document.querySelectorAll('.play-icon');

    cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('active');
            if (cardMenus[i].classList.contains('show')) {
                card.classList.remove('active');
            }
        });
    
        card.addEventListener('mouseleave', () => {
            card.classList.remove('active');
        });
    });

    cardMenuIcons.forEach((cardMenuIcon, i) => {
        cardMenuIcon.addEventListener('click', () => {
            cardMenus[i].classList.toggle('show');
            if (cardMenus[i].classList.contains('show')) {
                cards[i].classList.remove('active');
                playIcons[i].style.display = 'none';
            } else {
                playIcons[i].style.display = 'flex';
            }
        });
    
        cardMenuIcon.onpointerover = () => {
            cards[i].classList.remove('active');
        };
    });

    cardMenus.forEach((menu, i) => {
        menu.addEventListener('click', e => {
            e.target.parentElement.classList.remove('show');
            playIcons[i].style.display = 'flex';
        });
    });

    upArrow.addEventListener('click', () => {
        footerTag.classList.toggle('show-credits');
    });
}

export function createCard(id, title, cover, date, rating, nation) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.movieId = id;
    card.dataset.nation = nation;

    const cardPreloader = document.createElement('div');
    cardPreloader.classList.add('card-preloader');

    const preloader = document.createElement('img');
    preloader.classList.add('preloader');
    preloader.src = './assets/img/preloader-64x64.gif';
    cardPreloader.appendChild(preloader);

    const menuIcon = document.createElement('span');
    menuIcon.classList.add('menu-icon');
    const dots = document.createElement('i');
    dots.classList.add('fas', 'fa-ellipsis-v', 'fa-lg');
    menuIcon.appendChild(dots);

    const menu = document.createElement('ul');
    menu.classList.add('menu');
    menu.innerHTML = `
        <li><a href="#">Add to Favorites</a></li>
        <li><a href="#">More Infos</a></li>
        <li><a href="#">Rate this Movie</a></li>
    `;

    const dropLayout = document.createElement('div');
    dropLayout.classList.add('drop-layout');

    const movieCover = document.createElement('img');
    movieCover.classList.add('cover');
    movieCover.src = cover === null ? './assets/img/comingsoon.jpg' : `https://image.tmdb.org/t/p/w500/${cover}`;
    movieCover.alt = `${title} Cover`;
    movieCover.loading = 'lazy';
    movieCover.onload = () => {
        cardPreloader.classList.add('hide');
    };

    const movieTitle = document.createElement('p');
    movieTitle.classList.add('title');
    movieTitle.textContent = title;

    const playIcon = document.createElement('span');
    playIcon.classList.add('play-icon');
    playIcon.innerHTML = `Watch Trailer <i class="far fa-play-circle fa-5x"></i>`;

    const releaseDate = document.createElement('p');
    releaseDate.classList.add('date');
    releaseDate.innerHTML = date === undefined || date === '' ? `Not available` : `Out on: ${date}`;

    const movieRating = document.createElement('span');
    movieRating.classList.add('rating');
    movieRating.innerHTML = rating === 0 ? `n/a <i class="fas fa-star"></i>` : `<sup>${rating}</sup>/<sub>10</sub> <i class="fas fa-star"></i>`;

    card.append(cardPreloader, menuIcon, menu, movieCover, dropLayout, movieTitle, playIcon, releaseDate, movieRating);
    cardsContainer.appendChild(card);
}

searchInput.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
        const joinedSearchInput = searchInput.value.split(' ').join('+');
        pagesLabel.textContent = '/ 1';
        pageNum.value = '1';
        cardsContainer.innerHTML = '';
        searchQuery(joinedSearchInput, nation.value);
        searchInput.value = '';
        nav.classList.remove('active');
    }
});

export function searchEventHandler() {
    searchIcon.addEventListener('click', () => {
        searchInput.focus();
        searchInput.value = '';
        nav.classList.toggle('active');
    });

    filterIcon.addEventListener('click', () => {
        filterIcon.parentElement.classList.toggle('active');
    });
}