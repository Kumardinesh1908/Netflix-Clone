// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToFavoriteMoviesBtn = document.getElementById('goToFavoriteMovies');

// Event listener to navigate to favorite movies page
goToFavoriteMoviesBtn.addEventListener('click', () => {
    window.location.href = 'favorite_movies/favorite_movies.html';
});

const scrollDistance = 900;

const trendingContainer = document.getElementById('trendingContainer');
const trendingPreviousButton = document.getElementById('trendingPreviousButton');
const trendingNextButton = document.getElementById('trendingNextButton');

trendingNextButton.addEventListener('click', () => {
    trendingContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

trendingPreviousButton.addEventListener('click', () => {
    trendingContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

const topContainer = document.getElementById('topContainer');
const topPreviousButton = document.getElementById('topPreviousButton');
const topNextButton = document.getElementById('topNextButton');

topNextButton.addEventListener('click', () => {
    topContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

topPreviousButton.addEventListener('click', () => {
    topContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

const netflixContainer = document.getElementById('netflixContainer');
const netflixPreviousButton = document.getElementById('netflixPreviousButton');
const netflixNextButton = document.getElementById('netflixNextButton');

netflixNextButton.addEventListener('click', () => {
    netflixContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

netflixPreviousButton.addEventListener('click', () => {
    netflixContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

const netflixHindiContainer = document.getElementById('netflixHindiContainer');
const netflixHindiPreviousButton = document.getElementById('netflixHindiPreviousButton');
const netflixHindiNextButton = document.getElementById('netflixHindiNextButton');

netflixHindiNextButton.addEventListener('click', () => {
    netflixHindiContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

netflixHindiPreviousButton.addEventListener('click', () => {
    netflixHindiContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

const horrorContainer = document.getElementById('horrorContainer');
const horrorPreviousButton = document.getElementById('horrorPreviousButton');
const horrorNextButton = document.getElementById('horrorNextButton');

horrorNextButton.addEventListener('click', () => {
    horrorContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

horrorPreviousButton.addEventListener('click', () => {
    horrorContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

const romanticContainer = document.getElementById('romanticContainer');
const romanticPreviousButton = document.getElementById('romanticPreviousButton');
const romanticNextButton = document.getElementById('romanticNextButton');

romanticNextButton.addEventListener('click', () => {
    romanticContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

romanticPreviousButton.addEventListener('click', () => {
    romanticContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

const comedyContainer = document.getElementById('comedyContainer');
const comedyPreviousButton = document.getElementById('comedyPreviousButton');
const comedyNextButton = document.getElementById('comedyNextButton');

comedyNextButton.addEventListener('click', () => {
    comedyContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

comedyPreviousButton.addEventListener('click', () => {
    comedyContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

const actionContainer = document.getElementById('actionContainer');
const actionPreviousButton = document.getElementById('actionPreviousButton');
const actionNextButton = document.getElementById('actionNextButton');

actionNextButton.addEventListener('click', () => {
    actionContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
    });
});

actionPreviousButton.addEventListener('click', () => {
    actionContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
    });
});

// TMDB API key
const api_Key = '4626200399b08f9d04b72348e3625f15';

// Function to fetch and display movies or TV shows
function fetchMedia(containerId, endpoint) {
    const container = document.getElementById(containerId);
    fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
        .then(response => response.json())
        .then(data => {
            const media = data.results;
            media.forEach(item => {
                const itemElement = document.createElement('div');
                const imageUrl = containerId === 'trendingContainer' ? item.poster_path : item.backdrop_path;
                itemElement.innerHTML = ` <img src="https://image.tmdb.org/t/p/w500${imageUrl}" alt="${item.title || item.name}"> `;
                container.appendChild(itemElement);

                itemElement.addEventListener('click', () => {
                    // const mediaType = item.media_type || 'movie';
                    const mediaType = containerId === 'netflixContainer' ? 'tv' : item.media_type;
                    window.location.href = `movie_details/movie_details.html?media=${mediaType}&id=${item.id}`;
                });
            });
        })
        .catch(error => {
            console.error(error);

        });
}

// Initial fetch of trending, Netflix, top rated, horror, comedy, action and romantic on page load
fetchMedia('trendingContainer', 'trending/all/week?');
fetchMedia('netflixContainer', 'discover/tv?with_networks=213');
fetchMedia('netflixHindiContainer', 'discover/tv?');
fetchMedia('topContainer', 'movie/top_rated?');
fetchMedia('horrorContainer', 'discover/movie?with_genres=27');
fetchMedia('comedyContainer', 'discover/movie?with_genres=35');
fetchMedia('actionContainer', 'discover/movie?with_genres=28');
fetchMedia('romanticContainer', 'discover/movie?with_genres=10749');

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
        const movieItem = document.createElement('li');

        let buttonText = "Add to WatchList"; // Set default button text

        // Check if the movie is already in WatchList
        if (favoriteMovies.find(favoriteMovie => favoriteMovie.id === movie.id)) {
            buttonText = "Go to WatchList"; // Change button text
        }

        // Create HTML structure for each movie
        movieItem.innerHTML = `
                                <div class = "search-item-thumbnail">
                                    <img src ="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                                </div>
                                <div class ="search-item-info">
                                    <h3>${shortenedTitle}</h3>
                                    <p>${movie.media_type} <span>${date}</span></p>
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
    }
});


