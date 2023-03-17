import { Api, JsonRpc } from 'eosjs';

import { Abi } from 'eosjs/dist/eosjs-rpc-interfaces';
import fetch from 'node-fetch';

const config = {
  rpcEndpoint: 'https://wax.api.eosnation.io',
  chainId: '8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b',
}

export class EosManager {
  private readonly rpc: JsonRpc;
  private readonly api: Api;

  constructor() {
    this.rpc = new JsonRpc(config.rpcEndpoint, { fetch });

    this.api = new Api({
      rpc: this.rpc,
      chainId: config.chainId,
      signatureProvider: null,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
  }

  public async getAbi(contractName: string): Promise<Abi> {
    return await this.api.getAbi(contractName);
  }
}
