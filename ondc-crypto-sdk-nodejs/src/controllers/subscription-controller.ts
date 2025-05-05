import { Request, Response } from 'express';
import { CryptoService } from '../services/crypto.service';

export class SubscriptionController {
  private cryptoService: CryptoService;

  constructor() {
    this.cryptoService = new CryptoService();
  }

  async handleSubscription(req: Request, res: Response): Promise<Response> {
    try {
      console.log('Subscription endpoint called', req.body);
      const { challenge } = req.body;
      
      if (!challenge) {
        return res.status(400).json({ error: 'Missing challenge parameter' });
      }

      const answer = await this.cryptoService.decryptChallenge(challenge);
      console.log('Answer:', answer);
      return res.status(200).json({ answer });
      
    } catch (error) {
      console.error('Subscription error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
}

export const subscriptionController = new SubscriptionController();