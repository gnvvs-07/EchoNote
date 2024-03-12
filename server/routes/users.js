// requirements
const bcrypt = require("bcrypt");
// router 
const router = require("express").Router();
// modules
const { User, validate } = require("../models/user");
// middle wares
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjId = require("../middleware/validObjectId");
const validObjectId = require("../middleware/validObjectId");
// user 
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({
    message: error.details[0].message
  });
  // checking if user exists or not
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(403).send({
      message: `User with the email ID given already exists`
    });

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashPassword = await bcrypt.hash(req.body.password, salt);       //original password and salt password 
  // new user 
  let newUser = await new User({
    ...req.body,
    password: hashPassword
  }).save();
  newUser.password = undefined;
  newUser.__v = undefined;
  // success status
  res.status(200).send({
    data: newUser,
    message: `Account creation Successfull!!!`
  });
});
// accessing all users
router.get("/",admin,async(req,res)=>{
  const users = await User.find().select("-password-__v");
  res.status(200).send({data:users});
})
// get user BY ID
router.get("/:id",[validObjId,auth],async(req,res)=>{
  const user = await User.findById(req.params.id).select("-password-__v");
  res.status(200).send({data:user});
})
// update user BY ID
router.put("/:id",[validObjId,auth],async(req,res)=>{
  const user = await User.findByIdAndUpdate(
    req.params.id,
    // new dynamic params
    {$set:req.body},
    {new:true}
  ).select("-password-__v");
  res.status(200).send({data:user,message:`User details updated!!!`});
})
// delete user 
router.delete(":/id",[validObjectId,admin],async(req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send({
    message:`User accound deleted....`
  })
})
// exports
module.exports = router;