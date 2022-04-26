// stores/counter.js
import { defineStore } from 'pinia'
import StarMaskOnboarding from '../../node_modules/@starcoin/starmask-onboarding/dist/starmask-onboarding.es'

const initialStarCoin = () => {
  const currentUrl = new URL(window.location.href)
  const forwarderOrigin =
    currentUrl.hostname === 'localhost' ? 'http://localhost:9032' : undefined

  const isStarMaskInstalled = StarMaskOnboarding.isStarMaskInstalled()
  const isStarMaskConnected = false
  const accounts = []

  let onboarding
  try {
    onboarding = new StarMaskOnboarding({ forwarderOrigin })
  } catch (error) {
    console.error(error)
  }

  let chainInfo = {
    chain: '',
    network: '',
    accounts: '',
  }

  return {
    isStarMaskInstalled,
    isStarMaskConnected,
    accounts,
    onboarding,
    chainInfo,
  }
}

const initial = initialStarCoin()

export const useStarcoinStore = defineStore('starcoin', {
  state: () => {
    return { ...initial }
  },
  actions: {
    changeStarcoinStore(data) {
      this.starcoin = data
    },
    changeChain(chain) {
      this.chainInfo.chain = chain
    },
    changeNetwork(network) {
      this.chainInfo.network = network
    },
    changeAccounts(accounts) {
      this.accounts = accounts
      this.isStarMaskConnected = this.accounts && this.accounts.length > 0
    },
  },
})
