import { UserDBModel, UserInputModel } from "../input-output-types/users-type";
import { UserRepository } from "./userRepository";
import { bcryptService } from "../adapters/bcrypt";

export class UserService {
    static async createUser (data:UserInputModel) {
        const userExist = await UserRepository.findUserByLogiOrEmail({login: data.login, email: data.email});
        if (userExist) {
            return false;
        };
        const userPassword = await bcryptService.createHashPassword(data.password);

        const createDate = new Date().toISOString();
        const newUser: UserDBModel = {
        login: data.login,
        password: userPassword,
        email: data.email,
        createdAt: createDate,
        emailConfirmation: {
            confirmationCode: "",
            expirationDate: "",
            isConfirmed: true
        }
        };
    return UserRepository.createUser(newUser);
    }
}