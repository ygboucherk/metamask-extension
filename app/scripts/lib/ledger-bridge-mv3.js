/* eslint-disable no-undef */
const CONNECTION_EVENT = 'ledger-connection-change';

export class LedgerBridgeMv3 {
  init() {
    console.log('LEDGER MV3 BRIDGE - INIT');
    this.currentMessageId = 0;
    this.messageCallbacks = {};
    this._setupListener();

    return Promise.resolve();
  }

  destroy() {
    // chrome.runtime.onMessage.removeListener();
    return Promise.resolve();
  }

  attemptMakeApp() {
    console.log('LEDGER MV3 BRIDGE - MAKE APP');
    return new Promise((resolve, reject) => {
      this._sendMessage(
        {
          action: 'ledger-make-app',
        },
        ({ success, error }) => {
          if (success) {
            resolve(true);
          } else {
            reject(error);
          }
        },
      );
    });
  }

  updateTransportMethod(transportType) {
    console.log('LEDGER MV3 BRIDGE - UPDATE TRANSPORT');
    return new Promise((resolve, reject) => {
      this._sendMessage(
        {
          action: 'ledger-update-transport',
          params: { transportType },
        },
        ({ success }) => {
          if (success) {
            resolve(true);
          } else {
            reject(new Error('Ledger transport could not be updated'));
          }
        },
      );
    });
  }

  getPublicKey(params) {
    console.log('LEDGER MV3 BRIDGE - GET PUB KEY');
    return new Promise((resolve, reject) => {
      this._sendMessage(
        {
          action: 'ledger-unlock',
          params,
        },
        ({ success, payload }) => {
          if (success) {
            resolve(payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }

  deviceSignTransaction(params) {
    console.log('LEDGER MV3 BRIDGE - SIGN TX');
    return new Promise((resolve, reject) => {
      this._sendMessage(
        {
          action: 'ledger-sign-transaction',
          params,
        },
        ({ success, payload }) => {
          if (success) {
            resolve(payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }

  deviceSignMessage(params) {
    console.log('LEDGER MV3 BRIDGE - SIGN MSG');
    return new Promise((resolve, reject) => {
      this._sendMessage(
        {
          action: 'ledger-sign-personal-message',
          params,
        },
        ({ success, payload }) => {
          if (success) {
            resolve(payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }

  deviceSignTypedData(params) {
    console.log('LEDGER MV3 BRIDGE - SIGN TYPED DATA');
    return new Promise((resolve, reject) => {
      this._sendMessage(
        {
          action: 'ledger-sign-typed-data',
          params,
        },
        ({ success, payload }) => {
          if (success) {
            resolve(payload);
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(payload && payload.error);
        },
      );
    });
  }

  _setupListener() {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.name === 'WORKER_KEEP_ALIVE_MESSAGE') {
        return;
      }

      console.log('LISTENER MV3', msg);

      if (msg.data) {
        if (this.messageCallbacks[data.messageId]) {
          this.messageCallbacks[data.messageId](data);
        } else if (data.action === CONNECTION_EVENT) {
          this.isDeviceConnected = data.payload.connected;
        }
      }
    });
  }

  _sendMessage(msg, cb) {
    msg.target = 'LEDGER-IFRAME';

    this.currentMessageId += 1;
    msg.messageId = this.currentMessageId;

    this.messageCallbacks[this.currentMessageId] = cb;
    chrome.runtime.sendMessage(msg);
    // this.iframe.contentWindow.postMessage(msg, '*');
  }
}
