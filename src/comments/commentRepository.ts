import { commentCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";

export class CommetRepository {
    static async updateComment (id : string, content : string) {
        const mongoId = new ObjectId(id);
        const updateComment = await commentCollection.updateOne({ _id: mongoId },{$set: {content},
        });
        return updateComment.modifiedCount === 1
        
    };
    static async findUserByComment (id: string) {
        const mongoId = new ObjectId(id);
        return commentCollection.findOne({_id: mongoId});
    }
    static async deleteComment(id: string) {
        const mongoId = new ObjectId(id);
        const comment = await commentCollection.deleteOne({_id: mongoId});
        return comment.deletedCount === 1
    }
}