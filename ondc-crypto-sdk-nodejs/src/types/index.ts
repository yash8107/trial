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
  Request_Id: string;
  ondc_public_key: string;
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

// export const encryptionConfig: EncryptionKeys = {
//   unique_key_id: 'bb2de03a-bda1-458f-b27b-6919788da886',
//   Signing_private_key: '9sfCszmFVgrlzdxED3tfPtohk9FkcspnnooySJ8RxIBDWIdGg48zK4MM4Yq8gDwa5RbUZiXzAPQQ2LCiyXGBEQ==',
//   Signing_public_key: 'Q1iHRoOPMyuDDOGKvIA8GuUW1GYl8wD0ENiwoslxgRE=',
//   Encryption_Privatekey: 'MC4CAQAwBQYDK2VuBCIEIJCidZJ8WBezDoz145R0r8NL61U9XOSdDG5Vz5RZ62BC',
//   Encryption_Publickey: 'MCowBQYDK2VuAyEAbg59g4rH4ppMce1Oy4874F4QxdzdKygZh6jlDo12xUE=',
//   valid_from: '2025-05-05T20:16:59.764Z',
//   valid_until: '2026-05-05T20:16:59.764Z',
//   Request_Id: 'bb2de03a-bda1-458f-b27b-6919788da886',
//   ondc_public_key: 'MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM='
// };

export const encryptionConfig: EncryptionKeys = {
  unique_key_id: 'fdd4c1fc-dbd5-4db7-b1f2-524c72c816c9',
  Signing_private_key: 'wvLarmTpYZPKbGnG+p7Oj7pSpL1LObpVIWRcq1T0X+QCXH9/aBSKwl9bTmNpxQ0xxMjwmec/AOWBlrF3NRE5wg==',
  Signing_public_key: 'Alx/f2gUisJfW05jacUNMcTI8JnnPwDlgZaxdzUROcI=',
  Encryption_Privatekey: 'MC4CAQAwBQYDK2VuBCIEIFBQuBlH0gnr3YjqDUt24oQyjzK0wL6ccDp9SnpoEf5g',
  Encryption_Publickey: 'MCowBQYDK2VuAyEAHFRN6647p1BwblTRhnSbLQ/vA2vIqb4uFzz0jaGvuyk=',
  valid_from: '2025-05-07T16:02:42.240Z',
  valid_until: '2026-05-07T16:02:42.241Z',
  Request_Id: 'fdd4c1fc-dbd5-4db7-b1f2-524c72c816c9',
  ondc_public_key: 'MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM='
};