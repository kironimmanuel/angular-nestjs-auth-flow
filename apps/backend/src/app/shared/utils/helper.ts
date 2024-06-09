import * as crypto from 'crypto';

/**
 * Generates a SHA-256 hash of the given value concatenated with a salt.
 *
 * @param {string} value - The input string to be hashed.
 * @returns {string} - The resulting hexadecimal hash string.
 */
export const createHash = (value: string): string => {
    return crypto
        .createHash('sha256')
        .update(value.concat(process.env.HASH_SALT || ''))
        .digest('hex');
};
