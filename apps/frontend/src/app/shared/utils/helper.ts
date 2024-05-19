/**
 * Generates a random email address.
 *
 * @returns {string} A randomly generated email address.
 */
export function generateRandomEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const domains = ['gmail', 'yahoo', 'outlook', 'hotmail', 'example'];
  const extensions = ['com', 'net', 'org', 'io', 'co'];

  function getRandomString(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const usernameLength = Math.floor(Math.random() * 10) + 5;
  const username = getRandomString(usernameLength);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const extension = extensions[Math.floor(Math.random() * extensions.length)];

  return `${username}@${domain}.${extension}`;
}

/**
 * Generates a random username.
 *
 * @returns {string} A randomly generated username.
 */
export function getRandomUsername() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function getRandomString(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const usernameLength = Math.floor(Math.random() * 10) + 5;
  return getRandomString(usernameLength);
}
