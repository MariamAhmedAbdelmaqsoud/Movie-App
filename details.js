document.addEventListener("DOMContentLoaded", () => {
  const movieId = localStorage.getItem("selectedMovieId");

  if (!movieId) {
    document.body.innerHTML = "<p>No movie selected.</p>";
    return;
  }

  fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=2ef5e84f`)
    .then((res) => res.json())
    .then((movie) => {
      console.log("Movie ID:", movieId);
      document.getElementById("movie-title").textContent = movie.Title;
      document.getElementById("movie-poster").src = movie.Poster;
      document.getElementById("movie-year").textContent = `Year: ${movie.Year}`;
      document.getElementById("movie-type").textContent = `Type: ${movie.Type}`;
      document.getElementById("movie-plot").textContent = movie.Plot;
    })
    .catch((err) => {
      console.error("Error fetching details:", err);
      document.body.innerHTML = "<p>Failed to load movie details.</p>";
    });
});
