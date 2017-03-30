// set size from noise field explicitly

module.exports = function(){
  var THREE = require('three')
  var dat = require('dat-gui')
	var gui = new dat.GUI();

  var surface_perlin = require('./perlin_noise.js')()
  var deform_perlin = require('./perlin_noise.js')()

  window.intensity = 4
  window.sphere_radius = 20

  window.deform_sample_multiplier = 0.02
  window.deform_intensity = 50
  window.deform_lod = 2
  window.deform_falloff = 0.66

  deform_perlin.noiseDetail(2, 0.75)
  // deform_perlin.noiseSeed(92348203)

  window.deform_sample_offset_x = 10.1
  window.deform_sample_offset_y = 14.1

  window.sample_multiplier = 0.2
  window.surface_sample_offset_x = 10.1
  window.surface_sample_offset_y = 3.1
  window.sample_multiplier_x = 1
  window.sample_multiplier_y = 1
  window.time = 'off'

  var noise = surface_perlin.noise
  window.perlin = surface_perlin
  window.noise = noise

  window.octaves = 2
  window.falloff = 1

  surface_perlin.noiseDetail(window.octaves, window.falloff)
  // surface_perlin.noiseSeed(65465462162)

  window.time_speed = 0.1

  gui.add(window, 'deform_sample_multiplier', 0, 0.1)
  gui.add(window, 'deform_intensity', 0, 100.0)
  gui.add(window, 'deform_lod', 0, 8)
  gui.add(window, 'deform_sample_offset_x', 0, 100.0)
  gui.add(window, 'deform_sample_offset_y', 0, 100.0)
  gui.add(window, 'deform_falloff', 0, 1.0)
  gui.add(window, 'sample_multiplier', 0, 3.0)
  gui.add(window, 'surface_sample_offset_x', 0, 100.0)
  gui.add(window, 'surface_sample_offset_y', 0, 100.0)
  gui.add(window, 'intensity', 0, 30.0)
  gui.add(window, 'octaves', 1, 10).step(1)
  gui.add(window, 'falloff', 0, 1)
  gui.add(window, 'time', ['on', 'off'])
  gui.add(window, 'time_speed', 0, 0.1)

  var Exporter = require('three-obj-exporter')

  var e = new Exporter()
  window.e = e

  window.t = THREE

  document.body.style.margin = '0px'
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

  lights[0] = new THREE.SpotLight(0xffffff, 1, 0)
  lights[0].position.set(1000, 0, 0);
  lights[0].lookAt(scene.position)
  lights[0].castShadow = true
  lights[1] = new THREE.SpotLight(0xffffff, 1, 0)
  lights[1].position.set(-1000, 0, 0);
  lights[1].lookAt(scene.position)
  lights[1].castShadow = true

  scene.add(lights[0]);
  scene.add(lights[1]);

  var material = new THREE.MeshPhongMaterial({
      color: 0xbada55,
      shading: THREE.FlatShading,
      wireframe: false,
      side: THREE.DoubleSide
  });

  var res = 100
  var baseSphereGeometry = new THREE.SphereGeometry(window.sphere_radius, res, res)
  var sphereGeometry = new THREE.SphereGeometry(window.sphere_radius, res, res)
  var mesh = new THREE.Mesh(sphereGeometry, material)
  scene.add(mesh)
  console.log(mesh)
  window.m = mesh

  function update_sphere(){
    var time = Date.now() * 0.005;

    deform_perlin.noiseDetail(window.deform_lod, window.deform_falloff)
    surface_perlin.noiseDetail(window.octaves, window.falloff)

    baseSphereGeometry.vertices.forEach(function(v,idx){
      var mag = v.distanceTo(new THREE.Vector3(0,0,0))
      var _v = v.clone()
      _v.normalize()
      mag += (deform_intensity * deform_perlin.noise((v.x+deform_sample_offset_x) * deform_sample_multiplier, (v.y+deform_sample_offset_y) * deform_sample_multiplier, time * window.time_speed))
      mag -= (intensity * surface_perlin.noise((v.x+surface_sample_offset_x) * sample_multiplier, (v.y+surface_sample_offset_y) * sample_multiplier, time * window.time_speed))
      _v.multiply(new THREE.Vector3(mag, mag, mag))
      mesh.geometry.vertices[idx].x = _v.x
      mesh.geometry.vertices[idx].y = _v.y
      mesh.geometry.vertices[idx].z = _v.z
    })
    mesh.geometry.verticesNeedUpdate = true
  }

  var render = function() {
      requestAnimationFrame(render);
      var time = Date.now() * 0.005;
      update_sphere()

      var r = 175
      camera.position.x = r * Math.sin(time*0.1)
      camera.position.y = 0
      camera.position.z = r * Math.cos(time*0.1)
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
