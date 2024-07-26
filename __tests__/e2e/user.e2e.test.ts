import { req } from "./tests.helper";
import { userCollection, connectDB } from "../../src/db/mongo-db";
import { SETTINGS } from "../../src/settings";
import { UserInputModel} from "../../src/input-output-types/users-type";
import { codedAuth } from "../../src/middlewares/middlewareForAll";
import { user1 } from "./datasets";

// Определяем глобальную переменную
// global.refreshToken = null;
let refreshToken: any;
describe('E2E Tests', () => {
    const user = user1;
    // const session: DeviceViewModel = [];

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
        login: "login123",
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
    expect(res.body.email).toEqual(newUser.email);
    expect(typeof res.body.id).toEqual("string");
    });

    it('should register a user', async () => {
        const res = await req
        .post(SETTINGS.PATH.AUTH +"/registration")
        .send({
            login: "login123",
            password: "password",
            email: "example@example.com",
        });
        expect(204);
    });

    it('should login a user', async () => {
        const res = await req
        .post(SETTINGS.PATH.AUTH +"/login")
        .send({
            loginOrEmail: "login123",
            password: "password",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.headers['set-cookie']).toBeDefined();
        const cookies = res.headers['set-cookie'];
        if (!cookies || !Array.isArray(cookies)) {
            console.error('No cookies found or cookies are not an array');
            return;
        }
        cookies.forEach(cookie => {
            const [name, value] = cookie.split(';')[0].split('=');
            if (name === 'refreshToken') {
                refreshToken = value;
            }
        })
        expect(refreshToken).toBeDefined();
        // console.log('Refresh Token:', refreshToken);
    });
    it('should use the saved refresh token', () => {
        // const refreshToken = SETTINGS.REFRESH_TOKEN;
        expect(refreshToken).toBeDefined();
        console.log('Using Refresh Token:', refreshToken);
    });
    it('should get all sessions', async () => {
        const res = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${refreshToken}`);
        // .set('Authorization', `Bearer ${global.refreshToken}`);
        expect(200);
        // console.log(res.body); // Логируем ответ при запросе сессий
    });
    it('Login user with different user-agents', async () => {
        // for (let i = 0; i < 4; i++) {
        //     const res = await req
        //         .post(SETTINGS.PATH.AUTH +'/login')
        //         .set('User-Agent', `TestAgent${i}`)
        //         .send({
        //             loginOrEmail: "login123",
        //             password: "password",
        //         });
        // };

        const agents = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    
        for (const agent of agents) {
        const res = await req
            .post(SETTINGS.PATH.AUTH +'/login')
            .set('User-Agent', agent)
            .send({
                loginOrEmail: "login123",
                password: "password",
            });
    
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.headers['set-cookie']).toBeDefined();

        const cookies = res.headers['set-cookie'];
                if (!cookies || !Array.isArray(cookies)) {
            console.error('No cookies found or cookies are not an array');
            return;
        }
        expect(cookies.some(cookie => cookie.includes('refreshToken'))).toBe(true);
        }
    });
    it("shouldn't create 401", async () => {
        const newUser: UserInputModel = {
            login: "login",
            password: "password",
            email: "example@example.com",
        };
        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set({ Authorization: "Basi " + codedAuth }) // c
            .send(newUser) // отправка данных
            expect(res.status).toBe(401);
          // console.log(res.body)
        });
    it("shouldn't create 403", async () => { // если пытаться удалить deviceId другого пользователя
            const res = await req
            .delete(SETTINGS.PATH.SECURITY +"/devices/1")
            .set('Authorization', `Bearer ${refreshToken}`);
            expect(403);
    });
    
    it("shouldn't create 404", async () => {
        const res = await req
            .delete(SETTINGS.PATH.USERS +"/1")
            expect(404);
          // console.log(res.body)
    });
});