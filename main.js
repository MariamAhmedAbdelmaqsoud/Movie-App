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
const GEMINI_API_KEY = "AIzaSyCF2tREo8RzHEnzsRDW1xtWb4stxQTBMx0";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const chatHistory = [];

const toggleBtn = document.querySelector(".chatbot-toggler");
const chatbot = document.querySelector(".chatbot");
const iconOpen = toggleBtn.querySelector("i.bi-robot");
const iconClose = toggleBtn.querySelector("i.bi-x-lg");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
  chatbot.classList.toggle("show");
  iconOpen.classList.toggle("d-none");
  iconClose.classList.toggle("d-none");
});

document.querySelector(".close-chat").addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
  chatbot.classList.remove("show");
  iconOpen.classList.remove("d-none");
  iconClose.classList.add("d-none");
});

const chatInput = document.querySelector("#text-area");
const sendChatBtn = document.querySelector("#send-btn");
const chatbox = document.querySelector(".chatbox");

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

async function generateResponse(userMessage) {
  chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
    });

    if (!response.ok) {
      throw new Error("Network error: " + response.statusText);
    }

    const data = await response.json();
    const geminiReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    chatHistory.push({
      role: "model",
      parts: [{ text: geminiReply }],
    });

    return geminiReply;
  } catch (err) {
    console.error(err);
    return "Sorry, there was an error connecting to Gemini.";
  }
}

async function handleSendMessage() {
  const message = chatInput.value.trim();
  if (message === "") return;

  chatbox.appendChild(createChatLi(message, "outgoing"));
  chatbox.scrollTop = chatbox.scrollHeight;
  chatInput.value = "";

  const thinkingLi = createChatLi("Thinking...", "incoming");
  chatbox.appendChild(thinkingLi);
  chatbox.scrollTop = chatbox.scrollHeight;

  const reply = await generateResponse(message);
  thinkingLi.querySelector("p").textContent = reply;
  chatbox.scrollTop = chatbox.scrollHeight;
}

sendChatBtn.addEventListener("click", handleSendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
});
