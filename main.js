const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#btn");
const filmList = document.querySelector("#film-list");
const movieLink = document.querySelector("#movie-link");

function fetchAndDisplayMovies(search) {
  fetch(`https://www.omdbapi.com/?s=${search}&apikey=2ef5e84f`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        filmList.innerHTML = data.Search.map((movie) => {
          return `
            <div class="card" onClick='goToDetails("${movie.imdbID}")'>
              <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title} Poster">
              <h5 class="card-title">${movie.Title}</h5>
              <p class="card-text">Year:  ${movie.Year}</p>
              <button class="card-btn" onclick="event.stopPropagation(); addToFavorites('${movie.imdbID}', '${movie.Title}')">
                Add to Favorites
              </button>
            </div>
          `;
        }).join("");
      } else {
        filmList.innerHTML = `<p>No movies found.</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching films:", error);
      filmList.innerHTML = `<p>Error fetching films. Please try again later.</p>`;
    });
}

searchBtn.addEventListener("click", () => {
  const search = searchInput.value.trim();
  if (search !== "") {
    fetchAndDisplayMovies(search);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayMovies("avengers");
});

movieLink.addEventListener("click", (e) => {
  e.preventDefault();
  fetchAndDisplayMovies("action");
});

// Favorites
const favorites = [];
function addToFavorites(id, title) {
  if (!favorites.some((movie) => movie.id === id)) {
    favorites.push({ id, title });
    document.querySelector("#favorites-count").textContent = favorites.length;
    alert(`${title} has been added to your favorites!`);
  } else {
    alert(`${title} is already in your favorites.`);
  }
}

function goToDetails(id) {
  localStorage.setItem("selectedMovieId", id);
  window.location.href = "details.html";
}
