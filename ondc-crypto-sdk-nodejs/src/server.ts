import express, { Request, Response } from 'express';
import { createAuthorizationHeader } from './utility';

interface AuthHeaderRequest {
    body: any;
    privateKey: string;
    subscriberId: string;
    uniqueKeyId: string;
    expiryInSeconds?: number;
}

const app = express();
app.use(express.json());

app.post('/generate-auth-header', async (req: Request<{}, {}, AuthHeaderRequest>, res: Response) => {
    try {
        const {
            body,            // The request body to be signed
            privateKey,      // Your signing private key
            subscriberId,    // Your subscriber ID
            uniqueKeyId     // Your unique key ID
        } = req.body;

        // Current time in seconds (Unix timestamp)
        const created = Math.floor(Date.now() / 1000).toString();
        
        // Expires in 1 hour from now (Unix timestamp)
        const expires = (parseInt(created) + 3600).toString();

        const authHeader = await createAuthorizationHeader({
            body: JSON.stringify(body),
            privateKey,
            subscriberId,
            subscriberUniqueKeyId: uniqueKeyId,
            created,
            expires
        });

        res.json({
            authHeader,
            created,
            expires,
            created_iso: new Date(parseInt(created) * 1000).toISOString(),
            expires_iso: new Date(parseInt(expires) * 1000).toISOString()
        });

    } catch (err: unknown) {
        const error = err as Error;
        console.error('Error generating auth header:', error);
        res.status(500).json({
            error: 'Failed to generate authorization header',
            details: error?.message || 'Unknown error'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});