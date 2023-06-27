<template>
  <el-form label-position="top">
    <el-button type="primary" @click="toggleAnimation">{{ running ? '暂停' : '播放' }}</el-button>
  </el-form>

  <canvas id="ice-5_2" width="600" height="400"></canvas>
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

let rotateVal = 0
let scaleVal = 1

const running = ref(false)

let animationFrame = null

let bigger = true

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
  gl = createGl('#ice-5_2')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  const vertices = new Float32Array([
    -.3, .3,
    -.3, -.3,
    .3, .3,
    .3, -.3
  ])
  const colors = new Float32Array([
    1., 1., 0., 1.,
    1., .5, 0., 1.,
    0., .5, 1., 1.,
    0., 0., 1., 1.,
  ])
  const identityMatrix = new Matrix4()
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements)
  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 2)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

const toggleAnimation = () => {
  running.value = !running.value
}

const animation = () => {
  rotateVal = (rotateVal + 6) % 360
  // 旋转矩阵
  const rotateMatrix = new Matrix4()
  const radian = rotateVal * Math.PI / 180
  rotateMatrix.makeRotationZ(radian)

  // 缩放矩阵
  const scaleMatrix = new Matrix4()
  if (scaleVal > 2 || scaleVal < 1) {
    bigger = !bigger
  }
  bigger
      ? scaleVal += 0.03
      : scaleVal -= 0.03
  scaleMatrix.makeScale(scaleVal, scaleVal, scaleVal)

  // 相乘得到模型矩阵
  scaleMatrix.multiply(rotateMatrix)

  gl.uniformMatrix4fv(u_ModelMatrix, false, scaleMatrix.elements)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  animationFrame = requestAnimationFrame(animation)
}

watch(running, val => {
  val ? animation() : cancelAnimationFrame(animationFrame)
})

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Fourth5_2'
})
</script>

<style scoped lang="scss">
#ice-5_2 {
  margin-top: 16px;
}
</style>
