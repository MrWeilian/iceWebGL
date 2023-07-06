<template>
  <canvas
      id="ice-2_1"
      width="640"
      height="500"
      @mousedown="mousedown"
      @mousemove="mousemove($event, gl, u_ModelMatrix, indices, 'LINE_STRIP')"
      @mouseleave="mouseleave"
      @mouseup="mouseup"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer,
  useMouseMatrixRotate
} from '@ice-webgl/utils'
import { Matrix4 } from 'three'

const vertexCode = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;

  void main () {
    gl_Position = u_ModelMatrix * a_Position;
  }
`

const fragmentCode = `
  precision mediump float;

  void main () {
    gl_FragColor = vec4(0.086, 0.53, 1, 1);
  }
`

let gl, a_Position, canvas, a_Color, program, u_ModelMatrix, indices

let baseRotateX = 70
let baseRotateY = -30

const {
  mousemove,
  mousedown,
  mouseleave,
  mouseup
} = useMouseMatrixRotate(baseRotateX, baseRotateY)

const initGl = () => {
  gl = createGl('#ice-2_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  const matrix = new Matrix4()
  const radian = baseRotateX % 360 * Math.PI / 180
  matrix.makeRotationY(radian)
  const matrix2 = new Matrix4()
  const radian2 = baseRotateY % 360 * Math.PI / 180
  matrix2.makeRotationX(radian2)
  matrix2.multiply(matrix)
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix2.elements)
  const vertices = new Float32Array([
    -.5, .5, .5, // v0
    -.5, -.5, .5, // v1
    .5, -.5, .5, // v2
    .5, .5, .5, // v3
    .5, .5, -.5, // v4
    .5, -.5, -.5, // v5
    -.5, -.5, -.5, // v6
    -.5, .5, -.5,  // v7
  ])
  const byte = vertices.BYTES_PER_ELEMENT

  indices = new Uint8Array([
    0, 1, 2, 3, // 前
    3, 2, 5, 4, // 右
    4, 5, 6, 7, // 后
    0, 1, 6, 7, // 左
    0, 3, 4, 7, // 上
    6, 1, 2, 5, // 下
  ])

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, 0, 0)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Fifth2_1'
})
</script>
