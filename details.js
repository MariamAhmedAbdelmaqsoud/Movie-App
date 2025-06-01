document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the selected movie ID stored in localStorage
  const movieId = localStorage.getItem("selectedMovieId");

  // Fetch movie details from the OMDb API using the movie ID
  fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=2ef5e84f`)
    .then((res) => res.json())
    .then((movie) => {
      // Populate the page elements with movie details
      document.getElementById("movie-title").textContent = movie.Title;
      document.getElementById("movie-poster").src = movie.Poster;
      document.getElementById("movie-year").textContent = `Year: ${movie.Year}`;
      document.getElementById("movie-type").textContent = `Type: ${movie.Type}`;
      document.getElementById("movie-plot").textContent = movie.Plot;
    })
    .catch((err) => {
      // Handle errors and inform the user
      console.error("Error fetching details:", err);
      document.body.innerHTML = "<p>Failed to load movie details.</p>";
    });

  // Load existing comments for this movie
  loadComments(movieId);

  // Set up comment form submission handler
  document
    .getElementById("comment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent page reload on submit
      const text = document.querySelector("#comment-text").value.trim();
      const newComment = {
        movieId,
        text,
      };

      // Send new comment to the backend API
      fetch("https://harsh-wool-dianella.glitch.me/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
        .then((res) => res.json())
        .then(() => {
          // Refresh comments list after successful post
          loadComments(movieId);
          e.target.reset(); // Clear the form input
        })
        .catch((err) => {
          // Log errors if comment posting fails
          console.error("Error adding comment:", err);
        });
    });
});

// Function to fetch and display comments for a specific movie
function loadComments(movieId) {
  fetch(`https://harsh-wool-dianella.glitch.me/api/comments?movieId=${movieId}`)
    .then((res) => res.json())
    .then((comments) => {
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = "";

      // Append each comment to the list
      comments.forEach((comment) => {
        addCommentToList(comment);
      });
    })
    .catch((err) => {
      console.error("Error loading comments:", err);
    });
}

// Helper function to create and add a comment item to the DOM
function addCommentToList(comment) {
  const commentsList = document.getElementById("comments-list");
  const li = document.createElement("li");
  li.className = "list-group-item mb-2 rounded"; // Bootstrap list item style
  li.textContent = comment.text; // Display comment text
  commentsList.appendChild(li);
}
