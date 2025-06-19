
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const bio = document.getElementById("bio").value;

  fetch("https://e-swapper-backend.onrender.com/api/users/update-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ username, email, bio })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").innerText = data.message || "Profile updated!";
  })
  .catch(err => {
    document.getElementById("status").innerText = "Error updating profile.";
  });
});
