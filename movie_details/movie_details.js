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
const genre = document.getElementById('genre');
const plot = document.getElementById('plot');
const language = document.getElementById("language");
const iframe = document.getElementById("iframe");
const favoriteBtn = document.querySelector('.favoriteBtn');
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// API key for TMDB API
const api_Key = '4626200399b08f9d04b72348e3625f15';

// Retrieve the IMDb ID from the URL parameter
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const media = params.get("media");

// Function to fetch detailed information about the movie using its IMDb ID
async function fetchMovieDetails(id) {
    const response = await fetch(`https://api.themoviedb.org/3/${media}/${id}?api_key=${api_Key}`);
    const data = await response.json();
    return data;
}

// Display the movie details on the page
async function displayMovieDetails() {
    try {
        const movieDetails = await fetchMovieDetails(id);

        var spokenlanguage = movieDetails.spoken_languages.map(language => language.english_name)
        var genreNames = movieDetails.genres.map(genre => genre.name);

        // Setting the values of various elements with movie details
        movieTitle.textContent = movieDetails.name || movieDetails.title;
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
        movieYear.textContent = `${movieDetails.release_date || movieDetails.first_air_date}`;
        rating.textContent = movieDetails.vote_average;
        genre.innerText = genreNames.join(', ');
        plot.textContent = movieDetails.overview;
        language.textContent = spokenlanguage.join(', ');

        // Updating the favorite button text and adding a click event listener to toggle favorites
        if (favoriteMovies.some(favoriteMovie => favoriteMovie.id === movieDetails.id)) {
            favoriteBtn.textContent = "Remove From WatchList";
        } else {
            favoriteBtn.textContent = "Add To WatchList";
        }
        favoriteBtn.addEventListener('click', () => toggleFavorite(movieDetails));

    } catch (error) {
        console.error('Error fetching movie details:', error);
    }

    try{
        const videoDetails = await fetchVideoDetails(id);
        console.log("videoDetails",videoDetails)
        const trailer = videoDetails.find(video => video.type === 'Trailer');
        console.log("trailer",trailer)
        
        if (trailer) {
            iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            moviePoster.style.display="none";
        } else {
            iframe.style.display="none";
        }
    }catch(error){
        iframe.style.display="none";
    }
}

// Function to toggle adding/removing from favorites
function toggleFavorite(movieDetails) {
    const index = favoriteMovies.findIndex(movie => movie.id === movieDetails.id);
    if (index !== -1) {
        favoriteMovies.splice(index, 1);
        favoriteBtn.textContent = "Add To WatchList";
    } else {
        favoriteMovies.push(movieDetails);
        favoriteBtn.textContent = "Remove From WatchList";
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

// Call the function to display movie details when the page loads
window.addEventListener('load', () => {
    displayMovieDetails();
});



// Function to fetch video details (trailers) for a movie or TV show
async function fetchVideoDetails(id) {
    const response = await fetch(`https://api.themoviedb.org/3/${media}/${id}/videos?api_key=${api_Key}`);
    const data = await response.json();
    return data.results;
}