<script setup lang="ts">
import { useConnect, useConfig } from "@quirks/vue";
import { suggestChains } from "@quirks/store";
import { bitsong, bitsongAssetList } from "@nabla-studio/chain-registry";
import { useQuery } from "@tanstack/vue-query";

const { wallets } = useConfig();
const { connect, disconnect, connected, status } = useConnect();
const { accounts } = useChains();

const address = computed(() => {
  console.log(accounts.value);
  return accounts.value.find((account) => account.chainId === "bitsong-2b")
    ?.bech32Address;
});

const queryKey = computed(() => ["balance", address.value]);
const enabled = computed(
  () => address.value !== undefined && cwQueryClient.value !== undefined
);

useCWQueryClient("bitsong");

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
    <div v-for="wallet in wallets" :key="wallet.options.name">
      <button
        @click="
          {
            open(wallet.options.name);
          }
        "
      >
        <img
          :src="wallet.options.logoUrls?.light?.svg"
          :alt="wallet.options.prettyName"
          height="48px"
          width="48px"
          :style="{ width: '48px', height: '48px' }"
        />
      </button>

      <a
        :href="
          wallet.options.downloads && wallet.options.downloads.length > 0
            ? wallet.options.downloads[0].link
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
