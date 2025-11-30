import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); 


import {app} from "./app.js"; 

import connectDB from "./db/index.js";


dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port ${process.env.PORT}`);
        
    })
}).catch((err)=>{
    console.log("mongodb connection failed",err);
    
})