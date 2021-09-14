class modalPlayer extends HTMLElement {
    constructor() {
        super();
        this.TMDB_API_KEY = 'api_key=6a55627a0b1d370a7f55c28d1eeb36d1';
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    background-color: rgba(0, 0, 0, 0.9);
                    height: 100vh;
                    left: 0;
                    opacity: 0;
                    pointer-events: none;
                    position: fixed;
                    top: 0;
                    transition: opacity .4s ease;
                    width: 100%;
                    z-index: 11;
                }

                :host([opened]) {
                    opacity: 1;
                    pointer-events: all;
                }

                i {
                    background-color: #333;
                    border-radius: 50%;
                    color: #ffffff;
                    cursor: pointer;
                    padding: 8px 14px;
                    position: absolute;
                    right: 3%;
                    top: 3%;
                }

                .player-container {
                    display: block;
                    margin: auto;
                    max-width: 100%;
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1040px;
                }

                #player {
                    height: 490px;
                    width: 100%;
                }

                .error-message {
                    color: #ffffff;
                    font-size: 3rem;
                    padding: 8px 16px;
                    text-align: center;
                    text-shadow: 1px 1px 2px #131417;
                }
            </style>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            
            <i class="fas fa-times fa-2x"></i>

            <div class="player-container"></div>
        `;
        this.playerContainer = this.shadowRoot.querySelector('.player-container');
        this.player = this.shadowRoot.querySelector('#player');
        this.closeIcon = this.shadowRoot.querySelector('i');
        this.errorMessage = message => {
            this.playerContainer.innerHTML = '';
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = message;
            this.playerContainer.appendChild(errorMessage);
        }

        this.setIframeAttributes = (el, attr) => {
            for (var key in attr) {
                el.setAttribute(key, attr[key]);
            }
        }
    }

    createIframe(id) {
        const iFrame = document.createElement('iframe');
        this.setIframeAttributes(iFrame, {
            'id': 'player',
            'type': 'text/html',
            'src': `//www.youtube.com/embed/${id}?enablejsapi=1`,
            'frameborder': '0'
        });
        this.playerContainer.appendChild(iFrame);
    }

    fetchMovie(movieId, lang = "en-US") {
        try {
            fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?${this.TMDB_API_KEY}&language=${lang}`).then(res => {
                if (res.status !== 200) {
                    this.errorMessage('Sorry an error occured. Try again later : (');
                    throw new Error('Sorry an error occured. Try again later...');
                }
                return res.json();
            }).then(data => {
                if (data.results.length === 0) {
                    this.errorMessage('Sorry no trailer available : (');
                } else {
                    const officialTrailers = [];
                    data.results.forEach(trailer => {
                        if (trailer.official === true && trailer.type === 'Trailer') {
                            officialTrailers.push(trailer.key);
                        }
                    })
                    officialTrailers.length === 0 ? this.errorMessage('Sorry no official trailer available : (') : this.createIframe(officialTrailers[0]);
                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'opened') {
            if (this.hasAttribute('opened')) {
                this.closeIcon.addEventListener('pointerdown', () => {
                    document.body.style.overflow = 'auto';
                    this.removeAttribute('opened');
                    this.playerContainer.innerHTML = '';
                });
            }
        }
    }

    static get observedAttributes() {
        return ['opened', 'data-movie-id', 'data-nation'];
    }

    connectedCallback() {
        setTimeout(() => {
            const playIcons = document.querySelectorAll('.play-icon');
            playIcons.forEach(playIcon => {
                playIcon.addEventListener('click', () => {
                    this.fetchMovie(this.dataset.movieId, this.dataset.nation);
                });
            });
        }, 500);
    }
};

customElements.define('modal-player', modalPlayer);
