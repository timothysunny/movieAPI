document.getElementById("searchBtn").addEventListener("click", fetchMovies);

async function fetchMovies() {
    const searchBtn = document.getElementById("searchBtn");
    const query = document.getElementById("searchInput").value.trim();
    const container = document.getElementById("movieContainer");

    if (!query) {
        return alert("Please enter a movie name");
    }

    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=3a8e257b`;

    try {
        searchBtn.disabled = true;
        searchBtn.innerText = "Loading...";
        container.innerHTML = "<p class='text-white text-center'>Fetching movies...</p>";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        if (data.Response === "False") {
            container.innerHTML = "<p class='text-white text-center'>No movies found!</p>";
            return;
        }

        displayMovies(data.Search);
    } catch (error) {
        console.error("Error fetching movies:", error);
        container.innerHTML = "<p class='text-red-500 text-center'>Error fetching movies. Try again.</p>";
    } finally {
        searchBtn.disabled = false;
        searchBtn.innerText = "Search";
    }
}

function displayMovies(movies) {
    const container = document.getElementById("movieContainer");
    container.innerHTML = ""; 

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie", "cursor-pointer", "rounded-lg", "overflow-hidden", "bg-gray-900", "shadow-lg", "p-4", "hover:shadow-xl", "transition");

        movieElement.innerHTML = `
            <img class="w-full h-[300px] object-cover rounded-lg" src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
            <h3 class="text-lg font-semibold mt-2">${movie.Title}</h3>
            <p class="text-gray-400">${movie.Year}</p>
        `;
        
        movieElement.addEventListener("click", () => {
            window.location.href = `movie.html?id=${movie.imdbID}`;
        });

        container.appendChild(movieElement);
    });
}
