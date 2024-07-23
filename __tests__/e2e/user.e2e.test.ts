import { req } from "./tests.helper";
import { userCollection, sessionsCollection, connectDB } from "../../src/db/mongo-db";
import { SETTINGS } from "../../src/settings";
import { UserInputModel} from "../../src/input-output-types/users-type";
import { SessionsType } from "../../src/input-output-types/sessions-types";
import { DeviceViewModel } from "../../src/input-output-types/device-type";
import { codedAuth } from "../../src/middlewares/middlewareForAll";
import { user1 } from "./datasets";

// Определяем глобальную переменную
// global.refreshToken = null;

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
    expect(res.body.password).toEqual(newUser.password);
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
        expect(res.statusCode).toEqual(204);
    });

    it('should login a user', async () => {
        const res = await req
        .post(SETTINGS.PATH.AUTH +"/login")
        .send({
            loginOrEmail: "login123",
            password: "password",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('refreshToken');
        const refreshToken = res.body.refreshToken;
        // global.refreshToken = res.body.refreshToken;
        SETTINGS.REFRESH_TOKEN = refreshToken; // Достаем и сохраняем refresh token
        console.log(refreshToken); // проверяем токен
    });

    it('should use the saved refresh token', () => {
        const refreshToken = SETTINGS.REFRESH_TOKEN;
        expect(refreshToken).toBeDefined();
        console.log('Using Refresh Token:', refreshToken);
        // Ваш код, использующий refreshToken
    });
    it('should get all sessions', async () => {
        const res = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        // .set('Authorization', `Bearer ${global.refreshToken}`);
        expect(res.statusCode).toEqual(200);
        console.log(res.body); // Логируем ответ при запросе сессий
    });
    it.skip('Login user with different user-agents', async () => {
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
        expect(res.body).toHaveProperty('refreshToken');
        }
    });

    it.skip("shouldn't create 401", async () => {
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

    it.skip("shouldn't create 403", async () => { // если пытаться удалить deviceId другого пользователя
        const res = await req
        .delete(SETTINGS.PATH.SECURITY +"/devices/1")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(res.status).toBe(403);
        });

    it.skip("shouldn't create 404", async () => {
    const res = await req
        .delete(SETTINGS.PATH.USERS +"/1")
        expect(res.status).toBe(404);
      // console.log(res.body)
    });

    it.skip('Update refreshToken for device 1', async () => {
        const res = await req
        .post(SETTINGS.PATH.AUTH +"/refresh-token")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(res.status).toBe(200);
        expect(res.body.refreshToken).toBe(SETTINGS.REFRESH_TOKEN);
    });

    it.skip('should get the list of devices with the updated refreshToken', async () => {
        const res = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(res.status).toBe(200);
        expect(res.body[0].deviceId).toBe(session.devices[0].deviceId);
        expect(res.body[0].lastActiveDate).not.toBe(session.devices[0].lastActiveDate);
    });

    it.skip('should delete device 2', async () => {
        const res = await req
        .delete(SETTINGS.PATH.SECURITY +`/devices/${session.devices[1].deviceId}`)
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(res.status).toBe(204);
    
        const devicesResponse = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(devicesResponse.status).toBe(200);
        expect(devicesResponse.body.every((session) => session.deviceId !== session.devices[1].deviceId)).toBe(true);
    });

    it.skip('should logout device 3', async () => {
        const res = await req
        .post(SETTINGS.PATH.AUTH +"/logout")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(res.status).toBe(204);
    
        const devicesResponse = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(devicesResponse.status).toBe(200);
        expect(devicesResponse.body.every((session) => session.deviceId !== session.devices[2].deviceId)).toBe(true);
    });

    it.skip('should delete all remaining devices', async () => {

            const res = await req
                .delete(SETTINGS.PATH.SECURITY +`/devices/${session.deviceId}`)
                .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
            expect(res.status).toBe(204);
            
    
        const devicesResponse = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${SETTINGS.REFRESH_TOKEN}`);
        expect(devicesResponse.status).toBe(200);
        expect(devicesResponse.body.length).toBe(1);
        expect(devicesResponse.body[0].deviceId).toBe(session.devices[0].deviceId);
    });
});