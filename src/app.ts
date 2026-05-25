import express from "express";
import "./db/mongoose.js";
import { lectorRouter } from "./routers/lector_router.js";
import { libroRouter } from "./routers/libro_router.js";
import { defaultRouter } from "./routers/default_router.js";


export const app = express();
app.use(express.json());
app.use(lectorRouter);
app.use(libroRouter);
app.use(defaultRouter);