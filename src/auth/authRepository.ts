import { ObjectId } from "mongodb";
import { tokenCollection, userCollection } from "../db/mongo-db";
import { UserDBModel } from "../input-output-types/users-type";

export class AuthRepository {
    static async updateCode(userId: string, newCode: string) {
        const result = await userCollection.updateOne({_id : new ObjectId(userId)}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1;
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
    static async findRefreshTokenFromDB (token: string) {
        return tokenCollection.findOne({token: token});
    }
    static async insertTokenFromDB (token: string) {
        const saveResult = await tokenCollection.insertOne({token});
        return saveResult.insertedId.toString();
    }
}