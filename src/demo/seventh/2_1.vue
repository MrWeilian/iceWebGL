<template>
  <div
    class="canvas-wrapper"
    ref="canvasRef"
     @mousedown="mousedown"
     @mouseleave="mouseleave"
     @mousemove="mousemove"
     @mouseup="mouseup"
  />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { onMounted, ref } from 'vue';
import { useMouseCamera } from '@ice-webgl/utils/useMouseCamera';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvasRef = ref(null);
const cameraPosition = ref([1, 1, 6])

let camera, renderer, scene, controls

const moveOption = (diffX: number, diffY: number) => {
  const position = cameraPosition.value;
  // camera.position.set(position[0] + diffX, position[1] + diffY, position[2])
  controls.update();
  renderer.render(scene, camera);
}

const upOption = (endX: number, endY: number) => {
  const originPosition = cameraPosition.value;
  cameraPosition.value = [originPosition[0] + endX, originPosition[1] + endY, originPosition[2]];
}

const {
  mousedown,
  mousemove,
  mouseleave,
  mouseup
} = useMouseCamera({ moveOption, upOption })

const initFn = () => {
  camera = new THREE.PerspectiveCamera( 60, canvasRef.value.offsetWidth / canvasRef.value.offsetHeight, 1, 100);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  let ambientLight = new THREE.AmbientLight(0x999999);
  // 点光源 就像灯泡一样的效果  白色灯光 亮度0.6
  let pointLight = new THREE.PointLight(0xffffff, 0.3);
  camera.position.set(0, 1, 6);
  scene.add(ambientLight);
  // 将灯光加到摄像机中 点光源跟随摄像机移动
  // 为什么这样做  因为这样可以让后期处理时的辉光效果更漂亮
  camera.add(pointLight);
  const loader = new OBJLoader();
  const MTLloader = new MTLLoader();
  renderer.setSize( canvasRef.value.offsetWidth, canvasRef.value.offsetHeight );
  canvasRef.value.appendChild( renderer.domElement );
  // console.log('loader', loader);
  MTLloader.load('/models/car/Car/Car_Obj.mtl', function (materials) {
    loader.setMaterials(materials)
    loader.load(
        // 资源的URL
        '/models/car/Car/Car Obj.obj',

        // onLoad回调
        // Here the loaded data is assumed to be an object
        function ( obj ) {
          // Add the loaded object to the scene

          scene.add( obj );
          scene.add( camera );
          renderer.render(scene,camera);
          controls = new OrbitControls(camera, renderer.domElement);
          controls.target.set(0, 0, 0);
          controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
          controls.dampingFactor = 0.05;

          controls.screenSpacePanning = false;

          controls.maxPolarAngle = Math.PI / 2;
        },

        // onProgress回调
        function ( xhr ) {
          console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError回调
        function ( err ) {
          console.error( 'An error happened' );
        }
    );
  })
}

onMounted(() => {
  initFn();
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Seventh2_1'
})
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  margin: 0 auto;
  width: 100%;
  height: 300px;
}
</style>
