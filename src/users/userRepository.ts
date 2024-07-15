import { userCollection } from "../db/mongo-db";
import { UserDBModel } from "../input-output-types/users-type";
import { ObjectId } from "mongodb";

export class UserRepository {
    static async createUser (user: UserDBModel) {
        const saveResult = await userCollection.insertOne(user);
        return saveResult.insertedId.toString();
    }
    static async findUserByLogiOrEmail (data: {login: string, email:string}) {
        return userCollection.findOne({ $or: [{ login: data.login }, { email: data.email }] });
    }
    static async deleteUser (id: string) {
        const mongoId = new ObjectId(id);
        const user = await userCollection.deleteOne({_id: mongoId});
        if (user.deletedCount === 1) {
            return true;
        };
        return false;
    }
}