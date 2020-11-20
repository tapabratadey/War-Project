let socket = io();
let enterGame = document.getElementById("enter-game");
let loginDiv = document.getElementById("login");
let errEmail = document.getElementById("errorEmail");
let errPass = document.getElementById("errorPass");
let email = document.getElementById("email");
let password = document.getElementById("password");

document.body.onkeydown = function (event) {
  if (event.keyCode === 13) {
    formValidation();
  }
};
function checkError(response) {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    throw Error(response.statusText);
  }
}

let storeIp;
let userLoc;

async function formValidation() {
  if (!email.checkValidity())
    errEmail.innerHTML = "Please provide a valid email";
  else {
    //API for get requests
    await fetch(
      "http://cors-anywhere.herokuapp.com/http://api.ipify.org?format=json"
    )
      .then(checkError)
      .then((ipAdd) => {
        console.log(ipAdd);
        storeIp = ipAdd.ip;
      })
      .catch((err) => console.log(err));
    var LoginData = {
      email: email.value.toLowerCase(),
      password: password.value,
      ip: storeIp,
    };
    localStorage.setItem("user", LoginData.email);
    socket.emit("Login Validation OK", LoginData);
  }
}

socket.on("UserAuthenticated", function () {
  enterGame.style.display = "block";
  loginDiv.style.display = "none";
});

socket.on("Email is not registered", function () {
  errEmail.innerHTML = "Email is not registered";
});

socket.on("Username or Password is not valid", function () {
  errEmail.innerHTML = "Username or Password is not valid.";
});

particlesJS.load("particles-js", "./assets/particles.json");

socket.on("error", (reason) => {
  console.log(reason);
  window.location.href = "/";
});
