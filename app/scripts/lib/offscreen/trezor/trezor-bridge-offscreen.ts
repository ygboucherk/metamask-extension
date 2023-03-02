import { TREZOR_CONNECT_MANIFEST } from 'eth-trezor-keyring';
import type {
  EthereumSignedTx,
  EthereumSignMessage,
  EthereumSignTransaction,
  Params,
  Response,
  PROTO,
  EthereumSignTypedData,
  EthereumSignTypedDataTypes,
  GetPublicKey,
} from '@trezor/connect-web';
import {
  addOffscreenListener,
  sendOffscreenMessage,
} from '../iframe-messenger';

const target = 'trezor';

const responseCallback = (response: any, resolve: (value: any) => void) => {
  resolve(response);
};

export class TrezorBridgeOffscreen {
  model: string | undefined;

  init() {
    addOffscreenListener('trezor-device-event', (msg: any) => {
      this.model = msg?.event?.payload?.features;
    });

    return sendOffscreenMessage({
      target,
      action: 'init',
      params: { manifest: TREZOR_CONNECT_MANIFEST, lazyLoad: true },
      responseCallback,
    }) as Promise<void>;
  }

  dispose() {
    return sendOffscreenMessage({
      target,
      action: 'dispose',
      responseCallback,
    }) as Promise<void>;
  }

  getPublicKey(params: Params<GetPublicKey>) {
    // TODO Extract HDNodeResponse from TrezorConnect
    return sendOffscreenMessage({
      target,
      action: 'get-public-key',
      params,
      responseCallback,
    });
  }

  ethereumSignTransaction(params: Params<EthereumSignTransaction>) {
    return sendOffscreenMessage({
      target,
      action: 'sign-transaction',
      params,
      responseCallback,
    }) as Promise<Response<EthereumSignedTx>>;
  }

  ethereumSignMessage(params: Params<EthereumSignMessage>) {
    return sendOffscreenMessage({
      target,
      action: 'sign-message',
      params,
      responseCallback,
    }) as Promise<Response<PROTO.MessageSignature>>;
  }

  ethereumSignTypedData(
    params: Params<EthereumSignTypedData<EthereumSignTypedDataTypes>>,
  ) {
    return sendOffscreenMessage({
      target,
      action: 'sign-typed-data',
      params,
      responseCallback,
    }) as Promise<Response<PROTO.EthereumTypedDataSignature>>;
  }
}
