import { WithId } from "mongodb";
import { CommentDBType, CommentInputModel } from "../input-output-types/comments-type";
import { PostDbType, PostInputModel, PostViewModel } from "../input-output-types/posts-type";
import { UserDBModel } from "../input-output-types/users-type";
import { PostRepository } from "./postsRepository";

export class PostService {
    static async createPost (data: PostInputModel, id: string) {
        const findBlogNameForId = await PostRepository.findBlogNameForId(id)
        const createDate = new Date().toISOString();
        const newPost: PostDbType = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: findBlogNameForId!.name,
            createdAt: createDate,
        };
        return PostRepository.insertPost(newPost);
        // if (newPostDB) {
        //     const mapPostDB: PostViewModel = {
        //     title: data.title,
        //     shortDescription: data.shortDescription,
        //     content: data.content,
        //     blogId: data.blogId,
        //     blogName: findBlogNameForId!.name,
        //     createdAt: createDate,
        //     id: newPostDB.insertedId.toString(),
        //     }
        }
    static async createCommentByPost (paramId: string, data: CommentInputModel, user: WithId<UserDBModel>) {
        const post = await PostRepository.findPostById(paramId);
        const createDate = new Date().toISOString();
        const newComment: CommentDBType = {
            postId: paramId,
            content: data.content,
            createdAt:	createDate,
            commentatorInfo: { 
                userId:	user._id.toString(),
                userLogin: user.login,
            },
        };
        return PostRepository.insertComment(newComment)
    }
    static async updatePost (data: PostInputModel, id: string) {
        const succsesUpdate = await PostRepository.updatePost(data, id)
        if(succsesUpdate) {
            return succsesUpdate
        } else {
            return false
        }
    }
    static async deletePost (id: string) {
        const result = await PostRepository.deletePost(id)
        if(result) {
            return true
                } else {
            return false
            }
    }
}