/* eslint-disable no-undef */
/* eslint-disable import/unambiguous */
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import LedgerEth from '@ledgerhq/hw-app-eth';
import WebSocketTransport from '@ledgerhq/hw-transport-http/lib/WebSocketTransport';

// URL which triggers Ledger Live app to open and handle communication
const BRIDGE_URL = 'ws://localhost:8435';

// Number of seconds to poll for Ledger Live and Ethereum app opening
const TRANSPORT_CHECK_DELAY = 1000;
const TRANSPORT_CHECK_LIMIT = 120;

let transportType = 'webhid';
let app = null;
let transport = null;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg.offscreenIframe || msg.target !== 'ledger') {
    return;
  }
  console.log('LEDGER IFRAME MESSAGE RECEIVED 1', msg);

  const { action, params } = msg;

  executeAction(action, params)
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

async function executeAction(action, params) {
  switch (action) {
    case 'ledger-unlock':
      return unlock(params.hdPath);

    case 'ledger-sign-transaction':
      console.log('NOT IMPLEMENTED', action);
      // this.signTransaction(replyAction, params.hdPath, params.tx, messageId);
      break;

    case 'ledger-sign-personal-message':
      console.log('NOT IMPLEMENTED', action);
      // this.signPersonalMessage(
      //   replyAction,
      //   params.hdPath,
      //   params.message,
      //   messageId,
      // );
      break;

    case 'ledger-close-bridge':
      return cleanUp();

    case 'ledger-update-transport':
      const transportType =
        params.transportType === 'ledgerLive' || params.useLedgerLive
          ? 'ledgerLive'
          : params.transportType === 'webhid'
          ? 'webhid'
          : 'u2f';

      return updateTransportTypePreference(transportType);

    case 'ledger-make-app':
      return attemptMakeApp();

    case 'ledger-sign-typed-data':
      console.log('NOT IMPLEMENTED', action);
      // this.signTypedData(
      //   replyAction,
      //   params.hdPath,
      //   params.domainSeparatorHex,
      //   params.hashStructMessageHex,
      //   messageId,
      // );
      break;

    default:
      console.error('Unknown ledger action', action);
      return {
        success: false,
        error: 'Unknown ledger action',
      };
  }
}

async function updateTransportTypePreference(transportType) {
  transportType = transportType;

  return cleanUp();
}

async function cleanUp() {
  app = null;

  if (transport) {
    await transport.close();
    transport = null;
  }

  return {
    success: true,
  };
}

async function attemptMakeApp() {
  try {
    await makeApp({ openOnly: true });
    await cleanUp();
    return {
      success: true,
    };
  } catch (error) {
    await cleanUp();
    return {
      success: false,
      error,
    };
  }
}

async function makeApp(config = {}) {
  try {
    if (transportType === 'ledgerLive') {
      let reestablish = false;
      try {
        await WebSocketTransport.check(BRIDGE_URL);
      } catch (_err) {
        window.open('ledgerlive://bridge?appName=Ethereum');
        await checkTransportLoop();
        reestablish = true;
      }
      if (!app || reestablish) {
        transport = await WebSocketTransport.open(BRIDGE_URL);
        app = new LedgerEth(transport);
      }
    } else if (transportType === 'webhid') {
      const device = transport && transport.device;
      const nameOfDeviceType = device && device.constructor.name;
      const deviceIsOpen = device && device.opened;
      if (app && nameOfDeviceType === 'HIDDevice' && deviceIsOpen) {
        return;
      }
      transport = config.openOnly
        ? await TransportWebHID.openConnected()
        : await TransportWebHID.create();
      app = new LedgerEth(transport);
    } else {
      transport = await TransportU2F.create();
      app = new LedgerEth(transport);
    }
  } catch (error) {
    console.log('LEDGER:::CREATE APP ERROR', error);
    throw error;
  }
}

async function checkTransportLoop(i) {
  const iterator = i || 0;
  return WebSocketTransport.check(BRIDGE_URL).catch(async () => {
    await new Promise((success) => setTimeout(success, TRANSPORT_CHECK_DELAY));
    if (iterator < TRANSPORT_CHECK_LIMIT) {
      return checkTransportLoop(iterator + 1);
    } else {
      throw new Error('Ledger transport check timeout');
    }
  });
}

async function unlock(hdPath) {
  try {
    await makeApp();
    const res = await app.getAddress(hdPath, false, true);
    return {
      success: true,
      payload: res,
    };
  } catch (err) {
    const e = ledgerErrToMessage(err);
    return {
      success: false,
      payload: { error: e },
    };
  } finally {
    if (transportType !== 'ledgerLive') {
      await cleanUp();
    }
  }
}

function ledgerErrToMessage (err) {
  const isU2FError = (err) => !!err && !!(err).metaData
  const isStringError = (err) => typeof err === 'string'
  const isErrorWithId = (err) => err.hasOwnProperty('id') && err.hasOwnProperty('message')
  const isWrongAppError = (err) => String(err.message || err).includes('6804')
  const isLedgerLockedError = (err) => err.message && err.message.includes('OpenFailed')

  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  if (isU2FError(err)) {
    if (err.metaData.code === 5) {
      return new Error('LEDGER_TIMEOUT')
    }
    return err.metaData.type
  }

  if (isWrongAppError(err)) {
      return new Error('LEDGER_WRONG_APP')
  }

  if (isLedgerLockedError(err) || (isStringError(err) && err.includes('6801'))) {
      return new Error('LEDGER_LOCKED')
  }

  if (isErrorWithId(err)) {
    // Browser doesn't support U2F
    if (err.message.includes('U2F not supported')) {
      return new Error('U2F_NOT_SUPPORTED')
    }
  }

  // Other
  return err
}

console.log('LEDGER IFRAME OFFSCREEN LOADED');
