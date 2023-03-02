type Target = 'trezor' | 'ledger' | 'lattice';

export function sendOffscreenMessage({
  target,
  action,
  params,
  responseCallback,
}: {
  target: Target;
  action: string;
  params?: unknown;
  responseCallback: (
    response: unknown,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void,
  ) => unknown;
}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        offscreenIframe: true,
        target,
        action,
        params,
      },
      (response: unknown) => {
        responseCallback(response, resolve, reject);
      },
    );
  });
}

export function addOffscreenListener(
  action: string,
  callback: (msg: unknown) => void,
) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === action) {
      callback(msg);
    }
  });
}
