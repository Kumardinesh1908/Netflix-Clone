// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToFavoriteMoviesBtn = document.getElementById('goToFavoriteMovies');
const trendingContainer = document.getElementById('trendingContainer');
const trendingPreviousButton = document.getElementById('trendingPreviousButton');
const trendingNextButton = document.getElementById('trendingNextButton');
const topContainer = document.getElementById('topContainer');
const topPreviousButton = document.getElementById('topPreviousButton');
const topNextButton = document.getElementById('topNextButton');



// Event listener to navigate to favorite movies page
goToFavoriteMoviesBtn.addEventListener('click', () => {
    window.location.href = 'favorite_movies/favorite_movies.html';
});

const scrollDistance = 800;

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

// TMDB API key
const api_Key = '4626200399b08f9d04b72348e3625f15';

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
            if (results.length !== 0) {
                searchResults.style.visibility = "visible";
            }
            displaySearchResults(results);
        }, 100);
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


// Function to fetch and display trending 
function fetchTrending() {
    const trendingContainer = document.getElementById('trendingContainer');

    // Make an API request to TMDb for trending 
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${api_Key}`)
        .then(response => response.json())
        .then(data => {
            const trending = data.results;
            // Loop through trending and display each movie
            trending.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.innerHTML = ` <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"> `;

                trendingContainer.appendChild(movieItem);

                movieItem.addEventListener('click', () => {
                    window.location.href = `movie_details/movie_details.html?media=${movie.media_type}&id=${movie.id}`;
                });
            });
        })
        .catch(error => {
            console.error(error);
        });
}

// Initial fetch of trending  on page load
fetchTrending();


// Function to fetch and display top 
function fetchTop() {
    const topContainer = document.getElementById('topContainer');

    // Make an API request to TMDb for top 
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${api_Key}`)
        .then(response => response.json())
        .then(data => {
            const top = data.results;
            console.log(top)
            // Loop through top and display each movie
            top.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.innerHTML = ` <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="${movie.title}"> `;

                topContainer.appendChild(movieItem);

                movieItem.addEventListener('click', () => {
                    window.location.href = `movie_details/movie_details.html?media=movie&id=${movie.id}`;
                });
            });
        })
        .catch(error => {
            console.error(error);
        });
}

// Initial fetch of top  on page load
fetchTop();