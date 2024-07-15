import { SETTINGS } from "../settings";
import { PostDbType} from "../input-output-types/posts-type";
import { CommentDBType } from "../input-output-types/comments-type";
import { BlogDbType } from "../input-output-types/blogs-type";
import { UserDBModel } from "../input-output-types/users-type";
import { Collection, Db, MongoClient } from "mongodb";
import { tokenType } from "../input-output-types/eny-type";

// получение доступа к бд
let client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
export let db: Db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export let blogCollection: Collection<BlogDbType> = db.collection<BlogDbType>(
  SETTINGS.BLOG_COLLECTION_NAME
);
export let postCollection: Collection<PostDbType> = db.collection<PostDbType>(
  SETTINGS.POST_COLLECTION_NAME
);
export let userCollection: Collection<UserDBModel> = db.collection<UserDBModel>(
  SETTINGS.USER_COLLECTION_NAME
);
export let commentCollection: Collection<CommentDBType> = db.collection<CommentDBType>(
  SETTINGS.COMMENT_COLLECTION_NAME
);
export let tokenCollection: Collection<tokenType> = db.collection<tokenType>(
  SETTINGS.TOKENS_COLLECTION_NAME
);

// проверка подключения к бд
export const connectDB = async () => {
  try {
    client = new MongoClient(SETTINGS.MONGO_URL);
    db = client.db(SETTINGS.DB_NAME);

    postCollection = db.collection(SETTINGS.POST_COLLECTION_NAME);
    blogCollection = db.collection(SETTINGS.BLOG_COLLECTION_NAME);
    userCollection = db.collection(SETTINGS.USER_COLLECTION_NAME);
    commentCollection = db.collection(SETTINGS.COMMENT_COLLECTION_NAME);
    tokenCollection = db.collection(SETTINGS.TOKENS_COLLECTION_NAME);

    await client.connect();
    console.log("connected to db");
    return true;
  } catch (e) {
    console.log(e);
    await client.close();
    return false;
  }
};