import { assertIsDefined, getEndpoint } from "@quirks/core";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const useQueryClient = (chainName: string) => {
  const chains = useQuirks()((state) => state.chains);
  const queryClient = ref<CosmWasmClient>();

  watch(
    chains,
    async () => {
      if (chains.value && !queryClient.value) {
        const chain = getChain(chainName);
        assertIsDefined(chain);

        const endpoint = getEndpoint(chainName, chains.value);

        const CosmWasmClient = (await import("@cosmjs/cosmwasm-stargate"))
          .CosmWasmClient;

        queryClient.value = await CosmWasmClient.connect(endpoint.rpc.address);
      }
    },
    {
      immediate: true,
    }
  );

  return {
    queryClient,
  };
};
