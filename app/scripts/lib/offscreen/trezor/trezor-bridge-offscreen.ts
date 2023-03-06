import { TrezorBridge, TREZOR_CONNECT_MANIFEST } from 'eth-trezor-keyring';
import type {
  TrezorConnect,
  EthereumSignMessage,
  EthereumSignTransaction,
  Params,
  EthereumSignTypedData,
  EthereumSignTypedDataTypes,
  GetPublicKey,
} from '@trezor/connect-web';
import { TREZOR_ACTION, TREZOR_EVENT, TREZOR_TARGET } from './constants';

export class TrezorBridgeOffscreen implements TrezorBridge {
  model: string | undefined;

  init() {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.event === TREZOR_EVENT.DEVICE_CONNECT) {
        this.model = msg.payload;
      }
    });

    return new Promise<void>((resolve) => {
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: TREZOR_TARGET,
          action: TREZOR_ACTION.INIT,
          params: { manifest: TREZOR_CONNECT_MANIFEST, lazyLoad: true },
        },
        (response) => {
          resolve(response);
        },
      );
    });
  }

  dispose() {
    return new Promise<void>((resolve) => {
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: TREZOR_TARGET,
          action: TREZOR_ACTION.DISPOSE,
        },
        (response) => {
          resolve(response);
        },
      );
    });
  }

  getPublicKey(params: Params<GetPublicKey>) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: TREZOR_TARGET,
          action: TREZOR_ACTION.GET_PUBLIC_KEY,
          params,
        },
        (response) => {
          resolve(response);
        },
      );
    }) as ReturnType<TrezorConnect['getPublicKey']>;
  }

  ethereumSignTransaction(params: Params<EthereumSignTransaction>) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: TREZOR_TARGET,
          action: TREZOR_ACTION.SIGN_TRANSACTION,
          params,
        },
        (response) => {
          resolve(response);
        },
      );
    }) as ReturnType<TrezorConnect['ethereumSignTransaction']>;
  }

  ethereumSignMessage(params: Params<EthereumSignMessage>) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: TREZOR_TARGET,
          action: TREZOR_ACTION.SIGN_MESSAGE,
          params,
        },
        (response) => {
          resolve(response);
        },
      );
    }) as ReturnType<TrezorConnect['ethereumSignMessage']>;
  }

  ethereumSignTypedData(
    params: Params<EthereumSignTypedData<EthereumSignTypedDataTypes>>,
  ) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          offscreenIframe: true,
          target: TREZOR_TARGET,
          action: TREZOR_ACTION.SIGN_TYPED_DATA,
          params,
        },
        (response) => {
          resolve(response);
        },
      );
    }) as ReturnType<TrezorConnect['ethereumSignTypedData']>;
  }
}
