const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { callbackPromise } = require("nodemailer/lib/shared");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  loggedIn: {
    type: String,
  },
  admin: {
    type: Boolean,
  },
  location: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  health: {
    type: Number,
  },
  wins: {
    type: Number,
  },
  matchWins: {
    type: Number,
  },
  losses: {
    type: Number,
  },
  rank: {
    type: Number,
  },
  mRank: {
    type: Number,
  },
  inMatch: {
    type: Boolean,
  },
  cordX: {
    type: Number,
  },
  cordY: {
    type: Number,
  },
  pRight: {
    type: Boolean,
  },
  pLeft: {
    type: Boolean,
  },
  pUp: {
    type: Boolean,
  },
  pDown: {
    type: Boolean,
  },
  angle: {
    type: Number,
  },
  pColor: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (error) {
    console.log(error);
  }
});

UserSchema.methods.isValidPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, matched) {
    if (err) return cb(err);
    cb(null, matched);
  });
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
