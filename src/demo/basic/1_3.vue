<template>
  <canvas id="ice-1_3" width="600" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createShader, createProgram, createBuffer } from '@ice-webgl/utils'

onMounted(() => {
  const canvas = document.querySelector('#ice-1_3')
  const gl = canvas.getContext('webgl')

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
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  const program = createProgram(gl, vertexShader, fragmentShader)
  const vertices = new Float32Array([0., 0., 0., 1., 1., 0.])
  const a_Position = gl.getAttribLocation(program, 'a_Position')
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 2)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Basic1_3'
})
</script>
