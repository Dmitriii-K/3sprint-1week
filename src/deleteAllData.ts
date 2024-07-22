import { Request, Response } from "express";
import { Router } from "express";
import { blogCollection, postCollection, userCollection, commentCollection,/*, tokenCollection, apiCollection */
apiCollection,
sessionsCollection} from "./db/mongo-db";

export const deleteRouter = Router();

deleteRouter.delete("/all-data", async (req: Request, res: Response) => {
  await postCollection.drop();
  await blogCollection.drop();
  await userCollection.drop();
  await commentCollection.drop();
  await apiCollection.drop();
  await sessionsCollection.drop();
  // await tokenCollection.drop();
  res.sendStatus(204);
  console.log("All data is deleted");
});
