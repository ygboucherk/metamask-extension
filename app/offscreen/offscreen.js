chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg.offscreen) {
    return;
  }
  switch (msg.type) {
    case "TZInit":
      console.log("OFFSCREEN INIT", msg.params);

      TrezorConnect.on('DEVICE_EVENT', (event) => {
        if (event && event.payload && event.payload.features) {
          chrome.runtime.sendMessage({
            type: 'TZDeviceEvent',
            event,
          })
        }
      });
  
      TrezorConnect.init(msg.params).then(() => {
        sendResponse();
      });

      break;

    case "TZDispose":
      console.log("OFFSCREEN DISPOSE");

      // This removes the Trezor Connect iframe from the DOM
      // This method is not well documented, but the code it calls can be seen
      // here: https://github.com/trezor/connect/blob/dec4a56af8a65a6059fb5f63fa3c6690d2c37e00/src/js/iframe/builder.js#L181
      TrezorConnect.dispose();
      
      sendResponse();

      break;

    case "TZGetPublicKey":
      console.log("OFFSCREEN GET PUBLIC KEY", msg.params);

      TrezorConnect.getPublicKey(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case "TZSignTransaction":
      console.log("OFFSCREEN SIGN TX", msg.params);

      TrezorConnect.ethereumSignTransaction(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case "TZSignMessage":
      console.log("OFFSCREEN SIGN MSG", msg.params);

      TrezorConnect.ethereumSignMessage(msg.params).then((result) => {
        sendResponse(result);
      });

      break;

    case "TZSignTypedData":
      console.log("OFFSCREEN SIGN TYPED DATA", msg.params);

      TrezorConnect.ethereumSignTypedData(msg.params).then((result) => {
        sendResponse(result);
      });

      break;
  }

  return true;
});

console.log('OFFSCREEN LOADED', chrome.runtime)
