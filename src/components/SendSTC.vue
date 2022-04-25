<script setup>
import { ref } from "vue";
import { providers, utils, bcs } from "@starcoin/starcoin";
import BigNumber from "bignumber.js";
import { arrayify, hexlify } from "@ethersproject/bytes";

const toInputVal = ref("0x46ecE7c1e39fb6943059565E2621b312");
const amountInputVal = ref("0.001");
const tes = ref("1800");
const contractStatus = ref("Not clicked");

const sendClick = async () => {
  let starcoinProvider = new providers.Web3Provider(window.starcoin, "any");

  const toAccount = toInputVal.value;
  if (!toAccount) {
    window.alert("Invalid To: can not be empty!");
    return false;
  }

  const sendAmount = parseFloat(amountInputVal.value, 10);
  if (sendAmount <= 0) {
    // eslint-disable-next-line no-alert
    window.alert("Invalid sendAmount: should be a number!");
    return false;
  }

  const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber("1000000000");
  const sendAmountSTC = new BigNumber(String(amountInputVal.value), 10);
  const sendAmountNanoSTC = sendAmountSTC.times(BIG_NUMBER_NANO_STC_MULTIPLIER);
  const sendAmountHex = `0x${sendAmountNanoSTC.toString(16)}`;

  const txParams = {
    to: toAccount,
    value: sendAmountHex,
    gasLimit: 127845,
    gasPrice: 1,
  };

  const expiredSecs = parseInt(tes.value, 10);
  if (expiredSecs > 0) {
    txParams.expiredSecs = expiredSecs;
  }

  const transactionHash = await starcoinProvider
    .getSigner()
    .sendUncheckedTransaction(txParams);
};

const transferClick = async () => {
  let starcoinProvider = new providers.Web3Provider(window.starcoin, "any");
  contractStatus.value = "Calling";

  try {
    const functionId = "0x1::TransferScripts::peer_to_peer_v2";
    const strTypeArgs = ["0x1::STC::STC"];
    const tyArgs = utils.tx.encodeStructTypeTags(strTypeArgs);

    const toAccount = toInputVal.value;
    if (!toAccount) {
      window.alert("Invalid To: can not be empty!");
      return false;
    }

    const sendAmount = parseFloat(amountInputVal.value, 10);
    if (sendAmount <= 0) {
      // eslint-disable-next-line no-alert
      window.alert("Invalid sendAmount: should be a number!");
      return false;
    }

    const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber("1000000000");
    const sendAmountSTC = new BigNumber(String(amountInputVal.value), 10);
    const sendAmountNanoSTC = sendAmountSTC.times(
      BIG_NUMBER_NANO_STC_MULTIPLIER
    );
    const sendAmountHex = `0x${sendAmountNanoSTC.toString(16)}`;

    const amountSCSHex = (function () {
      const se = new bcs.BcsSerializer();
      // eslint-disable-next-line no-undef
      se.serializeU128(BigInt(sendAmountNanoSTC.toString(10)));
      return hexlify(se.getBytes());
    })();

    const args = [arrayify(toAccount), arrayify(amountSCSHex)];

    const scriptFunction = utils.tx.encodeScriptFunction(
      functionId,
      tyArgs,
      args
    );

    // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
    const payloadInHex = (function () {
      const se = new bcs.BcsSerializer();
      scriptFunction.serialize(se);
      return hexlify(se.getBytes());
    })();

    const txParams = {
      to: toAccount,
      value: sendAmountHex,
      gasLimit: 127845,
      gasPrice: 1,
    };

    const expiredSecs = parseInt(tes.value, 10);
    if (expiredSecs > 0) {
      txParams.expiredSecs = expiredSecs;
    }

    const transactionHash = await starcoinProvider
      .getSigner()
      .sendUncheckedTransaction(txParams);
  } catch (error) {
    contractStatus.value = "Call Failed";
    // callContractButton.disabled = false
    throw error;
  }

  contractStatus.value = "Call Completed";
  // callContractButton.disabled = false
};
</script>
<template>
  <div>
    <el-card>
      <h3>Send STC</h3>
      <h4>To</h4>
      <el-input v-model="toInputVal" />
      <h4>Amount of STC</h4>
      <el-input v-model="amountInputVal" />
      <h4>Transaction Expired Seconds(default 30 minutes)</h4>
      <el-input v-model="tes" />
      <el-button type="primary" @click="sendClick">SEND</el-button>
      <el-divider></el-divider>
      <h4>Contract Function</h4>
      <el-button @click="transferClick"
        >0x1::TransferScripts::peer_to_peer_v2</el-button
      >
      <el-button disabled>Contract Status: {{ contractStatus }}</el-button>
    </el-card>
  </div>
</template>

<style lang="less" scoped></style>
