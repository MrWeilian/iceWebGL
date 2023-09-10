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
import { Mat4 } from '../cuon-matrix/mat4';
import ViewMatrix from '../matrix/ViewMatrix'
import PerspectiveMatrix from '../matrix/PerspectiveMatrix';
import OrthographicMatrix from '../matrix/OrthographicMatrix'

const fov = 60
const near = 1
const far = 100

const items = []

const transformType = ref('perspective')

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;

  void main () {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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

let gl, a_Position, canvas, a_Color, program, u_ModelMatrix, u_ViewMatrix, u_ProjectionMatrix

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

  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  const modelMatrix = new Mat4()
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const viewMatrix = new ViewMatrix()
  viewMatrix.lookAt.apply(viewMatrix, [...camera, ...target, ...up])
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

  u_ProjectionMatrix = gl.getUniformLocation(program, 'u_ProjectionMatrix')
  const perspectiveMatrix = new PerspectiveMatrix()
  perspectiveMatrix.setPerspective(fov, gl.canvas.clientWidth / gl.canvas.clientHeight, near, far)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, perspectiveMatrix.elements)

  const vertices = new Float32Array([
    // 蓝
    -.5, 0, 0, 0.086, 0.53, 1, 1,
    .5, 0, 0, 0.086, 0.53, 1, 1,
    0, 0, -.5, 0.086, 0.53, 1, 1,
    0, .5, -.25, 0.086, 0.53, 1, 1,
  ])
  const byte = vertices.BYTES_PER_ELEMENT
  const indices = new Uint8Array([
    3, 0, 1,
    1, 2, 3,
    3, 2, 0,
    0, 2, 1
  ])

  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0)
  // 颜色值
  createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3)

  gl.clearColor(0., 0., 0., .9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_BYTE, 0)
}

watch(transformType, type => {
  u_ProjectionMatrix = gl.getUniformLocation(program, 'u_ProjectionMatrix')
  if (type === 'perspective') {
    const perspectiveMatrix = new PerspectiveMatrix()
    perspectiveMatrix.setPerspective(fov, gl.canvas.clientWidth / gl.canvas.clientHeight, near, far)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, perspectiveMatrix.elements)
  } else {
    const orthographicMatrix = new OrthographicMatrix()
    orthographicMatrix.setOrthographicPosition(-2, 2, 1, -1, -4, 4)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, orthographicMatrix.elements)
  }
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 9)
})

onMounted(() => {
  initGl()
})

// onMounted(() => {
//   const canvas = document.querySelector('canvas');
//   const gl = canvas.getContext('webgl');
//
//   const vertex = `
//   attribute vec2 position;
//
//   uniform float u_rotation;
//   uniform float u_time;
//   uniform float u_duration;
//   uniform float u_scale;
//   uniform vec2 u_dir;
//
//   varying float vP;
//
//   void main() {
//     float p = min(1.0, u_time / u_duration);
//     float rad = u_rotation + 3.14 * 10.0 * p;
//     float scale = u_scale * p * (2.0 - p);
//     vec2 offset = 2.0 * u_dir * p * p;
//     mat3 translateMatrix = mat3(
//       1.0, 0.0, 0.0,
//       0.0, 1.0, 0.0,
//       offset.x, offset.y, 1.0
//     );
//     mat3 rotateMatrix = mat3(
//       cos(rad), sin(rad), 0.0,
//       -sin(rad), cos(rad), 0.0,
//       0.0, 0.0, 1.0
//     );
//     mat3 scaleMatrix = mat3(
//       scale, 0.0, 0.0,
//       0.0, scale, 0.0,
//       0.0, 0.0, 1.0
//     );
//     gl_PointSize = 1.0;
//     vec3 pos = translateMatrix * rotateMatrix * scaleMatrix * vec3(position, 1.0);
//     gl_Position = vec4(pos, 1.0);
//     vP = p;
//   }
// `;
//
//   const fragment = `
//   precision mediump float;
//
//   uniform vec4 u_color;
//
//   varying float vP;
//
//   void main()
//   {
//     gl_FragColor.xyz = u_color.xyz;
//     gl_FragColor.a = (1.0 - vP) * u_color.a;
//   }
// `;
//
//   const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//   gl.shaderSource(vertexShader, vertex);
//   gl.compileShader(vertexShader);
//
//   const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//   gl.shaderSource(fragmentShader, fragment);
//   gl.compileShader(fragmentShader);
//
//   const program = gl.createProgram();
//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);
//   gl.useProgram(program);
//
//   const position = new Float32Array([
//     -1, -1,
//     0, 1,
//     1, -1,
//   ]);
//   const bufferId = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
//   gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);
//
//   const vPosition = gl.getAttribLocation(program, 'position');
//   gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(vPosition);
//
//   function randomTriangles() {
//     const u_color = [Math.random(), Math.random(), Math.random(), 1.0]; // 随机颜色
//     const u_rotation = Math.random() * Math.PI; // 初始旋转角度
//     const u_scale = Math.random() * 0.05 + 0.03; // 初始大小
//     const u_time = 0;
//     const u_duration = 3.0; // 持续3秒钟
//
//     const rad = Math.random() * Math.PI * 2;
//     const u_dir = [Math.cos(rad), Math.sin(rad)]; // 运动方向
//     const startTime = performance.now();
//
//     return {u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime};
//   }
//
//   function setUniforms(gl, {u_color, u_rotation, u_scale, u_time, u_duration, u_dir}) {
//     let loc = gl.getUniformLocation(program, 'u_color');
//     gl.uniform4fv(loc, u_color);
//
//     loc = gl.getUniformLocation(program, 'u_rotation');
//     gl.uniform1f(loc, u_rotation);
//
//     loc = gl.getUniformLocation(program, 'u_scale');
//     gl.uniform1f(loc, u_scale);
//
//     loc = gl.getUniformLocation(program, 'u_time');
//     gl.uniform1f(loc, u_time);
//
//     loc = gl.getUniformLocation(program, 'u_duration');
//     gl.uniform1f(loc, u_duration);
//
//     loc = gl.getUniformLocation(program, 'u_dir');
//     gl.uniform2fv(loc, u_dir);
//   }
//
//   let triangles = [];
//   function update(t) {
//     for(let i = 0; i < 5 * Math.random(); i++) {
//       triangles.push(randomTriangles());
//     }
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     triangles.forEach((triangle) => {
//       triangle.u_time = (performance.now() - triangle.startTime) / 1000;
//       setUniforms(gl, triangle);
//       gl.drawArrays(gl.TRIANGLES, 0, position.length / 2);
//     });
//
//     triangles = triangles.filter((triangle) => {
//       return triangle.u_time <= triangle.u_duration;
//     });
//     requestAnimationFrame(update);
//   }
//
//   requestAnimationFrame(update);
// })
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
