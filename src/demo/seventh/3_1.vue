<template>
  <div id="ice-3_1" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

const vertexCode = `
  attribute vec4 a_Position;

  void main () {
    gl_Poisition = a_Position;
  }
`;

const fragmentCode = `
  precision mediump float;
  varying vec4 v_Color;

  void main () {
    gl_FragColor = v_Color;
  }
`;

const loadOBJ = async () => {
  const result = await axios.get('/models/car/Car/Car Obj.obj');
  const obj = result.data;
  console.log(11, obj);
};

const initRender = () => {
  
}

onMounted(() => {
  loadOBJ();
});
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Seventh3_1',
});
</script>

<style lang="scss" scoped>
#ice-3_1 {
  margin: 0 auto;
  width: 100%;
  height: 400px;
}
</style>
