import { TREZOR_CONNECT_MANIFEST } from 'eth-trezor-keyring';
import type {
  TrezorConnect,
  EthereumSignMessage,
  EthereumSignTransaction,
  Params,
  EthereumSignTypedData,
  EthereumSignTypedDataTypes,
  GetPublicKey,
} from '@trezor/connect-web';
import {
  addOffscreenListener,
  sendOffscreenMessage,
} from '../iframe-messenger';
import { TREZOR_ACTION, TREZOR_EVENT } from './constants';

const target = 'trezor';

const responseCallback = (response: any, resolve: (value: any) => void) => {
  resolve(response);
};

export class TrezorBridgeOffscreen {
  model: string | undefined;

  init() {
    addOffscreenListener(TREZOR_EVENT.DEVICE_CONNECT, (model: string) => {
      this.model = model;
    });

    return sendOffscreenMessage({
      target,
      action: TREZOR_ACTION.INIT,
      params: { manifest: TREZOR_CONNECT_MANIFEST, lazyLoad: true },
      responseCallback,
    }) as Promise<void>;
  }

  dispose() {
    return sendOffscreenMessage({
      target,
      action: TREZOR_ACTION.DISPOSE,
      responseCallback,
    }) as Promise<void>;
  }

  getPublicKey(params: Params<GetPublicKey>) {
    return sendOffscreenMessage({
      target,
      action: TREZOR_ACTION.GET_PUBLIC_KEY,
      params,
      responseCallback,
    }) as ReturnType<TrezorConnect['getPublicKey']>;
  }

  ethereumSignTransaction(params: Params<EthereumSignTransaction>) {
    return sendOffscreenMessage({
      target,
      action: TREZOR_ACTION.SIGN_TRANSACTION,
      params,
      responseCallback,
    }) as ReturnType<TrezorConnect['ethereumSignTransaction']>;
  }

  ethereumSignMessage(params: Params<EthereumSignMessage>) {
    return sendOffscreenMessage({
      target,
      action: TREZOR_ACTION.SIGN_MESSAGE,
      params,
      responseCallback,
    }) as ReturnType<TrezorConnect['ethereumSignMessage']>;
  }

  ethereumSignTypedData(
    params: Params<EthereumSignTypedData<EthereumSignTypedDataTypes>>,
  ) {
    return sendOffscreenMessage({
      target,
      action: TREZOR_ACTION.SIGN_TYPED_DATA,
      params,
      responseCallback,
    }) as ReturnType<TrezorConnect['ethereumSignTypedData']>;
  }
}
