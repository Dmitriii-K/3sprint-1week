import { ObjectId, WithId } from "mongodb";
import { CommentDBType, CommentViewModel, PaginatorCommentViewModelDB } from "../input-output-types/comments-type";
import { PaginatorPostViewModel, PostDbType, PostViewModel, TypePostHalper } from "../input-output-types/posts-type";
import { commentCollection, postCollection } from "../db/mongo-db";
import { halper, commentsPagination } from "../middlewares/middlewareForAll";

export class PostQueryRepository {
    static async getAllPosts (helper: TypePostHalper) {
        const queryParams = halper(helper);
        const items: WithId<PostDbType>[] = (await postCollection
            .find({})
            .sort(queryParams.sortBy, queryParams.sortDirection)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray());
        const totalCount = await postCollection.countDocuments({});
        const posts: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(PostQueryRepository.mapPost),
        };
        return posts
    };
    static async findPostById (id: string) {
        const mongoId = new ObjectId(id);
        const post = await postCollection.findOne({_id: mongoId});
        if (!post) {
            return null;
        };
        return PostQueryRepository.mapPost(post);
    };
    static async findCommentById (id: string) {
        const mongoId = new ObjectId(id);
        const comment = await commentCollection.findOne({_id: mongoId});
        if (!comment) {
            return null;
        };
        return PostQueryRepository.mapComment(comment);
    };
    static async findCommentByPost (helper: TypePostHalper, id: string) {
        const queryParams = commentsPagination(helper);
            const items: WithId<CommentDBType>[] = await commentCollection
            .find({ postId: id })
            .sort(queryParams.sortBy, queryParams.sortDirection)
              .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();
            const totalCount = await commentCollection.countDocuments({ postId: id });
            const comments: PaginatorCommentViewModelDB = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(PostQueryRepository.mapComment),
            };
            return comments
    };
    static mapPost = (post: WithId<PostDbType>): PostViewModel => {
        return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        };
    };
    static mapComment = (comment: WithId<CommentDBType>): CommentViewModel => {
        return {
            id: comment._id.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
        };
    };
}
