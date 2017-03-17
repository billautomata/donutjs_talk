<template>
  <div id="app">
    <!-- <hello></hello> -->
    <threejscene></threejscene>
  </div>
</template>

<script>
import Hello from './components/Hello.vue'
import ThreeJScene from './components/threejs.vue'

export default {
  name: 'app',
  components: {
    'hello': Hello,
    'threejscene': ThreeJScene
  }
}
</script>

<style>
body {
  margin: 0px;
  padding-top: 0px;
}
</style>
