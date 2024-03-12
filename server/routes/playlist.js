const router = require("express").Router();
const {Playlist,validate} = require("../models/playlist");
const {Song} = require("../models/song");
const {User} = require("../models/user");
const auth = require("../middleware/auth");
const validObjectId = require("../middleware/validObjectId");

const joi = require("joi");
// playlist creation
router.post("/",auth,async(req,res)=>{
  const {error} = validate(req.body);
  if (error) {
    res.status(200).send({
      message:error.details[0].message
    })
  }

  const user = await User.findById(req.user._id);
  const playlist = await Playlist({...req.body,user:user._id}).save();
  user.playlists.push(playlist._id);
  await user.save();

  res.status(201).send({data:playlist});
})

// edit playlist
router.put("/edit/:id",[validObjectId,auth],async(req,res)=>{
  const schema = joi.object({
    name:joi.string().required(),
    desc:joi.string().allow(""),
    img:joi.string().allow("")
  });
  const {error} = schema.validate(req.body);
  if (error) return res.status(400).send({message:error.details[0].message});

  const playlist = await Playlist.findById(req.params.id);

  // playlist does not exist
  if (!playlist)
    return res.status(404).send({message:`Playlist not found`});

  // accessing playlist of a user 
  const user = await User.findById(req.body._id);
  // user does not contain the playlist
  if (!user._id.equals(playlist.user)){
    return res.status(403).send({message:`User doesnot have access to edit this playlist`});
  }
  // user have access 
  playlist.name = req.body.name;
  playlist.desc = req.body.desc;
  playlist.img = req.body.img;
  // saving playlist....
  playlist.save();

  // successfull update
  res.status(200).send({message:`Playlist Update SUCCESSFUL!!!`});
})

// adding songs to playlist--->>
router.put("/add-song",auth,async(req,res)=>{
  const schema = joi.object({
    playlistId:joi.string().required(),
    songId:joi.string().required()
  });
  // errors
  const {error} = schema.validate(req.body);
  if (error)
    return res.status(400).send({message:error.details[0].message});

  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.body.playlistid);
  if (!user._id.equals(playlist.user)){
    return res.status(403).send({message:`User doesnot have access to add this song..`});
  }
  if(playlist.songs.indexOf(req.body.songId) === -1){
    playlist.songs.push(req.body.songId);
  };
  await playlist.save();
  res.status(200).send({data:playlist,message:`Added to playlist`})
})
// remove song from playlist 
router.put("/remove-song",auth,async(req,res)=>{
  const schema = joi.object({
    playlistId:joi.string().required(),
    songId:joi.string().required()
  });
  // errors
  const {error} = schema.validate(req.body);
  if (error)
    return res.status(400).send({message:error.details[0].message});

  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.body.playlistid);
  if (!user._id.equals(playlist.user)){
    return res.status(403).send({message:`User doesnot have access to remove this song..`});
  }
  const index = playlist.songs.indexOf(req.body.songId);
  playlist.songs.splice(index,1);
  await playlist.save();
  res.status(200).send({data:playlist,message:`Removed from playlist`})
})
// user favorate playlist
router.get("/favorite",auth, async(req,res)=>{
  const user = await User.findById(req.user._id);
  const playlist = await Playlist.find({_id:user.playlists});
  res.status(200).send({data:playlist});      //success 
});
// get random playlist
router.get("/random",auth, async(req,res)=>{
  const playlist = await Playlist.aggregate([{$sample:{size:10}}]);
  res.status(200).send({data:playlist});
});
// get playlist with songs
router.get("/:id",[validObjectId,auth], async (req,res)=>{
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).send(`Playlist not found!!!`);
  const songs = await Song.find({_id:playlist.songs});
  res.status(200).send({data:{playlist,songs}});
});
// get all playlist
router.get("/",auth, async(req,res)=>{
  const playlists = await Playlist.find();
  res.status(200).send({data:playlists});
});
// delete playlist
router.delete("/:id",[validObjectId,auth], async(req,res)=>{
  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.params.id);
  if (!user._id.equals(playlist.user)){
    return res.status(403).send({message:`User doesnot have access to remove this song..`});
  }
  const index = user.playlists.indexOf(req.params.id);
  user.playlists.splice(index,1);
  await user.save();
  await playlist.remove();
  res.status(200).send({message:`Removed from the library`});
})
module.exports = router; 