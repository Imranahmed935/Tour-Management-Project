import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const runServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Database Connected successfully!");

    server = app.listen(envVars.PORT, () => {
      console.log(`The server is Running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await runServer();
  await seedSuperAdmin();
})();

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

process.on("uncaughtException", (err) => {
  console.log("uncaugth Exception detected. server shuting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});

// Promise.reject(new Error("I forgot to catch this promise!"));
// throw new Error("i forgot to handle local error")
