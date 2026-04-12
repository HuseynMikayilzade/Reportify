// Utility: Password hashing (SHA-256, local auth only)
import * as Crypto from 'expo-crypto';

export async function hashPassword(password: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
  return digest;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const digest = await hashPassword(password);
  return digest === hash;
}
