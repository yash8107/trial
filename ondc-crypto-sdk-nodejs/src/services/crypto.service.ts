import crypto from 'crypto';
import { encryptionConfig } from '../types/index';

export class CryptoService {
  private sharedKey: Buffer;

  constructor() {
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

    this.sharedKey = crypto.diffieHellman({
      privateKey,
      publicKey
    });
  }

  decryptAES256ECB(encrypted: string): string {
    try {
      const iv = Buffer.alloc(0);
      const decipher = crypto.createDecipheriv('aes-256-ecb', this.sharedKey, iv);
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}