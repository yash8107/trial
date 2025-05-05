import nacl from 'tweetnacl';
import { encryptionConfig } from '../types/index'; // Assuming your config path is correct
import * as crypto from 'crypto'; // Import crypto for key parsing

// Helper function for base64url decoding (used for JWK format)
function base64UrlDecode(base64urlString: string): Buffer {
    let base64 = base64urlString.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with '=' signs if necessary
    while (base64.length % 4) {
        base64 += '=';
    }
    return Buffer.from(base64, 'base64');
}

export class CryptoService {
    // Store the raw private key bytes (32 bytes for Curve25519)
    private rawPrivateKeyBytes: Buffer;

    constructor() {
        try {
            // Assume Encryption_Privatekey is a PEM string or a base64 encoded DER string
            const privateKeyInput = encryptionConfig.Encryption_Privatekey;
            if (!privateKeyInput) {
                throw new Error('Encryption_Privatekey is missing in the configuration.');
            }

            let privateKeyObject: crypto.KeyObject;

            // Attempt to parse directly (should work for standard PEM)
            try {
                privateKeyObject = crypto.createPrivateKey(privateKeyInput);
                console.log('Private key parsed directly (likely PEM format).');
            } catch (directError) {
                // If direct parsing fails, assume it might be a base64 encoded DER string
                console.warn(`Direct private key parsing failed (${directError instanceof Error ? directError.message : directError}). Attempting Base64 DER parsing...`);
                try {
                    const privateKeyDerBuffer = Buffer.from(privateKeyInput, 'base64');
                    // Explicitly tell crypto to parse the buffer as DER/PKCS#8
                    privateKeyObject = crypto.createPrivateKey({
                        key: privateKeyDerBuffer,
                        format: 'der',
                        type: 'pkcs8' // Standard format for private keys, including Curve25519
                    });
                    console.log('Private key parsed successfully as Base64 DER.');
                } catch (derError) {
                    console.error('Failed to parse private key using both direct (PEM) and Base64 DER methods.');
                    // Throw a more informative error if both attempts fail
                    throw new Error(`Failed to parse private key. Direct/PEM error: ${directError instanceof Error ? directError.message : directError}. Base64/DER error: ${derError instanceof Error ? derError.message : derError}`);
                }
            }

            // Export as JWK to safely extract raw key material for Curve25519/X25519
            const jwk = privateKeyObject.export({ format: 'jwk' });

            if (!jwk.d) {
                // If 'd' is missing, the key wasn't parsed correctly or isn't a private key
                throw new Error('Could not extract raw private key (d component) from JWK. Ensure the key is for Curve25519/X25519 and was parsed correctly.');
            }

            this.rawPrivateKeyBytes = base64UrlDecode(jwk.d);

            // Validate key length for nacl.box
            if (this.rawPrivateKeyBytes.length !== nacl.box.secretKeyLength) {
                 throw new Error(`Extracted private key has incorrect length: ${this.rawPrivateKeyBytes.length}. Expected ${nacl.box.secretKeyLength}.`);
            }
            console.log('Raw private key loaded and validated successfully.');

        } catch(error) {
            console.error("Error loading/parsing private key:", error);
            // Rethrow to prevent service from starting in a bad state
            throw new Error(`Failed to initialize CryptoService with private key: ${error instanceof Error ? error.message : error}`);
        }
    }

    async decryptChallenge(encryptedChallenge: string): Promise<string> {
        try {
            console.log('Encrypted challenge (base64):', encryptedChallenge);
            const encryptedBuffer = Buffer.from(encryptedChallenge, 'base64');

             // --- ONDC Public Key Parsing ---
            // This is the SubjectPublicKeyInfo (SPKI) in base64 DER format you provided
            // Ensure this is the correct ONDC public key corresponding to their encryption private key.
            const ondcPublicKeyBase64Der = "MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=";
            let rawOndcPublicKeyBytes: Buffer;
            try {
                // Decode base64 and parse the DER/SPKI structure
                const publicKeyDerBuffer = Buffer.from(ondcPublicKeyBase64Der, 'base64');
                const publicKeyObject = crypto.createPublicKey({ key: publicKeyDerBuffer, format: 'der', type: 'spki' });

                // Export as JWK to safely extract raw key material for Curve25519/X25519
                const pubJwk = publicKeyObject.export({ format: 'jwk' });
                if (!pubJwk.x) {
                     // If 'x' is missing, the key wasn't parsed correctly or isn't a public key
                     throw new Error('Could not extract raw public key (x component) from JWK. Ensure ONDC key is for Curve25519/X25519.');
                }
                rawOndcPublicKeyBytes = base64UrlDecode(pubJwk.x);

            } catch (parseError) {
                 console.error("Failed to parse ONDC public key:", parseError);
                 throw new Error(`Invalid ONDC Public Key format or value: ${parseError instanceof Error ? parseError.message : parseError}`);
            }

             // Validate key length for nacl.box
            if (rawOndcPublicKeyBytes.length !== nacl.box.publicKeyLength) {
                throw new Error(`Extracted ONDC public key has incorrect length: ${rawOndcPublicKeyBytes.length}. Expected ${nacl.box.publicKeyLength}.`);
            }
             console.log('Raw ONDC public key loaded successfully.');
            // --- End ONDC Public Key Parsing ---


            // Assumption: The encrypted buffer contains: 24-byte nonce + ciphertext
            // ** IMPORTANT: Verify this structure with ONDC documentation! **
            if (encryptedBuffer.length <= nacl.box.nonceLength) {
                 throw new Error(`Encrypted data (length ${encryptedBuffer.length}) is too short to contain nonce (length ${nacl.box.nonceLength}) and ciphertext.`);
            }
            const nonceBytes = encryptedBuffer.subarray(0, nacl.box.nonceLength);
            const ciphertextBytes = encryptedBuffer.subarray(nacl.box.nonceLength);

            console.log('Nonce (Buffer):', nonceBytes);
            console.log('Ciphertext (Buffer):', ciphertextBytes);
            console.log('Private Key (Raw Bytes):', this.rawPrivateKeyBytes); // Should be 32 bytes
            console.log('ONDC Public Key (Raw Bytes):', rawOndcPublicKeyBytes); // Should be 32 bytes

            // Perform decryption using raw keys
            const decryptedBuffer = nacl.box.open(
                ciphertextBytes,
                nonceBytes,
                rawOndcPublicKeyBytes,    // Use raw 32-byte public key
                this.rawPrivateKeyBytes    // Use raw 32-byte private key
            );

            // Check if decryption was successful
            if (!decryptedBuffer) {
                 console.error('Decryption failed! nacl.box.open returned null. Check keys, nonce, and ciphertext integrity.');
                 // Common causes: wrong ONDC public key, wrong private key, incorrect nonce/ciphertext splitting, corrupted data.
                 throw new Error('Decryption failed - nacl.box.open returned null.');
            }

            const decryptedChallenge = Buffer.from(decryptedBuffer).toString('utf8');
            console.log('Decrypted challenge:', decryptedChallenge);
            return decryptedChallenge;

        } catch (error) {
            console.error('Error in decryptChallenge:', error);
            // Ensure error is propagated correctly
            const errorMessage = error instanceof Error ? error.message : 'Unknown decryption error';
            throw new Error(`Failed to decrypt challenge: ${errorMessage}`);
        }
    }
}