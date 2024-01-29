import {
  bitsong,
  bitsongAssetList,
  osmosis,
  osmosisAssetList,
} from "@nabla-studio/chain-registry";
import type { Config } from "@quirks/store";
import { keplrExtension, keplrMobile, leapExtension } from "@quirks/wallets";

export default defineNuxtPlugin((nuxtApp) => {
  const t = useRuntimeConfig();

  const config: Config = {
    wallets: [keplrExtension, leapExtension, keplrMobile],
    chains: [osmosis, bitsong],
    assetsLists: [osmosisAssetList, bitsongAssetList],
    walletConnectOptions: {
      providerOpts: {
        logger: "info",
        projectId: t.public.projectId,
        metadata: {
          name: "Quirks App",
          description: "Quirks App for WalletConnect",
          url: "https://walletconnect.com/",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
      },
    },
  };

  nuxtApp.vueApp.use(quirksPlugin, config);
});
