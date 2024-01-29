<script setup lang="ts">
import {
  useConnect,
  useConfig,
  useWalletConnect,
  useWalletEvents,
} from "@quirks/vue";
import { suggestChains } from "@quirks/store";
import { bitsong, bitsongAssetList } from "@nabla-studio/chain-registry";
import { useQuery } from "@tanstack/vue-query";
import VueQrcode from "vue-qrcode";

const { wallets } = useConfig();
const { connect, disconnect, connected, status } = useConnect();
const { pairingURI } = useWalletConnect();
const { address } = useChain("bitsong");

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
  Wallet Status: {{ status }} {{ pairingURI }}
  <button @click="disconnect" v-if="connected">DISCONNECT</button>
  <div v-else>
    <VueQrcode
      v-if="pairingURI"
      :value="pairingURI"
      type="image/png"
      :color="{ dark: '#000000ff', light: '#ffffffff' }"
    />
    <div v-for="wallet in wallets" :key="wallet.options.wallet_name">
      <button @click="open(wallet.options.wallet_name)">
        <img
          :src="wallet.logoLight"
          :alt="wallet.options.pretty_name"
          height="48px"
          width="48px"
          :style="{ width: '48px', height: '48px' }"
        />
        {{ wallet.options.connectionType === "wallet_connect" ? "Mobile" : "" }}
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
