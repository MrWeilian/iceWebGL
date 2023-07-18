<template>
  <div class="box">
    <el-icon class="icon" @click="handleUp"><ArrowUp /></el-icon>
    <div class="mid">
      <el-icon class="icon" @click="handleLeft"><ArrowLeft /></el-icon>
      <el-icon class="icon"><Camera /></el-icon>
      <el-icon class="icon" @click="handleRight"><ArrowRight /></el-icon>
    </div>
    <el-icon class="icon" @click="handleDown"><ArrowDown /></el-icon>
  </div>


  <canvas
      id="ice-3_1"
      width="600"
      height="400"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'
import {
  Camera,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
import { Matrix4, Vector3 } from 'three'

const MOVE = 0.2

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_ViewMatrix;

  void main () {
    gl_Position = u_ViewMatrix * a_Position;
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

let gl, a_Position, canvas, a_Color, program, u_ViewMatrix, indices

const camera = new Vector3(0, 0, 0)
const target = new Vector3(0, 0, -1)
const up = new Vector3(0, 1, 0)

const initGl = () => {
  gl = createGl('#ice-3_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const matrix = new Matrix4()
  matrix.lookAt(camera, target, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    // 黄
    -0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1,
    0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1,
    0.5, 0.5, 0.5, 0.98, 0.86, 0.078, 1,
    -0.5, 0.5, 0.5, 0.98, 0.86, 0.078, 1,
    // 绿
    -0.5, 0.5, 0.5, 0.45, 0.82, 0.24, 1,
    -0.5, 0.5, -0.5, 0.45, 0.82, 0.24, 1,
    -0.5, -0.5, -0.5, 0.45, 0.82, 0.24, 1,
    -0.5, -0.5, 0.5, 0.45, 0.82, 0.24, 1,
    // 蓝
    0.5, 0.5, 0.5, 0.086, 0.53, 1, 1,
    0.5, -0.5, 0.5, 0.086, 0.53, 1, 1,
    0.5, -0.5, -0.5, 0.086, 0.53, 1, 1,
    0.5, 0.5, -0.5, 0.086, 0.53, 1, 1,
    // 橙
    0.5, 0.5, -0.5, 0.98, 0.68, 0.078, 1,
    0.5, -0.5, -0.5, 0.98, 0.68, 0.078, 1,
    -0.5, -0.5, -0.5, 0.98, 0.68, 0.078, 1,
    -0.5, 0.5, -0.5, 0.98, 0.68, 0.078, 1,
    // 红
    -0.5, 0.5, 0.5, 1, 0.30, 0.31, 1,
    0.5, 0.5, 0.5, 1, 0.30, 0.31, 1,
    0.5, 0.5, -0.5, 1, 0.30, 0.31, 1,
    -0.5, 0.5, -0.5, 1, 0.30, 0.31, 1,
    // 紫色
    -0.5, -0.5, 0.5, 0.70, 0.50, 0.92, 1,
    -0.5, -0.5, -0.5, 0.70, 0.50, 0.92, 1,
    0.5, -0.5, -0.5, 0.70, 0.50, 0.92, 1,
    0.5, -0.5, 0.5, 0.70, 0.50, 0.92, 1,
  ])
  const byte = vertices.BYTES_PER_ELEMENT

  indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
  ])

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3)
  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // gl.drawArrays(gl.TRIANGLES, 0, 6)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

const reDrawCamera = () => {
  const matrix = new Matrix4()
  matrix.lookAt(camera, target, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix.elements)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

const handleUp = () => {
  const result = camera.y + MOVE > 1 ? 1 : camera.y + MOVE
  camera.setY(result)
  reDrawCamera()
}

const handleDown = () => {
  const result = camera.y - MOVE < -1 ? -1 : camera.y - MOVE
  camera.setY(result)
  reDrawCamera()
}

const handleLeft = () => {
  const result = camera.x - MOVE < -1 ? -1 : camera.x - MOVE
  camera.setX(result)
  reDrawCamera()
}

const handleRight = () => {
  const result = camera.x + MOVE > 1 ? 1 : camera.x + MOVE
  camera.setX(result)
  reDrawCamera()
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Fifth3_1'
})
</script>

<style scoped lang="scss">
.box {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  .icon {
    cursor: pointer;
    box-sizing: content-box;
    padding: 4px;
  }
}
#ice-3_1 {
  margin: 16px auto 0;
}
</style>
