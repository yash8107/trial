import axios from 'axios';
import { createAuthorizationHeader } from './utility';
import { encryptionConfig } from '../types/index';

// Your private key - replace this with your actual private key
const PRIVATE_KEY = encryptionConfig.Signing_private_key;
const SUBSCRIBER_ID = "api.sellerfocus.xyz";
const UNIQUE_KEY_ID = encryptionConfig.unique_key_id;

async function lookupRequest() {
    try {        
        // Create request body
        const requestBody = {
            "subscriber_id": "api.sellerfocus.xyz",
            "country": "IND",
            "ukId": encryptionConfig.unique_key_id,
            "city": "std:080",
            "domain": "ONDC:RET11",
            "type": "BPP"
        };

        console.log('Step 1: Creating request body...');
        const requestBodyString = JSON.stringify(requestBody); // Stringify it once
        console.log(requestBodyString); // Log the exact string

        // Generate authorization header
        console.log('\nStep 2: Generating authorization header...');
        const created = Math.floor(Date.now() / 1000);
        const expires = created + 3600; // 1 hour expiry

        const authHeader = await createAuthorizationHeader({
            body: requestBodyString,
            privateKey: PRIVATE_KEY,
            subscriberId: SUBSCRIBER_ID,
            subscriberUniqueKeyId: UNIQUE_KEY_ID,
            created: created.toString(),
            expires: expires.toString()
        });
          

        console.log('Generated Authorization Header:', authHeader);

        // Make the API call
        console.log('\nStep 3: Making API call to ONDC lookup...');
        const response = await axios({
            method: 'post',
            url: 'https://staging.registry.ondc.org/v2.0/lookup',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            data: requestBodyString
        });

        console.log('\nStep 4: Response received');
        console.log('Status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));

        // return response.data;
        return response.data;
    } catch (error) {
        console.error('\nError occurred:');
        if (axios.isAxiosError(error)) {
            console.error('Response status:', error.response?.status);
            console.error('Response data:', JSON.stringify(error.response?.data, null, 2));
        } else {
            console.error('Error:', error);
        }
        throw error;
    }
}

// Execute the function
lookupRequest()
    .then(() => console.log('\nLookup request completed'))
    .catch(() => console.log('\nLookup request failed'));