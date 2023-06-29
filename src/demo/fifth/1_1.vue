<template>

  <canvas id="ice-1_1" width="600" height="400"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'
import { Matrix4 } from 'three'

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;

  void main () {
    gl_Position = u_ModelMatrix * a_Position;
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

let gl, a_Position, canvas, a_Color, program, u_ModelMatrix

const initGl = () => {
  gl = createGl('#ice-1_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  const matrix = new Matrix4()
  // const radian = 45 * Math.PI / 180
  // matrix.makeRotationY(radian)
  // const matrix2 = new Matrix4()
  // const radian2 = 45 * Math.PI / 180
  // matrix2.makeRotationX(radian2)
  // matrix2.multiply(matrix)
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements)
  const vertices = new Float32Array([
    .5, .5, .5,
    -.5, .5, .5,
    -.5, -.5, .5,
    .5, -.5, .5,
    .5, -.5, -.5,
    .5, .5, -.5,
    -.5, .5, -.5,
    -.5, -.5, -.5,
  ])
  const colors = new Float32Array([
    1., 1., 1., 1.,
    1., 1., 0., 1.,
    1., 1., 1., 1.,
    1., 0., 1., 1.,
    0., 1., 1., 1.,
    0., 0., 1., 1.,
    1., 1., 0., 1.,
    0., 1., 1., 1.,
  ])

  const indices = new Uint8Array([
      0, 1, 2, 0, 2, 3,
      0, 3, 4, 0, 4, 5,
      0, 5, 6, 0, 6, 1,
      1, 6, 7, 1, 7, 2,
      7, 4, 3, 7, 3, 2,
      4, 7, 6, 4, 6, 5
  ])

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // gl.drawArrays(gl.TRIANGLES, 0, 3)
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Fifth1_1'
})
</script>
