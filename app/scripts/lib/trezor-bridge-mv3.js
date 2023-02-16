/* eslint-disable no-undef */
const { TREZOR_CONNECT_MANIFEST } = require('eth-trezor-keyring');

class TrezorBridgeMv3 {
  init() {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.topic === 'trezor-device-event') {
        if (msg.event && msg.event.payload && msg.event.payload.features) {
          console.log(
            'MV3 BRIDGE DEVICE EVENT',
            msg.event.payload.features.model,
          );
          this.model = msg.event.payload.features.model;
        }
      }
    });

    return new Promise((resolve) => {
      console.log('MV3 BRIDGE INIT SEND');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'trezor',
          topic: 'init',
          params: { manifest: TREZOR_CONNECT_MANIFEST, lazyLoad: true },
        },
        () => {
          console.log('MV3 BRIDGE INIT RECEIVED');
          resolve();
        },
      );
    });
  }

  dispose() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'trezor',
          topic: 'dispose',
        },
        () => {
          console.log('MV3 BRIDGE DISPOSE RECEIVED');
          resolve();
        },
      );
    });
  }

  getPublicKey(params) {
    return new Promise((resolve) => {
      console.log('MV3 BRIDGE GETPUBLICKEY SEND');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'trezor',
          topic: 'get-public-key',
          params,
        },
        (response) => {
          console.log('MV3 BRIDGE GETPUBLICKEY RECEIVED', response);
          resolve(response);
        },
      );
    });
  }

  ethereumSignTransaction(params) {
    return new Promise((resolve) => {
      console.log('MV3 BRIDGE SIGNTX SEND');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'trezor',
          topic: 'sign-transaction',
          params,
        },
        (response) => {
          console.log('MV3 BRIDGE SIGNTX RECEIVED', response);
          resolve(response);
        },
      );
    });
  }

  ethereumSignMessage(params) {
    return new Promise((resolve) => {
      console.log('MV3 BRIDGE SIGNMSG SEND');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'trezor',
          topic: 'sign-message',
          params,
        },
        (response) => {
          console.log('MV3 BRIDGE SIGNMSG RECEIVED', response);
          resolve(response);
        },
      );
    });
  }

  ethereumSignTypedData(params) {
    return new Promise((resolve) => {
      console.log('MV3 BRIDGE SIGNDATA');
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: 'trezor',
          topic: 'sign-typed-data',
          params,
        },
        (response) => {
          console.log('MV3 BRIDGE SIGNDATA RECEIVED', response);
          resolve(response);
        },
      );
    });
  }
}

export { TrezorBridgeMv3 };
