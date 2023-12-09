import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { assertIsDefined, getEndpoint } from "@quirks/core";
import { store } from "@quirks/store";

let queryClient: CosmWasmClient;

export const connectQueryClient = async (chainName: string) => {
  const state = store.getState();

  const chain = getChain(chainName);
  assertIsDefined(chain);

  const endpoint = getEndpoint(chainName, state.chains);

  const CosmWasmClient = (await import("@cosmjs/cosmwasm-stargate"))
    .CosmWasmClient;

  queryClient = await CosmWasmClient.connect(endpoint.rpc.address);
};

export const balances = (chainName: string) => {
  const state = store.getState();
  const sender = getAddress(chainName);

  return queryClient.getBalance(sender, "ubtsg");
};
