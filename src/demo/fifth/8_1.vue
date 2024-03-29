<template>
  <div class="box">
    <el-radio-group v-model="transformType">
      <el-radio v-for="item in transformation" :label="item.value">{{ item.label }}</el-radio>
    </el-radio-group>
    <el-button class="btn" type="primary" @click="toggleAnimation">{{ running ? '停止' : '开始' }}</el-button>
  </div>

  <canvas
    id="ice-8_1"
    width="600"
    height="400"
    @mousedown="mousedown"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    @mouseup="mouseup"
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
import { Mat4 } from '../cuon-matrix/mat4';
import ViewMatrix from '../matrix/ViewMatrix'
import PerspectiveMatrix from '../matrix/PerspectiveMatrix';
import OrthographicMatrix from '../matrix/OrthographicMatrix';
import { useMouseCamera } from '@ice-webgl/utils/useMouseCamera';

const transformation = [
  { label: '透视投影', value: 'perspective' },
  { label: '正交投影', value: 'orthographic' },
]

const running = ref(false)

const fov = 80
const near = 1
const far = 100

let triangularPyramids = []

const transformType = ref('perspective')

const vertexCode = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;

  void main () {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  }
`

const fragmentCode = `
  precision mediump float;
  uniform vec4 u_Color;

  void main () {
    gl_FragColor = u_Color;
  }
`

let gl: WebGLRenderingContext, a_Position, canvas, program, indices, u_Color, u_ModelMatrix, u_ViewMatrix, u_ProjectionMatrix

const camera = [0, 0, 10]
const target = [0, 0, -1]
const up = [0, 1, 0]
const maxCameraPosition = 8
let animationNum = null

const getCameraPosition = (origin: number) => {
  if (origin > maxCameraPosition) return maxCameraPosition
  if (origin < -maxCameraPosition) return -maxCameraPosition
  return origin
}

const createModelMatrix = (elements?: Float32Array) => {
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  let result = elements
  if (!result) {
    const modelMatrix = new Mat4()
    result = modelMatrix.elements
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, result)
}

const createViewMatrix = (cameraArr: number[]) => {

  cameraArr[0] = getCameraPosition(cameraArr[0])
  cameraArr[1] = getCameraPosition(cameraArr[1])

  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const viewMatrix = new ViewMatrix()
  viewMatrix.lookAt.apply(viewMatrix, cameraArr)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)
}

const createProjectionMatrix = () => {
  const canvasEl = gl.canvas as HTMLElement
  u_ProjectionMatrix = gl.getUniformLocation(program, 'u_ProjectionMatrix')
  const perspectiveMatrix = new PerspectiveMatrix()
  perspectiveMatrix.setPerspective(fov, canvasEl.clientWidth / canvasEl.clientHeight, near, far)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, perspectiveMatrix.elements)
}

const initGl = () => {
  gl = createGl('#ice-8_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  u_Color = gl.getUniformLocation(program, 'u_Color')

  createModelMatrix()
  createViewMatrix([...camera, ...target, ...up])
  createProjectionMatrix()

  const vertices = new Float32Array([
    -.25, .25, .25,
    -.25, -.25, .25,
    .25, -.25, .25,
    .25, .25, .25,
    .25, .25, -.25,
    .25, -.25, -.25,
    -.25, -.25, -.25,
    -.25, .25, -.25,
  ])
  indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    3, 2, 5, 3, 5, 4,
    4, 5, 6, 4, 6, 7,
    7, 0, 6, 0, 1, 6,
    0, 3, 4, 0, 4, 7,
    1, 2, 5, 1, 5, 6,
  ])

  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, 0, 0)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

const draw = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  for (let i in triangularPyramids) {
    const item = triangularPyramids[i]
    gl.uniform4fv(u_Color, item.u_Color)
    gl.uniformMatrix4fv(u_ModelMatrix, false, item.u_ModelMatrix.elements)

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
  }

  running.value && (triangularPyramids = triangularPyramids.filter(_ => (Date.now() - _.startTime) < _.animationTime))
}

const moveOption = (diffX: number, diffY: number) => {
  const moveX = camera[0] + diffX
  const moveY = camera[1] + diffY

  createViewMatrix([moveX, moveY, camera[2], ...target, ...up])
  draw()
}

const upOption = (endX: number, endY: number) => {
  camera[0] = getCameraPosition(camera[0] + endX)
  camera[1] = getCameraPosition(camera[1] + endY)

  createViewMatrix([...camera, ...target, ...up])
  draw()
}

const animation = () => {
  createTriangularPyramid()
  for (const triangularPyramid of triangularPyramids) {
    const translateMatrix = new Mat4()
    const translate = triangularPyramid.translate.map(_ => _ / 100 * 1.5)
    translateMatrix.setTranslate.apply(translateMatrix, translate)

    const rotateMatrix = new Mat4()
    const rotate = triangularPyramid.rotate.map(_ => _/10)
    rotateMatrix.setRotate.apply(rotateMatrix, rotate)

    triangularPyramid.u_ModelMatrix.multiply(translateMatrix).multiply(rotateMatrix)
  }
  draw()

  animationNum = requestAnimationFrame(animation)
}

const {
  mousedown,
  mousemove,
  mouseleave,
  mouseup
} = useMouseCamera({ moveOption, upOption })

const createRandom = (area: number = 1) => {
  const target = Math.floor((Math.random() * (area * 2)) - area)
  return target
}

const randomCubeParams = () => {
  const u_Color = new Float32Array([Math.random(), Math.random(), Math.random(), .9])
  const u_ModelMatrix = new Mat4()
  const translate = [createRandom(10), createRandom(10), createRandom(1)]

  const rotate = [createRandom(30), createRandom(10), createRandom(10), createRandom(10)]
  const startTime = Date.now()
  const animationTime = Math.floor(Math.random() * 3000 + 4000) // 2-5s 动画时间

  return {
    translate,
    rotate,
    u_Color,
    u_ModelMatrix,
    startTime,
    animationTime
  }
}

const createTriangularPyramid = () => {
  for (let i = 0; i < 8; i++) {
    triangularPyramids.push(randomCubeParams())
  }
}

const toggleAnimation = () => {
  running.value = !running.value
  if (!running.value) {
    cancelAnimationFrame(animationNum)
  } else {
    triangularPyramids = []
    animation()
  }
}

watch(transformType, type => {
  const canvasEl = gl.canvas as HTMLElement
  u_ProjectionMatrix = gl.getUniformLocation(program, 'u_ProjectionMatrix')
  if (type === 'perspective') {
    const perspectiveMatrix = new PerspectiveMatrix()
    perspectiveMatrix.setPerspective(fov, canvasEl.clientWidth / canvasEl.clientHeight, near, far)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, perspectiveMatrix.elements)
  } else {
    const orthographicMatrix = new OrthographicMatrix()
    orthographicMatrix.setOrthographicPosition(-10, 10, 8, -8, -100, 100)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, orthographicMatrix.elements)
  }
  draw()
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
.box {
  display: flex;
  align-items: center;
}
.btn {
  margin-left: 16px;
}
</style>
