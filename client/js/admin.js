let socket = io();

let enterGame = document.getElementById("enter-game");
let loginDiv = document.getElementById("login");
let errEmail = document.getElementById("errorEmail");
let errPass = document.getElementById("errorPass");
let email = document.getElementById("email");
let password = document.getElementById("password");
let admin = document.getElementById("admin-id");
let loggedUsersData = document.getElementById("logged-users-data");
let leaderboardData = document.getElementById("leaderboard-data");

document.body.onkeydown = function (event) {
  if (event.keyCode === 13) formValidation();
};

function formValidation() {
  if (!email.checkValidity())
    errEmail.innerHTML = "Please provide a valid email";
  else {
    let loginData = {
      email: email.value.toLowerCase(),
      password: password.value,
    };
    localStorage.setItem("admin", loginData.email);
    socket.emit("Admin Validation OK", loginData);
  }
}

socket.on("AdminAuthenticated", function () {
  admin.style.display = "block";
  loginDiv.style.display = "none";
  socket.emit("dashboard");
});

socket.on("Not Authorized", function () {
  errEmail.innerHTML = "Not Authorized.";
});

socket.on("Please Log In", function (data) {
  window.location.href = "/admin";
});

socket.on("Password is not valid", function () {
  errEmail.innerHTML = "Password is not valid.";
});

particlesJS.load("particles-js", "./assets/particles.json");

socket.on("error", (reason) => {
  console.error(reason);
  window.location.href = "/";
});

let adminEmail = localStorage.getItem("admin");
window.onload = function () {
  if (adminEmail) socket.emit("Local Storage Data", adminEmail);
};

socket.on("Sending User Data", function (userData) {
  clearTable(userData);
  for (let i = 0; i < userData.length; i++) display_leaderboard(userData[i]);
});

//setting up table
let userTable = document.getElementById("table");

function display_leaderboard(data) {
  let tr = document.createElement("tr");
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let td = document.createElement("td");
      td.innerHTML = data[key];
      tr.appendChild(td);
    }
    userTable.appendChild(tr);
  }
}

//clearing table
function clearTable(userData) {
  let counter = userData.length;
  if (userTable.rows[counter]) {
    while (counter > 0) {
      userTable.deleteRow(counter);
      counter--;
    }
  }
}
