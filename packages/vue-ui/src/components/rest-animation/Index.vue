<template>
  <div class="rest-container">
    <pre-six-pointed-star-flow />
  </div>
</template>

<script setup lang="ts">
import PreSixPointedStarFlow from './PreSixPointedStarFlow.vue'
defineOptions({
  name: 'MadokaRestAnimation',
})
</script>

<style lang="less">
.rest-container {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
