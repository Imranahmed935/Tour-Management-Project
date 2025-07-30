/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

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
  getAllUser
};
