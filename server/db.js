// This file used to connect the db to the index file 
// requirements 
const mongoose = require("mongoose");


// exporting the functions/methods
module.exports = async()=>{
  try {
    await mongoose.connect(process.env.DB);
    console.log(`connected to DataBase Successfull!!!`);
  } catch (error) {
    console.log(`connection to DataBase Failed!!!`);
  }
}