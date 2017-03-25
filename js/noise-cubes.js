module.exports = function(){
  var THREE = require('three')
  var dat = require('dat-gui')
	var gui = new dat.GUI();

  var perlin = require('./perlin_noise.js')

  window.sample_multiplier = 0.1
  window.time = false

  var noise = perlin.noise
  window.perlin = perlin
  window.noise = noise
  perlin.noiseDetail(4,0.1)
  perlin.noiseSeed(1)


  window.octaves = 4
  window.falloff = 0.75

  gui.add(window, 'sample_multiplier', 0, 1)
  gui.add(window, 'octaves', 1, 10)
  gui.add(window, 'falloff', 0, 1)


  var Exporter = require('three-obj-exporter')

  var e = new Exporter()
  window.e = e

  window.t = THREE

  document.body.style.margin = '0px'
  document.body.style.padding = '0px'
  document.body.style.overflow = 'hidden'

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1500);
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 0
  camera.lookAt(scene.position)

  var renderer = new THREE.WebGLRenderer({
      antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x3366ff, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

  document.body.appendChild(renderer.domElement);

  var ambientLight = new THREE.AmbientLight(0xFFFFFF);
  // scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);

  lights[0] = new THREE.SpotLight(0xffffff, 2, 0)
  lights[0].position.set(0, 1000, 1000);
  lights[0].lookAt(scene.position)

  lights.forEach(function(l){
    l.castShadow = true;
  })

  scene.add(lights[0]);

  var material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: false,
      side: THREE.DoubleSide
  });

  var x = 32
  var y = 32

  var geometry

  var meshes = []
  for(var i = 0; i < x; i++){
    for(var j = 0; j < y; j++){
      (function(){
        // var mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(noise(i,j), noise(i,j), noise(i,j)), material)
        var mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1), material)
        mesh.position.x = i - (x/2)
        mesh.position.y = j - (y/2)
        meshes.push(mesh)
        scene.add(mesh)
      })()
    }
  }

  // var geometry = new THREE.PlaneGeometry( 1000, 1000, 40, 40 );
  // geometry.dynamic = true
  // var mesh = new THREE.Mesh(geometry);
  // mesh.castShadow = true
  // mesh.receiveShadow = true
  // mesh.rotation.x = -Math.PI*0.5
  //
  // window.mesh = mesh
  //
  // scene.add(mesh);

  var prevFog = false;
  var frame_number = 0

  // mesh.geometry.dynamic = true
  // var a1 = 0.01
  // var a2 = 0.03
  // var a3 = 0.02
  // var h = 30
  // mesh.geometry.vertices.forEach(function(v,i){
  // //  v.z = (h * ( Math.cos(v.x*a1) * Math.sin(v.y*a2) * Math.cos(v.x * a3) )) + (0 * (Math.random()-0.5))
  //   v.z = noise(v.x, v.y) * 100.0
  // })
  // mesh.geometry.verticesNeedUpdate = true


  var multiplier = 0.01
  var render = function() {

      requestAnimationFrame(render);

      var time = Date.now() * 0.01;

      // multiplier *= 0.999
      // mesh.geometry.vertices.forEach(function(v,i){
      //   v.z = (h * ( Math.cos(v.x*a1) * Math.sin(v.y*a2) * Math.cos(v.x * a3) )) + (0 * (Math.random()-0.5))
      //   v.z = noise(v.x * multiplier, v.y * multiplier, time) * 40.0
      // })
      // mesh.geometry.verticesNeedUpdate = true

      perlin.noiseDetail(window.octaves, window.falloff)

      var mesh_idx = 0
      for(var i = 0; i < x; i++){
        for(var j = 0; j < y; j++){
          (function(){
            if(!window.time){
              meshes[mesh_idx].scale.x = noise(i * sample_multiplier, j * sample_multiplier)
              meshes[mesh_idx].scale.y = noise(i * sample_multiplier, j * sample_multiplier)
              meshes[mesh_idx].scale.z = noise(i * sample_multiplier, j * sample_multiplier)
            } else {
              meshes[mesh_idx].scale.x = noise(i * sample_multiplier, j * sample_multiplier, time * 0.1)
              meshes[mesh_idx].scale.y = noise(i * sample_multiplier, j * sample_multiplier, time * 0.1)
              meshes[mesh_idx].scale.z = noise(i * sample_multiplier, j * sample_multiplier, time * 0.1)
            }
            mesh_idx +=1
          })()
        }
      }


      // var h = 10
      // mesh.geometry.vertices[frame_number % mesh.geometry.vertices.length].z = h * Math.abs(Math.sin(time*1))

      frame_number += 1
      // mesh.rotation.x += 0.005;
      // mesh.rotation.y += 0.005;

      var r = x
      // camera.position.y = 100 + (10 * Math.sin(time*10))
      camera.position.y = r * Math.sin(time*0.01)
      camera.position.x = r * Math.cos(time*0.01)
      camera.position.z = r
      // camera.position.z = -r * Math.cos(time*4)

      // lights[2].position.x = r * Math.sin(time)

      camera.lookAt(scene.position)

      renderer.render(scene, camera);

  };

  window.addEventListener('resize', function() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

  }, false);

  render();
}
