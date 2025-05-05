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