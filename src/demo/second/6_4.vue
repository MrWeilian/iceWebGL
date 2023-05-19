<template>
  <canvas id="ice-6_4" width="600" height="300"></canvas>
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
  precision mediump float;

  void main () {
    gl_FragColor = vec4(0.0, 0.0, 1., .8);
  }
`

let gl, a_Position, canvas

const initGl = () => {
  gl = createGl('#ice-6_4')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')

  const vertices = new Float32Array([
    0., 0., -.5, .3,
    -.3, .6, 0., .8,
    .3, .6, .5, .3
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  gl.clearColor(0., 0., 0., .9)
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
  name: 'Second6_4'
})
</script>
