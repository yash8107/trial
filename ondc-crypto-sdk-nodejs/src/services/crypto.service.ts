import crypto from 'crypto';
import { encryptionConfig } from '../types/index';

export class CryptoService {
  private aesKey: Buffer;

  constructor() {
    // Validate key pair first
    const { privateKey, publicKey } = this.validateKeyPair();
    const sharedSecret = crypto.diffieHellman({
      privateKey,
      publicKey,
    });

    // Key derivation using SHA-256
    this.aesKey = crypto.createHash('sha256')
      .update(sharedSecret)
      .digest()
      .subarray(0, 32); // Use first 32 bytes for AES-256
  }

  private validateKeyPair() {
    try {
      const privateKey = crypto.createPrivateKey({
        key: Buffer.from(encryptionConfig.Encryption_Privatekey, 'base64'),
        format: 'der',
        type: 'pkcs8'
      });

      const publicKey = crypto.createPublicKey({
        key: Buffer.from(encryptionConfig.Encryption_Publickey, 'base64'),
        format: 'der',
        type: 'spki'
      });

      return { privateKey, publicKey };
    } catch (error) {
      throw new Error(`Invalid key pair: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  decryptAES256ECB(encrypted: string): string {
    try {
      // Validate input
      if (!encrypted || typeof encrypted !== 'string') {
        throw new Error('Invalid encrypted data format');
      }

      const decipher = crypto.createDecipheriv('aes-256-ecb', this.aesKey, null);
      decipher.setAutoPadding(true); // Enable automatic padding removal
      
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', {
        error: error instanceof Error ? error.message : 'Unknown',
        encryptedInput: encrypted,
        aesKeyLength: this.aesKey.length
      });
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}