import { ObjectId } from "mongodb";
import { blogCollection, commentCollection, postCollection } from "../db/mongo-db";
import { PostDbType, PostInputModel } from "../input-output-types/posts-type";
import { CommentDBType } from "../input-output-types/comments-type";

export class PostRepository {
    static async findBlogNameForId (id: string) {
        const newId = new ObjectId(id);
        return blogCollection.findOne({ _id: newId });
    }
    static async findPostById (id: string) {
        const newId = new ObjectId(id)
        return postCollection.findOne({_id: newId})
    }
    static async insertPost (data: PostDbType) {
        const result = postCollection.insertOne(data);
        return (await result).insertedId.toString()
    }
    static async insertComment (data: CommentDBType) {
        const result = commentCollection.insertOne(data);
        return (await result).insertedId.toString()
    }
    static async updatePost (post: PostInputModel, id: string) {
        const mongoId = new ObjectId(id);
        const result = postCollection.updateOne({_id: mongoId}, {$set: {post}})
        return (await result).modifiedCount === 1
    }
    static async deletePost (id: string) {
        const mongoId = new ObjectId(id);
        const result = await postCollection.deleteOne({_id: mongoId})
        if(result.deletedCount >= 1) {
            return true
        } else {
            return false
        }
    }
}