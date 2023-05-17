<template>
  <div>
    <el-button type="primary" @click="triangles">gl.TRIANGLES</el-button>
    <el-button type="primary" @click="triangleStrip">gl.TRIANGLE_STRIP</el-button>
    <el-button type="primary" @click="triangleFan">gl.TRIANGLE_STRIP</el-button>
  </div>
  <canvas id="ice-6_3" width="600" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createGl, createShader, createProgram } from '@ice-webgl/utils'

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;

  void main () {
    gl_Position = a_Position;
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

let gl, a_Position, canvas, a_Color

const initGl = () => {
  gl = createGl('#ice-6_3')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  const vertices = new Float32Array([
    -.5, .5,  1., 0., 0., 1.,
    -.5, -.5, 1., 0., 0., 1.,
    0., .5,  0., 1., 0., 1.,
    0., -.5,   0., 1., 0., 1.,
    .5, .5, 0., 0., 1., 1.,
    .5, -.5, 0., 0., 1., 1.,
  ])
  const FSIZE = vertices.BYTES_PER_ELEMENT
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0)
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_Color)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const triangles = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

const triangleStrip = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
}

const triangleFan = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Basic6_3'
})
</script>

<style lang="scss" scoped>
#ice-6_3 {
  margin-top: 16px;
}
</style>
