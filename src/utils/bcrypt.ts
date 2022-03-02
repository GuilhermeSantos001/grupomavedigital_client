/**
 * @description https://www.npmjs.com/package/bcrypt
 * @author GuilhermeSantos001
 * @update 26/02/2022
 */

import { genSaltSync, hashSync, compareSync, genSalt, hash, compare } from 'bcrypt';

export function EncryptSync(password: string, saltRounds?: number): string {
    const salt = genSaltSync(saltRounds || 10);
    return hashSync(password, salt);
}

export function DecryptSync(password: string, hash: string): boolean {
    return compareSync(password, hash);
}

export function Encrypt(password: string, saltRounds?: number): Promise<string> {
    return new Promise((resolve, reject) => {
        genSalt(saltRounds || 10, function (error: Error | undefined, salt: string) {
            if (error)
                return reject(error);

            hash(password, salt, function (error: Error | undefined, encrypted: string) {
                if (error)
                    return reject(error);

                return resolve(encrypted);
            });
        });
    });
}

export function Decrypt(password: string, encrypted: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        compare(password, encrypted, function (error: Error | undefined, same: boolean) {
            if (error)
                return reject(error);

            return resolve(same);
        });
    });
}