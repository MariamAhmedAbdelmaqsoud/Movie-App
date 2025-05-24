document.addEventListener("DOMContentLoaded", () => {
  const movieId = localStorage.getItem("selectedMovieId");

  // load Details
  fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=2ef5e84f`)
    .then((res) => res.json())
    .then((movie) => {
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

  // load comments
  loadComments(movieId);

  // form submission handler
  document
    .getElementById("comment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const text = document.querySelector("#comment-text").value.trim();

      const newComment = {
        movieId,
        text
      };

      fetch("https://harsh-wool-dianella.glitch.me/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
        .then((res) => res.json())
        .then(() => {
          loadComments(movieId);
          e.target.reset();
        })
        .catch((err) => {
          console.error("Error adding comment:", err);
        });
    });
});

function loadComments(movieId) {
  fetch(`https://harsh-wool-dianella.glitch.me/api/comments?movieId=${movieId}`)
    .then((res) => res.json())
    .then((comments) => {
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = "";

      comments.forEach((comment) => {
        addCommentToList(comment);
      });
    })
    .catch((err) => {
      console.error("Error loading comments:", err);
    });
}

function addCommentToList(comment) {
  const commentsList = document.getElementById("comments-list");
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = comment.text;
  commentsList.appendChild(li);
}
