<template>
  <el-form label-position="top" style="width: 600px;">
    <el-form-item label="复合变换（平移+旋转）：">
      <el-slider v-model="rotateVal" :min="-360" :max="360" />
    </el-form-item>
  </el-form>

  <canvas id="ice-4_1" width="600" height="500"></canvas>
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

const defaultOrigin = 0

const rotateVal = ref(defaultOrigin)

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
  gl = createGl('#ice-4_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  const vertices = new Float32Array([
    -.3, -.3,
    0., .3,
    .3, -.3,
  ])
  const colors = new Float32Array([
    1., 0., 0., 1.,
    0., 1., 0., 1.,
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
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

watch(rotateVal, rotateVal => {
  // 旋转矩阵
  const rotateMatrix = new Matrix4()
  const radian = rotateVal * Math.PI / 180
  rotateMatrix.makeRotationZ(radian)
  // 平移矩阵
  const translateMatrix = new Matrix4()
  const translateX = rotateVal / 360.0
  translateMatrix.makeTranslation(translateX, 0., 0.)
  // 相乘得到模型矩阵
  translateMatrix.multiply(rotateMatrix)
  // rotateMatrix.multiply(translateMatrix)

  gl.uniformMatrix4fv(u_ModelMatrix, false, translateMatrix.elements)
  // gl.uniformMatrix4fv(u_ModelMatrix, false, rotateMatrix.elements)
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
  name: 'Fourth4_1'
})
</script>
