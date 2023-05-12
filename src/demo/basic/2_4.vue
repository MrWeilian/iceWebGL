<template>
  <el-row :gutter="8">
    <el-col :span="6"><el-button type="primary" @click="clear">清空画布</el-button></el-col>
    <el-col :span="6"><el-switch v-model="isClear" active-text="每次清空绘图区" /></el-col>
  </el-row>
  <canvas id="ice-2_4" @click="drawFn" width="600" height="200"></canvas>
</template>

<script setup lang="ts">
import 'element-plus/theme-chalk/el-input-number.css'
import { onMounted, ref } from 'vue'
import { createGl, createShader, createProgram } from '@ice-webgl/utils'

const isClear = ref(true)

const vertexCode = `
  // 定义了一个名为 a_Position，类型为 vec4 的 attribute 变量
  attribute vec4 a_Position;

  void main () {
    // 将变量赋值给顶点坐标
    gl_Position = a_Position;
    // 顶点渲染像素大小
    gl_PointSize = 24.0;
  }
`

const fragmentCode = `
  void main () {
    // 顶点颜色——蓝色 (R, G, Bule, A)
    gl_FragColor = vec4(0.0, 0.0, 0.9, 1.0);
  }
`

let gl, a_Position, canvas

const initGl = () => {
  gl = createGl('#ice-2_4')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const drawFn = (e: MouseEvent) => {
  const halfW = canvas.width / 2
  const halfH = canvas.height / 2
  const glX = parseFloat((e.offsetX - halfW ) / halfW + '')
  const glY = parseFloat((halfH - e.offsetY) / halfH + '')

  isClear.value && gl.clear(gl.COLOR_BUFFER_BIT)

  gl.vertexAttrib2f(a_Position, glX, glY)
  gl.drawArrays(gl.POINTS, 0, 1)
}

const clear = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
}

onMounted(() => {
  initGl()
  canvas = document.querySelector('#ice-2_4')
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Basic2_4'
})
</script>

<style lang="scss">
#ice-2_4 {
  margin-top: 16px;
}
</style>
