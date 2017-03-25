module.exports = function(){
  var THREE = require('three')

  var perlin = require('./perlin_noise.js')

  var noise = perlin.noise
  window.noise = noise
  perlin.noiseSeed(10001)
  var Exporter = require('three-obj-exporter')

  var e = new Exporter()
  window.e = e

  window.t = THREE

  document.body.style.margin = '0px'
  document.body.style.padding = '0px'
  document.body.style.overflow = 'hidden'

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1500);
  camera.position.y = 40

  camera.position.x = 300
  camera.position.z = 40

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

  lights[0] = new THREE.SpotLight(0xffffff, 1, 0)
  lights[0].position.set(0, 1000, 0);
  lights[0].lookAt(scene.position)

  lights.forEach(function(l){
    l.castShadow = true;
  })

  scene.add(lights[0]);

  var sphereGeometry = new THREE.SphereBufferGeometry( 50, 32, 32 );
  var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000, wireframe: true } );
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.position.y = 10
  sphere.castShadow = true; //default is false
  sphere.receiveShadow = false; //default
  // scene.add( sphere );

  var geometry = new THREE.PlaneGeometry( 1000, 1000, 40, 40 );
  geometry.dynamic = true
  var mesh = new THREE.Mesh(geometry);
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.rotation.x = -Math.PI*0.5

  window.mesh = mesh

  mesh.material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: false,
      side: THREE.DoubleSide
  });
  scene.add(mesh);

  var prevFog = false;
  var frame_number = 0

  mesh.geometry.dynamic = true
  var a1 = 0.01
  var a2 = 0.03
  var a3 = 0.02
  var h = 30
  mesh.geometry.vertices.forEach(function(v,i){
  //  v.z = (h * ( Math.cos(v.x*a1) * Math.sin(v.y*a2) * Math.cos(v.x * a3) )) + (0 * (Math.random()-0.5))
    v.z = noise(v.x, v.y) * 100.0
  })
  mesh.geometry.verticesNeedUpdate = true


  var multiplier = 0.01
  var render = function() {

      requestAnimationFrame(render);

      var time = Date.now() * 0.0001;

      // multiplier *= 0.999
      mesh.geometry.vertices.forEach(function(v,i){
        // v.z = (h * ( Math.cos(v.x*a1) * Math.sin(v.y*a2) * Math.cos(v.x * a3) )) + (0 * (Math.random()-0.5))
        v.z = noise(v.x * multiplier, v.y * multiplier, time) * 40.0
      })
      mesh.geometry.verticesNeedUpdate = true


      // var h = 10
      // mesh.geometry.vertices[frame_number % mesh.geometry.vertices.length].z = h * Math.abs(Math.sin(time*1))

      frame_number += 1
      // mesh.rotation.x += 0.005;
      // mesh.rotation.y += 0.005;

      var r = 400
      // camera.position.y = 100 + (10 * Math.sin(time*10))
      camera.position.y = 100
      camera.position.z = 500
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
