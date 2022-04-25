<script setup lang="ts">
import { useStarcoinStore } from "@/stores/starcoin";
import Status from "./components/Status.vue";
import BasicActions from "./components/BasicActions.vue";
import PermissionsActions from "./components/PermissionsActions.vue";
import SendSTC from "./components/SendSTC.vue";

const starCoinStore = useStarcoinStore();

const onStarcoinEvent = () => {
  if (starCoinStore.isStarMaskInstalled) {
    const handleNewChain = (chain) => {
      starCoinStore.changeChain(chain);
    };

    const handleNewNetwork = (network) => {
      starCoinStore.changeNetwork(network);
    };

    const handleNewAccounts = (accounts) => {
      starCoinStore.changeAccounts(accounts);
    };

    // 钱包网络切换
    window.starcoin.on("chainChanged", handleNewChain);
    window.starcoin.on("networkChanged", handleNewNetwork);

    // 钱包帐号切换
    window.starcoin.on("accountsChanged", handleNewAccounts);
  }
};

const initialChaiInfo = async () => {
  if (starCoinStore.isStarMaskInstalled) {
    const chainInfo = await window.starcoin.request({
      method: "chain.id",
    });

    starCoinStore.changeChain(`0x${chainInfo.id.toString(16)}`);
    starCoinStore.changeNetwork(chainInfo.id);
  }
};

const initialAccount = async () => {
  if (window?.starcoin.isConnected) {
    const newAccounts = await window.starcoin.request({
      method: "stc_accounts",
    });
    starCoinStore.changeAccounts(newAccounts);
  }
};

onStarcoinEvent();
initialChaiInfo();
initialAccount();
</script>

<template>
  <h1>E2E Test Dapp</h1>
  <img
    class="logo"
    alt="Vue logo"
    src="https://starmask-test-dapp.starcoin.org/logo-horizontal.png"
  />
  <Status />
  <BasicActions />
  <PermissionsActions />
  <SendSTC />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  width: 317px;
  height: 143px;
}
</style>
