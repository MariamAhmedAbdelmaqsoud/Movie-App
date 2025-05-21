document.querySelector("#signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // check if email exist
  fetch(`http://localhost:3000/users?email=${email}`)
    .then((res) => res.json())
    .then((users) => {
      if (users.length > 0) {
        alert("Email already exists.");
        return;
      }

      // create user
      const newUser = {
        name,
        email,
        password,
      };
      console.log(newUser);

      fetch(`http://localhost:3000/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
        .then((res) => res.json())
        .then((data) => {
          window.location.href = "login.html";
          console.log("to login");
        })
        .catch((err) => console.error("Error during sign up:", err));
    });
});
