import { BlogDbType, BlogInputModel } from "../input-output-types/blogs-type";
import { BlogPostInputModel } from "../input-output-types/eny-type";
import { PostDbType } from "../input-output-types/posts-type";
import { BlogRepository } from "./blogRepository";

export class BlogSessions {
    static async createBlog (data: BlogInputModel) {
        const createDate = new Date().toISOString();
        const newBlog: BlogDbType = {
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: createDate,
            isMembership: false,
        };
        return BlogRepository.insertBlog(newBlog);
    }
    static async createPostForBlog (blogId: string, data: BlogPostInputModel, name: string) {
        const createDate = new Date().toISOString();
        const newPost: PostDbType = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: blogId,
            blogName: name,
            createdAt: createDate,
        };
        return BlogRepository.insertPostForBlog(newPost)
    }
    static async findBlogById (id: string) {
        const blog = await BlogRepository.findBlogById(id)
        if(!blog) {
            return null
        } else {
            return blog
        }
    }
    static async updateBlog (id: string, updateContent: BlogInputModel) {
        const updateResult = await BlogRepository.updateBlog(id, updateContent)
        if(updateResult) {
            return updateResult
        } else {
            return false
        }
    }
    static async deleteBlog (id: string) {
        const deleteResult = await BlogRepository.deleteBlog(id)
        if (deleteResult) {
            return true;
        } else {
            return null;
        }
    }
}