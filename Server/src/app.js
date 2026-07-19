const express=require("express");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const app=express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const authRoutes = require("./Routes/AuthRoutes");

app.use("/api/auth", authRoutes);
module.exports = app;