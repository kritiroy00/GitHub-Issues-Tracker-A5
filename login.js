document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === "admin" && pass === "admin123"){
    localStorage.setItem("loggedIn", true);
    window.location.href = "main.html";
  } else {
    alert("Invalid credentials!");
  }
});
