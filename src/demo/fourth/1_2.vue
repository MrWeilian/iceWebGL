<template>
  <el-form label-position="top" style="width: 600px;">
    <el-form-item label="scale 缩放比例：">
      <el-slider v-model="scaleVal" :format-tooltip="format" />
    </el-form-item>
  </el-form>

  <canvas id="ice-1_2" width="600" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'

const defaultOrigin = 50.0

const scaleVal = ref(defaultOrigin)
const format = (val) => parseFloat((val / 50).toFixed(2).toString())

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform float u_Scale;

  void main () {
    gl_Position = vec4(a_Position.x * u_Scale, a_Position.y * u_Scale, 0., 1.);
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
  gl = createGl('#ice-1_2')

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

  const u_Position = gl.getUniformLocation(program, 'u_Scale')
  const scale = scaleVal.value / defaultOrigin
  gl.uniform1f(u_Position, scale)
  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 2)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

watch(scaleVal, x => {
  const u_Position = gl.getUniformLocation(program, 'u_Scale')
  const scale = scaleVal.value / defaultOrigin
  gl.uniform1f(u_Position, scale)
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
  name: 'Fourth1_2'
})
</script>
