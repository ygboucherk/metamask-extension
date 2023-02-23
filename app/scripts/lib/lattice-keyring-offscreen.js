/* eslint-disable no-undef */
/* eslint-disable import/unambiguous */
import LatticeKeyring from 'eth-lattice-keyring';

class LatticeKeyringOffscreen extends LatticeKeyring {
  constructor(opts = {}) {
    super(opts);
  }

  async _getCreds() {
    try {
      // If we are not aware of what Lattice we should be talking to,
      // we need to open a window that lets the user go through the
      // pairing or connection process.
      const name = this.appName ? this.appName : 'Unknown';
      const base = 'https://lattice.gridplus.io';
      const url = `${base}?keyring=${name}&forceLogin=true`;

      // send a msg to the render process to open lattice connector
      // and collect the credentials
      const creds = await new Promise((resolve, reject) => {
        console.log('LATTICE MV3 BRIDGE - GET CREDS');
        chrome.runtime.sendMessage(
          {
            offscreenIframe: true,
            target: 'lattice',
            action: 'lattice-credentials',
            params: {
              url,
            },
          },
          (response) => {
            console.log('LATTICE MV3 BRIDGE - GET CREDS RESPONSE', response);

            if (response.error) {
              reject(response.error);
            }

            resolve(response.result);
          },
        );
      });

      return creds;
    } catch (err) {
      throw new Error(err);
    }
  }
}

LatticeKeyringOffscreen.type = LatticeKeyring.type;
export { LatticeKeyringOffscreen };
