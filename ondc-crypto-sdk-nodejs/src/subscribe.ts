import axios from 'axios';
import { createAuthorizationHeader } from './utility';
import { format } from 'date-fns';

// Your private key - replace this with your actual private private key
// const PRIVATE_KEY = "NvR+zC8lk+Ctj61xxFEjbg3QyY3iJkS370M/xurRpa2T/c89ILrcFUJSa5nHVLCGXRMP6FZiKQSlXStQwC077w==";
// const SUBSCRIBER_ID = "api.sellerfocus.xyz";
// const UNIQUE_KEY_ID = "41391d6a-05e1-4967-803d-1a60a2d43d59";

const PRIVATE_KEY = "TndbG8PV65HRlvkLDxcEb2weAedEaSGK3FZ4H2NRaf4wieJbMY5aYV6EDhUVrgGmNP/0jUqhTSpj//dzIwzdmA==";
const SUBSCRIBER_ID = "api.sellerfocus.xyz";
const UNIQUE_KEY_ID = "911d250b-20c2-4944-bd25-2254467adc1e";

async function createSubscriptionRequest() {
    try {
// Replace the timestamp formatting code:
const currentTime = new Date();
const formattedTimestamp = currentTime.toISOString(); // This gives "2023-10-05T12:34:56.789Z"
        
        // Create request body
        const requestBody = {
            context: {
                operation: {
                    ops_no: 2
                }
            },
            message: {
                request_id: UNIQUE_KEY_ID,
                timestamp: formattedTimestamp,
                entity: {
                    gst: {
                        legal_entity_name: "CounterBusiness",
                        business_address: "Trade World, Mansarpur, Coorg, Karnataka 333333",
                        city_code: ["std:080"],
                        gst_no: "07AAACN2082N4Z7"
                    },
                    pan: {
                        name_as_per_pan: "Yash Singhal",
                        pan_no: "MPYPS4674B",
                        date_of_incorporation: "12/04/2001"
                    },
                    name_of_authorised_signatory: "Yash Singhal",
                    address_of_authorised_signatory: "405, Pinnacle House, Kandiwali, Mumbai 400001",
                    email_id: "yashsinghal8107@gmail.com",
                    mobile_no: 8107209784,
                    country: "IND",
                    subscriber_id: SUBSCRIBER_ID,
                    unique_key_id: UNIQUE_KEY_ID,
                    callback_url: "/",
                    key_pair: {
                        signing_public_key: "MIniWzGOWmFehA4VFa4BpjT/9I1KoU0qY//3cyMM3Zg=",
                        encryption_public_key: "MCowBQYDK2VuAyEA4eXX5R2ForQkbQ84tsgJWo2rJNaTN5w1pXU6b5ub+Tg=",
                        valid_from: new Date().toISOString(), 
                        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                network_participant: [
                    {
                        subscriber_url: "/bapl",
                        domain: "ONDC:RET11",
                        type: "sellerApp",
                        msn: true,
                        city_code: ["std:080"],
                        seller_on_record: [{}]
                    }
                ]
            }
        };

        console.log('Step 1: Creating request body...');
        console.log(JSON.stringify(requestBody, null, 2));

        // Generate authorization header
        console.log('\nStep 2: Generating authorization header...');
        const created = Math.floor(Date.now() / 1000);
        const expires = created + 3600; // 1 hour expiry

        const authHeader = await createAuthorizationHeader({
            body: JSON.stringify(requestBody),
            privateKey: PRIVATE_KEY,
            subscriberId: SUBSCRIBER_ID,
            subscriberUniqueKeyId: UNIQUE_KEY_ID,
            created: created.toString(),
            expires: expires.toString()
        });

        console.log('Generated Authorization Header:', authHeader);

        // Make the API call
        console.log('\nStep 3: Making API call to ONDC Registry...');
        const response = await axios({
            method: 'post',
            url: 'https://staging.registry.ondc.org/subscribe',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            data: requestBody
        });

        console.log('\nStep 4: Response received');
        console.log('Status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));

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
createSubscriptionRequest()
    .then(() => console.log('\nSubscription request completed'))
    .catch(() => console.log('\nSubscription request failed'));