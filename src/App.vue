<script setup lang="ts">
import Account from './components/Account.vue'
import Connect from './components/Connect.vue'
import Home from "./views/Home.vue";
import Back from "./views/Back.vue";
import {getPublicVariable} from "./utils/base.ts";
import {watch} from "vue";
import {erc20ConfigABI} from "./api";
import {useChainId} from "@wagmi/vue";

const {data: ustdAddress} = getPublicVariable('usdt')
watch(ustdAddress,(newVal)=>{
  erc20ConfigABI.address = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24";
})
</script>

<template>
<router-view></router-view>
</template>
