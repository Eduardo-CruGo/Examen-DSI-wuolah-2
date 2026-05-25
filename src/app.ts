import express from "express";
import "./db/mongoose.js";
//import { userRouter } from "./routers/user.js";
//import { noteRouter } from "./routers/note.js";
//import { defaultRouter } from "./routers/default.js";

export const app = express();
app.use(express.json());
//app.use(userRouter);
//app.use(noteRouter);
//app.use(defaultRouter);