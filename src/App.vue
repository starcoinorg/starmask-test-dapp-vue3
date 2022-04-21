<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import StarMaskOnboarding from "@starcoin/starmask-onboarding";
import { providers, utils, bcs, encoding } from "@starcoin/starcoin";

console.log(providers);
const { isStarMaskInstalled } = StarMaskOnboarding;
console.log(isStarMaskInstalled());
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  hello
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
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
</style>
