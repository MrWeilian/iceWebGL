<template>
  <el-form label-position="top" style="width: 600px;">
    <el-form-item label="x偏移值：">
      <el-slider v-model="xVal" :min="-1" :max="1" :step="0.01" />
    </el-form-item>
    <el-form-item label="y偏移值：">
      <el-slider v-model="yVal" :min="-1" :max="1" :step="0.01" />
    </el-form-item>
  </el-form>

  <canvas id="ice-1_1" width="600" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'

const xVal = ref(0)
const yVal = ref(0)

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform vec4 u_Position;

  void main () {
    gl_Position = a_Position + u_Position;
    v_Color= a_Color;
  }
`

const fragmentCode = `
  precision mediump float;
  varying vec4 v_Color;

  void main () {
    gl_FragColor = v_Color;
  }
`

let gl, a_Position, canvas, a_Color, program

const initGl = () => {
  gl = createGl('#ice-1_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  const vertices = new Float32Array([
    -.3, -.3,
    0., .6,
    .3, -.3,
  ])
  const colors = new Float32Array([
    1., 0., 0., 1.,
    0., 1., 0., 1.,
    0., 0., 1., 1.,
  ])

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 2)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

watch(xVal, x => {
  const u_Position = gl.getUniformLocation(program, 'u_Position')
  const xMoveVertices = new Float32Array([x, yVal.value, 0., 0.])
  gl.uniform4fv(u_Position, xMoveVertices)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})

watch(yVal, y => {
  const u_Position = gl.getUniformLocation(program, 'u_Position')
  const xMoveVertices = new Float32Array([xVal.value, y, 0., 0.])
  gl.uniform4fv(u_Position, xMoveVertices)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Fourth1_1'
})
</script>
