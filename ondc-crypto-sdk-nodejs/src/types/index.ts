export interface ICreateSigningString {
  message: string;
  created?: string;
  expires?: string;
}

export interface ISignMessage {
  signingString: string;
  privateKey: string;
}

export interface GenericObject {
  [key: string]: any;
}

export interface IVerifyMessage {
  signedString: string;
  signingString: string;
  publicKey: string;
}

export interface IHeaderParts {
  expires: string;
  created: string;
  keyId: string;
  signature: string;
  [key: string]: any;
}

export interface IVerifyHeader {
  headerParts: IHeaderParts;
  body: string;
  publicKey: string;
}

export interface IsHeaderValid {
  header: string;
  body: string;
  publicKey: string;
}
export interface ICreateAuthorizationHeader {
  body: string;
  privateKey: string;
  subscriberId: string;
  subscriberUniqueKeyId: string;
  expires?: string;
  created?: string;
}

export interface CreateVLookupSignature {
  country: string;
  domain: string;
  type: string;
  city: string;
  subscriber_id: string;
  privateKey: string;
}

// Add to existing types
export interface KeyPairs {
  unique_key_id: string;
  signing: {
      privateKey: string;
      publicKey: string;
  };
  encryption: {
      privateKey: string;
      publicKey: string;
  };
  validFrom: string;
  validUntil: string;
}

export interface SubscribeRequest {
  payload: {
      context: {
          domain: string;
          country: string;
          city: string;
          action: string;
          timestamp: string;
      };
      message: {
          request_id: string;
          subscriber_id: string;
          unique_key_id: string;
          signing_public_key: string;
          encryption_public_key: string;
          valid_from: string;
          valid_until: string;
      };
  };
  keys: KeyPairs;
}

export interface EncryptionKeys {
  unique_key_id: string;
  Signing_private_key: string;
  Signing_public_key: string;
  Encryption_Privatekey: string;
  Encryption_Publickey: string;
  valid_from: string;
  valid_until: string;
}

// export const encryptionConfig: EncryptionKeys = {
//   unique_key_id: '41391d6a-05e1-4967-803d-1a60a2d43d59',
//   Signing_private_key: 'NvR+zC8lk+Ctj61xxFEjbg3QyY3iJkS370M/xurRpa2T/c89ILrcFUJSa5nHVLCGXRMP6FZiKQSlXStQwC077w==',
//   Signing_public_key: 'k/3PPSC63BVCUmuZx1Swhl0TD+hWYikEpV0rUMAtO+8=',
//   Encryption_Privatekey: 'MC4CAQAwBQYDK2VuBCIEIHBg3aLi0b3YmWY3U/uUhFd+ieRJIJ/vL7QoiZhDsgBN',
//   Encryption_Publickey: 'MCowBQYDK2VuAyEA817tuDx8zi+WCwJpOVZmvgXOLoFmEftyEoFMB0VQQhQ=',
//   valid_from: '2025-05-05T13:11:13.021Z',
//   valid_until: '2026-05-05T13:11:13.021Z'
// };

export const encryptionConfig: EncryptionKeys = {
  unique_key_id: '911d250b-20c2-4944-bd25-2254467adc1e',
  Signing_private_key: 'TndbG8PV65HRlvkLDxcEb2weAedEaSGK3FZ4H2NRaf4wieJbMY5aYV6EDhUVrgGmNP/0jUqhTSpj//dzIwzdmA==',
  Signing_public_key: 'MIniWzGOWmFehA4VFa4BpjT/9I1KoU0qY//3cyMM3Zg=',
  Encryption_Privatekey: 'MC4CAQAwBQYDK2VuBCIEIJB66O2j8ElW7tBKmx7wuLNMZ0IcxSt83irmc+Pa9PFB',
  Encryption_Publickey: 'MCowBQYDK2VuAyEA4eXX5R2ForQkbQ84tsgJWo2rJNaTN5w1pXU6b5ub+Tg=',
  valid_from: '2025-05-05T19:29:51.429Z',
  valid_until: '2026-05-05T19:29:51.429Z'
};
