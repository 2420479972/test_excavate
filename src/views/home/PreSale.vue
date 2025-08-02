<template>
  <section class="rounded-lg p-4 mb-6 bg-gradient-to-br from-darkLight to-dark">
    <Char></Char>
    <Buy></Buy>
    <pre-sale-detail></pre-sale-detail>
  </section>

</template>

<script setup lang="ts">
import Char from "./Char.vue";
import Buy from "./Buy.vue";
import PreSaleDetail from "./PreSaleDetail.vue";
</script>

<style scoped>
@import "../../assets/css/home.css";
</style>

