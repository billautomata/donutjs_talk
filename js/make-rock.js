// set size from noise field explicitly

module.exports = function(x,y){
  var THREE = require('three')
  var dat = require('dat-gui')

  var surface_perlin = require('./perlin_noise.js')()
  var deform_perlin = require('./perlin_noise.js')()

  var sphere_radius = 90
  var intensity = sphere_radius * 0.1
  var deform_intensity = sphere_radius * 2.0

  var deform_sample_multiplier = 0.02
  var deform_lod = 2
  var deform_falloff = 0.66

  deform_perlin.noiseDetail(deform_lod, deform_falloff)
  deform_perlin.noiseSeed(9234203)

  var deform_sample_offset_x = x
  var deform_sample_offset_y = y

  var surface_sample_multiplier = 1
  var surface_sample_offset_x = x
  var surface_sample_offset_y = y
  var sample_multiplier_x = 1
  var sample_multiplier_y = 1
  var time = 'off'

  var noise = surface_perlin.noise
  var perlin = surface_perlin
  var noise = noise

  var octaves = 2
  var falloff = 1

  surface_perlin.noiseDetail(octaves, falloff)
  // surface_perlin.noiseSeed(65465462162)

  var material = new THREE.MeshStandardMaterial({
      color: 0xbada55,
      wireframe: false,
      reflectivity: 1.0,
      clearCoat: 1.0,
      clearCoatRoughness: 1.0,
      roughness: 1.0,
      side: THREE.DoubleSide
  });

  var time_speed = 0.0

  var res = 100
  var baseSphereGeometry = new THREE.SphereGeometry(sphere_radius, res, res)
  var sphereGeometry = new THREE.SphereGeometry(sphere_radius, res, res)
  var mesh = new THREE.Mesh(sphereGeometry, material)

  update_sphere()

  function update_sphere(){
    var time = Date.now() * 0.005;

    deform_perlin.noiseDetail(deform_lod, deform_falloff)
    surface_perlin.noiseDetail(octaves, falloff)

    baseSphereGeometry.vertices.forEach(function(v,idx){
      var mag = v.distanceTo(new THREE.Vector3(0,0,0))
      var _v = v.clone()
      _v.normalize()
      mag += (deform_intensity * deform_perlin.noise((v.x+deform_sample_offset_x) * deform_sample_multiplier, (v.y+deform_sample_offset_y) * deform_sample_multiplier, time * time_speed))
      mag -= (intensity * surface_perlin.noise((v.x+surface_sample_offset_x) * surface_sample_multiplier, (v.y+surface_sample_offset_y) * surface_sample_multiplier, time * time_speed))
      _v.multiply(new THREE.Vector3(mag, mag, mag))
      mesh.geometry.vertices[idx].x = _v.x
      mesh.geometry.vertices[idx].y = _v.y
      mesh.geometry.vertices[idx].z = _v.z
    })
    mesh.geometry.verticesNeedUpdate = true
  }
  return mesh
}
