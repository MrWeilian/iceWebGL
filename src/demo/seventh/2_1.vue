<template>
  <canvas id="ice-2_1" width="400" height="400"></canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { onMounted } from 'vue';

const initFn = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer();
  const loader = new OBJLoader();
  const MTLloader = new MTLLoader();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  // console.log('loader', loader);
  MTLloader.load('/models/car/Car/Car_Obj.mtl', function (materials) {
    console.log(materials);
    loader.setMaterials(materials)
    loader.load(
        // 资源的URL
        '/models/car/Car/Car Obj.obj',

        // onLoad回调
        // Here the loaded data is assumed to be an object
        function ( obj ) {
          // Add the loaded object to the scene
          console.log(1, obj);
          // scene.add( obj );
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
#ice-2_1 {
  margin: 0 auto;
}
</style>
