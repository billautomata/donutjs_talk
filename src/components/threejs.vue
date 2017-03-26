<template>
  <div id="threejscene">
    <div v-if='foo > 100'>{{ foo }}</div>
  </div>
</template>

<script>

var THREE = window.THREE

export default {
  name: 'threejscene',
  data () {
    return {
      'foo': Math.random()
    }
  },
  mounted(){
    console.log(this.foo)

    require('../../js/grass.js')()
          //
          //
    			// var scene = new THREE.Scene();
    			// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
    			// camera.position.z = 30;
          //
    			// var renderer = new THREE.WebGLRenderer( { antialias: true } );
    			// renderer.setPixelRatio( window.devicePixelRatio );
    			// renderer.setSize( window.innerWidth, window.innerHeight );
    			// renderer.setClearColor( 0x000000, 1 );
    			// document.body.appendChild( renderer.domElement );
          //
    			// var ambientLight = new THREE.AmbientLight( 0x000000 );
    			// scene.add( ambientLight );
          //
    			// var lights = [];
    			// lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    			// lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    			// lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
          //
    			// lights[ 0 ].position.set( 0, 200, 0 );
    			// lights[ 1 ].position.set( 100, 200, 100 );
    			// lights[ 2 ].position.set( - 100, - 200, - 100 );
          //
    			// scene.add( lights[ 0 ] );
    			// scene.add( lights[ 1 ] );
    			// scene.add( lights[ 2 ] );
          //
    			// var geometry = new THREE.TorusKnotGeometry( 40, 1, 64, 24, 16, 18 );
    			// var mesh = new THREE.Mesh( geometry );
          //
    			// // generateVertexColors( geometry );
          //
    			// mesh.material = new THREE.MeshLambertMaterial( { color: 0x00ff00, wireframe: false } );
          //
    			// // generateMorphTargets( mesh, geometry );
          //
    			// scene.add( mesh );
          //
    			// var prevFog = true;
          //
    			// var render = function () {
          //
    			// 	requestAnimationFrame( render );
          //
    			// 	var time = Date.now() * 0.001;
          //
    			// 	mesh.rotation.x += 0.005;
    			// 	mesh.rotation.y += 0.005;
          //
    			// 	if ( prevFog !== scene.fog ) {
          //
    			// 		mesh.material.needsUpdate = true;
    			// 		prevFog = scene.fog;
          //
    			// 	}
          //
    			// 	if ( mesh.morphTargetInfluences ) {
          //
    			// 		mesh.morphTargetInfluences[ 0 ] = ( 1 + Math.sin( 4 * time ) ) / 2;
          //
    			// 	}
          //
    			// 	renderer.render( scene, camera );
          //
    			// };
          //
    			// window.addEventListener( 'resize', function () {
          //
    			// 	camera.aspect = window.innerWidth / window.innerHeight;
    			// 	camera.updateProjectionMatrix();
          //
    			// 	renderer.setSize( window.innerWidth, window.innerHeight );
          //
    			// }, false );
          //
    			// render();
          //


  }
}
</script>

<style >
body {
  padding: 0px;
  margin: 0px;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
