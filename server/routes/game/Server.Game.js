const Player = require("../../player/Server.Player");
const User = require("../../models/models");
import {
  update_match_wins_rank,
  update_wins_loss,
  update_match_wins,
  update_if_match_running_status,
} from "../../player/updateDB";

export let SOCKET_LIST = {};

export async function init_game(socket, email) {
  const user = await User.findOne({ email: email });
  if (!user) socket.emit("Please Log In.");
  else {
    console.log(`${email} has joined game`);
    socket.id = user._id;
    SOCKET_LIST[socket.id] = socket;
    check_if_match_running(user);
    user.matchWins = 0;
    update_match_wins(user);
    Player.playerList[socket.id] = user;
  }
}
let user_array = [];

export async function send_users(socket) {
  var getUserData = await User.find().sort({ wins: -1 });
  for (let i = 0; i < getUserData.length; i++) {
    getUserData[i].rank = i + 1;
    user_array.push({
      rank: getUserData[i].rank,
      username: getUserData[i].username,
      wins: getUserData[i].wins,
      losses: getUserData[i].losses,
    });
  }
  socket.emit("Sending Leaderboard Data", user_array);
  user_array.length = 0;
}

function check_if_match_running(user) {
  let date = new Date();
  let currentTime = date.toLocaleTimeString();

  let parseTime = currentTime.split(":");
  let mins = parseTime[1];

  if (mins % 5 == 0) user.inMatch = false;
  else user.inMatch = true;
  update_if_match_running_status(user);
}

setInterval(function () {
  let infoPlayers = Player.update();

  let totalUsers = Object.keys(SOCKET_LIST).length;
  let date = new Date();
  let currentTime = date.toLocaleTimeString();

  let parseTime = currentTime.split(":");
  let mins = parseTime[1];
  let secs = parseTime[2];
  let msg;
  let winner;
  if (mins % 5 == 1 || mins % 5 == 2 || mins % 5 == 3 || mins % 5 == 4) {
    msg = "FIGHT!!!!!";
    if (mins % 5 == 4 && secs >= 50) msg = "Match is Ending in...";
  } else if (mins % 5 == 0) {
    //match not in session
    if (totalUsers > 1) {
      msg = "WINNER IS...";
      winner = find_winner(winner, infoPlayers);
      if (winner || winner !== "No One") give_points(winner, infoPlayers);
    }
    if (secs >= 15) msg = "New Match starting in...";
    if (secs == 50) reset_match_stats(infoPlayers);
  }
  send_players_to_client(infoPlayers, currentTime, mins, secs, msg, winner);
}, 1000 / 60);

function reset_match_stats(infoPlayers) {
  for (let i in infoPlayers) {
    infoPlayers[i].mWins = 0;
    infoPlayers[i].mRank = 0;
    update_match_wins_rank(infoPlayers[i]);
  }
}

function find_winner(winner, infoPlayers) {
  for (let i in infoPlayers) {
    let matchWins = infoPlayers[i].mWins;
    for (let j in infoPlayers) {
      if (i != j) {
        if (infoPlayers[j].mWins > matchWins) winner = infoPlayers[j].pName;
        else winner = infoPlayers[i].pName;
      }
    }
    if (matchWins == 0) winner = "No One";
  }
  return winner;
}

function give_points(winner, infoPlayers) {
  for (let i in infoPlayers) {
    if (winner == infoPlayers[i].pName) infoPlayers[i].pWins += 1;
    else infoPlayers[i].pLoss += 1;
    update_wins_loss(infoPlayers[i]);
  }
}

function send_players_to_client(
  infoPlayers,
  currentTime,
  mins,
  secs,
  msg,
  winner
) {
  for (let i in SOCKET_LIST) {
    let socket = SOCKET_LIST[i];
    socket.emit("Game starting", {
      infoPlayers,
      currentTime,
      mins,
      secs,
      msg,
      winner,
    });
  }
}
