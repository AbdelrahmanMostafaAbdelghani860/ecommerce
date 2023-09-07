import mongoose from "mongoose"; 
import asyncHandler from "../src/utilies/errorHandler.js";

const DBconnection =  async()=>{
try {
   await mongoose.connect(process.env.DB_LINK).then(console.log('DB Connected'))
}
catch(error) {
 return console.log('Error in DB connection');}
}
export default DBconnection 