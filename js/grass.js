module.exports = function(){
  var THREE = require('three')
  var Exporter = require('three-obj-exporter')
  var e = new Exporter()
  window.e = e
  window.t = THREE

  document.body.style.margin = '0px'
  document.body.style.padding = '0px'
  document.body.style.overflow = 'hidden'

  var dat = require('dat-gui')
	var gui = new dat.GUI();
  gui.close()
  window.gui = gui

  var perlin = require('./perlin_noise.js')()

  window.sample_multiplier = 0.003
  window.sample_offset_x = 0.001
  window.sample_offset_y = 0.00
  window.sample_multiplier_x = 1
  window.sample_multiplier_y = 1
  window.time = 'off'
  window.height = 100
  window.height_offset = 0
  window.noise_threshold = 0.65

  window._wireframe = true

  var noise = perlin.noise
  window.perlin = perlin
  window.noise = noise
  // perlin.noiseDetail(4,0.1)
  perlin.noiseSeed(1)

  window.octaves = 4
  window.falloff = 0.75
  window.time_speed = 0.01

  window.offset_x = 0
  window.offset_y = 0

  gui.add(window, 'height', 1, 300)
  gui.add(window, 'sample_multiplier', 0, 0.5)
  gui.add(window, 'sample_offset_x', 0, 1.5).step(0.001)
  gui.add(window, 'sample_offset_y', 0, 1.5).step(0.001)
  gui.add(window, 'sample_multiplier_x', 0, 10.5)
  gui.add(window, 'sample_multiplier_y', 0, 10.5)
  gui.add(window, 'octaves', 1, 10).step(1)
  gui.add(window, 'falloff', 0, 1)
  gui.add(window, 'time', ['on', 'off'])
  gui.add(window, 'time_speed', 0, 1)
  gui.add(window, 'height_offset', 0, 300)
  gui.add(window, 'noise_threshold', 0, 1)

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1500);
  // camera.position.y = 40
  // camera.position.x = 300
  // camera.position.z = 40

  camera.lookAt(scene.position)

  var renderer = new THREE.WebGLRenderer({
      antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0x3366ff, 1);
  renderer.setClearColor(0x0, 1)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

  document.body.appendChild(renderer.domElement);

  // var ambientLight = new THREE.AmbientLight(0xFFFFFF);
  // scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);

  lights[0] = new THREE.SpotLight(0xffffff, 1, 0)
  lights[0].position.set(1000, 1000, 0);
  lights[0].lookAt(scene.position)

  lights.forEach(function(l){
    l.castShadow = true;
  })

  scene.add(lights[0]);

  // var sphereGeometry = new THREE.SphereBufferGeometry( 50, 64, 64 );
  // var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, wireframe: true } );
  // var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  // sphere.position.y = 10
  // sphere.castShadow = true; //default is false
  // sphere.receiveShadow = false; //default
  // scene.add( sphere );

  var geometry = new THREE.PlaneGeometry( 1000, 1000, 64, 64 );
  geometry.dynamic = true
  var mesh = new THREE.Mesh(geometry);
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.rotation.x = -Math.PI*0.5

  window.mesh = mesh

  mesh.material = new THREE.MeshBasicMaterial({
      // color: 0x00ff00,
      wireframe: _wireframe,
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
  });
  scene.add(mesh);

  var prevFog = false;
  var frame_number = 0

  mesh.geometry.dynamic = true
  var a1 = 0.01
  var a2 = 0.03
  var a3 = 0.02
  var h = 100
  // mesh.geometry.vertices.forEach(function(v,i){
  //  v.z = (h * ( Math.cos(v.x*a1) * Math.sin(v.y*a2) * Math.cos(v.x * a3) )) + (0 * (Math.random()-0.5))
  // v.z = noise(v.x, v.y) * 100.0
  // })
  // mesh.geometry.verticesNeedUpdate = true

  console.log(mesh)

  function update_mesh(){
    window.offset_x += sample_offset_x
    window.offset_y += sample_offset_y
    var time = Date.now() * 0.001;
    if(window.time === 'off'){
      time = 0
    }
    perlin.noiseDetail(window.octaves, window.falloff)
    mesh.geometry.vertices.forEach(function(v,i){
      var noise_result = noise((v.x * sample_multiplier * sample_multiplier_x) + offset_x, (v.y * sample_multiplier * sample_multiplier_y) + offset_y, time * window.time_speed)
      v.z = (window.height * noise_result) - window.height_offset
    })
    mesh.geometry.faces.forEach(function(face,face_index){
      ['a', 'b', 'c'].forEach(function(face_vertex,i){
        var vertex_index = face[face_vertex]
        var p = geometry.vertices[vertex_index]
        // console.log(p.z)
        var noise_result = noise((p.x * sample_multiplier * sample_multiplier_x) + offset_x, (p.y * sample_multiplier * sample_multiplier_y) + offset_y, time * window.time_speed)
        if(noise_result > window.noise_threshold){
          face.vertexColors[i] = new THREE.Color(0x00ff00)
        } else {
          face.vertexColors[i] = new THREE.Color(0xff0000)
        }
      })
    })
    mesh.geometry.colorsNeedUpdate = true
    mesh.geometry.elementsNeedUpdate = true
    mesh.geometry.verticesNeedUpdate = true
  }

  var render = function() {

      requestAnimationFrame(render);

      var time = Date.now() * 0.0001;

      update_mesh()

      var r = 400

      camera.position.y = 400
      camera.position.z = -r * Math.sin(time * 0.5) * 2
      camera.position.x = -r * Math.cos(time * 0.5) * 2
      // camera.position.z = -r * Math.cos(time*4)

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
