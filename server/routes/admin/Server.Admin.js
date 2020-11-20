const User = require("../../models/models");

let user_array = [];

export function send_user_data(socket) {
  setInterval(async function () {
    var getUserData = await User.find().sort({ wins: -1 });
    for (let i = 0; i < getUserData.length; i++) {
      getUserData[i].rank = i + 1;
      user_array.push({
        rank: getUserData[i].rank,
        username: getUserData[i].username,
        isLogged: getUserData[i].loggedIn,
        ipAddress: getUserData[i].ipAddress,
        location: getUserData[i].location,
        wins: getUserData[i].wins,
        losses: getUserData[i].losses,
        health: getUserData[i].health,
      });
    }
    socket.emit("Sending User Data", user_array);
    user_array.length = 0;
  }, 1000);
}

export async function verify_localStorage(socket, adminEmail) {
  const admin = await User.findOne({ email: adminEmail });
  if (!admin) socket.emit("Please Log In");
  else socket.emit("AdminAuthenticated");
}

/*socket.emit("Sending User Data", {
        rank: getUserData[i].rank,
        username: getUserData[i].username,
        isLogged: getUserData[i].loggedIn,
        ipAddress: getUserData[i].ipAddress,
        location: getUserData[i].location,
        wins: getUserData[i].wins,
        losses: getUserData[i].losses,
        health: getUserData[i].health,
      });*/
