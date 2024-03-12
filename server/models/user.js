// requirements
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// user schema
const userSchema = new mongoose.Schema({
  // attributes - name,email,password,gender,month,date,year,likedsongs,playlists,AdminSettings
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  month: { type: String, required: true },
  date: { type: String, required: true },
  year: { type: String, required: true },
  likedsongs: { type: [String], default: [] },
  playlists: { type: [String], default: [] },
  isAdmin: { type: Boolean, default: false }
});
// methods
userSchema.methods.generateAuthToken = function () {
  // token
  const token = jwt.sign(
    // payloads
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    // private key for jwt
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  )
  return token;
}

// validation of user
const validate = (user) => {
  const schema = joi.object({
    name: joi.string().min(5).max(25).required(),
    email: joi.string().email().required(),
    password: passwordComplexity().min(5).max(11).required(),
    month: joi.string().required(),
    year: joi.string().required(),
    date: joi.string().required(),
    gender: joi.string().valid("male", "female", "other").required(),
  });

  // Use destructuring to get 'error' and 'value' properties from the result of validate
  const { error, value } = schema.validate(user);

  if (error) {
    console.log("user validation failed!!!", error.details);
    throw new Error(error.details[0].message); // Throw an error to indicate validation failure
  }

  // Return the validated value
  return value;
};

// user model
const User = mongoose.model("user", userSchema);

// expoting
module.exports = { User, validate };