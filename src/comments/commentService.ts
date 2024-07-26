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
        const succsesUpdate = await CommetRepository.updateComment(id, content);
        if(succsesUpdate === true) {
            return succsesUpdate
        } else {
            return false
        }
        }
    static async deleteComment (id: string) {
        const deleteComment = await CommetRepository.deleteComment(id);
        if (deleteComment) {
            return true;
        } else {
            return null;
        }
    }
}