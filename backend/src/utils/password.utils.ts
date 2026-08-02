import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password securely using bcrypt with 10 salt rounds.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password against a stored bcrypt hash.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
