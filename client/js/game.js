import { keyEvents } from "./keyEvents.js";
export let socket = io();

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let playerName = document.getElementById("player-name");
let logOut = document.getElementById("log-out");
let menuSign = document.getElementById("menu-sign");
let openMenu = document.getElementById("open-menu");

//====================>>
//			ON LOAD
//====================>>

let user = localStorage.getItem("user");
window.onload = function () {
  if (user) {
    socket.emit("Game Local Storage Data", user);
    resizeCanvas();
    playerName.style.display = "block";
    logOut.style.display = "block";
    menuSign.style.display = "block";
  } else {
    window.location.href = "/";
  }
};

function resizeCanvas() {
  let width = 3840;
  let height = 2160;
  canvas.width = width;
  canvas.height = height;
}

//====================>>
//		GAME START
//====================>>
socket.on("Game starting", function (data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // displayTime(data.currentTime);
  displayMatchStats(data);
  check_msg(data);
  game_loop(data);
});

keyEvents();

function game_loop(data) {
  for (let i = 0; i < data.infoPlayers.length; i++) {
    if (data.infoPlayers[i].pHealth > 0) drawPlayer(data.infoPlayers[i]);
    drawBullet(data.infoPlayers[i]);
  }
}

function check_msg(data) {
  let msg = data.msg;
  if (msg === "FIGHT!!!!!") {
    displayTimer(data.mins, data.secs);
    min = 0;
  } else if (msg === "Match is Ending in...") {
    displayMessage("Match Ending in: ", data.secs);
  } else if (msg === "WINNER IS...") {
    displayWinner("Winner: ", data.winner);
  } else if (msg === "New Match starting in...") {
    displayMessage("New Match starts in: ", data.secs);
  }
}

//====================>>
//	EVENT LISTENERS
//====================>>

menuSign.addEventListener("click", () => {
  if (openMenu.style.display === "none") {
    openMenu.style.display = "block";
  } else {
    openMenu.style.display = "none";
  }
});

logOut.addEventListener("click", () => {
  socket.emit("Log Out", playerName.innerHTML);
});

//====================>>
//		LOGGING OUT
//====================>>
socket.on("logout player", function () {
  localStorage.removeItem("user");
  window.location.href = "/";
});

socket.on("Please Log In", function () {
  window.location.href = "/";
});

//====================>>
//		MATCH STATS
//====================>>
let matchStatsTable = document.getElementById("match-stats-table");

function displayMatchStats({ infoPlayers }) {
  clearMatchStatsTable(infoPlayers.length);
  for (let i in infoPlayers) {
    let tr = document.createElement("tr");
    for (let key in infoPlayers[i]) {
      if (key === "mRank") drawData(infoPlayers[i][key], tr);
      else if (key === "pName") drawData(infoPlayers[i][key], tr);
      else if (key === "mWins") drawData(infoPlayers[i][key], tr);
      else if (key === "pHealth") drawData(infoPlayers[i][key], tr);
    }
    matchStatsTable.appendChild(tr);
  }
}

function drawData(data, tr) {
  let td = document.createElement("td");
  td.innerHTML = data;
  tr.appendChild(td);
}

function clearMatchStatsTable(len) {
  while (len > 0) {
    if (matchStatsTable.rows[len]) {
      matchStatsTable.deleteRow(len);
    }
    len--;
  }
}

//====================>>
//		LEADERBOARD
//====================>>
let leaderboardTable = document.getElementById("leaderboard-table");

socket.on("Sending Leaderboard Data", function (leaderboardData) {
  clearLeaderboardTable(leaderboardData);
  for (let i = 0; i < leaderboardData.length; i++)
    display_leaderboard(leaderboardData[i]);
});

function display_leaderboard(data) {
  let tr = document.createElement("tr");
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let td = document.createElement("td");
      td.innerHTML = data[key];
      tr.appendChild(td);
    }
    leaderboardTable.appendChild(tr);
  }
}

function clearLeaderboardTable(leaderboardData) {
  let counter = leaderboardData.length;
  if (leaderboardTable.rows[counter]) {
    while (counter > 0) {
      leaderboardTable.deleteRow(counter);
      counter--;
    }
  }
}

setInterval(function () {
  socket.emit("leaderboard");
}, 3000);

//==============>>
//	DRAW FUNCS
//===============>
function drawPlayer(player) {
  translation(player);
  ctx.moveTo(player.pCordX, player.pCordY);
  ctx.lineTo(player.pCordX - 12.5, player.pCordY + 25);
  ctx.lineTo(player.pCordX + 12.5, player.pCordY + 25);
  ctx.closePath();
  ctx.strokeStyle = player.pColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  healthBar(player);
  playerInfo(player);
}

function drawBullet(player) {
  for (let j = 0; j < player.bulletArr.length; j++) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.arc(
      player.bulletArr[j].cordX,
      player.bulletArr[j].cordY,
      2,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
}

// function displayTime(currentTime) {
//   ctx.font = "20px Courier New";
//   ctx.fillStyle = "#fff";
//   ctx.fillText(currentTime, 100, 20);
// }

function displayMessage(msg, timer) {
  ctx.font = "20px Courier New";
  ctx.fillStyle = "#fff";
  ctx.fillText(msg, 100, 40);
  ctx.fillText(timer, 100, 60);
}

let min = 0;

function displayTimer(mins, secs) {
  let parseMin = mins.slice(1, 2);
  if (parseMin == 1 || parseMin == 6) min = 0;
  if (parseMin == 2 || parseMin == 7) min = 1;
  if (parseMin == 3 || parseMin == 8) min = 2;
  if (parseMin == 4 || parseMin == 9) min = 3;
  if (parseMin == 5 || parseMin == 0) min = 4;
  let timer = min + ":" + secs;
  ctx.font = "20px Courier New";
  ctx.fillStyle = "#fff";
  ctx.fillText(timer, 100, 40);
}

function displayWinner(msg, winner) {
  winner = winner + "!!!";
  ctx.font = "20px Courier New";
  ctx.fillStyle = "#fff";
  ctx.fillText(msg, 100, 40);
  ctx.fillText(winner, 100, 60);
}

function playerInfo(player) {
  ctx.fillStyle = "#fff";
  ctx.font = "10px Courier New";
  ctx.fillText(player.pName, player.pCordX, player.pCordY - 40);
  let username = localStorage.getItem("userid");
  // playerName.innerHTML = player.pName;
  playerName.innerHTML = username;
}

function translation(player) {
  ctx.save();
  ctx.translate(player.pCordX, player.pCordY);
  ctx.rotate(player.pAngle * (Math.PI / 180));
  ctx.translate(-player.pCordX, -player.pCordY);
  ctx.beginPath();
}

function lifeRemaining(player, bHit) {
  green_health(player);
  translation(player);
  ctx.arc(
    (3 * player.pCordX - 2.5) / 3,
    (3 * player.pCordY + 45) / 3,
    22.5,
    2 * Math.PI,
    bHit * Math.PI
  );
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function green_health(player) {
  translation(player);
  ctx.arc(
    (3 * player.pCordX - 2.5) / 3,
    (3 * player.pCordY + 45) / 3,
    22.5,
    0 * Math.PI,
    2 * Math.PI
  );
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function healthBar(player) {
  if (player.pHealth === 100) {
    green_health(player);
  } else lifeRemaining(player, (100 - player.pHealth) / 50);
}

//===============>
