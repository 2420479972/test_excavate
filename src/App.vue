<script setup lang="ts">
import Account from './components/Account.vue'
import Connect from './components/Connect.vue'
import Home from "./views/Home.vue";
import Back from "./views/Back.vue";
import {getPublicVariable} from "./utils/base.ts";
import {watch} from "vue";
import {erc20ConfigABI} from "./api";


const {data: ustdAddress} = getPublicVariable('usdt')
watch(ustdAddress,(newVal)=>{
  erc20ConfigABI.address = newVal;
})
</script>

<template>
  <Home></Home>
<!--  <Account/>-->
<!--  <Back></Back>-->
<!--  <Connect />-->
</template>
