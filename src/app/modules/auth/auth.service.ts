import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const existEmail = await User.findOne({ email });

  if (!existEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not Exist!");
  }
  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    existEmail.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!");
  }

  const jwtPayload = {
    userId: existEmail._id,
    email: existEmail.email,
    role: existEmail.role,
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRED)

//   const accessToken = jwt.sign(jwtPayload, "secret", {
//     expiresIn: "1d",
//   });
  
  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
