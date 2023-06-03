<template>
  <div class="wrapper">
<!--    <canvas id="ice-5_1" width="4096" height="2048"></canvas>-->
    <canvas id="ice-5_1" width="400" height="200"></canvas>

    <el-form class="options-group">
      <el-form-item label="调整尺寸">
        <el-slider v-model="size" :format-tooltip="format" />
      </el-form-item>
      <el-form-item label="调整尺寸">
        <el-slider v-model="size" :format-tooltip="format" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createGl,
  createShader,
  createProgram,
} from '@ice-webgl/utils'
import imageUrl from '/public/images/third/4.1.jpeg'

const size = ref(0)

const format = (val) => parseFloat((val / 50).toString())

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
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }
`

let gl, program, a_Position, canvas, img

const initGl = () => {
  gl = createGl('#ice-5_1')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  program = createProgram(gl, vertexShader, fragmentShader)

  const verticesTexCoords = new Float32Array([
    // -1., 1., 0., 1.,
    // -1., -1., 0., 0.,
    // 1., 1., 1., 1.,
    // 1.,-1., 1., 0.
      -1., 1., 0., format(size.value),
      -1., -1., 0., 0.,
      1., 1., format(size.value), format(size.value),
      1.,-1., format(size.value), 0.
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

  drawPicture()
}

const drawPicture = () => {
  const texture = gl.createTexture()

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)

  const u_Sampler = gl.getUniformLocation(program, 'u_Sampler')
  gl.uniform1i(u_Sampler, 0)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

const initImage = () => {
  img = new Image()
  img.src = imageUrl
  img.onload = function () {
    initGl()
  }
}

watch(size, (size) => {
  initGl()
})

onMounted(() => {
  initImage()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Third5_1'
})
</script>

<style lang="scss" scoped>
#ice-5_1 {
  margin-top: 16px;
}

.wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
  .options-group {
    padding: 0 8px 0 16px;
    flex: 1;
    box-sizing: border-box;
  }
}
</style>
