import { sendOffscreenMessage } from '../iframe-messenger';

const target = 'ledger';

const responseCallback = (
  response: any,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void,
) => {
  if (response.success) {
    resolve(response.payload);
  } else {
    reject(response.payload?.error);
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
        response: any,
        resolve: (value: unknown) => void,
        reject: (reason?: any) => void,
      ) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(response.error);
        }
      },
    });
  }

  updateTransportMethod(transportType: string) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-update-transport',
      params: { transportType },
      responseCallback: (
        response: any,
        resolve: (value: unknown) => void,
        reject: (reason?: any) => void,
      ) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(new Error('Ledger transport could not be updated'));
        }
      },
    });
  }

  getPublicKey(params: any) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-unlock',
      params,
      responseCallback,
    });
  }

  deviceSignTransaction(params: any) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-sign-transaction',
      params,
      responseCallback,
    });
  }

  deviceSignMessage(params: any) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-sign-personal-message',
      params,
      responseCallback,
    });
  }

  deviceSignTypedData(params: any) {
    return sendOffscreenMessage({
      target,
      action: 'ledger-sign-typed-data',
      params,
      responseCallback,
    });
  }
}
