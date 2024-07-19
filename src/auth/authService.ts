import {randomUUID} from "crypto";
import {add} from "date-fns"; 
import { UserDBModel, UserInputModel } from "../input-output-types/users-type";
import { bcryptService } from "../adapters/bcrypt";
import { sendMailService } from "../adapters/sendEmail";
import { AuthRepository } from "./authRepository";
import { WithId } from "mongodb";
import { jwtService } from "../adapters/jwtToken";
import { SessionsType } from "../input-output-types/sessions-types";

export const authService = {
    async checkCredentials(loginOrEmail: string) {
        const user = await AuthRepository.findUserByLogiOrEmail(loginOrEmail);
        if(user) {
            return user;
        } else {
            return null;
        }
    },
    async updateRefreshToken(user:WithId<UserDBModel>, deviceId: string) {// как избежать двойного создания deviceId ?
        const newPairTokens = jwtService.generateToken(user);
        //обновить iat в бд
        const {accessToken, refreshToken} = newPairTokens;
        const payload = jwtService.getUserIdByToken(refreshToken);
        const {iat} = payload;
        await AuthRepository.updateIat(iat);
        if(newPairTokens) {
            return {accessToken, refreshToken}
        } else {
            return null
        };
    },
    async registerUser(data:UserInputModel) {
 //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать ПРОВЕРКА В MIDDLEWARE
        const password = await bcryptService.createHashPassword(data.password)//создать хэш пароля
        const newUser: UserDBModel = { // сформировать dto юзера
            login: data.login,
            email: data.email,
            password,
            createdAt: new Date().toString(),
            emailConfirmation: {    // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: (add(new Date(), {hours: 1, minutes: 30,})).toISOString(),
                isConfirmed: false
            }
        };
        await AuthRepository.createUser(newUser); // сохранить юзера в базе данных
        await sendMailService.sendMail(newUser.email ,newUser.emailConfirmation.confirmationCode);
        // console.log(newUser);
        return newUser;
    },
    async confirmEmail(code: string) {
        const user: WithId<UserDBModel> | null = await AuthRepository.findUserByCode(code);
        if(!user) return false;
        if(user.emailConfirmation.isConfirmed) return false;
        if(user.emailConfirmation.confirmationCode !== code ) return false;
        if(user.emailConfirmation.expirationDate < new Date().toISOString()) return false;
            const result = await AuthRepository.updateConfirmation(user._id)
            // console.log(result);
            return result;
    },
    async resendEmail(mail: string) {
        const user: WithId<UserDBModel> | null = await AuthRepository.findUserByEmail(mail);
        if(!user) return false;
        if(user.emailConfirmation.isConfirmed) return false;
        const newCode = randomUUID();
        await  Promise.all([
        AuthRepository.updateCode(user._id.toString(), newCode),
        await sendMailService.sendMail(mail, newCode)
        ])
        // console.log(result);
        return true;
    },
    async createSession(userId: string, data: string, userAgent: string, ip: string) {
        const payload = jwtService.getUserIdByToken(data);
        const {iat, exp, device_id} = payload;
        const newSession: SessionsType = {
            user_id: userId,
            device_id: device_id,
            iat: iat,
            exp: exp,
            device_name: userAgent,
            ip: ip
        }
        await AuthRepository.createSession(newSession);
    },
    async authLogoutAndDeleteSession(deviceId: string) {
        const deletedSession = await AuthRepository.deleteSession(deviceId);
        if(deletedSession) {
            return true
                } else {
            return false
            }
    }
    // async authUserLogout(token: string) {
    //     const invalidToken = await AuthRepository.insertTokenFromDB(token);
    //     if(invalidToken) {
    //         return true
    //     } else {
    //         return false
    //     };
    // }
};
