import { ObjectId } from "mongodb";
import { /*tokenCollection,*/ apiCollection, sessionsCollection, userCollection } from "../db/mongo-db";
import { UserDBModel } from "../input-output-types/users-type";
import { SessionsType } from "../input-output-types/sessions-types";

export class AuthRepository {
    static async updateCode(userId: string, newCode: string) {
        const result = await userCollection.updateOne({_id : new ObjectId(userId)}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1;
    }
    static async checkUserByRegistration (login: string, email: string) {
        return userCollection.findOne({ $or: [{ login: login }, { email: email }] });
    }
    static async findUserByLogiOrEmail (loginOrEmail: string) {
        return userCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
    }
    static async createUser (user: UserDBModel) {
        const saveResult = await userCollection.insertOne(user);
        return saveResult.insertedId.toString();
    }
    static async findUserByCode (code: string) {
        return userCollection.findOne({"emailConfirmation.confirmationCode": code});
    }
    static async findUserByEmail (mail: string) {
        return userCollection.findOne({email: mail});
    }
    static async resendMail (mail: string) {
        return userCollection.findOne({email: mail});
    }
    static async updateConfirmation (_id: ObjectId) {
        const result = await userCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1;
    }
    static async createSession (session: SessionsType) {
        const saveResult = await sessionsCollection.insertOne(session);
        return saveResult.insertedId.toString();
    }
    static async findSessionFromDeviceId (deviceId: string) {
        return sessionsCollection.findOne({device_id: deviceId})
    }
    static async updateIat (iat: string,deviceId: string) {
        return sessionsCollection.updateOne({device_id: deviceId}, { $set: { iat: iat }})
    }
    static async deleteSession (deviceId: string) {
        const result = await sessionsCollection.deleteOne({device_id: deviceId});
        if(result.deletedCount === 1) {
            return true
        } else {
            return false
        } 
    }
    // static async dataRecording (ip: string, url: string, currentDate: Date) {
    //     const result = await apiCollection.insertOne({ip: ip, URL: url, date: currentDate})
    //     return result.insertedId.toString()
    // }
    // static async countingNumberRequests (filterDocument: ) {
    //     return apiCollection.countDocuments(filterDocument)
    // }
    // static async findRefreshTokenFromDB (token: string) {
    //     return tokenCollection.findOne({token: token});
    // }
    // static async insertTokenFromDB (token: string) {
    //     const saveResult = await tokenCollection.insertOne({token});
    //     return saveResult.insertedId.toString();
    // }
}