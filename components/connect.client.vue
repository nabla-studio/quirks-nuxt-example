<script setup lang="ts">
import { useConnect, useConfig, useWalletEvents } from "@quirks/vue";
import { suggestChains } from "@quirks/store";
import { bitsong, bitsongAssetList } from "@nabla-studio/chain-registry";
import { useQuery } from "@tanstack/vue-query";

const { wallets } = useConfig();
const { connect, disconnect, connected, status } = useConnect();
const { address } = useChain("bitsong");

const queryKey = computed(() => ["balance", address.value]);
const enabled = computed(
  () => address.value !== undefined && cwQueryClient.value !== undefined
);

useCWQueryClient("bitsong");

useWalletEvents("keystorechange", () => {
  console.log("Keystore Changed");
});

const { data } = useQuery({
  queryKey,
  queryFn: () => {
    console.log("QUERY:", address.value);
    if (address.value) {
      return balances("bitsong", address.value);
    }

    return null;
  },
  enabled,
});

const open = async (walletName: string) => {
  await suggestChains(walletName, [
    { chain: bitsong, assetList: bitsongAssetList, name: "bitsong" },
  ]);
  await connect(walletName);
};
</script>

<template>
  Hello world {{ status }} {{ connected }}
  {{ wallets.length }}
  <button @click="disconnect" v-if="connected">DISCONNECT</button>
  <div v-else>
    <div v-for="wallet in wallets" :key="wallet.options.wallet_name">
      <button
        @click="
          {
            open(wallet.options.wallet_name);
          }
        "
      >
        <img
          :src="wallet.logoLight"
          :alt="wallet.options.pretty_name"
          height="48px"
          width="48px"
          :style="{ width: '48px', height: '48px' }"
        />
      </button>

      <a
        :href="
          wallet.options.platforms && wallet.options.platforms.length > 0
            ? wallet.options.platforms[0].install_link
            : '#'
        "
        target="_blank"
        v-if="!wallet.injected"
      >
        Install
      </a>
    </div>
  </div>

  <div>Balances: {{ JSON.stringify(data) }}</div>
</template>
