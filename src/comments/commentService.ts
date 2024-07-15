import { CommetRepository } from "./commentRepository";


// export class CommentService {
//     static async updateComment (id: string, content: string) {
//         const findComment = await CommetRepository.findUserByComment(id)
//         if (!findComment) {
//         return null;
//         } else {
//         if (req.user._id.toString() !== findComment.commentatorInfo.userId.toString()) {
//             return false;  
//         }
//         const succsesUpdate = await CommetRepository.updateComment(id, content);
//         if(succsesUpdate) {
//             return true;
//         }
//         }
//         return;
//     };

//     static async deleteComment (id: string) {
//         const findUserById = await CommetRepository.findUserByComment(id);
//         if(!findUserById) {
//         return false;
//         }
//         const deleteComment = await CommetRepository.deleteComment(id);
//         if (deleteComment) {
//         return true;
//         } else {
//         return null;
//         }
//     }
// }