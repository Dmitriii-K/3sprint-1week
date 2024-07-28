import { ObjectId, WithId } from "mongodb";
import { BlogDbType, BlogViewModel, TypeBlogHalper, TypePostForBlogHalper } from "../input-output-types/blogs-type";
import { blogCollection, postCollection } from "../db/mongo-db";
import { PostQueryRepository } from "../posts/postsQueryRepository";
import { halper } from "../middlewares/middlewareForAll";
import { PostDbType } from "../input-output-types/posts-type";

export class BlogQueryRepository {
    static async getAllBlogs (helper: TypeBlogHalper) {
        const queryParams = halper(helper);
        const search = helper.searchNameTerm
        ? { name: { $regex: helper.searchNameTerm, $options: "i" } }
        : {};
        const items: WithId<BlogDbType>[] = await blogCollection
            .find(search)
            .sort(queryParams.sortBy, queryParams.sortDirection)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();
        const totalCount = await blogCollection.countDocuments(search);
        const blogs = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(BlogQueryRepository.blogMap),
        };
        return blogs
    }
    static async getBlogById (id: string) {
        const mongoId = new ObjectId(id)
        const blog =  await blogCollection.findOne({_id: mongoId});
        if (!blog) {
            return null;
        };
        return BlogQueryRepository.blogMap(blog);
    }
    static async getPostForBlogById (id: string) {
        const mongoId = new ObjectId(id)
        const post =  await postCollection.findOne({_id: mongoId});
        if (!post) {
            return null;
        };
        return PostQueryRepository.mapPost(post)
    }
    static async getPostFofBlog (helper: TypePostForBlogHalper, id: string) {
        const queryParams = halper(helper);
        const items: WithId<PostDbType>[] = await postCollection
            .find({ blogId: id })
            .sort(queryParams.sortBy, queryParams.sortDirection)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();
        const totalCount = await postCollection.countDocuments({ blogId: id });
        const posts = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(PostQueryRepository.mapPost),
        };
        return posts
    }
    static blogMap (blog: WithId<BlogDbType>): BlogViewModel {
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