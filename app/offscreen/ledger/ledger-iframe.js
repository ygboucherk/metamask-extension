const CONNECTION_EVENT = 'ledger-connection-change';

let currentMessageId = 0;
let messageCallbacks = {};
let isDeviceConnected = false;

window.addEventListener('message', ({ origin, data }) => {
  console.log('MESSAGE', { origin, data });
  if (origin !== 'https://metamask.github.io') {
    return;
  }

  if (data) {
    if (messageCallbacks[data.messageId]) {
      messageCallbacks[data.messageId](data);
    } else if (data.action === CONNECTION_EVENT) {
      // Not doing anything
      isDeviceConnected = data.payload.connected;
    }
  }

  return;
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.name === 'WORKER_KEEP_ALIVE_MESSAGE') {
    return;
  }

  console.log('LEDGER IFRAME MESSAGE RECEIVED 1', msg);
  if (!msg.offscreenIframe || msg.target !== 'ledger') {
    return;
  }

  const iframe = document.querySelector('iframe');
  
  currentMessageId += 1;
  const iframeMsg = {
    ...msg,
    target: 'LEDGER-IFRAME',
    messageId: currentMessageId,
  }
  messageCallbacks[currentMessageId] = sendResponse

  console.log('LEDGER IFRAME MESSAGE RECEIVED 2', iframeMsg, iframe);

  iframe.contentWindow.postMessage(iframeMsg, '*');

  return true;
});

console.log('LEDGER IFRAME OFFSCREEN LOADED');
