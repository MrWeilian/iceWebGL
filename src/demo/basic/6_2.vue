<template>
  <div>
    <el-button type="primary" @click="lines">gl.LINES</el-button>
    <el-button type="primary" @click="lineStrip">gl.LINE_STRIP</el-button>
    <el-button type="primary" @click="lineLoop">gl.LINE_LOOP</el-button>
  </div>
  <canvas id="ice-6_2" width="600" height="300"></canvas>
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
    gl_FragColor = vec4(0.0, 0.0, 1., .8);
  }
`

let gl, a_Position, canvas

const initGl = () => {
  gl = createGl('#ice-6_2')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  const vertices = new Float32Array([
    -.5, -.5, -.5, .5, // 每两个为一组，改变前后两组的顺序
    0., -.5, 0., .5,  // 每两个为一组，改变前后两组的顺序
    .5, -.5, .5, .5 // 每两个为一组，改变前后两组的顺序
  ])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const lines = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.LINES, 0, 6)
}

const lineStrip = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.LINE_STRIP, 0, 6)
}

const lineLoop = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.LINE_LOOP, 0, 6)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Basic6_2'
})
</script>

<style lang="scss" scoped>
#ice-6_2 {
  margin-top: 16px;
}
</style>
