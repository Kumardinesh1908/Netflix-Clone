// Get the logo element and add a click event listener to navigate to the index page
const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Add a window load event listener to show the WatchList when the page loads
window.addEventListener('load', () => {
    showWatchListItems();
});

// Get the element where the WatchList will be displayed
const watchListItems = document.getElementById('watchList-Items');

// Function to display the list of WatchList
function showWatchListItems() {
    // Retrieve WatchList from local storage or use an empty array
    const storedWatchList = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (storedWatchList.length === 0) { // Display a message if there are no items in  WatchList
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "It's lonely here. Add some movies/Tv shows to WatchList !";
        watchListItems.appendChild(emptyMessage);
    } else {

        // Display each WatchList-Item as a separate item
        storedWatchList.forEach(movie => {
            const shortenedTitle = movie.title || movie.name;
            const date = movie.release_date || movie.first_air_date;
            const watchList_Item = document.createElement('div');

            watchList_Item.classList.add('watchlist-item');

            watchList_Item.innerHTML = `
                <div class="search-item-thumbnail">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                </div>
                <div class="search-item-info">
                    <h3>${shortenedTitle}</h3>
                    <h4>Year : ${date}</h4>
                </div>
                <button class="removeBtn" id="${movie.id}">Remove From WatchList</button>
            `;
            watchListItems.appendChild(watchList_Item);

            // Add a click event listener to the remove button
            const removeBtn = watchList_Item.querySelector('.removeBtn');
            removeBtn.addEventListener('click', () => removeMovieFromWatchList(movie.id));

            // Add a click event listener to navigate to respestive movie details page
            const thumbnail = watchList_Item.querySelector('.search-item-thumbnail');
            thumbnail.addEventListener('click', () => {
                // Construct the URL for the movie details page with the IMDb ID as a parameter
                const movieDetailsURL = `../movie_details/movie_details.html?media=${movie.media_type}&id=${movie.id}`;
                window.location.href = movieDetailsURL;
            });
        });
    }
}

// Function to remove a movie from the WatchList
function removeMovieFromWatchList(movieId) {
    let storedWatchList = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Find the index of the movie with the given ID in the stored array
    const movieIndex = storedWatchList.findIndex(movie => movie.id === movieId);

    if (movieIndex !== -1) {
        // Remove the movie from the array
        storedWatchList.splice(movieIndex, 1);

        // Update the local storage with the modified array
        localStorage.setItem('watchlist', JSON.stringify(storedWatchList));

        // Remove the corresponding DOM element
        const movieElement = document.getElementById(movieId);
        if (movieElement) {
            movieElement.parentElement.remove(); // Remove the entire movie item
        }

        // If no movies/Tv shows are left, show the empty message
        if (storedWatchList.length === 0) {
            watchListItems.innerHTML = ""; // Clear existing content
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = "It's lonely here. Add some movies/Tv shows to WatchList!";
            watchListItems.appendChild(emptyMessage);
        }
    }
}


