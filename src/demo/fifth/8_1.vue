<template>
  <canvas
    id="ice-8_1"
    width="600"
    height="400"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
  createBuffer
} from '@ice-webgl/utils'
import {
  Camera,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
import ViewMatrix from '../matrix/ViewMatrix'
import PerspectiveMatrix from '../matrix/PerspectiveMatrix';
import OrthographicMatrix from '../matrix/OrthographicMatrix'

const fov = 60
const near = 1
const far = 5

const transformType = ref('perspective')

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_PerspectiveMatrix;
  uniform mat4 u_ViewMatrix;

  void main () {
    gl_Position = u_PerspectiveMatrix * u_ViewMatrix * a_Position;
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

let gl, a_Position, canvas, a_Color, program, u_ViewMatrix, u_PerspectiveMatrix

const camera = [0, 0, 2]
const target = [0, 0, -1]
const up = [0, 1, 0]

const initGl = () => {
  gl = createGl('#ice-8_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')

  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const viewMatrix = new ViewMatrix()
  viewMatrix.lookAt.apply(viewMatrix, [...camera, ...target, ...up])
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

  u_PerspectiveMatrix = gl.getUniformLocation(program, 'u_PerspectiveMatrix')
  const perspectiveMatrix = new PerspectiveMatrix()
  perspectiveMatrix.setPerspective(fov, gl.canvas.clientWidth / gl.canvas.clientHeight, near, far)
  gl.uniformMatrix4fv(u_PerspectiveMatrix, false, perspectiveMatrix.elements)

  const vertices = new Float32Array([
    // 蓝
    -1, 0, 0, 0.086, 0.53, 1, 1,
    1, 0, 0, 0.086, 0.53, 1, 1,
    0, 0, -1, 0.086, 0.53, 1, 1,
    0, 1, -.5, 0.086, 0.53, 1, 1,
  ])
  const byte = vertices.BYTES_PER_ELEMENT
  const indices = new Float32Array([
    3, 0, 1,
    1, 2, 3,
    3, 2, 0,
    0, 2, 1
  ])

  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

watch(transformType, type => {
  u_PerspectiveMatrix = gl.getUniformLocation(program, 'u_PerspectiveMatrix')
  if (type === 'perspective') {
    const perspectiveMatrix = new PerspectiveMatrix()
    perspectiveMatrix.setPerspective(fov, gl.canvas.clientWidth / gl.canvas.clientHeight, near, far)
    gl.uniformMatrix4fv(u_PerspectiveMatrix, false, perspectiveMatrix.elements)
  } else {
    const orthographicMatrix = new OrthographicMatrix()
    orthographicMatrix.setOrthographicPosition(-2, 2, 1, -1, -4, 4)
    gl.uniformMatrix4fv(u_PerspectiveMatrix, false, orthographicMatrix.elements)
  }
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 9)
})

onMounted(() => {
  initGl()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Fifth8_1'
})
</script>

<style scoped lang="scss">
#ice-8_1 {
  margin: 16px auto 0;
}
</style>
