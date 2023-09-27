// Selecting the logo element and adding a click event listener to navigate to the homepage
const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Selecting various elements on the page for displaying movie details
const movieTitle = document.getElementById('movieTitle');
const moviePoster = document.getElementById('moviePoster');
const movieYear = document.getElementById('movieYear');
const rating = document.getElementById('rating');
const release = document.getElementById('release');
const genre = document.getElementById('genre');
const writer = document.getElementById('writer');
const actors = document.getElementById('actors');
const plot = document.getElementById('plot');
const language = document.getElementById('language');
const awards = document.getElementById('awards');
const favoriteBtn = document.querySelector('.favoriteBtn');

// API key for OMDB API and loading favorite movies from local storage
const API_KEY = '5b92f78';
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];


// Retrieve the IMDb ID from the URL parameter
const params = new URLSearchParams(window.location.search);
console.log(params)

const imdbID = params.get('imdbID');

console.log(imdbID)

// Function to fetch detailed information about the movie using its IMDb ID
async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
}

// Display the movie details on the page
async function displayMovieDetails() {
    try {
        const movieDetails = await fetchMovieDetails(imdbID);

        // Setting the values of various elements with movie details
        movieTitle.textContent = movieDetails.Title;
        moviePoster.src = movieDetails.Poster;
        movieYear.textContent = `Year: ${movieDetails.Year}`;
        rating.textContent = `Rating: ${movieDetails.Ratings[0].Value}`;
        release.textContent = `Released : ${movieDetails.Released}`;
        genre.textContent = `${movieDetails.Genre}`;
        writer.textContent = `${movieDetails.Writer}`;
        actors.textContent = `${movieDetails.Actors}`;
        plot.textContent = `${movieDetails.Plot}`;
        language.textContent = `${movieDetails.Language}`;
        awards.textContent = movieDetails.Awards;

        // Updating the favorite button text and adding a click event listener to toggle favorites
        if (favoriteMovies.some(favoriteMovie => favoriteMovie.imdbID === imdbID)) {
            favoriteBtn.textContent = "Remove From Favorites";
        } else {
            favoriteBtn.textContent = "Add To Favorites";
        }
        favoriteBtn.addEventListener('click', () => toggleFavorite(movieDetails));

    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to toggle adding/removing from favorites
function toggleFavorite(movieDetails) {
    const index = favoriteMovies.findIndex(movie => movie.imdbID === imdbID);
    if (index !== -1) {
        favoriteMovies.splice(index, 1);
        favoriteBtn.textContent = "Add To Favorites";
    } else {
        favoriteMovies.push(movieDetails);
        favoriteBtn.textContent = "Remove From Favorites";
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

// Call the function to display movie details when the page loads
window.addEventListener('load', () => {
    displayMovieDetails();
});


