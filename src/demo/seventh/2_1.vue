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
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { onMounted, ref } from "vue";
import { useMouseCamera } from "@ice-webgl/utils/useMouseCamera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvasRef = ref(null);
const isDrag = ref(false);

let camera, renderer, scene, controls;

const downOption = () => {
  isDrag.value = true;
};

const moveOption = () => {
  if (!isDrag.value) return;
  controls.update();
  renderer.render(scene, camera);
};

const upOption = () => {
  isDrag.value = false;
};

const { mousedown, mousemove, mouseleave, mouseup } = useMouseCamera({
  moveOption,
  upOption,
  downOption,
});

const initFn = () => {
  camera = new THREE.PerspectiveCamera(
    60,
    canvasRef.value.offsetWidth / canvasRef.value.offsetHeight,
    1,
    100,
  );
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  let pointLight = new THREE.PointLight(0xffffff, 0.6);
  camera.position.set(0, 1, 6);
  scene.add(ambientLight);
  scene.add(camera);
  camera.add(pointLight);

  const loader = new OBJLoader();
  const MTLloader = new MTLLoader();
  renderer.setSize(canvasRef.value.offsetWidth, canvasRef.value.offsetHeight);
  canvasRef.value.appendChild(renderer.domElement);
  // console.log('loader', loader);
  MTLloader.load("/models/car/Car/Car_Obj.mtl", function (materials) {
    loader.setMaterials(materials);
    loader.load(
      "/models/car/Car/Car Obj.obj",

      // onLoad回调
      // Here the loaded data is assumed to be an object
      function (obj) {
        scene.add(obj);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
        renderer.render(scene, camera);
      },

      // onProgress回调
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },

      // onError回调
      function (err) {
        console.error("An error happened");
      },
    );
  });
};

onMounted(() => {
  initFn();
});
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Seventh2_1",
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  margin: 0 auto;
  width: 100%;
  height: 400px;
}
</style>
