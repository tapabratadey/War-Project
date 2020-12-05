const Player = require("./Server.Player");
const { update_match_wins, update_health } = require("../player/updateDB");

export let bulletArr = [];

export function moveBullet(player) {
  for (let i = 0; i < bulletArr.length; i++) {
    bulletArr[i].cordX += bulletArr[i].speedX;
    bulletArr[i].cordY += bulletArr[i].speedY;
    if (
      bulletArr[i].cordX < 0 ||
      bulletArr[i].cordX > 3840 ||
      bulletArr[i].cordY < 0 ||
      bulletArr[i].cordY > 2160 ||
      bulletHit(player, bulletArr[i])
    )
      bulletArr.splice(i, 1);
  }
}

export function bulletHit(player, bullet) {
  if (bullet.id != player._id) {
    if (player.health != 0) {
      let dx = player.cordX + 20 - bullet.cordX;
      let dy = player.cordY + 26.5 - bullet.cordY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 30 + bullet.radius) {
        player.health -= 5;
        if (player.health === 0) {
          player.health = 100;
          player.cordX = Math.floor(Math.random() * 500);
          player.cordY = Math.floor(Math.random() * 500);
          for (let j in Player.playerList) {
            if (Player.playerList[j]._id == bullet.id) {
              Player.playerList[j].matchWins += 1;
              // update_match_wins(Player.playerList[j]);
            }
          }
        }
        update_health(player);
        return true;
      }
    }
  }
}

export function update_bullets(user, bullet) {
  if (user.angle == -90) bullet.speedX -= 15;
  else if (user.angle == 90) bullet.speedX += 15;
  if (user.angle == 360) bullet.speedY -= 15;
  if (user.angle == 180) bullet.speedY += 15;
  if (user.angle == -45) {
    bullet.speedX -= 15;
    bullet.speedY -= 15;
  } else if (user.angle == 45) {
    bullet.speedX += 15;
    bullet.speedY -= 15;
  } else if (user.angle == 135) {
    bullet.speedX += 15;
    bullet.speedY += 15;
  } else if (user.angle == -135) {
    bullet.speedX -= 15;
    bullet.speedY += 15;
  } else if (bullet.speedX === 0 && bullet.speedY === 0) bullet.speedY -= 15;
  // store in an array <--- connect it to the player
  bulletArr.push(bullet);
}
