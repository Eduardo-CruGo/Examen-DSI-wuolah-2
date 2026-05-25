import express from "express";
import "./db/mongoose.js";
//import { lectorRouter } from "./routers/lector_router.js";


export const app = express();
app.use(express.json());
//app.use(lectorRouter);
