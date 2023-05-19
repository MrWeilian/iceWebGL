<template>
  <canvas id="ice-1_2" width="600" height="100"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const createShader = (gl, type, sourceCode) => {
  const shader = gl.createShader(type) // 创建着色器对象
  gl.shaderSource(shader, sourceCode) // 提供着色器代码
  gl.compileShader(shader) // 编译 -> 生成着色器
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) return shader

  console.error('shader err >>>', type, gl.getShaderInfoLog(shader))
  gl.deleteShader(shader);
}

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error('program err >>>', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

onMounted(() => {
  const canvas = document.querySelector('#ice-1_2')
  const gl = canvas.getContext('webgl')

  const vertexCode = `
    void main () {
      gl_Position = vec4(0, 0.0, 0.0, 1.0);
      gl_PointSize = 24.0;
    }
  `
  const fragmentCode = `
    void main () {
      gl_FragColor = vec4(0.0, 0.0, 0.9, 1.0);
    }
  `
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  createProgram(gl, vertexShader, fragmentShader)
  gl.drawArrays(gl.POINTS, 0, 1)
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Second1_2'
})
</script>
