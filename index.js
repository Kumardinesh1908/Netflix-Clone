// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToFavoriteMoviesBtn = document.getElementById('goToFavoriteMovies');

// Event listener to navigate to favorite movies page
goToFavoriteMoviesBtn.addEventListener('click', () => {
    window.location.href = 'favorite_movies/favorite_movies.html';
});

const scrollDistance = 900;

// Define a function to handle scrolling
function setupScroll(containerClass, previousButtonClass, nextButtonClass) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    const previousButtons = document.querySelectorAll(`.${previousButtonClass}`);
    const nextButtons = document.querySelectorAll(`.${nextButtonClass}`);

    containers.forEach((container, index) => {
        const previousButton = previousButtons[index];
        const nextButton = nextButtons[index];

        nextButton.addEventListener('click', () => {
            container.scrollBy({
                left: scrollDistance,
                behavior: 'smooth',
            });
        });

        previousButton.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth',
            });
        });
    });
}

// Set up scrolling for each section
setupScroll('trending-container', 'trending-previous', 'trending-next');
setupScroll('netflix-container', 'netflix-previous', 'netflix-next');
setupScroll('netflixShows-container', 'netflixShows-previous', 'netflixShows-next');
setupScroll('top-container', 'top-previous', 'top-next');
setupScroll('horror-container', 'horror-previous', 'horror-next');
setupScroll('comedy-container', 'comedy-previous', 'comedy-next');
setupScroll('action-container', 'action-previous', 'action-next');
setupScroll('romantic-container', 'romantic-previous', 'romantic-next');

// TMDB API key
const api_Key = '4626200399b08f9d04b72348e3625f15';


// Function to fetch and display movies or TV shows
function fetchMedia(containerClass, endpoint, mediaType) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach((container) => {
        fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
            .then(response => response.json())
            .then(data => {
                const fetchResults = data.results;
                fetchResults.forEach(item => {
                    const itemElement = document.createElement('div');
                    const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;
                    itemElement.innerHTML = ` <img src="https://image.tmdb.org/t/p/w500${imageUrl}" alt="${item.title || item.name}"> `;
                    container.appendChild(itemElement);

                    itemElement.addEventListener('click', () => {
                        const media_Type = item.media_type || mediaType
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
                    });
                });

                if (containerClass === 'netflix-container') {
                    const randomIndex = Math.floor(Math.random() * fetchResults.length);
                    const randomMovie = fetchResults[randomIndex];
                    
                    const banner = document.getElementById('banner');
                    const play = document.getElementById('play-button');
                    const info = document.getElementById('more-info');
                    const title = document.getElementById('banner-title');

                    banner.src = `https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`;
                    title.textContent = randomMovie.title || randomMovie.name;
                    (play && info).addEventListener('click', () => {
                        const media_Type = randomMovie.media_type || mediaType
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${randomMovie.id}`;
                    });
                }
            })
            .catch(error => {
                console.error(error);

            });
    })
}


// Initial fetch of trending, Netflix, top rated, horror, comedy, action, and romantic on page load
fetchMedia('trending-container', 'trending/all/week?');
fetchMedia('netflix-container', 'discover/tv?with_networks=213', 'tv');
fetchMedia('netflixShows-container', 'discover/tv?', 'tv');
fetchMedia('top-container', 'movie/top_rated?', 'movie');
fetchMedia('horror-container', 'discover/movie?with_genres=27', 'movie');
fetchMedia('comedy-container', 'discover/movie?with_genres=35', 'movie');
fetchMedia('action-container', 'discover/movie?with_genres=28', 'movie');
fetchMedia('romantic-container', 'discover/movie?with_genres=10749', 'movie');



// Variables to handle favorite movies list
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// Event listener for search input changes
searchInput.addEventListener('input', async () => {
    const query = searchInput.value;
    if (query.length > 2) {
        const results = await fetchSearchResults(query);
        if (results.length !== 0) {
            searchResults.style.visibility = "visible";
        }
        displaySearchResults(results);
    } else {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
});

// Event listener for Enter key press in search input
searchInput.addEventListener('keyup', async event => {
    if (event.key === 'Enter') {
        const query = searchInput.value;
        if (query.length > 2) {
            const results = await fetchSearchResults(query);
            if (results.length !== 0) {
                searchResults.style.visibility = "visible";
            }
            displaySearchResults(results);
        } else {
            searchResults.innerHTML = '';
            searchResults.style.visibility = "hidden";
        }
    }
});

// Function to fetch search results from OMDB API
async function fetchSearchResults(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${api_Key}&query=${query}`);
    const data = await response.json();
    return data.results || [];
}

// Function to display search results
function displaySearchResults(results) {
    console.log(results)
    // Clear previous search results
    searchResults.innerHTML = '';

    // Loop through results and create HTML elements
    results.map(movie => {
        const shortenedTitle = movie.title || movie.name;
        const date = movie.release_date || movie.first_air_date;

        let buttonText = "Add to WatchList"; // Set default button text

        // Check if the movie is already in WatchList
        if (favoriteMovies.find(favoriteMovie => favoriteMovie.id === movie.id)) {
            buttonText = "Go to WatchList"; // Change button text
        }

        const movieItem = document.createElement('li');

        // Create HTML structure for each movie
        movieItem.innerHTML = `
                                <div class = "search-item-thumbnail">
                                    <img src ="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                                </div>
                                <div class ="search-item-info">
                                    <h3>${shortenedTitle}</h3>
                                    <p>${movie.media_type} <span> &nbsp; ${date}</span></p>
                                </div>
                                <button class="favoriteBtn" id="${movie.id}">${buttonText}</button>   
                                `;

        const favoriteBtn = movieItem.querySelector('.favoriteBtn');

        // Add event listener for favorite button
        favoriteBtn.addEventListener('click', () => {
            if (buttonText === "Add to WatchList") {
                addToFavorites(movie);
            } else {
                window.location.href = 'favorite_movies/favorite_movies.html'; // Navigate to the favorite movies page
            }
        });


        const thumbnail = movieItem.querySelector('.search-item-thumbnail');
        const info = movieItem.querySelector('.search-item-info');

        // Add event listener to navigate to movie details page
        (thumbnail && info).addEventListener('click', () => {
            window.location.href = `movie_details/movie_details.html?media=${movie.media_type}&id=${movie.id}`;
        });

        // Append movie item to search results
        searchResults.appendChild(movieItem);
    });
}

// Function to add a movie to favorites
function addToFavorites(movie) {
    // Check if the movie is not already in the favorites list
    if (!favoriteMovies.find(favoriteMovie => favoriteMovie.id === movie.id)) {
        favoriteMovies.push(movie);
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies)); // Store in Local Storage
        const favoriteBtn = document.querySelector(`[id="${movie.id}"]`);
        if (favoriteBtn) {
            favoriteBtn.textContent = "Go to WatchList";
            favoriteBtn.addEventListener('click', () => {
                window.location.href = 'favorite_movies/favorite_movies.html'; // Navigate to the favorite movies page
            });
        }
    }
}

// Event listener to close search results when clicking outside
document.addEventListener('click', event => {
    if (!searchResults.contains(event.target)) {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
});


