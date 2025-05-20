document.querySelector("#login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  fetch(`http://localhost:3000/users?email=${email}&password=${password}`)
    .then((res) => res.json())
    .then((users) => {
      console.log(users);
      if (users.length === 0) {
        alert("Invalid email or password.");
        return;
      }
      window.location.href = "index.html";
    })
    .catch((err) => {
      console.error("Error during login:", err);
      alert("Something went wrong. Please try again.");
    });
});
