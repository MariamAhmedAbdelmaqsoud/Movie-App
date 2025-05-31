const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#btn");
const filmList = document.querySelector("#film-list");
const movieLink = document.querySelector("#movie-link");
// mainly function
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

// search
searchBtn.addEventListener("click", () => {
  const search = searchInput.value.trim();
  if (search !== "") {
    fetchAndDisplayMovies(search);
  }
});
// Display Movies
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayMovies("avengers");
});
// Display Movies on click
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
// Details Page
function goToDetails(id) {
  localStorage.setItem("selectedMovieId", id);
  window.location.href = "details.html";
}
// // chatbot
const toggleBtn = document.querySelector(".chatbot-toggler");
const chatbot = document.querySelector(".chatbot");
const iconOpen = toggleBtn.querySelector("i.bi-robot");
const iconClose = toggleBtn.querySelector("i.bi-x-lg");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
  chatbot.classList.toggle("show");

  // Toggle icons
  iconOpen.classList.toggle("d-none");
  iconClose.classList.toggle("d-none");
});

// Optional: close from inside
document.querySelector(".close-chat").addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
  chatbot.classList.remove("show");
  iconOpen.classList.remove("d-none");
  iconClose.classList.add("d-none");
});
const chatInput = document.querySelector("#text-area");
const sendChatBtn = document.querySelector("#send-btn");
const chatbox = document.querySelector(".chatbox");

// Function to create chat messages
function createChatLi(message, type) {
  const li = document.createElement("li");
  li.classList.add("chat", type);
  if (type === "outgoing") {
    li.innerHTML = `<p>${message}</p>`;
  } else {
    li.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  }
  return li;
}

// Send message handler
function handleSendMessage() {
  const message = chatInput.value.trim();
  if (message === "") return;

  chatbox.appendChild(createChatLi(message, "outgoing"));
  chatbox.scrollTop = chatbox.scrollHeight;
  chatInput.value = "";

  //static reply without API
  setTimeout(() => {
    chatbox.appendChild(
      createChatLi("Sorry, I am not connected to AI right now.", "incoming")
    );
    chatbox.scrollTop = chatbox.scrollHeight;
  }, 500);
}

sendChatBtn.addEventListener("click", handleSendMessage);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
});
