const mongoose = require("mongoose");
// exporting middle ware
module.exports = (req,res,next)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send({
      message:`Invalid ID`
    });
  }
  next();
}