import TrezorConnect from '@trezor/connect-web';

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.offscreenIframe || msg.target !== 'trezor') {
    return;
  }

  switch (msg.action) {
    case 'init':
      TrezorConnect.on('DEVICE_EVENT', (event) => {
        if (event?.payload?.features) {
          // eslint-disable-next-line no-undef
          chrome.runtime.sendMessage({
            action: 'trezor-device-event',
            payload: event.payload.features,
          });
        }
      });

      TrezorConnect.init({
        ...msg.params,
        env: 'web',
      }).then(() => {
        sendResponse();
      });

      break;

    case 'dispose':
      // This removes the Trezor Connect iframe from the DOM
      // This method is not well documented, but the code it calls can be seen
      // here: https://github.com/trezor/connect/blob/dec4a56af8a65a6059fb5f63fa3c6690d2c37e00/src/js/iframe/builder.js#L181
      TrezorConnect.dispose();

      sendResponse();

      break;

    case 'get-public-key':
      TrezorConnect.getPublicKey(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case 'sign-transaction':
      TrezorConnect.ethereumSignTransaction(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case 'sign-message':
      TrezorConnect.ethereumSignMessage(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case 'sign-typed-data':
      TrezorConnect.ethereumSignTypedData(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    default:
      sendResponse({
        success: false,
        payload: {
          error: 'Trezor message not supported',
        },
      });
  }

  // eslint-disable-next-line consistent-return
  return true;
});
