<template>
  <div class="glass-effect py-2 px-4 mb-2">
    <div class="flex items-center">
      <div class="flex items-center mr-2">
        <i class="fas fa-bullhorn text-primary announcement-icon"></i>
      </div>
      <div class="overflow-hidden flex-1">
        <div class="announcement-text whitespace-nowrap text-sm">
          {{notification}}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getPublicVariable} from "../../utils/base.ts";
const {data:notification} = getPublicVariable('notification')
</script>
<style scoped>
@import "../../assets/css/home.css";
</style>
