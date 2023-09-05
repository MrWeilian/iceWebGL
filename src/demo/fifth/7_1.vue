<template>
  <el-radio-group v-model="transformType">
    <el-radio v-for="item in transformation" :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>

  <canvas
      id="ice-7_1"
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
import { Mat4 } from '../cuon-matrix/mat4';
import OrthographicMatrix from '../matrix/OrthographicMatrix'

const interval = ['[-1, 1]', '[-2, 2]', '[-3, 3]'] as const

const fov = 60
const near = 1
const far = 5

const transformation = [
  { label: '透视投影', value: 'perspective' },
  { label: '正交投影', value: 'orthographic' },
]

const transformType = ref('perspective')
const orthographicInterval = ref(1)

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
  gl = createGl('#ice-7_1')

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
  // const perspectiveMatrix = new PerspectiveMatrix()
  const perspectiveMatrix = new Mat4()
  perspectiveMatrix.setPerspective(fov, gl.canvas.clientWidth / gl.canvas.clientHeight, near, far)
  gl.uniformMatrix4fv(u_PerspectiveMatrix, false, perspectiveMatrix.elements)

  const vertices = new Float32Array([
    // 绿
    -.7, 0.8, -2, 0.45, 0.82, 0.24, 1,
    -1.2, -0.2, -2, 0.45, 0.82, 0.24, 1,
    -0.2, -0.2, -2, 0.45, 0.82, 0.24, 1,
    // 蓝
    -.1, 0.6, -1, 0.086, 0.53, 1, 1,
    -.6, -0.4, -1, 0.086, 0.53, 1, 1,
    .4, -0.4, -1, 0.086, 0.53, 1, 1,
    // 橙
    0.5, 0.4, 0, 0.98, 0.68, 0.078, 1,
    0, -0.6, 0, 0.98, 0.68, 0.078, 1,
    1, -0.6, 0, 0.98, 0.68, 0.078, 1,
  ])
  const byte = vertices.BYTES_PER_ELEMENT

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3)
  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 9)
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
  name: 'Fifth7_1'
})
</script>

<style scoped lang="scss">
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.box {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  .icon {
    cursor: pointer;
    box-sizing: content-box;
    padding: 4px;
  }
}
#ice-7_1 {
  margin: 16px auto 0;
}
</style>
