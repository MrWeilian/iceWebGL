<template>
  <el-button type="danger" @click="redFn">红色</el-button>
  <el-button type="success" @click="greenFn">绿色</el-button>
  <el-button type="primary" @click="blueFn">蓝色</el-button>
  <el-button type="info" @click="blackFn">黑色</el-button>
  <el-button @click="transparentFn">透明</el-button>

  <canvas id="ice-2_1" width="600" height="100"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createGl } from '@ice-webgl/utils'

let gl

const redFn = () => {
  gl.clearColor(.9, 0., 0., .8)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const greenFn = () => {
  gl.clearColor(0., .9, 0., .8)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const blueFn = () => {
  gl.clearColor(0., 0., .9, .8)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const blackFn = () => {
  gl.clearColor(0., 0., .0, .8)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const transparentFn = () => {
  gl.clearColor(0., 0., .0, .0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

onMounted(() => {
  gl = createGl('#ice-2_1')
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Second2_1'
})
</script>

<style scoped lang="scss">
#ice-2_1 {
  margin-top: 16px;
}
</style>
