import { ObjectId } from "mongodb";
import { blogCollection, postCollection } from "../db/mongo-db";
import { BlogDbType, BlogInputModel } from "../input-output-types/blogs-type";
import { PostDbType } from "../input-output-types/posts-type";

export class BlogRepository {
    static async insertBlog (data: BlogDbType) {
        const result = blogCollection.insertOne(data);
        return (await result).insertedId.toString()
    }
    static async insertPostForBlog (data: PostDbType) {
        const result = postCollection.insertOne(data);
        return (await result).insertedId.toString()
    }
    static async findBlogById (id: string) {
        const mongoId = new ObjectId(id)
        return blogCollection.findOne({_id: mongoId})
    }
    static async updateBlog (id: string, updateContent: BlogInputModel) {
        const mongoId = new ObjectId(id)
        const updateResult = await blogCollection.updateOne({_id: mongoId}, {$set: {updateContent}})
        return updateResult.modifiedCount === 1
    }
    static async deleteBlog (id: string) {
        const mongoId = new ObjectId(id)
        const result = await blogCollection.deleteOne({_id: mongoId})
        return result.deletedCount === 1
    }
}