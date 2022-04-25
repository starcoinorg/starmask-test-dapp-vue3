<script setup>
import { computed } from "vue";
import { useStarcoinStore } from "@/stores/starcoin";

const starcoinStore = useStarcoinStore();
const statusDefined = computed(() => [
  {
    key: "Network",
    value: starcoinStore.chainInfo.network,
  },
  {
    key: "ChainId",
    value: starcoinStore.chainInfo.chain,
  },
  {
    key: "SelectedAccount",
    value: starcoinStore.accounts,
  },
]);
</script>
<!--  -->
<template>
  <div class="status-wrap">
    <h2 class="title">Status</h2>
    <div class="status-main">
      <div
        :key="index"
        class="status-main-item"
        v-for="(item, index) of statusDefined"
      >
        <el-alert :title="`${item.key}: ${item.value}`" type="success" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.title {
  text-align: left;
}
</style>
