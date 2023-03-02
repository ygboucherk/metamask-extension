/* eslint-disable no-undef */
/* eslint-disable import/unambiguous */
const CONNECTION_EVENT = 'ledger-connection-change';

const messageCallbacks = {};
let currentMessageId = 0;

window.addEventListener('message', ({ origin, data }) => {
  if (origin !== 'https://metamask.github.io') {
    return;
  }

  if (data) {
    if (messageCallbacks[data.messageId]) {
      messageCallbacks[data.messageId](data);
    } else if (data.action === CONNECTION_EVENT) {
      chrome.runtime.sendMessage({
        action: 'ledger-connection-event',
        payload: data.payload.connected,
      });
    }
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.offscreenIframe || msg.target !== 'ledger') {
    return;
  }

  const iframe = document.querySelector('iframe');

  currentMessageId += 1;
  const iframeMsg = {
    ...msg,
    target: 'LEDGER-IFRAME',
    messageId: currentMessageId,
  };
  messageCallbacks[currentMessageId] = sendResponse;

  iframe.contentWindow.postMessage(iframeMsg, '*');

  // eslint-disable-next-line consistent-return
  return true;
});
