// set size from noise field explicitly

module.exports = function(){
  var THREE = require('three')
  var dat = require('dat-gui')
	var gui = new dat.GUI();

  var perlin = require('./perlin_noise.js')()

  window.sample_multiplier = 0.1
  window.sample_offset_x = 0
  window.sample_offset_y = 0
  window.sample_multiplier_x = 1
  window.sample_multiplier_y = 1
  window.time = 'off'

  var noise = perlin.noise
  window.perlin = perlin
  window.noise = noise
  perlin.noiseDetail(4,0.1)
  perlin.noiseSeed(1)

  window.octaves = 4
  window.falloff = 0.75
  window.time_speed = 0.1

  gui.add(window, 'sample_multiplier', 0, 0.5)
  gui.add(window, 'sample_offset_x', 0, 10)
  gui.add(window, 'sample_offset_y', 0, 10)
  gui.add(window, 'sample_multiplier_x', 0.5, 10.5)
  gui.add(window, 'sample_multiplier_y', 0.5, 10.5)
  gui.add(window, 'octaves', 1, 10).step(1)
  gui.add(window, 'falloff', 0, 1)
  gui.add(window, 'time', ['on', 'off'])
  gui.add(window, 'time_speed', 0, 0.1)

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

  lights[0] = new THREE.SpotLight(0xffffff, 2, 0)
  lights[0].position.set(0, 1000, 1000);
  lights[0].lookAt(scene.position)
  lights[0].castShadow = true

  scene.add(lights[0]);

  var material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: false,
      side: THREE.DoubleSide
  });

  var render = function() {
      requestAnimationFrame(render);

      var time = Date.now() * 0.01;

      var r = 500
      camera.position.x = r * Math.sin(time*0.01)
      camera.position.y = r * Math.cos(time*0.01)
      camera.position.z = r
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
