const mongoose = require("mongoose");
const joi = require("joi");

// object
const ObjectId = mongoose.Schema.Types.ObjectId;

// playlist schema
const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: ObjectId, ref: "user", required: true },
  desc: { type: String },
  songs: { type: Array, default: [] },
  img: { type: String },
});
// validation
const validate = (playlist) => {
  const schema = joi.object({
    name: joi.string().required(),
    user: joi.string().required(),
    desc: joi.string().allow(""),
    songs: joi.array().items(joi.string()),
    img: joi.string().allow(""),
  });
  if (!schema.validate(song)) {
    console.log(`validation of the playlist failed!!!`)
  }
  return schema.validate(playlist);
}


// model
const Playlist = mongoose.model("playlist", playlistSchema);


module.exports = { Playlist, validate };