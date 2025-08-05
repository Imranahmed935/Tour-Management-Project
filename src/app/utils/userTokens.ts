import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes"

export const createUserTokens = (user:Partial<IUser>)=>{
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };
    
      const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRED);
      const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)
    return {
        accessToken,
        refreshToken
    }
}

export const createAccessTokenWithRefreshToken = async(refreshToken:string)=>{
const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload
  const existEmail = await User.findOne({ email:verifiedRefreshToken.email });
  if (!existEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist!");
  }

  if(existEmail.isActive === IsActive.BLOCKED || existEmail.isActive === IsActive.INACTIVE){
     throw new AppError(httpStatus.BAD_REQUEST, `User is ${existEmail.isActive}`);
  }
  if(existEmail.isDeleted){
     throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }


  const jwtPayload = {
    userId: existEmail._id,
    email: existEmail.email,
    role: existEmail.role,
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRED);
  return accessToken;
}
