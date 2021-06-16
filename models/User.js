const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

// Hashing the password before save into the Database
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    this.confirmPassword = undefined;
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
