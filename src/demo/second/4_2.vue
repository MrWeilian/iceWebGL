<template>
  <el-row :gutter="8">
    <el-col :span="6">
      <el-button type="primary" @click="clear">清空画布</el-button>
    </el-col>
    <el-col :span="6">
      <el-switch v-model="isClear" active-text="每次清空绘图区" />
    </el-col>
  </el-row>
  <canvas id="ice-4_2" @click="drawFn" width="600" height="200"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createShader, createProgram } from '@ice-webgl/utils'

const isClear = ref(false)

const vertexCode = `
  attribute vec4 a_Position;
  // 定义 a_Color 动态接受值
  attribute vec4 a_Color;
  // 定义 v_Color 接收、传递颜色值（跟片元着色器一致）
  varying vec4 v_Color;

  void main () {
    gl_Position = a_Position;
    gl_PointSize = 24.0;
    v_Color = a_Color;
  }
`

const fragmentCode = `
  precision mediump float;
  // 定义 v_Color，注意类型、变量名跟顶点着色器的一致，用于接收变量
  varying vec4 v_Color;

  void main () {
    gl_FragColor = v_Color;
  }
`

let gl, a_Position, canvas, a_Color

const initGl = () => {
  canvas = document.querySelector('#ice-4_2')
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')

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
  gl.vertexAttrib4f(a_Color, Math.random(), Math.random(), Math.random(), .8)
  gl.drawArrays(gl.POINTS, 0, 1)
}

const clear = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Second4_2'
})
</script>

<style lang="scss" scoped>
#ice-4_2 {
  margin-top: 16px;
}
</style>
