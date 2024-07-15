import { userCollection } from "../db/mongo-db";
import { PaginatorUserViewModel, TypeUserPagination, UserDBModel, UserViewModel } from "../input-output-types/users-type";
import { ObjectId, WithId } from "mongodb";
import { userPagination } from "../middlewares/middlewareForAll";

export class UserQueryRepository {
    static async findUserById (id: string) {
        const mongoId = new ObjectId(id);
        const user = await userCollection.findOne({_id: mongoId});
        if (!user) {
            return null;
        };
        return UserQueryRepository.mapUser(user);
    };
    static async findUsers(sortData: TypeUserPagination) {
        const queryParams = userPagination(sortData);
        const searchEmail = sortData.searchEmailTerm
        ? { email: { $regex: sortData.searchEmailTerm, $options: "i" } }
        : {};
        const searchLogin = sortData.searchLoginTerm
        ? { login: { $regex: sortData.searchLoginTerm, $options: "i" } }
        : {};

        const filter = { $or: [searchLogin, searchEmail]}
        const items: WithId<UserDBModel>[] = await userCollection
            .find(filter)
            .sort(queryParams.sortBy, queryParams.sortDirection)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();
        const totalCount = await userCollection.countDocuments(filter);
        const newUser: PaginatorUserViewModel = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(UserQueryRepository.mapUser),
        };
        return newUser;
    };
    static mapUser (user: WithId<UserDBModel>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    };
}