// src/services/crypto.service.ts
import crypto from 'crypto';
import { encryptionConfig } from '../types/index';
import _sodium from 'libsodium-wrappers';

export class CryptoService {
  private aesKey: Buffer;

  constructor() {
    const { privateKey, publicKey } = this.validateKeyPair();
    const sharedSecret = this.deriveSharedSecret(privateKey, publicKey);
    this.aesKey = this.deriveAESKey(sharedSecret);
  }

  private validateKeyPair() {
    try {
      // Verify private key format
      const privateKey = crypto.createPrivateKey({
        key: Buffer.from(encryptionConfig.Encryption_Privatekey, 'base64'),
        format: 'der',
        type: 'pkcs8'
      });

      // Verify public key matches private key
      const generatedPublic = crypto.createPublicKey(privateKey)
        .export({ format: 'der', type: 'spki' })
        .toString('base64');

      if (generatedPublic !== encryptionConfig.Encryption_Publickey) {
        throw new Error('Public key does not match private key');
      }

      return {
        privateKey,
        publicKey: crypto.createPublicKey({
          key: Buffer.from(encryptionConfig.Encryption_Publickey, 'base64'),
          format: 'der',
          type: 'spki'
        })
      };
    } catch (error) {
      throw new Error(`Key validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private deriveSharedSecret(privateKey: crypto.KeyObject, publicKey: crypto.KeyObject): Buffer {
    return crypto.diffieHellman({
      privateKey,
      publicKey,
    });
  }

  private deriveAESKey(sharedSecret: Buffer): Buffer {
    return crypto.createHash('sha256')
      .update(sharedSecret)
      .digest()
      .subarray(0, 32); // Use first 32 bytes for AES-256
  }

  decryptAES256ECB(encrypted: string): string {
    try {
      if (!encrypted || typeof encrypted !== 'string') {
        throw new Error('Invalid encrypted data format');
      }

      const decipher = crypto.createDecipheriv('aes-256-ecb', this.aesKey, Buffer.alloc(0));
      decipher.setAutoPadding(false); // Handle padding manually

      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      // Remove PKCS7 padding manually
      const pad = decrypted.charCodeAt(decrypted.length - 1);
      if (pad < 1 || pad > 16) {
        throw new Error('Invalid padding');
      }
      
      return decrypted.slice(0, -pad);
    } catch (error) {
      console.error('Decryption failed:', {
        aesKey: this.aesKey.toString('base64'),
        encryptedInput: encrypted,
        error: error instanceof Error ? error.message : 'Unknown'
      });
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Add signing functionality from reference code
  async signMessage(message: string): Promise<string> {
    await _sodium.ready;
    const sodium = _sodium;
    const signedMessage = sodium.crypto_sign_detached(
      message,
      sodium.from_base64(encryptionConfig.Signing_private_key, sodium.base64_variants.ORIGINAL)
    );
    return sodium.to_base64(signedMessage, sodium.base64_variants.ORIGINAL);
  }
}