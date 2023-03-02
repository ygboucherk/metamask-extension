/* eslint-disable import/unambiguous */
/* eslint-disable no-undef */

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.offscreenIframe || msg.target !== 'lattice') {
    return;
  }

  console.log('LATTICE IFRAME MSG RECEIVED', msg);

  // Open the tab
  openConnectorTab(msg.params.url).then((conn) => {
    let listenInterval;

    if (conn.chromium) {
      // On a Chromium browser we can just listen for a window message
      window.addEventListener(
        'message',
        (event) => {
          console.log('LATTICE IFRAME EVENT RECEIVED', event);

          // Ensure origin
          const base = 'https://lattice.gridplus.io';
          if (event.origin !== base) {
            return;
          }

          try {
            // Stop the listener
            clearInterval(listenInterval);
            // Parse and return creds
            const creds = JSON.parse(event.data);
            if (!creds.deviceID || !creds.password) {
              sendResponse({
                error: new Error('Invalid credentials returned from Lattice.'),
              });
            }
            sendResponse({
              result: creds,
            });
          } catch (err) {
            sendResponse({
              error: err,
            });
          }
        },
        false,
      );
      // Watch for the open window closing before creds are sent back
      listenInterval = setInterval(() => {
        if (conn.chromium.closed) {
          clearInterval(listenInterval);
          sendResponse({
            error: new Error('Lattice connector closed.'),
          });
        }
      }, 500);
    } else if (conn.firefox) {
      // For Firefox we cannot use `window` in the extension and can't
      // directly communicate with the tabs very easily so we use a
      // workaround: listen for changes to the URL, which will contain
      // the login info.
      // NOTE: This will only work if have `https://lattice.gridplus.io/*`
      // host permissions in your manifest file (and also `activeTab` permission)
      const loginUrlParam = '&loginCache=';
      listenInterval = setInterval(() => {
        findTabById(conn.firefox.id).then((tab) => {
          if (!tab || !tab.url) {
            sendResponse({
              error: new Error('Lattice connector closed.'),
            });
          }
          // If the tab we opened contains a new URL param
          const paramLoc = tab.url.indexOf(loginUrlParam);
          if (paramLoc < 0) {
            return;
          }
          const dataLoc = paramLoc + loginUrlParam.length;
          // Stop this interval
          clearInterval(listenInterval);
          try {
            // Parse the login data. It is a stringified JSON object
            // encoded as a base64 string.
            const _creds = Buffer.from(
              tab.url.slice(dataLoc),
              'base64',
            ).toString();
            // Close the tab and return the credentials
            browser.tabs.remove(tab.id).then(() => {
              const creds = JSON.parse(_creds);
              if (!creds.deviceID || !creds.password) {
                sendResponse({
                  error: new Error(
                    'Invalid credentials returned from Lattice.',
                  ),
                });
              }

              sendResponse({
                result: creds,
              });
            });
          } catch (err) {
            sendResponse({
              error: 'Failed to get login data from Lattice. Please try again.',
            });
          }
        });
      }, 500);
    }
  });

  // eslint-disable-next-line consistent-return
  return true;
});

async function openConnectorTab(url) {
  try {
    const browserTab = window.open(url);
    console.log('LATTICE IFRAME OPEN WINDOW', browserTab);
    // Preferred option for Chromium browsers. This extension runs in a window
    // for Chromium so we can do window-based communication very easily.
    if (browserTab) {
      return { chromium: browserTab };
    } else if (browser && browser.tabs && browser.tabs.create) {
      // FireFox extensions do not run in windows, so it will return `null` from
      // `window.open`. Instead, we need to use the `browser` API to open a tab.
      // We will surveille this tab to see if its URL parameters change, which
      // will indicate that the user has logged in.
      const tab = await browser.tabs.create({ url });
      return { firefox: tab };
    }

    throw new Error('Unknown browser context. Cannot open Lattice connector.');
  } catch (err) {
    throw new Error('Failed to open Lattice connector.');
  }
}

async function findTabById(id) {
  const tabs = await browser.tabs.query({});
  return tabs.find((tab) => tab.id === id);
}

console.log('LATTICE IFRAME OFFSCREEN LOADED');
