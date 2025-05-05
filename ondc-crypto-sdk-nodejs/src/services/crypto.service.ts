import sodium from 'libsodium-wrappers';
import { encryptionConfig } from '../types/index';

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

    const privateKeyRaw = sodium.from_base64(this.encryptionPrivateKey, sodium.base64_variants.ORIGINAL);
    const publicKeyRaw = sodium.from_base64(this.encryptionPublicKey, sodium.base64_variants.ORIGINAL);

    console.log('Private key:', privateKeyRaw);
    console.log('Public key:', publicKeyRaw);

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
}
