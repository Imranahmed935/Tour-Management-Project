/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);
    sendResponse(res, {
        success:true,
        statusCode:httpStatus.CREATED,
        message:"user created successfully",
        data:user
    });
  }
);

const updatedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_SECRET)as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload);
    sendResponse(res, {
        success:true,
        statusCode:httpStatus.CREATED,
        message:"user Updated successfully",
        data:user
    });
  }
);

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const decodedToken = req.user as JwtPayload
    const myProfile = await userServices.getMe(decodedToken.userId);
    res.status(httpStatus.OK).json({
        success:true,
        message:"user profile retrived successfully",
        data:myProfile
    })
})
const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const allUser = await userServices.getAllUser();
    res.status(httpStatus.OK).json({
        success:true,
        message:"all user retrived successfully",
        data:allUser
    })
})

export const userControllers = {
  createUser,
  getAllUser,
  updatedUser,
  getMe
};
