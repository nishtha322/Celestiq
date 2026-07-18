const express=require("express");
const cors=require("cors");
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"Celestiq api is runnig"
    });
})
module.exports = app;