<template>
  <canvas id="ice-1_1" width="620" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'
import { Matrix4, Vector3, Vector4 } from '../cuon-matrix'
import axios from 'axios';

const readOBJFile = async () => {
  const res = await axios.get('/models/fan/Colling Fan.obj')
  console.log(res)

}

onMounted(() => {
  readOBJFile()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Seventh1_1'
})
</script>

<style lang="scss" scoped>
#ice-1_1 {
  margin: 0 auto;
}
</style>
