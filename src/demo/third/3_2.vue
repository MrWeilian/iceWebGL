<template>
  <canvas id="ice-3_2_a" width="600" height="150"></canvas>
  <canvas id="ice-3_2_b" width="600" height="150"></canvas>
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

const fragmentGradientCode = `
  precision mediump float;
  varying vec4 v_Color;

  void main () {
    float tanARadian = atan(120., 180.);
    float vertexY = gl_FragCoord.x * tan(tanARadian) - gl_FragCoord.y;
    gl_FragColor = mix(
    vec4(0., 0., 0., .9),
    v_Color, smoothstep(.1, 2.4, vertexY)
    );
  }
`

const initGl = () => {
  const glA = createGl('#ice-3_2_a')
  const glB = createGl('#ice-3_2_b')

  const vertexShader = createShader(glA, glA.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(glA, glA.FRAGMENT_SHADER, fragmentCode)

  const vertexBShader = createShader(glB, glB.VERTEX_SHADER, vertexCode)
  const fragmentGradientShader = createShader(
      glB,
      glB.FRAGMENT_SHADER,
      fragmentGradientCode
  )

  draw(glA, vertexShader, fragmentShader)
  draw(glB, vertexBShader, fragmentGradientShader)
}

const draw = (gl, vertexShader, fragmentShader) => {
  const program = createProgram(gl, vertexShader, fragmentShader)

  const a_Position = gl.getAttribLocation(program, 'a_Position')
  const a_Color = gl.getAttribLocation(program, 'a_Color')

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
  name: 'Third3_2'
})
</script>
