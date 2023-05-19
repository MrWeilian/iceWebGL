<template>
  <canvas id="ice-3_1" width="600" height="100"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createGl, createShader, createProgram } from '@ice-webgl/utils'

const vertexCode = `
  // 定义了一个名为 a_Position，类型为 vec4 的 attribute 变量
  attribute vec4 a_Position;

  void main () {
    // 将变量赋值给顶点坐标
    gl_Position = a_Position;
    // 顶点渲染像素大小
    gl_PointSize = 24.0;
  }
`

const fragmentCode = `
  void main () {
    // 顶点颜色——蓝色 (R, G, Bule, A)
    gl_FragColor = vec4(0.0, 0.0, 0.9, 1.0);
  }
`

const initGl = () => {
  const gl = createGl('#ice-3_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  const program = createProgram(gl, vertexShader, fragmentShader)

  const a_Position = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttrib2f(a_Position, -.9, .7)

  gl.drawArrays(gl.POINTS, 0, 1)
}

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Second3_1'
})
</script>
