// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToFavoriteMoviesBtn = document.getElementById('goToFavoriteMovies');

// Event listener to navigate to favorite movies page
goToFavoriteMoviesBtn.addEventListener('click', () => {
    window.location.href = 'favorite_movies/favorite_movies.html';
});

const API_KEY = '5b92f78'; // OMDB API key
// Variables to handle search timeout and favorite movies list
let timeoutId;
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// Event listener for search input changes
searchInput.addEventListener('input', async () => {
    const query = searchInput.value;

    clearTimeout(timeoutId);

    if (query.length > 2) {
        timeoutId = setTimeout(async () => {
            const results = await fetchSearchResults(query);
            displaySearchResults(results);
        }, 100);
    } else {
        searchResults.innerHTML = '';
    }
});

// Event listener for Enter key press in search input
searchInput.addEventListener('keyup', async event => {
    if (event.key === 'Enter') {
        const query = searchInput.value;

        if (query.length > 2) {
            const results = await fetchSearchResults(query);
            displaySearchResults(results);
        } else {
            searchResults.innerHTML = '';
        }
    }
});

// Function to fetch search results from OMDB API
async function fetchSearchResults(query) {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();
    return data.Search || [];
}

// Function to display search results
function displaySearchResults(results) {
    // Clear previous search results
    searchResults.innerHTML = '';

    // Loop through results and create HTML elements
    results.map(movie => {
        const shortenedTitle = movie.Title.substring(0, 47);
        const movieItem = document.createElement('li');

        let buttonText = "Add to Favorites"; // Set default button text
        
        // Check if the movie is already in favorites
        if (favoriteMovies.find(favoriteMovie => favoriteMovie.imdbID === movie.imdbID)) {
            buttonText = "Go to Favorites"; // Change button text
        }

        // Create HTML structure for each movie
        movieItem.innerHTML = `
                                <div class = "search-item-thumbnail">
                                    <img src ="${movie.Poster}">
                                </div>
                                <div class ="search-item-info">
                                    <h3>${shortenedTitle}</h3>
                                    <p>${movie.Year}</p>
                                </div>
                                <button class="favoriteBtn" id="${movie.imdbID}">${buttonText}</button>   
                                `;

        const favoriteBtn = movieItem.querySelector('.favoriteBtn');

        // Add event listener for favorite button
        favoriteBtn.addEventListener('click', () => {
            if (buttonText === "Add to Favorites") {
                addToFavorites(movie);
            } else {
                window.location.href = 'favorite_movies/favorite_movies.html'; // Navigate to the favorite movies page
            }
        });


        const thumbnail = movieItem.querySelector('.search-item-thumbnail');
        const info = movieItem.querySelector('.search-item-info');

        // Add event listener to navigate to movie details page
        (thumbnail && info).addEventListener('click', () => {
            window.location.href = `movie_details/movie_details.html?imdbID=${movie.imdbID}`;
        });

        // Append movie item to search results
        searchResults.appendChild(movieItem);
    });
}

// Function to add a movie to favorites
function addToFavorites(movie) {
    // Check if the movie is not already in the favorites list
    if (!favoriteMovies.find(favoriteMovie => favoriteMovie.imdbID === movie.imdbID)) {
        favoriteMovies.push(movie);
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies)); // Store in Local Storage
        const favoriteBtn = document.querySelector(`[id="${movie.imdbID}"]`);
        if (favoriteBtn) {
            favoriteBtn.textContent = "Go to Favorites";
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

