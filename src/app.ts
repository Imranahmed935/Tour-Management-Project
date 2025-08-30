import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleWare/globalErrorHandler";
import notFount from "./app/middleWare/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport"
import { envVars } from "./app/config/env";

const app = express();

app.use(
  expressSession({
    secret: "your secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "The server is running on localhost",
  });
});

// app.use(globalErrorHandler)
app.use(globalErrorHandler);

app.use(notFount);

export default app;
