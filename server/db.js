const mongoose = require("mongoose")
 

const db = mongoose.connect(process.env.DB_URI)

const con = mongoose.connection

con.on("error", ()=>{  
    console.log("error") 
}) 

con.once("open", ()=>{
    console.log("db connected...")
}) 