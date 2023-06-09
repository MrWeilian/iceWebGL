<template>
  <div class="wrapper">
    <canvas id="ice-6_2" width="480" height="480"></canvas>

    <el-form class="options-group" size="small" label-position="top">
      <el-form-item label="选择纹理和混色搭配：">
        <el-radio-group v-model="texType" @change="drawPicture">
          <el-radio :label="1">樱木</el-radio>
          <el-radio :label="2">流川</el-radio>
          <el-radio :label="3">樱木+流川(乘法)</el-radio>
          <el-radio :label="4">樱木+流川(除法)</el-radio>
          <el-radio :label="5">樱木+流川(加法)</el-radio>
          <el-radio :label="6">樱木+流川(减法)</el-radio>
        </el-radio-group>
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
import imageUrl1 from '/public/images/third/5.3.512.jpeg'
import imageUrl2 from '/public/images/third/6.5.jpeg'

const texType = ref(1)

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
  uniform sampler2D u_Sampler1;

  void main () {
    gl_FragColor = texture2D(u_Sampler1, v_TexCoord);
  }
`

const fragmentMultipleCode = `
  precision mediump float;
  varying vec2 v_TexCoord;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform float u_DrawIndex;

  void main () {
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
    vec4 color2 = texture2D(u_Sampler2, v_TexCoord);
    if (u_DrawIndex >= 6.0) {
      gl_FragColor = vec4(color1.rgb - color2.rgb, 1.);
    } else if (u_DrawIndex >= 5.0) {
      gl_FragColor = vec4(color1.rgb + color2.rgb, 1.);
    } else if (u_DrawIndex >= 4.0) {
      gl_FragColor = vec4(color1.rgb / color2.rgb, 1.);
    } else {
      gl_FragColor = vec4(color1.rgb * color2.rgb, 1.);
    }
  }
`

let gl, program, canvas, img1, img2

const initGl = (fragmentCode) => {
  gl = createGl('#ice-6_2')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  program = createProgram(gl, vertexShader, fragmentShader)

  const verticesTexCoords = new Float32Array([
      -1., 1., 0., 1.,
      -1., -1., 0., 0.,
      1., 1., 1., 1.,
      1.,-1., 1., 0.
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
}

const initTexture = (img, sampler, texIndex) => {
  const texture = gl.createTexture()

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  gl.activeTexture(gl[`TEXTURE${texIndex}`])
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

  gl.uniform1i(sampler, texIndex)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
}

const drawPicture = () => {
  if (texType.value > 2) {
    initGl(fragmentMultipleCode)
    const u_Sampler1 = gl.getUniformLocation(program, 'u_Sampler1')
    const u_Sampler2 = gl.getUniformLocation(program, 'u_Sampler2')
    const u_DrawIndex = gl.getUniformLocation(program, 'u_DrawIndex')
    switch (texType.value) {
      case 3:
        gl.uniform1f(u_DrawIndex, 3.)
        break
      case 4:
        gl.uniform1f(u_DrawIndex, 4.)
        break
      case 5:
        gl.uniform1f(u_DrawIndex, 5.)
        break
      case 6:
        gl.uniform1f(u_DrawIndex, 6.)
        break
    }
    initTexture(img1, u_Sampler1, 0)
    initTexture(img2, u_Sampler2, 1)
  } else {
    initGl(fragmentCode)
    const u_Sampler1 = gl.getUniformLocation(program, 'u_Sampler1')
    initTexture(texType.value === 1 ? img1 : img2, u_Sampler1, 0)
  }

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

const initImage = async () => {
  img1 = new Image()
  img1.src = imageUrl1
  img2 = new Image()
  img2.src = imageUrl2

  const loadImageQueue = [
    new Promise((res) => {
      img1.onload = res
    }),
    new Promise((res) => {
      img2.onload = res
    })
  ]
  await Promise.all(loadImageQueue)

  drawPicture()
}

onMounted(() => {
  initGl(fragmentCode)
  initImage()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Third6_2'
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
  .options-group {
    padding-left: 12px;
    flex: 1;
    box-sizing: border-box;
  }
}
</style>
