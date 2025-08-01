<script setup lang="ts">
import Account from './components/Account.vue'
import Connect from './components/Connect.vue'
import Home from "./views/Home.vue";
import Back from "./views/Back.vue";
import {getPublicVariable} from "./utils/base.ts";
import {watch} from "vue";
import {erc20ConfigABI} from "./api";
import {useAccount, useChainId} from "@wagmi/vue";
import {localAddress,ownerAddress} from "./store/address.ts";

const {data: ustdAddress} = getPublicVariable('usdt')
const {data: owner} = getPublicVariable('owner')
const {address} = useAccount();

watch(ustdAddress,(newVal)=>{
  if(!newVal) return;
  erc20ConfigABI.address = "0x10c12af81ce8Cf7e78cb2E19f773F2236F1B9D5A";
},{
  deep:true,
  immediate:true
})

watch(address,(newVal:string)=>{
  if(!newVal) return;
  localAddress.value = newVal
},{
  deep:true,
  immediate:true
})

watch(owner,(newVal:string)=>{
  if(!newVal) return;
  ownerAddress.value = newVal
},{
  deep:true,
  immediate:true
})
</script>

<template>
<router-view></router-view>
</template>
