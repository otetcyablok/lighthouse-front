<template>
  <div class="min-full-height flex column gap_8 items-center justify-center relative">
    <canvas
      ref="canvasRef"
      class="canvas"
    />

    <MediaRecorderComponent
      @recorded="onRecorded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import MediaRecorderComponent from '@/components/MediaRecorderComponent.vue';

const canvasRef = ref();

function onRecorded(stringifiedBlob: string) {
  lighthouse_generate(canvasRef.value, stringifiedBlob, () => {});
}
</script>

<style lang="scss">
.canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  z-index: -1;
}
</style>
