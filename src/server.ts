import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";
import { promise } from "zod";
import { error } from "console";

let server: Server;

const runServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mongoTodo:mongodb@cluster0.haqk7.mongodb.net/tour-backend?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Database Connected successfully!");

    server = app.listen(5000, () => {
      console.log(`The server is Running!!`);
    });
  } catch (error) {
    console.log(error);
  }
};
runServer();


// process.on("SIGINT", (err) => {
//   console.log("SIGINT detected. server shuting down...", err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//     process.exit(1);
//   }
// });


process.on("SIGTERM", (err) => {
  console.log("SIGTERM detected. server shuting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});


process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection detected. server shuting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});


process.on("uncaughtException",(err)=>{
  console.log("uncaugth Exception detected. server shuting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
})

// Promise.reject(new Error("I forgot to catch this promise!"));
// throw new Error("i forgot to handle local error")
