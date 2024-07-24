// it.skip('Update refreshToken for device 1', async () => {
//     const res = await req
//     .post(SETTINGS.PATH.AUTH +"/refresh-token")
//     .set('Authorization', `Bearer ${refreshToken}`);
//     expect(res.status).toBe(200);
//     expect(res.headers['set-cookie']).toBe(refreshToken);
// });

// it.skip('should get the list of devices with the updated refreshToken', async () => {
//     const res = await req
//     .get(SETTINGS.PATH.SECURITY +"/devices")
//     .set('Authorization', `Bearer ${refreshToken}`);
//     expect(res.status).toBe(200);
// });

// it.skip('should delete device 2', async () => {
//     const res = await req
//     .delete(SETTINGS.PATH.SECURITY +`/devices/${session.devices[1].deviceId}`)
//     .set('Authorization', `Bearer ${refreshToken}`);
//     expect(res.status).toBe(204);

//     const devicesResponse = await req
//     .get(SETTINGS.PATH.SECURITY +"/devices")
//     .set('Authorization', `Bearer ${refreshToken}`);
//     expect(devicesResponse.status).toBe(200);
// });

// it.skip('should logout device 3', async () => {
//     const res = await req
//     .post(SETTINGS.PATH.AUTH +"/logout")
//     .set('Authorization', `Bearer ${refreshToken}`);
//     expect(res.status).toBe(204);

//     const devicesResponse = await req
//     .get(SETTINGS.PATH.SECURITY +"/devices")
//     .set('Authorization', `Bearer ${refreshToken}`);
//     expect(devicesResponse.status).toBe(200);
// });

// it.skip('should delete all remaining devices', async () => {

//         const res = await req
//             .delete(SETTINGS.PATH.SECURITY +`/devices/${session.deviceId}`)
//             .set('Authorization', `Bearer ${refreshToken}`);
//         expect(res.status).toBe(204);
        

//     const devicesResponse = await req
//     .get(SETTINGS.PATH.SECURITY +"/devices")
//     .set('Authorization', `Bearer ${refreshToken}`);
//     expect(devicesResponse.status).toBe(200);
//     expect(devicesResponse.body.length).toBe(1);
// });