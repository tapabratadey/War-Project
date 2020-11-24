// const { update_player_cords } = require("../player/updateDB");

const Bullet = require("./Bullet");
const Game = require("../routes/game/Server.Game");

export let playerList = {};

//=========================>
// called in Server.Game.js
//========================>>
export function update() {
  let players_info = [];
  for (let i in playerList) {
    let player = playerList[i];
    movePlayer(player);
    Bullet.moveBullet(player);
    push_to_array(player, players_info);
  }
  // sort_total_wins(players_info);
  if (players_info.length > 1) sort_match_wins(players_info);
  return players_info;
}

//====================>
// called in server.js
//===================>>
export function update_keys(socket, key) {
  let user = playerList[socket.id];
  if (user) {
    if (key.inputId === "right") user.pRight = key.state;
    else if (key.inputId === "left") user.pLeft = key.state;
    else if (key.inputId === "up") user.pUp = key.state;
    else if (key.inputId === "down") user.pDown = key.state;
    else if (key.inputId === "shoot" && key.state && user.health > 0) {
      if (Game.inMatch) {
        let bullet = new BulletObj(user.cordX, user.cordY, user.id);
        Bullet.update_bullets(user, bullet);
      }
    }
  }
}

function push_to_array(player, players_info) {
  players_info.push({
    pRank: player.rank,
    mRank: player.mRank,
    pName: player.username,
    mWins: player.matchWins,
    pWins: player.wins,
    pLoss: player.losses,
    pHealth: player.health,
    pCordX: player.cordX,
    pCordY: player.cordY,
    pAngle: player.angle,
    bulletArr: Bullet.bulletArr,
    pColor: player.pColor,
  });
}

function sort_match_wins(players_info) {
  players_info.sort((a, b) => {
    if (a.mWins < b.mWins) return 1;
    if (a.mWins > b.mWins) return -1;
    return 0;
  });
  for (let i = 0; i < players_info.length; i++) {
    players_info[i].mRank = i + 1;
    // update_match_rank(players_info[i]);
  }
  return players_info;
}

function accelerate(speedX, speedY, angle, player) {
  player.cordX += speedX;
  player.cordY += speedY;
  player.angle = angle;
}

function movePlayer(player) {
  if (player.health > 0) {
    if (
      player.cordX > 0 &&
      player.cordX <= 3840 &&
      player.cordY > 0 &&
      player.cordY <= 2160
    )
      calc_movement(player);
    if (player.cordX <= 0) player.cordX = 1;
    if (player.cordX >= 3840) player.cordX = 3830;
    //(-10)
    if (player.cordY <= 0) player.cordY = 1;
    if (player.cordY >= 2160) player.cordY = 2150; //(-10)
  }
}

function calc_movement(player) {
  if (player.pUp && player.pRight) accelerate(10, -10, 45, player);
  else if (player.pUp && player.pLeft) accelerate(-10, -10, -45, player);
  else if (player.pDown && player.pRight) accelerate(10, 10, 135, player);
  else if (player.pDown && player.pLeft) accelerate(-10, 10, -135, player);
  else if (player.pRight) accelerate(10, 0, 90, player);
  else if (player.pLeft) accelerate(-10, 0, -90, player);
  else if (player.pUp) accelerate(0, -10, 360, player);
  else if (player.pDown) accelerate(0, 10, 180, player);
}

let BulletObj = function (cordX, cordY, id) {
  this.id = id;
  this.cordX = cordX;
  this.cordY = cordY;
  this.speedX = 0;
  this.speedY = 0;
};

/*function sort_total_wins(players_info) {
  players_info.sort((a, b) => {
    if (a.pWins < b.pWins) return 1;
    if (a.pWins > b.pWins) return -1;
    return 0;
  });
  for (let i = 0; i < players_info.length; i++) {
    players_info[i].pRank = i + 1;
    update_total_rank(players_info[i]);
  }
  return players_info;
}*/
