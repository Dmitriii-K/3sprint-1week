import { UserDBModel } from "./users-type"

declare global {
    namespace Express {
        export interface Request {
            user: WithId<UserDBModel> 
        }
    }
}

declare global {
    namespace Express {
        export interface Locals {
            user: UserDBModel 
        }
    }
}


// import { Request } from "express"
// declare global {
//     namespace Express {
//         export interface Request {
//             user: UserDBModel
//         }
//     }
// }