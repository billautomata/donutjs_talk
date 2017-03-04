<template>
  <div id="hello">
  </div>
</template>

<script>
import foo from '../lib/main.js'

export default {
  name: 'hello',
  data () {
    return {
    }
  },
  mounted(){
    require('../lib/main.js')()
  }
}
</script>

<style scoped>
#hello {
  padding: 0px;
  margin: 0px;
}
</style>
