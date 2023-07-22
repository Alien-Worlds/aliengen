import { Api, JsonRpc } from "eosjs";

import { Abi } from "eosjs/dist/eosjs-rpc-interfaces";
import fetch from "node-fetch";
import { RpcConfig } from "../actions/config";

export class EosManager {
  private readonly rpc: JsonRpc;
  private readonly api: Api;

  constructor(config: RpcConfig) {
    const { endpoint, chainId } = config;
    this.rpc = new JsonRpc(endpoint, { fetch });

    this.api = new Api({
      rpc: this.rpc,
      chainId,
      signatureProvider: null,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
  }

  public async getAbi(contractName: string): Promise<Abi> {
    return await this.api.getAbi(contractName);
  }
}
