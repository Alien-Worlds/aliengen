import { Serialize } from "eosjs";
import { Abi } from "../types/abi.types";

export const hexToUint8Array = (hex: string) => {
  if (typeof hex !== "string") {
    throw new Error("Expected string containing hex digits");
  }
  if (hex.length % 2) {
    throw new Error("Odd number of hex digits");
  }
  const l = hex.length / 2;
  const result = new Uint8Array(l);
  for (let i = 0; i < l; ++i) {
    const x = parseInt(hex.substr(i * 2, 2), 16);
    if (Number.isNaN(x)) {
      throw new Error("Expected hex string");
    }
    result[i] = x;
  }
  return result;
};

export const hexToAbi = (hex: string): Abi => {
  const bytes = hexToUint8Array(hex);
  const abiTypes = Serialize.getTypesFromAbi(Serialize.createAbiTypes());
  const buffer = new Serialize.SerialBuffer({ array: bytes });
  buffer.restartRead();
  return abiTypes.get("abi_def").deserialize(buffer);
};
