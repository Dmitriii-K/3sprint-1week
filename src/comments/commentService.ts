import { CommetRepository } from "./commentRepository";

export class CommentService {
    static async findUserByComment (id: string) {
        const user = await CommetRepository.findUserByComment(id)
        if(!user) {
            return null
        } else {
            return user
        }
    }
    static async updateComment (id: string, content: string) {
        const updateResult = await CommetRepository.updateComment(id, content);
        if(updateResult) {
            return updateResult
        } else {
            return false
        }
    }
    static async deleteComment (id: string) {
        const deleteResult = await CommetRepository.deleteComment(id);
        if (deleteResult) {
            return true;
        } else {
            return null;
        }
    }
}