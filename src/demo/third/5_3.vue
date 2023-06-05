<template>
  <div class="wrapper">
    <canvas id="ice-5_3" width="420" height="420"></canvas>

    <el-form class="options-group" size="small" label-position="top">
      <el-form-item label="TEXTURE_MIN_FILTER 参数配置：">
        <el-radio-group v-model="minFilterType" @change="drawPicture">
          <el-radio label="NEAREST"></el-radio>
          <el-radio label="LINEAR"></el-radio>
          <el-radio label="NEAREST_MIPMAP_LINEAR"></el-radio>
          <el-radio label="NEAREST_MIPMAP_NEAREST"></el-radio>
          <el-radio label="LINEAR_MIPMAP_NEAREST"></el-radio>
          <el-radio label="LINEAR_MIPMAP_LINEAR"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="TEXTURE_MAG_FILTER 参数配置：">
        <el-radio-group v-model="magFilterType" @change="drawPicture">
          <el-radio label="NEAREST"></el-radio>
          <el-radio label="LINEAR"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="texImage2D 前调用 gl.generateMipmap：">
        <el-switch v-model="isBeforeTexImage2D" @change="drawPicture" />
      </el-form-item>
      <el-form-item label="是否使用 2 整数次幂的源图片：">
        <el-switch v-model="isPowOfTWo" @change="drawPicture" />
      </el-form-item>
      <el-form-item label="图像缩放：">
        <el-slider size="small" v-model="size" :format-tooltip="format" />
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
import imageUrl512 from '/public/images/third/5.3.512.jpeg'
import imageUrl500 from '/public/images/third/5.3.jpeg'

const size = ref(50)
const magFilterType = ref('NEAREST')
const minFilterType = ref('NEAREST_MIPMAP_LINEAR')
const isBeforeTexImage2D = ref(false)
const isPowOfTWo = ref(true)
const maxSize = 100

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

let gl, program, a_Position, canvas, img512, img500

const initGl = () => {
  gl = createGl('#ice-5_3')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  program = createProgram(gl, vertexShader, fragmentShader)

  const verticesTexCoords = new Float32Array([
      -1., 1., 0., format(maxSize - size.value),
      -1., -1., 0., 0.,
      1., 1., format(maxSize - size.value), format(maxSize - size.value),
      1.,-1., format(maxSize - size.value), 0.
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

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[minFilterType.value])
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[magFilterType.value])
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  isBeforeTexImage2D.value && gl.generateMipmap(gl.TEXTURE_2D)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, isPowOfTWo.value ? img512 : img500)

  !isBeforeTexImage2D.value && gl.generateMipmap(gl.TEXTURE_2D)

  const u_Sampler = gl.getUniformLocation(program, 'u_Sampler')
  gl.uniform1i(u_Sampler, 0)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

const initImage = () => {
  img512 = new Image()
  img512.src = imageUrl512
  img500 = new Image()
  img500.src = imageUrl500
  img512.onload = function () {
    initGl()
  }
}

watch(size, (size) => {
  console.log(size);
  initGl()
})

onMounted(() => {
  initImage()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Third5_3'
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
  .options-group {
    padding-left: 8px;
    flex: 1;
    box-sizing: border-box;
  }
}
</style>
