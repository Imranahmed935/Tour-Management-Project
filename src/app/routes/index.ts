import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.router";
import { TourRoutes } from "../modules/tour/tour.router";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path:"/auth",
    route:authRoutes
  },
  {
    path:"/division",
    route:DivisionRoutes
  },
  {
    path:"/tour",
    route:TourRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
