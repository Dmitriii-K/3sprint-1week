import { req } from "./tests.helper";
import { userCollection, connectDB } from "../../src/db/mongo-db";
import { SETTINGS } from "../../src/settings";
import { UserDBModel, UserInputModel} from "../../src/input-output-types/users-type";
import { authMiddleware, codedAuth } from "../../src/middlewares/middlewareForAll";
import { user1 } from "./datasets";


describe("/blogs", () => {
    beforeAll(async () => {
    await connectDB();
    await userCollection.drop();
    });
    afterAll(async () => {
    await userCollection.drop();
});

    it("should create", async () => {
      // зачищаем базу данных
    await userCollection.drop();
    const newUser: UserInputModel = {
        login: "login",
        password: "password",
        email: "example@example.com",
    };

    const res = await req
        .post(SETTINGS.PATH.USERS)
        .set({ Authorization: "Basic " + codedAuth })
        .send(newUser) // отправка данных
        .expect(201);

      // console.log(res.body)

    expect(res.body.login).toEqual(newUser.login);
    expect(res.body.password).toEqual(newUser.password);
    expect(res.body.email).toEqual(newUser.email);
    expect(typeof res.body.id).toEqual("string");
    });

    it("shouldn't create 401", async () => {
    await userCollection.drop();
    const newUser: UserInputModel = {
        login: "login",
        password: "password",
        email: "example@example.com",
    };

    const res = await req
        .post(SETTINGS.PATH.USERS)
        .send(newUser) // отправка данных
        .expect(401);

      // console.log(res.body)
    });

    it("should get empty array", async () => {
      await userCollection.drop(); // очистка базы данных если нужно

      const res = await req.get(SETTINGS.PATH.USERS).expect(200); // проверяем наличие эндпоинта

    expect(res.body.length).toEqual(0);
      // console.log(res.body) // можно посмотреть ответ эндпоинта
    });

    it("should get not empty array", async () => {
      await userCollection.insertOne(user1); // заполнение базы данных начальными данными если нужно

    const res = await req.get(SETTINGS.PATH.USERS).expect(200);

      // console.log(res.body)

    expect(res.body.length).toEqual(1);
    });

    it("shouldn delete", async () => {
    await userCollection.insertOne(user1);

      const res = await req.get(SETTINGS.PATH.USERS + "/1").expect(404); // проверка на ошибку
      // console.log(res.body)
    });

    it("shouldn't delete", async () => {
    await userCollection.insertOne(user1);

      const res = await req.get(SETTINGS.PATH.USERS + "/1").expect(404); // проверка на ошибку
      // console.log(res.body)
    })
});