<script setup>
import { ref } from "vue";
import { useStarcoinStore } from "@/stores/starcoin";

const permissionsResult = ref("");

const starCoinStore = useStarcoinStore();
const getPermissionsDisplayString = (permissionsArray) => {
  if (permissionsArray.length === 0) {
    return "No permissions found.";
  }

  const permissionNames = permissionsArray.map((perm) => perm.parentCapability);
  return permissionNames
    .reduce((acc, name) => `${acc}${name}, `, "")
    .replace(/, $/u, "");
};

const reqPermissions = async () => {
  const permissionsArray = await window.starcoin.request({
    method: "wallet_requestPermissions",
    params: [{ stc_accounts: {} }],
  });

  permissionsResult.value = getPermissionsDisplayString(permissionsArray);
};

const getPermissions = async () => {
  const permissionsArray = await window.starcoin.request({
    method: "wallet_getPermissions",
  });

  permissionsResult.value = getPermissionsDisplayString(permissionsArray);
};
</script>
<!--  -->
<template>
  <div>
    <el-card>
      <h3>Permissions Actions</h3>
      <el-button
        type="primary"
        @click="reqPermissions"
        :disabled="!starCoinStore.isStarMaskConnected"
      >
        REQUEST PERMISSIONS
      </el-button>
      <el-button
        type="primary"
        @click="getPermissions"
        :disabled="!starCoinStore.isStarMaskConnected"
      >
        GET PERMISSIONS
      </el-button>
      <el-button type="info" disabled
        >Permissions result: {{ permissionsResult }}</el-button
      >
    </el-card>
  </div>
</template>

<style lang="less" scoped></style>
