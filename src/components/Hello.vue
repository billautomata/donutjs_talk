<template>
  <div id="hello">
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  mounted(){
    require('../lib/particle/main.js')()
  }
}
</script>

<style scoped>
#hello {
  padding: 0px;
  margin: 0px;
}
</style>
