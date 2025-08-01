import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path:"/auth",
    route:authRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
