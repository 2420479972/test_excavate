<template>
  <main class="pb-4 relative flex-1 overflow-auto">
    <notice></notice>
    <div class="px-5">
      <pre-sale-time></pre-sale-time>
      <pre-sale></pre-sale>
      <earnings></earnings>
      <record></record>
    </div>
  </main>

</template>

<script setup lang="ts">
import PreSaleTime from "./PreSaleTime.vue";
import Notice from "./Notice.vue";
import PreSale from "./PreSale.vue";
import Earnings from "./Earnings.vue";
import Record from "./Record.vue";
</script>

<style  scoped>
@import "../../assets/css/home.css";
</style>
