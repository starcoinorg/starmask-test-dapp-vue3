<script setup>
import { ref } from 'vue'
import { providers, utils, bcs } from '@starcoin/starcoin'
import BigNumber from 'bignumber.js'
import { hexlify } from '@ethersproject/bytes'

const nodeUrlMap = {
  '1': 'https://main-seed.starcoin.org',
  '2': 'https://proxima-seed.starcoin.org',
  '251': 'https://barnard-seed.starcoin.org',
  '253': 'https://halley-seed.starcoin.org',
  '254': 'http://localhost:9850',
}

const toInputVal = ref('0x46ecE7c1e39fb6943059565E2621b312')
const amountInputVal = ref('0.001')
const tes = ref('1800')
const contractStatus = ref('Not clicked')

const transferClick = async () => {
  let starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
  contractStatus.value = 'Calling'

  try {
    const functionId = '0x1::TransferScripts::peer_to_peer_v2'
    const strTypeArgs = ['0x1::STC::STC']

    const toAccount = toInputVal.value
    if (!toAccount) {
      window.alert('Invalid To: can not be empty!')
      return false
    }

    const sendAmount = parseFloat(amountInputVal.value, 10)
    if (sendAmount <= 0) {
      // eslint-disable-next-line no-alert
      window.alert('Invalid sendAmount: should be a number!')
      return false
    }

    const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
    const sendAmountSTC = new BigNumber(String(amountInputVal.value), 10)
    const sendAmountNanoSTC = sendAmountSTC.times(
      BIG_NUMBER_NANO_STC_MULTIPLIER
    )

    const args = [toAccount, sendAmountNanoSTC]
    const nodeUrl = nodeUrlMap[window.starcoin.networkVersion]

    const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
      functionId,
      strTypeArgs,
      args,
      nodeUrl
    );

    // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
    const payloadInHex = (function () {
      const se = new bcs.BcsSerializer()
      scriptFunction.serialize(se)
      return hexlify(se.getBytes())
    })()

    const txParams = {
      data: payloadInHex,
    }

    const expiredSecs = parseInt(tes.value, 10)
    if (expiredSecs > 0) {
      txParams.expiredSecs = expiredSecs
    }

    const transactionHash = await starcoinProvider
      .getSigner()
      .sendUncheckedTransaction(txParams)
    console.log({ transactionHash })
  } catch (error) {
    contractStatus.value = 'Call Failed'
    throw error
  }

  contractStatus.value = 'Call Completed'
}
</script>
<template>
  <div class="card-wrap">
    <el-card>
      <h3>Send STC</h3>
      <h4>To</h4>
      <el-input v-model="toInputVal" />
      <h4>Amount of STC</h4>
      <el-input v-model="amountInputVal" />
      <h4>Transaction Expired Seconds(default 30 minutes)</h4>
      <el-input v-model="tes" />
      <h4>Contract Function</h4>
      <el-button type="primary" @click="transferClick"
        >0x1::TransferScripts::peer_to_peer_v2</el-button
      >
      <el-button disabled>Contract Status: {{ contractStatus }}</el-button>
    </el-card>
  </div>
</template>

<style lang="less" scoped></style>
