<script setup lang="ts">
import { useConnect, useChains } from "@quirks/vue";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";

const { accounts } = useChains();
const { connected, status } = useConnect();

const send = async () => {
  const sign = (await import("@quirks/store")).sign;
  const getAddress = (await import("@quirks/store")).getAddress;

  const address = getAddress("osmosis");

  MsgSend.typeUrl;

  const msg = {
    typeUrl: MsgSend.typeUrl,
    value: MsgSend.fromPartial({
      amount: [
        {
          denom: "uosmo",
          amount: "1",
        },
      ],
      toAddress: address,
      fromAddress: address,
    }),
  };

  console.log(msg);

  const txRaw = await sign("osmosis", [msg]);

  const broadcast = (await import("@quirks/store")).broadcast;

  const res = await broadcast("osmosis", txRaw);

  console.log(res);
};
</script>

<template>
  <div>
    <div>
      STATUS: {{ status }}
      <div v-if="connected">
        Addresses:
        <button @click="send">SIGN</button>
        <div v-for="account in accounts" :key="account.chainId">
          <div>Chain ID: {{ account.chainId }}</div>

          <div>Chain Name: {{ account.chainName }}</div>

          <div>Address: {{ account.bech32Address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
