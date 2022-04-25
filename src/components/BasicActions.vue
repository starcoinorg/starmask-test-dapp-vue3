<script setup>
import { ref, reactive,computed, onBeforeMount,onMounted} from 'vue'
import {useStarcoinStore} from '@/stores/starcoin';

const starCoinStore = useStarcoinStore();
const textStatus = [
  'Click here to install StarMask!',
  'Connect',
  'Connected',
];
const disabled = ref(false);
const showSelectedAccount = ref(false);

const status = computed(() => {
  console.log(starCoinStore, 'status')
  if (!starCoinStore.isStarMaskInstalled) {
    disabled.value = false;
    return 0;
  }
  else if (starCoinStore.isStarMaskConnected) {
    disabled.value = true;
    starCoinStore.onboarding?.stopOnboarding();
    return 2;
  }
  else {
    disabled.value = false;
    return 1;
  }
});

const clickHandle = async () => {
  const _status = status.value;

  if (_status === 0) {
    disabled.value = true;
    starCoinStore.onboarding.startOnboarding()
  }
  else if (_status === 1) {
    try {
        const newAccounts = await window.starcoin.request({
            method: 'stc_requestAccounts',
        })
        starCoinStore.changeAccounts(newAccounts)
    } catch (error) {
        console.error(error)
    }
  }

  console.log(status,'status')
}

const getAccount = () => {
  showSelectedAccount.value = true;
}
</script>
<!--  -->
<template>
  <div>
      <el-card>
          <h3>Basic Actions</h3>
          <el-button type="primary" :disabled="disabled" @click="clickHandle">{{textStatus[status]}}</el-button>
          <el-button type="primary" :disabled="status !== 2" @click="getAccount">GET SELECTED ACCOUNT</el-button>
          <el-button type="info" disabled>SelectedAccount: {{showSelectedAccount ? starCoinStore.accounts[0] : ''}}</el-button>
      </el-card>
  </div>
</template>

<style lang='less' scoped>
</style>