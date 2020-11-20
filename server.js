import express from "express";
import http from "http";
import socket from "socket.io";

const app = express();
const server = http.Server(app);
const io = socket(server);

const connectDB = require("./server/helpers/init_mongodb");
const Auth = require("./server/auth/auth");
const Game = require("./server/routes/game/Server.Game");
const Player = require("./server/player/Server.Player");
const Admin = require("./server/routes/admin/Server.Admin");

app.use(express.static("./client/"));
app.use("/register", express.static("./client/html/register.html"));
app.use("/game", express.static("./client/html/game.html"));
app.use("/admin", express.static("./client/html/admin.html"));

connectDB();

io.on("connect", (socket) => {
  console.log("Connection to client...");
  try {
    //LOGIN
    socket.on("Login Validation OK", function (data) {
      Auth.login(data, socket);
    });

    //REGISTER
    socket.on("Registration Validation OK", function (data) {
      Auth.register(data, socket);
    });

    //LOG OUT
    socket.on("Log Out", function () {
      Auth.log_out(socket);
    });

    //GAME
    socket.on("Game Local Storage Data", function (email) {
      Game.init_game(socket, email);
    });
    socket.on("keyPress", function (key) {
      Player.update_keys(socket, key);
    });
    socket.on("leaderboard", function () {
      Game.send_users(socket);
    });

    //ADMIN
    socket.on("Admin Validation OK", function (data) {
      Auth.adminLogin(data, socket);
    });
    socket.on("Local Storage Data", function (adminEmail) {
      Admin.verify_localStorage(socket, adminEmail);
    });
    socket.on("dashboard", function () {
      Admin.send_user_data(socket);
    });

    //on socket disconnect
    socket.on("disconnect", function () {
      let user = Player.playerList[socket.id];
      if (user) {
        console.log(`${user.email} disconnected`);
        delete Game.SOCKET_LIST[socket.id];
        delete Player.playerList[socket.id];
      }
    });
  } catch (error) {
    console.error(error);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server started on port ${PORT}`));
