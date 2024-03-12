const router = require("express").Router();
const {User} = require("../models/user");
const {Song,validate} = require("../models/song");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/validObjectId");

// song creation
router.post("/",admin,async(req,res)=>{
  const{error} = validate(req.body);
  if (error) {
    return res.status(400).send({message:error.details[0].message});
  }
});

// acessing all songs
router.get("/",async(req,res)=>{
  const songs = await Song.find();
  res.status(200).send({data:songs});
});

// update song
router.put("/:id",[validObjectId,admin],async(req,res)=>{
  const song = await Song.findByIdAndUpdate(req.params.id,req.body,{new:true});
  res.status(200).send({data:song,message:`Song updated SUCCESS!!!`});
});

// delete song
router.delete("/:id",[validObjectId,admin],async(req,res)=>{
  await Song.findByIdAndDelete(req.params.id);
  res.status(200).send({message:`SONG DELETION COMPLETE SUCCESS`});
});

// likes
router.put("/like/:id",[validObjectId,auth],async(req,res)=>{
  let resMessage = "";
  const song = await Song.findById(req.params.id);
  // song does not exits
  if (!song){
    return res.status(400).send({message:`SONG NOT FOUND...`});
  }
  const user = await User.findById(req.user._id);
  // index of liked songs 
  const index = user.likedSongs.indexOf(song._id);
  if (index === -1){
    user.likedSongs.push(song._id);
    resMessage = `Added to Your Liked Songs`;
  }
  else{
    user.likedSongs.splice(index,1);
    resMessage = `Removed from Your Liked Songs`
  }
  await user.save();
  res.status(200).send({message:resMessage});
});

// all liked songs
router.get("/like",auth,async(req,res)=>{
  const user = await User.findById(req.user._id);
  const songs = await Song.find({_id:user.likedSongs});
  res.status(200).send({data:songs});
});

// module exports
module.exports = router;