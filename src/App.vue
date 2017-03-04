<template>
  <div id="app">
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello.vue'
import a from './lib/main.js'
import b from './lib/emitter.js'
import c from './lib/particle.js'
import d from './lib/vector.js'
import e from './lib/world.js'

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

<style>
body {
  margin: 0px;
  padding-top: 0px;
}
</style>
