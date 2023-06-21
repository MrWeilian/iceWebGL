<template>
  <el-form label-position="top" style="width: 600px;">
    <el-form-item label="x偏移值：">
      <el-slider v-model="xVal" :min="-1" :max="1" :step="0.01" />
    </el-form-item>
  </el-form>

  <canvas id="ice-2_1" width="600" height="300"></canvas>
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

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_TranslateMatrix;

  void main () {
    gl_Position = u_TranslateMatrix * a_Position;
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

let gl, a_Position, canvas, a_Color, program, u_TranslateMatrix

const initGl = () => {
  gl = createGl('#ice-2_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_TranslateMatrix = gl.getUniformLocation(program, 'u_TranslateMatrix')
  const vertices = new Float32Array([
    -.3, -.3,
    0., .6,
    .3, -.3,
  ])
  const translateMatrix = new Float32Array([
    1., 0., 0., 0.,
    0., 1., 0., 0.,
    0., 0., 1., 0.,
    0., 0., 0., 1.
  ])
  const colors = new Float32Array([
    1., 0., 0., 1.,
    0., 1., 0., 1.,
    0., 0., 1., 1.,
  ])

  gl.uniformMatrix4fv(u_TranslateMatrix, false, translateMatrix)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 2)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

watch(xVal, x => {
  const translateMatrix = new Float32Array([
      1., 0., 0., 0.,
      0., 1., 0., 0.,
      0., 0., 1., 0.,
      x, 0., 0., 1.
  ])
  gl.uniformMatrix4fv(u_TranslateMatrix, false, translateMatrix)
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
  name: 'Fourth2_1'
})
</script>
