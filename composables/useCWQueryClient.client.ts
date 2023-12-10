import { assertIsDefined, getEndpoint } from "@quirks/core";
import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const cwQueryClient = ref<CosmWasmClient>();

export const useCWQueryClient = (chainName: string) => {
  const chains = useQuirks()((state) => state.chains);

  watch(
    chains,
    async () => {
      if (chains.value && !cwQueryClient.value) {
        const chain = getChain(chainName);
        assertIsDefined(chain);

        const endpoint = getEndpoint(chainName, chains.value);

        const CosmWasmClient = (await import("@cosmjs/cosmwasm-stargate"))
          .CosmWasmClient;

        cwQueryClient.value = await CosmWasmClient.connect(
          endpoint.rpc.address
        );
      }
    },
    {
      immediate: true,
    }
  );
};

export const balances = (chainName: string, address: string) => {
  return cwQueryClient.value?.getBalance(address, "ubtsg");
};
