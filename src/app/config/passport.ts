/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        // if (!isUserExist) {
        //   return done(null, false, { message: "User does not exist" });
        // }

        if (!isUserExist) {
                return done("User does not exist")
            }

            if (!isUserExist.isVerified) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
                return done("User is not verified")
            }

            if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                return done(`User is ${isUserExist.isActive}`)
            }
            if (isUserExist.isDeleted) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
                return done("User is deleted")
            }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (googleAuthenticated) => googleAuthenticated.provider == "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "you have authenticated through google, if you want to login setup a password",
          });
        }

        const isPasswordMatch = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: "Password does not match!" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          done(null, false, { message: "No email found!" });
        }
        let user = await User.findOne({ email });

        // let isUserExist = await User.findOne({ email })
                if (user && !user.isVerified) {
                    // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
                    // done("User is not verified")
                    return done(null, false, { message: "User is not verified" })
                }

                if (user && (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE)) {
                    // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                    done(`User is ${user.isActive}`)
                }

                if (user && user.isDeleted) {
                    return done(null, false, { message: "User is deleted" })
                    // done("User is deleted")
                }

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log("google stretagy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
