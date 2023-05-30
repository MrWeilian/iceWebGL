<template>
  <el-row :gutter="8">
    <el-col :span="6">
      <el-button type="primary" @click="clear">清空画布</el-button>
    </el-col>
    <el-col :span="6">
      <el-switch v-model="isClear" active-text="每次清空绘图区" />
    </el-col>
  </el-row>
  <canvas id="ice-4_1" @click="drawFn" width="600" height="200"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createShader, createProgram } from '@ice-webgl/utils'

const isClear = ref(false)

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
  precision mediump float;
  uniform vec4 u_FragColor;

  void main () {
    gl_FragColor = u_FragColor;
  }
`

let gl, a_Position, canvas, u_FragColor

const initGl = () => {
  canvas = document.querySelector('#ice-4_1')
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  u_FragColor = gl.getUniformLocation(program, 'u_FragColor')

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
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), .8)
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
  name: 'Second4_1'
})
</script>

<style lang="scss" scoped>
#ice-4_1 {
  margin-top: 16px;
}
</style>
