<template>
  <el-radio-group v-model="transformType">
    <el-radio v-for="item in transformation" :label="item.value" size="large">{{ item.label }}</el-radio>
  </el-radio-group>
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
      id="ice-5_1"
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
import ViewMatrix from '../matrix/ViewMatrix'

const MOVE = 0.2

const transformation = [
  { label: '同时改变相机和观察点位置', value: 'translate' },
  { label: '仅改变相机位置', value: 'rotate' },
]

const transformType = ref('translate')

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

let gl, a_Position, canvas, a_Color, program, u_ViewMatrix

const camera = [0, 0, 0]
const target = [0, 0, -1]
const up = [0, 1, 0]

const initGl = () => {
  gl = createGl('#ice-5_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const matrix = new ViewMatrix()
  matrix.lookAt.apply(matrix, [...camera, ...target, ...up])

  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    // 绿
    0, 0.6, -0.6, 0.45, 0.82, 0.24, 1,
    -0.5, -0.4, -0.6, 0.45, 0.82, 0.24, 1,
    0.5, -0.4, -0.6, 0.45, 0.82, 0.24, 1,
    // 蓝
    0, 0.5, -0.4, 0.086, 0.53, 1, 1,
    -0.5, -0.5, -0.4, 0.086, 0.53, 1, 1,
    0.5, -0.5, -0.4, 0.086, 0.53, 1, 1,
    // 橙
    0, 0.4, -0.2, 0.98, 0.68, 0.078, 1,
    -0.5, -0.6, -0.2, 0.98, 0.68, 0.078, 1,
    0.5, -0.6, -0.2, 0.98, 0.68, 0.078, 1,
  ])
  const byte = vertices.BYTES_PER_ELEMENT

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3)
  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 9)
}

const reDrawCamera = () => {
  const matrix = new ViewMatrix()
  matrix.lookAt.apply(matrix, [...camera, ...target, ...up])
  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 9)
}

const handleUp = () => {
  if (transformType.value === 'translate') {
    target[1] += MOVE
    camera[1] += MOVE
  } else {
    camera[1] += MOVE
  }

  reDrawCamera()
}

const handleDown = () => {
  if (transformType.value === 'translate') {
    target[1] -= MOVE
    camera[1] -= MOVE
  } else {
    camera[1] -= MOVE
  }
  reDrawCamera()
}

const handleLeft = () => {
  if (transformType.value === 'translate') {
    target[0] -= MOVE
    camera[0] -= MOVE
  } else {
    camera[0] -= MOVE
  }
  reDrawCamera()
}

const handleRight = () => {
  if (transformType.value === 'translate') {
    target[0] += MOVE
    camera[0] += MOVE
  } else {
    camera[0] += MOVE
  }
  reDrawCamera()
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Fifth5_1'
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
#ice-5_1 {
  margin: 16px auto 0;
}
</style>
