document.addEventListener("DOMContentLoaded", async function () {
    const watchLaterBtn = document.getElementById("watchLaterBtn");

    // Get Movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    if (!movieId) {
        console.error("No movie ID found in URL.");
        return;
    }

    // Fetch movie details from OMDB API (or your backend)
    async function fetchMovieDetails(id) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=3a8e257b&i=${id}`);
            const movie = await response.json();
            return movie;
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }

    // Add to Watchlist Function
    async function addToWatchlist() {
        const movie = await fetchMovieDetails(movieId);
        if (!movie || movie.Response === "False") {
            alert("Movie not found!");
            return;
        }

        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

        // Check if the movie is already in the watchlist
        if (!watchlist.some(item => item.imdbID === movie.imdbID)) {
            watchlist.push({
                imdbID: movie.imdbID,
                title: movie.Title,
                poster: movie.Poster,
                year: movie.Year
            });

            localStorage.setItem("watchlist", JSON.stringify(watchlist));
            alert("Added to Watchlist!");
        } else {
            alert("Already in Watchlist!");
        }
    }

    // Attach event listener to "Watch Later" button
    if (watchLaterBtn) {
        watchLaterBtn.addEventListener("click", addToWatchlist);
    }
});
