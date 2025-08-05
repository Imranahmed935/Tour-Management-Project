import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import httpStatus from "http-status-codes";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "no token here");
      }

      // const verifiedToken = jwt.verify(accessToken, "secret");
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload;

      const existEmail = await User.findOne({ email: verifiedToken.email });
      if (!existEmail) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist!");
      }

      if (
        existEmail.isActive === IsActive.BLOCKED ||
        existEmail.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${existEmail.isActive}`
        );
      }
      if (existEmail.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
      }
      // if (!verifiedToken) {
      //   throw new AppError(403, "you are not authorized");
      // }
      req.user = verifiedToken;
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
