chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.offscreenIframe || msg.target !== 'trezor') {
    return;
  }

  switch (msg.topic) {
    case 'init':
      // console.log('OFFSCREEN INIT', msg.params);

      TrezorConnect.on('DEVICE_EVENT', (event) => {
        if (event && event.payload && event.payload.features) {
          chrome.runtime.sendMessage({
            topic: 'trezor-device-event',
            event,
          });
        }
      });

      TrezorConnect.init(msg.params).then(() => {
        sendResponse();
      });

      break;

    case 'dispose':
      // console.log('OFFSCREEN DISPOSE');

      // This removes the Trezor Connect iframe from the DOM
      // This method is not well documented, but the code it calls can be seen
      // here: https://github.com/trezor/connect/blob/dec4a56af8a65a6059fb5f63fa3c6690d2c37e00/src/js/iframe/builder.js#L181
      TrezorConnect.dispose();

      sendResponse();

      break;

    case 'get-public-key':
      // console.log('OFFSCREEN GET PUBLIC KEY', msg.params);

      TrezorConnect.getPublicKey(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case 'sign-transaction':
      // console.log('OFFSCREEN SIGN TX', msg.params);

      TrezorConnect.ethereumSignTransaction(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case 'sign-message':
      // console.log('OFFSCREEN SIGN MSG', msg.params);

      TrezorConnect.ethereumSignMessage(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case 'sign-typed-data':
      // console.log('OFFSCREEN SIGN TYPED DATA', msg.params);

      TrezorConnect.ethereumSignTypedData(msg.params).then((result) => {
        sendResponse(result);
      });

      break;
  }

  return true;
});

console.log('TREZOR IFRAME OFFSCREEN LOADED');
