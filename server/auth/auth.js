const User = require("../models/models.js");
const crypto = require("crypto");
const { sendNodeMail } = require("../helpers/nodemailer");
const {
  update_login_data,
  update_logged_status,
  update_player_cords,
} = require("../player/updateDB");
const Player = require("../player/Server.Player");
const fetch = require("node-fetch");

export async function login({ email, password, ip }, socket) {
  const found_user = await User.findOne({ email });
  if (!found_user) {
    socket.emit("Email is not registered");
  } else {
    found_user.isValidPassword(password, async (err, matched) => {
      if (err) console.error(err);
      if (matched) {
        update_logged_in_status(found_user, ip);
        socket.emit("UserAuthenticated", found_user.username);
      } else socket.emit("Username or Password is not valid");
    });
  }
}

export async function register({ email, username, password, ip }, socket) {
  const userExists = await User.findOne({ email: email });
  const userIdExists = await User.findOne({ username: username });
  if (userExists) socket.emit("UserExists");
  else {
    if (userIdExists) socket.emit("UserIdExists");
    else {
      let saveCode = crypto.randomBytes(8).toString("hex");
      socket.emit("Sending verification code", saveCode);
      await sendNodeMail(saveCode, email);
      socket.on("Client Sending Code Back", async function (clientCode) {
        if (clientCode === saveCode) {
          socket.emit("userVerified");
          store_new_user(email, username, password, ip);
          socket.emit("userSaved");
        } else {
          socket.emit("userNotVerified");
        }
      });
    }
  }
}

export async function adminLogin(data, socket) {
  const adminExists = await User.findOne({ email: data.email });
  if (adminExists === null) {
    socket.emit("Not Authorized");
  } else {
    if (!adminExists.admin) socket.emit("Not Authorized");
    else {
      adminExists.isValidPassword(data.password, (err, matched) => {
        if (err) console.error(err);
        if (matched) {
          socket.emit("AdminAuthenticated");
        } else socket.emit("Password is not valid");
      });
    }
  }
}

export async function log_out(socket) {
  let user = Player.playerList[socket.id];
  if (user) {
    user.loggedIn = "offline";
    update_player_cords(user);
    socket.emit("logout player");
  }
}

async function store_new_user(email, username, password, ip) {
  const url =
    "https://cors-anywhere.herokuapp.com/http://ip-api.com/json/" +
    ip +
    "?fields=status,message,query,country,city";
  const headers = {
    "X-Requested-With": "XMLHttpRequest",
  };
  fetch(url, {
    headers: headers,
  })
    .then((res) => res.json())
    .then(async (text) => {
      let location = text.city + ", " + text.country;
      const user = new User(
        return_user_data(email, username, password, ip, location)
      );
      await user.save();
    });
}

function return_user_data(email, username, password, ip, location) {
  return {
    email,
    username,
    password,
    loggedIn: "online",
    admin: false,
    ipAddress: ip,
    location,
    health: 100,
    wins: 0,
    losses: 0,
    rank: 0,
    mRank: 0,
    inMatch: false,
    matchWins: 0,
    cordX: 240,
    cordY: 240,
    pRight: false,
    pLeft: false,
    pUp: false,
    pDown: false,
    angle: 0,
    pColor: generateRandomColor(),
  };
}

function update_logged_in_status(found_user, ip) {
  const url =
    "https://cors-anywhere.herokuapp.com/http://ip-api.com/json/" +
    ip +
    "?fields=status,message,query,country,city";
  const headers = {
    "X-Requested-With": "XMLHttpRequest",
  };
  fetch(url, {
    headers: headers,
  })
    .then((res) => res.json())
    .then((text) => {
      found_user.loggedIn = "online";
      found_user.location = text.city + ", " + text.country;
      found_user.ipAddress = ip;
      update_login_data(found_user);
    });
}

function generateRandomColor() {
  let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  if (color.length != 7) {
    color = generateRandomColor();
  }
  return color;
}
