<template>
  <canvas id="ice-3_1" width="600" height="150"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;

  void main () {
    gl_Position = a_Position;
    v_Color = a_Color;
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
  gl = createGl('#ice-3_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  draw(gl, vertexShader, fragmentShader)
}

const draw = (gl, vertexShader, fragmentShader) => {
  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')

  const verticesColors = new Float32Array([
    -1., -1., 1., 1., 0., 1.,
    -.4, .6, 1., 1., 0., 1.,
    .2, -1., 1., 1., 0., 1.,
  ])

  const FSIZE = verticesColors.BYTES_PER_ELEMENT

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_Position)

  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.enableVertexAttribArray(a_Color)

  gl.clearColor(0., 0., 0., .9)
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
  name: 'Third3_1'
})
</script>
