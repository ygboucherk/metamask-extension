/* eslint-disable no-undef */
export class LedgerBridgeOffscreen {
  init() {
    console.log('LEDGER MV3 BRIDGE - INIT');
    return Promise.resolve();
  }

  destroy() {
    console.log('LEDGER MV3 BRIDGE - DESTROY');
    // chrome.runtime.onMessage.removeListener();
    return Promise.resolve();
  }

  attemptMakeApp() {
    return new Promise((resolve, reject) => {
      console.log('LEDGER MV3 BRIDGE - MAKE APP');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'ledger',
          action: 'ledger-make-app',
        },
        (response) => {
          console.log('LEDGER MV3 BRIDGE - MAKE APP RESPONSE', response);

          if (response.success) {
            resolve(true);
          } else {
            reject(response.error);
          }
        },
      );
    });
  }

  updateTransportMethod(transportType) {
    return new Promise((resolve, reject) => {
      console.log('LEDGER MV3 BRIDGE - UPDATE TRANSPORT');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'ledger',
          action: 'ledger-update-transport',
          params: { transportType },
        },
        (response) => {
          console.log(
            'LEDGER MV3 BRIDGE - UPDATE TRANSPORT RESPONSE',
            response,
          );

          if (response.success) {
            resolve(true);
          } else {
            reject(new Error('Ledger transport could not be updated'));
          }
        },
      );
    });
  }

  getPublicKey(params) {
    return new Promise((resolve, reject) => {
      console.log('LEDGER MV3 BRIDGE - GET PUB KEY');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'ledger',
          action: 'ledger-unlock',
          params,
        },
        (response) => {
          console.log('LEDGER MV3 BRIDGE - GET PUB KEY RESPONSE', response);

          if (response.success) {
            resolve(response.payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }

  deviceSignTransaction(params) {
    return new Promise((resolve, reject) => {
      console.log('LEDGER MV3 BRIDGE - SIGN TX');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'ledger',
          action: 'ledger-sign-transaction',
          params,
        },
        (response) => {
          console.log('LEDGER MV3 BRIDGE - SIGN TX RESPONSE', response);

          if (response.success) {
            resolve(response.payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }

  deviceSignMessage(params) {
    return new Promise((resolve, reject) => {
      console.log('LEDGER MV3 BRIDGE - SIGN MSG');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'ledger',
          action: 'ledger-sign-personal-message',
          params,
        },
        (response) => {
          console.log('LEDGER MV3 BRIDGE - SIGN MSG RESPONSE', response);

          if (response.success) {
            resolve(response.payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }

  deviceSignTypedData(params) {
    return new Promise((resolve, reject) => {
      console.log('LEDGER MV3 BRIDGE - SIGN TYPED DATA');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'ledger',
          action: 'ledger-sign-typed-data',
          params,
        },
        (response) => {
          console.log('LEDGER MV3 BRIDGE - SIGN TYPED DATA RESPONSE', response);

          if (response.success) {
            resolve(response.payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }
}
