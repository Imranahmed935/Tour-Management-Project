import express, { Request, Response } from "express";
import cors from"cors"
import { router } from "./app/routes";

import { globalErrorHandler } from "./app/middleWare/globalErrorHandler";
import notFount from "./app/middleWare/notFound";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router)



app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        message:'The server is running on localhost'
    })
})

// app.use(globalErrorHandler)
app.use(globalErrorHandler)

app.use(notFount)

export default app