import { Request, Response } from 'express';
import sodium from 'libsodium-wrappers';

export class OndcRegistrationController {
  async siteVerification(req: Request, res: Response) {
    try {
      console.log('Site Verification Endpoint Called');

      // Load keys from environment variables
      const signingPrivateKey = '9sfCszmFVgrlzdxED3tfPtohk9FkcspnnooySJ8RxIBDWIdGg48zK4MM4Yq8gDwa5RbUZiXzAPQQ2LCiyXGBEQ==';

      if (!signingPrivateKey) {
        throw new Error('No signing private key found. Generate keys first.');
      }

      // Generate a unique request ID
      const requestId = "bb2de03a-bda1-458f-b27b-6919788da886";

      // Wait for sodium to be ready
      await sodium.ready;

      // Generate signature
      const signatureBytes = sodium.crypto_sign_detached(
        Buffer.from(requestId),
        sodium.from_base64(signingPrivateKey, sodium.base64_variants.ORIGINAL)
      );

      // Convert signature to base64
      const SIGNED_UNIQUE_REQ_ID = sodium.to_base64(signatureBytes, sodium.base64_variants.ORIGINAL);

      // HTML template for verification
      const htmlFile = `
      <!DOCTYPE html>
<html>
  <head>
    <meta
      name="ondc-site-verification"
      content="${SIGNED_UNIQUE_REQ_ID}"
    />
    <title>ONDC Site Verification</title>
  </head>
  <body>
    <h1>ONDC Site Verification</h1>
  </body>
</html>
`;

      // Set content type to HTML
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(htmlFile);

    } catch (error) {
      console.error('Site Verification Error:', error);
      res.status(500).json({
        error: 'Site verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const ondcRegistrationController = new OndcRegistrationController();