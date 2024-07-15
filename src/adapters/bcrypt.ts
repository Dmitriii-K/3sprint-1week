import bcrypt from 'bcryptjs';

export const bcryptService = {
    async createHashPassword (password: string) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const userHashPassword = await bcrypt.hash(password, salt);
        return userHashPassword;
    },

    async comparePasswords (password: string, hash: string) {
        
        return bcrypt.compare(password, hash);
    }
}