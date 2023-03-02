import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import LedgerEth from '@ledgerhq/hw-app-eth';
import WebSocketTransport from '@ledgerhq/hw-transport-http/lib/WebSocketTransport';

// URL which triggers Ledger Live app to open and handle communication
const BRIDGE_URL = 'ws://localhost:8435';

// Number of seconds to poll for Ledger Live and Ethereum app opening
const TRANSPORT_CHECK_DELAY = 1000;
const TRANSPORT_CHECK_LIMIT = 120;

class LedgerBridge {
  constructor() {
    this.addEventListeners();
    this.transportType = 'u2f';
  }

  addEventListeners() {
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (!msg.offscreenIframe || msg.target !== 'ledger') {
        return;
      }
      console.log('LEDGER IFRAME MESSAGE RECEIVED 1', msg);

      const { action, params } = msg;

      this.executeAction(action, params)
        .then((result) => {
          console.log('LEDGER IFRAME RESULT', { action, params, result });
          sendResponse(result);
        })
        .catch((error) => {
          console.log('LEDGER IFRAME ERROR', { action, params, error });
        });

      // eslint-disable-next-line consistent-return
      return true;
    });
  }

  async executeAction(action, params) {
    switch (action) {
      case 'ledger-unlock':
        return this.unlock(params.hdPath);

      case 'ledger-sign-transaction':
        return this.signTransaction(params.hdPath, params.tx);

      case 'ledger-sign-personal-message':
        return this.signPersonalMessage(params.hdPath, params.message);

      case 'ledger-close-bridge':
        return this.cleanUp();

      case 'ledger-update-transport':
        if (params.transportType === 'ledgerLive' || params.useLedgerLive) {
          return this.updateTransportTypePreference('ledgerLive');
        } else if (params.transportType === 'webhid') {
          return this.updateTransportTypePreference('webhid');
        }
        return this.updateTransportTypePreference('u2f');

      case 'ledger-make-app':
        return this.attemptMakeApp();

      case 'ledger-sign-typed-data':
        return this.signTypedData(
          params.hdPath,
          params.domainSeparatorHex,
          params.hashStructMessageHex,
        );

      default:
        throw new Error('Ledger action not executed');
    }
  }

  delay(ms) {
    return new Promise((success) => setTimeout(success, ms));
  }

  checkTransportLoop(i) {
    const iterator = i || 0;
    return WebSocketTransport.check(BRIDGE_URL).catch(async () => {
      await this.delay(TRANSPORT_CHECK_DELAY);
      if (iterator < TRANSPORT_CHECK_LIMIT) {
        return this.checkTransportLoop(iterator + 1);
      }
      throw new Error('Ledger transport check timeout');
    });
  }

  async attemptMakeApp() {
    try {
      await this.makeApp({ openOnly: true });
      await this.cleanUp();
      return {
        success: true,
      };
    } catch (error) {
      await this.cleanUp();
      return {
        success: false,
        error,
      };
    }
  }

  async makeApp(config = {}) {
    try {
      if (this.transportType === 'ledgerLive') {
        let reestablish = false;
        try {
          await WebSocketTransport.check(BRIDGE_URL);
        } catch (_err) {
          window.open('ledgerlive://bridge?appName=Ethereum');
          await this.checkTransportLoop();
          reestablish = true;
        }
        if (!this.app || reestablish) {
          this.transport = await WebSocketTransport.open(BRIDGE_URL);
          this.app = new LedgerEth(this.transport);
        }
      } else if (this.transportType === 'webhid') {
        const device = this.transport && this.transport.device;
        const nameOfDeviceType = device && device.constructor.name;
        const deviceIsOpen = device && device.opened;
        if (this.app && nameOfDeviceType === 'HIDDevice' && deviceIsOpen) {
          return;
        }
        this.transport = config.openOnly
          ? await TransportWebHID.openConnected()
          : await TransportWebHID.create();
        this.app = new LedgerEth(this.transport);
      } else {
        this.transport = await TransportU2F.create();
        this.app = new LedgerEth(this.transport);
      }
    } catch (e) {
      console.log('LEDGER:::CREATE APP ERROR', e);
      throw e;
    }
  }

  updateTransportTypePreference(transportType) {
    this.transportType = transportType;
    return this.cleanUp();
  }

  async cleanUp() {
    this.app = null;
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
    }

    return {
      success: true,
    };
  }

  async unlock(hdPath) {
    try {
      await this.makeApp();
      const res = await this.app.getAddress(hdPath, false, true);
      return {
        success: true,
        payload: res,
      };
    } catch (err) {
      const e = this.ledgerErrToMessage(err);
      return {
        success: false,
        payload: { error: e },
      };
    } finally {
      if (this.transportType !== 'ledgerLive') {
        this.cleanUp();
      }
    }
  }

  async signTransaction(hdPath, tx) {
    try {
      await this.makeApp();
      const res = await this.app.signTransaction(hdPath, tx);
      return {
        success: true,
        payload: res,
      };
    } catch (err) {
      const e = this.ledgerErrToMessage(err);
      return {
        success: false,
        payload: { error: e },
      };
    } finally {
      if (this.transportType !== 'ledgerLive') {
        this.cleanUp();
      }
    }
  }

  async signPersonalMessage(hdPath, message) {
    try {
      await this.makeApp();

      const res = await this.app.signPersonalMessage(hdPath, message);
      return {
        success: true,
        payload: res,
      };
    } catch (err) {
      const e = this.ledgerErrToMessage(err);
      return {
        success: false,
        payload: { error: e },
      };
    } finally {
      if (this.transportType !== 'ledgerLive') {
        this.cleanUp();
      }
    }
  }

  async signTypedData(hdPath, domainSeparatorHex, hashStructMessageHex) {
    try {
      await this.makeApp();

      const res = await this.app.signEIP712HashedMessage(
        hdPath,
        domainSeparatorHex,
        hashStructMessageHex,
      );
      return {
        success: true,
        payload: res,
      };
    } catch (err) {
      const e = this.ledgerErrToMessage(err);
      return {
        success: false,
        payload: { error: e },
      };
    } finally {
      this.cleanUp();
    }
  }

  ledgerErrToMessage(err) {
    const isU2FError = (e) => Boolean(e) && Boolean(e.metaData);
    const isStringError = (e) => typeof e === 'string';
    const isErrorWithId = (e) =>
      // eslint-disable-next-line no-prototype-builtins
      e.hasOwnProperty('id') && e.hasOwnProperty('message');
    const isWrongAppError = (e) => String(e.message || e).includes('6804');
    const isLedgerLockedError = (e) =>
      e.message && e.message.includes('OpenFailed');

    // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
    if (isU2FError(err)) {
      if (err.metaData.code === 5) {
        return new Error('LEDGER_TIMEOUT');
      }
      return err.metaData.type;
    }

    if (isWrongAppError(err)) {
      return new Error('LEDGER_WRONG_APP');
    }

    if (
      isLedgerLockedError(err) ||
      (isStringError(err) && err.includes('6801'))
    ) {
      return new Error('LEDGER_LOCKED');
    }

    if (isErrorWithId(err)) {
      // Browser doesn't support U2F
      if (err.message.includes('U2F not supported')) {
        return new Error('U2F_NOT_SUPPORTED');
      }
    }

    // Other
    return err;
  }
}

(() => {
  // eslint-disable-next-line no-unused-vars
  const bridge = new LedgerBridge();
})();
