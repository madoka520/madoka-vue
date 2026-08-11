<template>
  <svg viewBox="0 0 100 100" class="svg-container">
    <defs>
      <linearGradient id="dreamyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(255, 182, 193, 0)" />
        <stop offset="30%" stop-color="#ff9ac2" />
        <stop offset="50%" stop-color="#ffffff" />
        <stop offset="70%" stop-color="#e0b0ff" />
        <stop offset="100%" stop-color="rgba(224, 176, 255, 0)" />
      </linearGradient>

      <filter id="dreamy-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
        <feComposite
          in="blur1"
          in2="blur2"
          operator="arithmetic"
          k2="1"
          k3="1"
        />
      </filter>
    </defs>

    <g class="triangle-group">
      <path :d="triangle" class="path-base" />
      <path :d="triangle" class="path-streamer" />
      <path-drow
        :d="triangle"
        color="#ff4d8d"
        class="glow-layer"
        :delay="1.5"
      />
    </g>

    <g :class="['rotate-wrap', { active: state.step >= 1 }]">
      <path-drow
        :d="triangle"
        color="rgba(255, 192, 203, 0.35)"
        class="path-base"
      />
      <path :d="triangle" class="path-streamer delay-sync" />
      <path-drow
        v-if="state.step >= 2"
        :d="triangle"
        color="#ff4d8d"
        class="final-state-glow"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import PathDrow from './PathDrow.vue'

const triangle = `M50 10 L15.36 70 L84.64 70 Z`

const state = reactive({
  step: 0,
})

onMounted(() => {
  setTimeout(() => (state.step = 1), 1500)
  setTimeout(() => (state.step = 2), 3000)
  setTimeout(() => (state.step = 3), 4500)
})
</script>

<style lang="less">
@len: 207.84;
@streamer-len: 60;
@dreamy-pink: #ff85b3;
@dreamy-purple: #d4a5ff;
@base-line: rgba(255, 192, 203, 0.35);

.svg-container {
  width: 200px;
  aspect-ratio: 1 / 1;

  .path-base {
    fill: none;
    stroke: @base-line;
    stroke-width: 0.8px;
  }

  .path-streamer {
    fill: none;
    stroke: url(#dreamyGradient);
    stroke-width: 2.2px;
    stroke-linecap: round;
    stroke-dasharray: @streamer-len (@len - @streamer-len);
    animation: luxuriousFlow 4s linear infinite;
    filter: url(#dreamy-glow);
    mix-blend-mode: screen;

    &.delay-sync {
      animation-delay: -2s;
    }
  }

  .glow-layer {
    opacity: 0.4;
    mix-blend-mode: screen;
  }

  .rotate-wrap {
    // 改用 50% 50% 解决向下跳动的问题
    transform-origin: 50% 50%;
    transition: transform 1.8s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;

    &.active {
      transform: rotate(180deg);
    }
  }

  .final-state-glow {
    fill: none;
    stroke: @dreamy-pink;
    stroke-width: 2.5;
    mix-blend-mode: color-dodge;
  }
}

@keyframes luxuriousFlow {
  from {
    stroke-dashoffset: @len;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
