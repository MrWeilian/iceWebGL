<template>
  <div class="box">
    <canvas
      id="ice-1_1"
      width="300"
      height="300"
    />
    <div>
      <el-switch v-model="light" active-text="开灯！" />
    </div>
  </div>
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

const light = ref(false)

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec3 a_Normal;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;
  uniform vec4 u_LightColor;
  uniform vec3 u_LightDirection;

  void main () {
    gl_Position = u_ModelMatrix * a_Position;
    vec3 normal = normalize(a_Normal);
    vec3 normalizeLightDirection = normalize(u_LightDirection);
    // 求光线、法向量点积
    float dotProduct = dot(normal, normalizeLightDirection);
    vec3 colorRes = vec3(u_LightColor) * vec3(a_Color) * dotProduct;
    v_Color= vec4(colorRes, a_Color.a);
  }
`

const fragmentCode = `
  precision mediump float;
  varying vec4 v_Color;

  void main () {
    gl_FragColor = v_Color;
  }
`

let gl, a_Position, canvas, a_Color, a_Normal, program, u_ModelMatrix, u_LightColor, u_LightDirection, indices, normals

const initGl = () => {
  gl = createGl('#ice-1_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  a_Normal = gl.getAttribLocation(program, 'a_Normal')
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
  u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection')

  const matrix = new Matrix4()
  matrix.setRotate(30, .3, -.3, 0)
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    // 蓝 1
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0., 0., 1,
    0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0., 0., 1,
    0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0., 0., 1,
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0., 0., 1,
    // 蓝 2
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, -1, 0., 0.,
    -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, -1, 0., 0.,
    -0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, -1, 0., 0.,
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, -1, 0., 0.,
    // 蓝 3
    0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 1, 0., 0.,
    0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 1, 0., 0.,
    0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 1, 0., 0.,
    0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 1, 0., 0.,
    // 蓝 4
    0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0., 0., -1,
    0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0., 0., -1,
    -0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0., 0., -1,
    -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0., 0., -1,
    // 蓝 5
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0., 1., 0.,
    0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0., 1., 0.,
    0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0., 1., 0.,
    -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0., 1., 0.,
    // 蓝 6
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0., -1., 0.,
    -0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0., -1., 0.,
    0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0., -1., 0.,
    0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0., -1., 0.,
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

  normals = new Float32Array([

  ])

  const lightColor = new Vector4(1, 1, 1, 1)
  gl.uniform4fv(u_LightColor, lightColor.elements)

  const lightDirection = new Vector3(-1, -1, 0)
  gl.uniform3fv(u_LightDirection, lightDirection.elements)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 10, 0)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 10, byte * 3)
  // 点的法向量
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Normal, 3, byte * 10, byte * 7)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

watch(light, () => {

})

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Sixth1_1'
})
</script>

<style lang="scss" scoped>
.box {
  display: flex;

}
</style>
