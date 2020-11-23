let socket = io();

let errId = document.getElementById("errorId");
let errEmail = document.getElementById("errorEmail");
let errPass = document.getElementById("errorPass");
let userId = document.getElementById("userId");
let email = document.getElementById("email");
let password = document.getElementById("password");
let registerDiv = document.getElementById("register");
let verifyDiv = document.getElementById("verification");
let code = document.getElementById("code");
let errorCode = document.getElementById("errorCode");
let enterGame = document.getElementById("enter-game");

let verifyCode;
let RegistrationData;

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
  if (!userId.checkValidity())
    errId.innerHTML = "Username length should be between 2-4.";
  if (!email.checkValidity())
    errEmail.innerHTML = "Please provide a valid email";
  if (!password.checkValidity())
    errPass.innerHTML = "Password length should be between 6-12.";
  else {
    //API for get requests
    // await fetch(
    //   "http://cors-anywhere.herokuapp.com/http://api.ipify.org?format=json"
    // )
    //   .then(checkError)
    //   .then((ipAdd) => {
    //     console.log(ipAdd);
    //     storeIp = ipAdd.ip;
    //   })
    //   .catch((err) => console.log(err));
    var RegistrationData = {
      username: userId.value.toLowerCase(),
      email: email.value.toLowerCase(),
      password: password.value,
      // ip: storeIp,
    };
    localStorage.setItem("user", RegistrationData.email);
    localStorage.setItem("userid", RegistrationData.username);
    socket.emit("Registration Validation OK", RegistrationData);
  }
}

socket.on("UserExists", function (data) {
  errEmail.innerHTML = "Email is already registered";
});

socket.on("UserIdExists", function (data) {
  errId.innerHTML = "Username is already registered";
});

socket.on("Sending verification code", function (data) {
  verifyCode = data;
  verifyDiv.style.display = "block";
  registerDiv.style.display = "none";
});

function sendCode() {
  socket.emit("Client Sending Code Back", code.value);
}

socket.on("userVerified", function (data) {
  enterGame.style.display = "block";
  verifyDiv.style.display = "none";
});

socket.on("userNotVerified", function (data) {
  errorCode.innerHTML = "Incorrect Code";
});

particlesJS.load("particles-js", "./assets/particles.json");
