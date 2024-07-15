import { ObjectId, WithId } from "mongodb";
import { commentCollection } from "../db/mongo-db";
import { CommentDBType, CommentViewModel } from "../input-output-types/comments-type";

export class CommentQueryRepository {
    static async findCommentById (id: string) {
        const mongoId = new ObjectId(id);
        const comment = await commentCollection.findOne({_id: mongoId});
        if (!comment) {
            return null;
        };
        return CommentQueryRepository.mapComment(comment);
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