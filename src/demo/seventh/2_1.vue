<template>
  <canvas id="ice-1_1" width="400" height="400"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'
import { Matrix4, Vector3, Vector4 } from '../cuon-matrix'
import axios from 'axios';
import parseWFObj from 'wavefront-obj-parser'

const xLight = ref(3)
const yLight = ref(2)
const zLight = ref(1)

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec3 a_Normal;
  varying vec4 v_Color;
  uniform mat4 u_MvpMatrix;
  uniform vec4 u_LightColor;
  uniform vec3 u_LightDirection;

  void main () {
    gl_Position = u_MvpMatrix * a_Position;
    // vec3 normal = normalize(a_Normal);
    // vec3 normalizeLightDirection = normalize(u_LightDirection);
    // 求光线、法向量点积
    // float dotProduct = dot(normal, normalizeLightDirection);
    // vec3 colorRes = vec3(u_LightColor) * vec3(a_Color) * dotProduct;
    // v_Color= vec4(colorRes, a_Color.a);
    v_Color= vec4(0., 0., 0., 1.);
  }
`

const fragmentCode = `
  precision mediump float;
  varying vec4 v_Color;

  void main () {
    gl_FragColor = v_Color;
  }
`

let gl, a_Position, canvas, a_Color, a_Normal, program, u_MvpMatrix, u_LightColor, u_LightDirection, indices

const initGl = ({ vertexPositions, vertexPositionIndices, vertexNormals }) => {
  gl = createGl('#ice-1_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  a_Normal = gl.getAttribLocation(program, 'a_Normal')
  u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
  u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
  u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection')

  const matrix = new Matrix4()
  matrix
    .perspective(50, 1, 1, 100)
    .lookAt(1.3, .5, 1.3, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_MvpMatrix, false, matrix.elements)

  const vertices = new Float32Array(vertexPositions)

  indices = new Uint16Array(vertexPositionIndices)

  const lightColor = new Vector4(1.0, 1.0, 1.0, 1.0)
  gl.uniform4fv(u_LightColor, lightColor.elements)

  const lightDirection = new Vector3(xLight.value, yLight.value, zLight.value)
  gl.uniform3fv(u_LightDirection, lightDirection.elements)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3)
  // 颜色值
  // createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(), a_Color, 3)
  // 点的法向量
  createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vertexNormals), a_Normal, 3)
  console.log('indices.length', indices.length);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
}

const readOBJFile = async () => {
  const res = await axios.get('/models/fan/Colling Fan.obj')
  const parseObject = parseWFObj(res.data)
  console.log('parseObject', parseObject)
  initGl(parseObject)
}

onMounted(() => {
  readOBJFile()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Seventh1_1'
})
</script>

<style lang="scss" scoped>
#ice-1_1 {
  margin: 0 auto;
}
</style>
