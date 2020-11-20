const User = require("../models/models");

const options = { upsert: false };

//=======================>>
// called during log in
//=======================>>
export function update_login_data(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        loggedIn: player.loggedIn,
        location: player.location,
        ipAddress: player.ipAddress,
      },
    };
    update_one(query, update, options);
  }
}

//=======================>>
// called during log out
//=======================>>
export function update_player_cords(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        cordX: player.cordX,
        cordY: player.cordY,
        angle: player.angle,
        loggedIn: player.loggedIn,
      },
    };
    update_one(query, update, options);
  }
}

//=======================>>
// called In Bullet.js
//=======================>>
export function update_health(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        health: player.health,
        // cordX: player.cordX,
        // cordY: player.cordY,
      },
    };
    update_one(query, update, options);
  }
}

//=======================>>
// called In Server.Game.js
//=======================>>
export function update_match_wins(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        matchWins: player.matchWins,
      },
    };
    update_one(query, update, options);
  }
}

export function update_if_match_running_status(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        inMatch: player.inMatch,
      },
    };
    update_one(query, update, options);
  }
}

// called In SetInterval
export function update_match_wins_rank(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        matchWins: player.matchWins,
        mRank: player.mRank,
      },
    };
    update_one(query, update, options);
  }
}

export function update_wins_loss(player) {
  const query = { username: player.pName };
  const update = {
    $set: {
      wins: player.pWins,
      losses: player.pLoss,
    },
  };
  update_one(query, update, options);
}

//=======================>>
// MONGODB UPDATEONE
//=======================>>
function update_one(query, update, options) {
  User.updateOne(query, update, options)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`Successfully updated the item.`);
      }
    })
    .catch((err) => console.error(`Failed to update the item: ${err}`));
}

/*
* MIGHT NEED LATER

export function update_logged_status(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        loggedIn: player.loggedIn,
        matchWins: player.matchWins,
      },
    };
    update_one(query, update, options);
  }
}

export function update_total_rank(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        rank: player.rank,
      },
    };
    update_one(query, update, options);
  }
}

export function update_match_rank(player) {
  if (player._id) {
    const query = { _id: player._id };
    const update = {
      $set: {
        mRank: player.mRank,
      },
    };
    update_one(query, update, options);
  }
}*/
