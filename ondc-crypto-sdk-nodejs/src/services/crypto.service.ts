import { encryptionConfig } from '../types/index'; // Assuming your config path is correct
import * as crypto from 'crypto'; // Import crypto for key parsing
import _sodium from 'libsodium-wrappers';

export class CryptoService {
  private sharedKey: Buffer; // For AES decryption
  private signingPrivateKey: string; // For EdDSA signing
  private requestId: string; // For signing

  constructor() {
      try {
          const encryptionPrivateKeyBase64 = encryptionConfig.Encryption_Privatekey;
          const ondcPublicKeyBase64 = encryptionConfig.ondc_public_key; // Assuming this key name in your config
          this.signingPrivateKey = encryptionConfig.Signing_private_key; // Assuming this key name
          this.requestId = encryptionConfig.Request_Id; // Assuming this key name

          if (!encryptionPrivateKeyBase64 || !ondcPublicKeyBase64 || !this.signingPrivateKey || !this.requestId) {
              throw new Error('One or more required keys (Encryption_Privatekey, Ondc_Publickey, Signing_Privatekey, Request_Id) are missing in the configuration.');
          }

          const privateKey = crypto.createPrivateKey({
              key: Buffer.from(encryptionPrivateKeyBase64, 'base64'),
              format: 'der',
              type: 'pkcs8',
          });

          const publicKey = crypto.createPublicKey({
              key: Buffer.from(ondcPublicKeyBase64, 'base64'),
              format: 'der',
              type: 'spki',
          });

          this.sharedKey = crypto.diffieHellman({
              privateKey: privateKey,
              publicKey: publicKey,
          });
          console.log('Shared key derived successfully for AES decryption.');

          // Initialize libsodium for signing
          (async () => {
              await _sodium.ready;
              console.log('Libsodium is ready for signing.');
          })();

      } catch (error) {
          console.error("Error initializing CryptoService:", error);
          throw new Error(`Failed to initialize CryptoService: ${error instanceof Error ? error.message : error}`);
      }
  }

  // Decrypt using AES-256-ECB as per the ONDC example
  decryptChallenge(encryptedChallenge: string): string {
      try {
          console.log('Encrypted challenge (base64):', encryptedChallenge);
          if (!this.sharedKey) {
              throw new Error('Shared key is not initialized.');
          }
          const iv = Buffer.alloc(0); // ECB doesn't use IV
          const decipher = crypto.createDecipheriv('aes-256-ecb', this.sharedKey, iv);
          let decrypted = decipher.update(encryptedChallenge, 'base64', 'utf8');
          decrypted += decipher.final('utf8');
          console.log('Decrypted challenge:', decrypted);
          return decrypted;
      } catch (error) {
          console.error('Error in decryptChallenge:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown decryption error';
          throw new Error(`Failed to decrypt challenge: ${errorMessage}`);
      }
  }
}

// Example (ensure your encryptionConfig path and keys are correct):
// const encryptionConfig = {
//     Encryption_Privatekey: \'\'\'MC4CAQEwBQYDK2VuBCIEILgcht9h660ZeO36tG+QuHGNcLN9JuAzxHWZl09f57Bh\'\'\', // Your NP's encryption private key
//     Ondc_Publickey: \'\'\'MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=\'\'\', // Registry's public key
//     Signing_Privatekey: \'\'\'7M2L3q9y5gS/dq21Ly3Y3VtYEwgmGM1tM4n0wce/WgcJcOzvdfKo+AUEulIyQCawS39dc6uicu8NAaEpciPajg==\'\'\', // Your NP's signing private key
//     Request_Id: \'\'\'some-unique-request-id-from-subscribe-call\'\'\' // The request_id for signing
// };