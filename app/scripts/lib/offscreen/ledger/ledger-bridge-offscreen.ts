import { sendOffscreenMessage } from '../iframe-messenger';

const target = 'ledger';

const responseCallback = (
  response: { success: boolean; payload: { error?: Error } },
  resolve: (value: any) => void,
  reject: (reason?: any) => void,
) => {
  if (response.success) {
    resolve(response.payload);
  } else {
    reject(response.payload.error);
  }
};

export class LedgerBridgeOffscreen {
  init() {
    return Promise.resolve();
  }

  destroy() {
    return Promise.resolve();
  }

  attemptMakeApp() {
    return sendOffscreenMessage({
      target,
      action: 'ledger-make-app',
      responseCallback: (
        response: { success: boolean; error?: Error },
        resolve: (value: any) => void,
        reject: (reason?: any) => void,
      ) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(response.error);
        }
      },
    }) as Promise<boolean>;
  }

  updateTransportMethod(transportType: string) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-update-transport',
      params: { transportType },
      responseCallback: (
        response: { success: boolean },
        resolve: (value: any) => void,
        reject: (reason?: any) => void,
      ) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(new Error('Ledger transport could not be updated'));
        }
      },
    }) as Promise<boolean>;
  }

  getPublicKey(params: { hdPath: string }) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-unlock',
      params,
      responseCallback,
    }) as Promise<{
      publicKey: string;
      address: string;
      chainCode?: string;
    }>;
  }

  deviceSignTransaction(params: { hdPath: string; tx: string }) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-sign-transaction',
      params,
      responseCallback,
    }) as Promise<{
      s: string;
      v: string;
      r: string;
    }>;
  }

  deviceSignMessage(params: { hdPath: string; message: string }) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-sign-personal-message',
      params,
      responseCallback,
    }) as Promise<{
      v: number;
      s: string;
      r: string;
    }>;
  }

  deviceSignTypedData(params: {
    hdPath: string;
    domainSeparatorHex: string;
    hashStructMessageHex: string;
  }) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-sign-typed-data',
      params,
      responseCallback,
    }) as Promise<{
      v: number;
      s: string;
      r: string;
    }>;
  }
}
