import sodium from 'libsodium-wrappers';
import { encryptionConfig } from '../types/index';
import * as crypto from 'crypto';

export class CryptoService {
  private encryptionPrivateKey: string;

  constructor() {
    this.encryptionPrivateKey = encryptionConfig.Encryption_Privatekey;
  }

  async decryptChallenge(encryptedChallenge: string): Promise<string> {

    try {
      console.log('Encrypted challenge:', encryptedChallenge);

      const buffer = Buffer.from(encryptedChallenge, 'base64');
      const decryptedBuffer = crypto.privateDecrypt(
        {
          key: this.encryptionPrivateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING, // Depends on how ONDC encrypts it; adjust if needed
        },
        buffer
      );
      console.log('Decrypted challenge:', decryptedBuffer.toString('utf8'));
      return decryptedBuffer.toString('utf8');
    } catch (error) {
      console.error('Error decrypting challenge:', error);
      throw new Error('Failed to decrypt challenge');
    }
  }
}
