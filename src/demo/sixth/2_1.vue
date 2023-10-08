<template>
  <div class="box">
    <canvas
      id="ice-2_1"
      width="300"
      height="300"
    />
    <div class="form">
      <el-switch v-model="envLight" active-text="开启环境光" />
      <p>调整平行光照射角度：</p>
      <el-form>
        <el-form-item label="光源x位置">
          <el-slider v-model="xLight" :max="3" :step="0.01"  />
        </el-form-item>
        <el-form-item label="光源y位置">
          <el-slider v-model="yLight" :max="3" :step="0.01"  />
        </el-form-item>
        <el-form-item label="光源z位置">
          <el-slider v-model="zLight" :max="3" :step="0.01"  />
        </el-form-item>
      </el-form>
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

const envLight = ref(true)
const ENV_LIGHT_RGB = 0.36

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
  uniform vec4 u_AmbientColor;

  void main () {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(a_Normal);
    vec3 normalizeLightDirection = normalize(u_LightDirection);
    // 求光线、法向量点积
    float dotProduct = dot(normal, normalizeLightDirection);
    vec4 ambient = a_Color * u_AmbientColor;
    vec3 colorRes = vec3(u_LightColor) * vec3(a_Color) * dotProduct;
    v_Color= vec4(colorRes, a_Color.a) + ambient;
  }
`

const fragmentCode = `
  precision mediump float;
  varying vec4 v_Color;

  void main () {
    gl_FragColor = v_Color;
  }
`

let gl, a_Position, canvas, a_Color, a_Normal, program, u_MvpMatrix, u_LightColor, u_LightDirection, u_AmbientColor, indices

const initGl = () => {
  gl = createGl('#ice-2_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  a_Normal = gl.getAttribLocation(program, 'a_Normal')
  u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
  u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
  u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection')
  u_AmbientColor = gl.getUniformLocation(program, 'u_AmbientColor')

  const matrix = new Matrix4()
  matrix
    .perspective(60, 1, 1, 100)
    .lookAt(1.3, 1.3, 1.3, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_MvpMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    // 蓝 1（前）
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
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0., 1, 0.,
    0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0., 1, 0.,
    0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0., 1, 0.,
    -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0., 1, 0.,
    // 蓝 6
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0., -1, 0.,
    -0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0., -1, 0.,
    0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0., -1, 0.,
    0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0., -1, 0.,
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

  const lightColor = new Vector4(1.0, 1.0, 1.0, 1.0)
  gl.uniform4fv(u_LightColor, lightColor.elements)

  const lightDirection = new Vector3(xLight.value, yLight.value, zLight.value)
  gl.uniform3fv(u_LightDirection, lightDirection.elements)

  const ambientColor = new Vector4(ENV_LIGHT_RGB, ENV_LIGHT_RGB, ENV_LIGHT_RGB, 1.)
  gl.uniform4fv(u_AmbientColor, ambientColor.elements)

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

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

watch([xLight, yLight, zLight], () => {
  const lightDirection = new Vector3(xLight.value, yLight.value, zLight.value)
  gl.uniform3fv(u_LightDirection, lightDirection.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
})

watch(envLight, light => {

  const ambientColor = light
      ? new Vector4(ENV_LIGHT_RGB, ENV_LIGHT_RGB, ENV_LIGHT_RGB, 1.)
      : new Vector4(0., 0., 0., 1.)
  gl.uniform4fv(u_AmbientColor, ambientColor.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
})

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Sixth2_1'
})
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  .form {
    flex: 1;
  }
}
</style>
