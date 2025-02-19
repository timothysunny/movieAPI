document.addEventListener("DOMContentLoaded", fetchMovieDetails);
const pageTitle = document.getElementById("pageTitle")

async function fetchMovieDetails() {
    const params = new URLSearchParams(window.location.search);
    const movieID = params.get("id");

    if (!movieID) {
        document.getElementById("movieDetails").innerHTML = "<p class='text-center text-red-500'>Invalid movie ID</p>";
        return;
    }

    const url = `https://www.omdbapi.com/?i=${movieID}&apikey=3a8e257b`;

    try {
        const response = await fetch(url);
        const movie = await response.json();

        if (movie.Response === "False") {
            document.getElementById("movieDetails").innerHTML = "<p class='text-center text-red-500'>Movie not found</p>";
            return;
        }

        displayMovieDetails(movie);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        document.getElementById("movieDetails").innerHTML = "<p class='text-center text-red-500'>Failed to load movie details</p>";
    }
}

function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById("movieDetails");
    const movieDescription = document.getElementById("movieDescription");
    const movieDirector = document.getElementById("movieDirector");
    pageTitle.innerHTML = `${movie.Title} (${movie.Year})`;
    detailsContainer.innerHTML = `
        <img class="mx-auto rounded-lg shadow-lg w-[300px]" src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        <h1 class="text-3xl font-bold mb-4">${movie.Title}</h1>
        <p class="mt-4 text-gray-400 max-w-[70%] mx-auto">${movie.Plot}</p>
    `;
    movieDescription.innerHTML = `${movie.Plot}`;
    movieDirector.innerHTML = `${movie.Director}`;
    document.getElementById("movieYear").innerHTML = movie.Year;
    document.getElementById("movieLang").innerHTML = movie.Language;
    document.getElementById("movieRating").innerHTML = movie.imdbRating;
    document.getElementById("movieGenres").innerHTML = movie.Genre;

}

// Go back to search page
function goBack() {
    window.history.back();
}
