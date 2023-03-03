import { CallbackProcessor } from './callback-processor';

const OFFSCREEN_MESSAGE_TARGET = 'ledger';
const CONNECTION_EVENT = 'ledger-connection-change';
const LEDGER_FRAME_ORIGIN_URL = 'https://metamask.github.io';

const callbackProcessor = new CallbackProcessor();

window.addEventListener('message', ({ origin, data }) => {
  if (origin !== LEDGER_FRAME_ORIGIN_URL) {
    return;
  }

  if (data) {
    if (data.action === CONNECTION_EVENT) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        action: CONNECTION_EVENT,
        payload: data.payload.connected,
      });
    }

    callbackProcessor.processCallback(data);
  }
});

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.offscreenIframe || msg.target !== OFFSCREEN_MESSAGE_TARGET) {
    return;
  }

  const iframe = document.querySelector('iframe');

  const messageId = callbackProcessor.registerCallback(sendResponse);
  const iframeMsg = {
    ...msg,
    target: 'LEDGER-IFRAME',
    messageId,
  };

  iframe.contentWindow.postMessage(iframeMsg, '*');

  // eslint-disable-next-line consistent-return
  return true;
});
