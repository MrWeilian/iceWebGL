<template>
  <canvas
      id="ice-3_1"
      width="640"
      height="500"
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
import { Matrix4, Vector3 } from 'three'

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

const initGl = () => {
  gl = createGl('#ice-3_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const matrix = new Matrix4()
  const camera = new Vector3(0., 0., 0.)
  const target = new Vector3(0, 0, -1)
  const up = new Vector3(0, 1, 0)
  matrix.lookAt(camera, target, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix.elements)
  const vertices = new Float32Array([
    // 黄
    -0.5, 0.5, 0., 0.98, 0.86, 0.078, 1,
    -0.5, -0.5, 0., 0.98, 0.86, 0.078, 1,
    0.5, 0.5, 0.5, 0.98, 0.86, 0.078, 1,

    // 蓝
    0.5, 0.5, 0., 0.086, 0.53, 1, 1,
    0.5, -0.5, 0., 0.086, 0.53, 1, 1,
    -0.5, -0.5, -0.5, 0.086, 0.53, 1, 1,
  ])
  const byte = vertices.BYTES_PER_ELEMENT

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
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
