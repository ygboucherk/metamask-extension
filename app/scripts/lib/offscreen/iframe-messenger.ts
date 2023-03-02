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
    response: any,
    resolve: (value: any) => void,
    reject: (reason?: any) => void,
  ) => any;
}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        offscreenIframe: true,
        target,
        action,
        params,
      },
      (response) => {
        responseCallback(response, resolve, reject);
      },
    );
  });
}

export function addOffscreenListener(
  action: string,
  callback: (msg: any) => void,
) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === action) {
      callback(msg);
    }
  });
}
