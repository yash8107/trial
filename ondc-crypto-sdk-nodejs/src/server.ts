import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import ondcRoutes from './routes';
import 'dotenv/config';
import { createAuthorizationHeader } from './utility';
import { ondcRegistrationController } from './controllers/ondcRegistrationController';
import SubscriptionController from './controllers/subscription-controller';

interface AuthHeaderRequest {
    body: any;
    privateKey: string;
    subscriberId: string;
    uniqueKeyId: string;
    expiryInSeconds?: number;
}

const app = express();
app.use(cors());
app.use(helmet());
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

// Root route
app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/ondc-site-verification.html', ondcRegistrationController.siteVerification);

app.post('/on_subscribe', (req, res) => {
    SubscriptionController.handleSubscription(req, res);
  });
// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});