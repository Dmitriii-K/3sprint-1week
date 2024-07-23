import { req } from "./tests.helper";
import { userCollection, connectDB } from "../../src/db/mongo-db";
import { SETTINGS } from "../../src/settings";
import { UserInputModel} from "../../src/input-output-types/users-type";
import { codedAuth } from "../../src/middlewares/middlewareForAll";
import { user1 } from "./datasets";


describe("/blogs", () => {
    beforeAll(async () => {
    await connectDB();
    await userCollection.drop();
    });
    afterAll(async () => {
    await userCollection.drop();
});
const refreshToken1 = "";
const user = user1;
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

    it('Login user with different user-agents', async () => {
        const agents = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    
        for (const agent of agents) {
        const res = await req
            .post(SETTINGS.PATH.AUTH +'/login')
            .set('User-Agent', agent)
            .send({
            username: 'testuser',
            password: 'password123'
            });
    
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        }
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
        .set({ Authorization: "Basi " + codedAuth }) // c
        .send(newUser) // отправка данных
        .expect(401);

      // console.log(res.body)
    });

    it.skip("shouldn't create 403", async () => {
        await userCollection.drop();
        const newUser: UserInputModel = {
            login: "login",
            password: "password",
            email: "example@example.com",
        };
    

        });

    it("shouldn't create 404", async () => {
    await userCollection.drop();

    const res = await req
        .get(SETTINGS.PATH.USERS)
        .expect(404);

      // console.log(res.body)
    });

    test('Update refreshToken for device 1', async () => {
        const res = await req
        .post(SETTINGS.PATH.AUTH +"/refresh-token")
        .set('Authorization', `Bearer ${refreshToken1}`);
        expect(res.status).toBe(200);
        expect(res.body.refreshToken).toBe(refreshToken1);
    });

    it('should get the list of devices with the updated refreshToken', async () => {
        const res = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${refreshToken1}`);
        expect(res.status).toBe(200);
        expect(res.body[0].deviceId).toBe(user.devices[0].deviceId);
        expect(res.body[0].lastActiveDate).not.toBe(user.devices[0].lastActiveDate);
    });

    it('should delete device 2', async () => {
        const res = await req
        .delete(SETTINGS.PATH.SECURITY +`/devices/${user.devices[1].deviceId}`)
        .set('Authorization', `Bearer ${refreshToken1}`);
        expect(res.status).toBe(204);
    
        const devicesResponse = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${refreshToken1}`);
        expect(devicesResponse.status).toBe(200);
        expect(devicesResponse.body.every((device) => device.deviceId !== user.devices[1].deviceId)).toBe(true);
    });

    it('should logout device 3', async () => {
        const res = await req
        .post(SETTINGS.PATH.AUTH +"/logout")
        .set('Authorization', `Bearer ${refreshToken3}`);
        expect(res.status).toBe(204);
    
        const devicesResponse = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${refreshToken1}`);
        expect(devicesResponse.status).toBe(200);
        expect(devicesResponse.body.every((device) => device.deviceId !== user.devices[2].deviceId)).toBe(true);
    });

    it('should delete all remaining devices', async () => {

            const res = await req
                .delete(SETTINGS.PATH.SECURITY +`/devices/${user.deviceId}`)
                .set('Authorization', `Bearer ${refreshToken1}`);
            expect(res.status).toBe(204);
            
    
        const devicesResponse = await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${refreshToken1}`);
        expect(devicesResponse.status).toBe(200);
        expect(devicesResponse.body.length).toBe(1);
        expect(devicesResponse.body[0].deviceId).toBe(user.devices[0].deviceId);
    });
});