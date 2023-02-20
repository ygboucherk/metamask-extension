window.addEventListener('message', ({ origin, data }) => {
  console.log('MESSAGE', { origin, data });
  if (origin !== 'https://metamask.github.io') {
    return;
  }

  // if (data) {
  //   if (this.messageCallbacks[data.messageId]) {
  //     this.messageCallbacks[data.messageId](data);
  //   } else if (data.action === CONNECTION_EVENT) {
  //     this.isDeviceConnected = data.payload.connected;
  //   }
  // }

  return;
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.name === 'WORKER_KEEP_ALIVE_MESSAGE') {
    return;
  }
  
  console.log('LEDGER IFRAME MESSAGE RECEIVED 1', msg);
  if (msg.target !== 'LEDGER-IFRAME') {
    return;
  }

  const iframe = document.querySelector("iframe");
  console.log('LEDGER IFRAME MESSAGE RECEIVED', msg, iframe);
  iframe.contentWindow.postMessage(msg, '*')

  sendResponse();

  return true;
});

console.log('LEDGER IFRAME OFFSCREEN LOADED');
