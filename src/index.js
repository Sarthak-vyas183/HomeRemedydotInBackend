import dotenv from "dotenv"
import connectDB from "./db/dbconnect.js";
import {app} from './app.js'
import express from "express";
import path from "path";

dotenv.config({
    path: './.env'
})

const __dirname = path.resolve();
app.use("/public", express.static(path.join(__dirname, "public")));

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})