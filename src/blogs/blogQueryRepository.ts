import { WithId } from "mongodb";
import { BlogDbType, BlogViewModel } from "../input-output-types/blogs-type";

export class BlogQueryRepository {
    static getAllBlogs () {}
    static getBlogById () {}
    static getPostForBlog () {}
    static blogsMap (blog: WithId<BlogDbType>): BlogViewModel {
        return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
        };
    }
};