<template>
  <canvas id="ice-4_1" width="640" height="400"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
} from '@ice-webgl/utils'

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;

  void main () {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`

const fragmentCode = `
  precision mediump float;
  varying vec2 v_TexCoord;
  uniform sampler2D u_Sampler;

  void main () {
    gl_FragColor = vec4(0., 0., 0., 1.);
  }
`

let gl, program, a_Position, canvas, img

const initGl = () => {
  gl = createGl('#ice-4_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  program = createProgram(gl, vertexShader, fragmentShader)

  const verticesTexCoords = new Float32Array([
      -.5, .5, 0., 1.,
      -.5, -.5, 0., 0.,
      .5, .5, 1., 1.,
      .5,-.5, 1., 0.
  ])
  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(a_Position)
  const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord')
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(a_TexCoord)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Third4_1'
})
</script>
