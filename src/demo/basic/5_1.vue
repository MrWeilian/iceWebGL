<template>
  <el-button type="primary" @click="drawLine">线</el-button>
  <el-button type="primary" @click="drawTriangle">三角</el-button>
  <canvas id="ice-5_1" width="600" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createGl, createShader, createProgram } from '@ice-webgl/utils'

const vertexCode = `
  attribute vec4 a_Position;

  void main () {
    gl_Position = a_Position;
  }
`

const fragmentCode = `
  void main () {
    gl_FragColor = vec4(0.0, 0.0, 0.9, 1.0);
  }
`

let gl, a_Position, canvas

const initGl = () => {
  gl = createGl('#ice-5_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  const vertices = new Float32Array([
      0., .8, -.6, -.6, .6, -.6
  ])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.LINE_STRIP, 0, 3)
}

const drawLine = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.LINE_STRIP, 0, 3)
}

const drawTriangle = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Basic5_1'
})
</script>

<style lang="scss" scoped>
#ice-5_1 {
  margin-top: 16px;
}
</style>
