// Get the logo element and add a click event listener to navigate to the index page
const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Add a window load event listener to show the favorite movies list when the page loads
window.addEventListener('load', () => {
    showFavoriteMoviesList();
});

// Get the element where the favorite movies will be displayed
const favoriteMoviesList = document.getElementById('favoriteMoviesList');

function showFavoriteMoviesList() {
    // Retrieve favorite movies from local storage or use an empty array
    const storedFavoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

    if (storedFavoriteMovies.length === 0) { // Display a message if there are no favorite movies
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "It's lonely here. Add some favorite movies!";
        favoriteMoviesList.appendChild(emptyMessage);
    } else { // Display each favorite movie as a separate item
        storedFavoriteMovies.forEach(movie => {
            const shortenedTitle = movie.Title.substring(0, 47);
            const favoriteMovieItem = document.createElement('div');
            favoriteMovieItem.classList.add('favorite-movie-item');
            favoriteMovieItem.innerHTML = `
                <div class="search-item-thumbnail">
                    <img src="${movie.Poster}">
                </div>
                <div class="search-item-info">
                    <h3>${shortenedTitle}</h3>
                    <h4>Year : ${movie.Year}</h4>
                </div>
                <button class="removeBtn" id="${movie.imdbID}">Remove From Favorites</button>
            `;
            favoriteMoviesList.appendChild(favoriteMovieItem);

        // Add a click event listener to the remove button
        const removeBtn = favoriteMovieItem.querySelector('.removeBtn');
        removeBtn.addEventListener('click', () => removeMovieFromFavorites(movie.imdbID));
        });
    }
}

// Function to remove a movie from the favorites
function removeMovieFromFavorites(movieId) {
    let storedFavoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    
    // Find the index of the movie with the given ID in the stored array
    const movieIndex = storedFavoriteMovies.findIndex(movie => movie.imdbID === movieId);

    if (movieIndex !== -1) {
        // Remove the movie from the array
        storedFavoriteMovies.splice(movieIndex, 1);

        // Update the local storage with the modified array
        localStorage.setItem('favoriteMovies', JSON.stringify(storedFavoriteMovies));

        // Remove the corresponding DOM element
        const movieElement = document.getElementById(movieId);
        if (movieElement) {
            movieElement.parentElement.remove(); // Remove the entire movie item
        }

        // If no favorite movies are left, show the empty message
        if (storedFavoriteMovies.length === 0) {
            favoriteMoviesList.innerHTML = ""; // Clear existing content
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = "It's lonely here. Add some favorite movies!";
            favoriteMoviesList.appendChild(emptyMessage);
        }
    }
}


