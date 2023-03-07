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
      chrome.runtime.sendMessage({
        action: CONNECTION_EVENT,
        payload: data.payload.connected,
      });

      return;
    }

    callbackProcessor.processCallback(data);
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.offscreenIframe || msg.target !== OFFSCREEN_MESSAGE_TARGET) {
    return;
  }

  const iframe = document.querySelector('iframe');

  if (!iframe?.contentWindow) {
    const error = new Error('Ledger iframe not present');
    sendResponse({
      success: false,
      error,
      payload: {
        error,
      },
    });
  }

  const messageId = callbackProcessor.registerCallback(sendResponse);
  const iframeMsg = {
    ...msg,
    target: 'LEDGER-IFRAME',
    messageId,
  };

  // It has already been checked that they are not null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  iframe!.contentWindow!.postMessage(iframeMsg, '*');

  // This keeps sendResponse function valid after return
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
  // eslint-disable-next-line consistent-return
  return true;
});
