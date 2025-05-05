import sodium from 'libsodium-wrappers';
import { encryptionConfig } from '../types/index';
import * as crypto from 'crypto';

export class CryptoService {
  private encryptionPrivateKey: string;
  private encryptionPublicKey: string;

  constructor() {
    this.encryptionPrivateKey = encryptionConfig.Encryption_Privatekey;
    this.encryptionPublicKey = encryptionConfig.Encryption_Publickey;
  }

  async decryptChallenge(encryptedChallenge: string): Promise<string> {
    console.log('Encrypted challenge:', encryptedChallenge);
    await sodium.ready;

    // ⛏️ Convert DER base64 private key → 32-byte raw key
    const privateKeyRaw = this.extractRawPrivateKeyFromDER(this.encryptionPrivateKey);
    const publicKeyRaw = this.extractRawPublicKeyFromDER(this.encryptionPublicKey);

    // Log the keys being used for decryption
    console.log('Attempting decryption with keys:');
    console.log('Private key:', Buffer.from(privateKeyRaw).toString('base64'));
    console.log('Public key:', Buffer.from(publicKeyRaw).toString('base64'));

    // Must be 32 bytes each
    if (privateKeyRaw.length !== 32 || publicKeyRaw.length !== 32) {
      throw new Error('Encryption key must be 32 bytes (raw X25519 key)');
    }

    const decrypted = sodium.crypto_box_seal_open(
      sodium.from_base64(encryptedChallenge, sodium.base64_variants.ORIGINAL),
      publicKeyRaw,
      privateKeyRaw
    );

    console.log('Decrypted:', decrypted);
    if (!decrypted) {
      throw new Error('Failed to decrypt challenge');
    }
    console.log('Decrypted string:', sodium.to_string(decrypted));
    return sodium.to_string(decrypted);
  }

  extractRawPrivateKeyFromDER(base64Key: string): Uint8Array {
    const derBuffer = Buffer.from(base64Key, 'base64');
  
    const privateKeyObj = crypto.createPrivateKey({
      key: derBuffer,
      format: 'der',
      type: 'pkcs8',
    });
  
    const rawKey = privateKeyObj.export({ format: 'der', type: 'pkcs8' });
    return new Uint8Array(rawKey.slice(-32)); // last 32 bytes are the raw key
  }

  extractRawPublicKeyFromDER(base64Key: string): Uint8Array {
    const derBuffer = Buffer.from(base64Key, 'base64');
  
    const publicKeyObj = crypto.createPublicKey({
      key: derBuffer,
      format: 'der',
      type: 'spki',
    });
  
    const rawKey = publicKeyObj.export({ format: 'der', type: 'spki' });
    return new Uint8Array(rawKey.slice(-32)); // last 32 bytes are raw
  }
}
