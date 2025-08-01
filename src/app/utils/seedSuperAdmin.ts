import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

// export const seedSuperAdmin = async() =>{
//     try {
//         const SuperAdminExist =await User.findOne({email:envVars.SUPER_ADMIN_EMAIL})

//         if(SuperAdminExist){
//             console.log("Super Admin Already exist!")
//             return;
//         }

//         console.log("trying to create super admin")

//         const authProvider:IAuthProvider ={
//             provider:"credentials",
//             providerId:envVars.SUPER_ADMIN_EMAIL
//         }

//         const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASS, Number(envVars.BCRYPT_SALT_ROUND))
//         const payload:IUser = {
//             name:'super admin',
//             role:Role.SUPER_ADMIN,
//             email:envVars.SUPER_ADMIN_EMAIL,
//             password:hashedPassword,
//             isVerified:true,
//             auths:[authProvider]
//         }

//         const superAdmin = await User.create(payload)
//         console.log("super admin created successfull")
//         console.log(superAdmin)
//     } catch (error) {
//         console.log(error)
//     }
// }

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super admin already exist!");
      return;
    }
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };
    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASS,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("super admin created successfully");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
