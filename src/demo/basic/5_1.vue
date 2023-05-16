<template>
  <canvas id="ice-5_1" width="600" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createShader, createProgram } from '@ice-webgl/utils'

const isClear = ref(false)

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

let gl, a_Position, canvas, a_Color

const initGl = () => {
  canvas = document.querySelector('#ice-5_1')
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  const vertices = new Float32Array([
      0., .5, -.5, -.5, .5, -.5
  ])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

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
  name: 'Basic5_1'
})
</script>
