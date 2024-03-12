const router = require("express").Router();
const bcrypt = require("bcrypt");
const {User} = require("../models/user");

router.post("/",async(req,res)=>{
  const user = await User.findOne({email:req.body.email});
  const validPassword = await bcrypt.compare(req.body.password,user.password);
  // user verification
  if (!user)
    return res.status(400).send({message:`Invalid emailID`});
  if (!validPassword)
    return res.status(400).send({message:`Invalid Password`});
  // token generation
  const token = user.generateAuthToken();
  res.status(200).send({
    data:token,
    message:`Login successfull!! please wait....`
  });
});

module.exports = router;