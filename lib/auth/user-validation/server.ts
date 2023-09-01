import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    let saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}