import { authService } from '../../src/auth/authService';
import { AuthRepository } from '../../src/auth/authRepository';
import { sendMailService } from '../../src/adapters/sendEmail';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

describe('UNIT', () => {
//     let client : MongoClient
//     beforeAll(async () => {
//         const mongoServer = await MongoMemoryServer.create();
//         const mongoUri = mongoServer.getUri();
//           // Подключите базу данных к Вашему приложению
//         client = new MongoClient(mongoUri);
//         await client.connect();
//         });
//     afterAll(async () => {
//         await client.close()
//         //return done()
//     }
// );
    // beforeAll(async () => {
    //     await connectDB();
    //     await userCollection.drop();
    // });
    // afterAll(async () => {
    //     await userCollection.drop();
    // });
    
    describe('checkCredentials user', () => {
        const checkCredention = authService.checkCredentials;

        it('should return user if email or login is valid', async () => {
            AuthRepository.findUserByLogiOrEmail = jest.fn().mockImplementation((user: string)=> true)
            const result = await checkCredention('testemail@gmail.com');
            expect(result).toBeTruthy();
        });
        it('should return null if user is not found', async () => {
            AuthRepository.findUserByLogiOrEmail = jest.fn().mockImplementation((user: string)=> null)
            const result = await authService.checkCredentials('nonexistentuser@example.com');
            expect(result).toBeNull();
        });
    });

    describe('registerUser', () => {
        const registrationUser = authService.registerUser;
        // bcryptService.createHashPassword = jest.fn().mockImplementation((pass: string) => {hashPpass: "password"});
        AuthRepository.createUser = jest.fn().mockImplementation((newUser:string) => undefined);
        sendMailService.sendMail = jest.fn().mockImplementation((email: string, confirmationCode: string) => true);

        it('should register a new user successfully', async () => {
            const newUser = {
                login: "login",
                password: "password",
                email: "testemail@gmail.com",
                createdAt: new Date().toString(),
                emailConfirmation: {
                    confirmationCode: randomUUID(),
                    expirationDate: add(new Date(), {
                        minutes: 30,
                    }),
                    isConfirmed: false,
                }
            }
            const user = await registrationUser(newUser);
            expect(user).toBeDefined();
            expect(user.login).toEqual(newUser.login);
            expect(user.email).toBe(newUser.email);
            expect(user.emailConfirmation.isConfirmed).toBeFalsy();
            expect(sendMailService.sendMail).toBeCalled();
        });
    });

    describe('confirmEmail', () => {
        const confirmEmail = authService.confirmEmail;

        it('should confirm email with valid confirmation code', async () => {
            const validCode = 'validconfirmationcode';
            const user = {
                emailConfirmation : {
                    isConfirmed: false,
                    confirmationCode: validCode,
                    expirationDate: new Date()
                }
            }
            AuthRepository.findUserByCode = jest.fn().mockImplementation((code: string) => user);
            AuthRepository.updateConfirmation = jest.fn().mockImplementation((_id: ObjectId) => true);

            const result = await confirmEmail(validCode);
            expect(result).toBeTruthy();
        });

        it('should return invalid inform if user not found in db by code', async () => {
            AuthRepository.findUserByCode = jest.fn().mockImplementation((code: string) => null);
            const invalidCode = '~invalid6 confirmation7 code9`';
            const result = await confirmEmail(invalidCode);
            expect(result).toBeFalsy();
        });

        it('should return invalid inform if invalid code sent', async () => {
            const validCode = 'validconfirmationcode';
            const user = {
                emailConfirmation : {
                    isConfirmed: false,
                    confirmationCode: "hajsdhajsd",
                    expirationDate: new Date()
                }
            }
            AuthRepository.findUserByCode = jest.fn().mockImplementation((code: string) => user);
            AuthRepository.updateConfirmation = jest.fn().mockImplementation((_id: ObjectId) => true);

            const result = await confirmEmail(validCode);
            expect(result).toBeFalsy();
        });

        it('should return invalid inform if user is already confirmed', async () => {
            const validCode = 'validconfirmationcode';
            const user = {
                emailConfirmation : {
                    isConfirmed: true,
                    confirmationCode: "hajsdhajsd",
                    expirationDate: new Date()
                }
            }
            AuthRepository.findUserByCode = jest.fn().mockImplementation((code: string) =>user);
            AuthRepository.updateConfirmation = jest.fn().mockImplementation((_id: ObjectId) => true);

            const result = await confirmEmail(validCode);
            expect(result).toBeFalsy();
        });
        it('should return invalid inform if code expiration date is outdated ', async () => {
            const validCode = 'validconfirmationcode';
            const user = {
                emailConfirmation : {
                    isConfirmed: false,
                    confirmationCode: "hajsdhajsd",
                    expirationDate: new Date(Date.now() - 10000)
                }
            }
            AuthRepository.findUserByCode = jest.fn().mockImplementation((code: string) => user);
            AuthRepository.updateConfirmation = jest.fn().mockImplementation((_id: ObjectId) => true);

            const result = await confirmEmail(validCode);
            expect(result).toBeFalsy();
        });
    });

    describe('resendEmail', () => {
        const resendEmail = authService.resendEmail;

        it('should resend the confirmation email', async () => {
            const user = {
                _id: new ObjectId(),
                emailConfirmation: {
                    isConfirmaed: false,
                
                }          
            }
            sendMailService.sendMail  = jest.fn().mockImplementation((email: string, newCode: string) => undefined);

            AuthRepository.updateCode = jest.fn().mockImplementation((_id: ObjectId, code: string) => undefined);
            AuthRepository.findUserByEmail = jest.fn().mockImplementation((email: string) => user);
            const mail = "testemail@gmail.com";
            const result = await resendEmail(mail);
            expect(result).toBeTruthy();
        });

        it('should return false if the user is already confirmed', async () => {
            const user = {
                _id: new ObjectId(),
                emailConfirmation: {
                    isConfirmed: true,
                
                }          
            }
            sendMailService.sendMail  = jest.fn().mockImplementation((email: string, newCode: string) => undefined);
            AuthRepository.updateCode = jest.fn().mockImplementation((_id: ObjectId, code: string) => undefined);
            AuthRepository.findUserByEmail = jest.fn().mockImplementation((email: string) => user);
            const mail = "12421454";
            const result = await resendEmail(mail);
            expect(result).toBeFalsy();

        
        });
        it('should return false if the user is not found in db', async () => {
            const user = null
            sendMailService.sendMail  = jest.fn().mockImplementation((email: string, newCode: string) => undefined);
            AuthRepository.updateCode = jest.fn().mockImplementation((_id: ObjectId, code: string) => undefined);
            AuthRepository.findUserByEmail = jest.fn().mockImplementation((email: string) => user);
            const mail = "12421454";
            const result = await resendEmail(mail);
            expect(result).toBeFalsy();

            
            
        });
    });
});