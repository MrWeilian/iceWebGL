<template>
  <canvas id="ice-1_1" width="600" height="100"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const canvas = document.querySelector('#ice-1_1')
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'rgba(0, 0 , 240, 1)'
  // 矩形
  ctx.fillRect(0, 0, 100, 100)
  // 圆形
  ctx.arc(240, 50, 50, 0, Math.PI * 360 / 180)
  ctx.fill();
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Second1_1'
})
</script>
