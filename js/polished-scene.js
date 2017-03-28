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

  // perlin noise instances
  var perlin = require('./perlin_noise.js')()
  var tree_placement_perlin = require('./perlin_noise.js')()
  var tree_height_perlin = require('./perlin_noise.js')()
  var tree_species_perlin = require('./perlin_noise.js')()
  var rock_placement_perlin = require('./perlin_noise.js')()

  // trees
  var tree_resolution = 10 // distance per step for tree placement

  tree_placement_perlin.noiseSeed(1234567)
  window.tree_placement_sample_multiplier = 0.01
  window.tree_placement_noise_threshold = 0.60

  tree_height_perlin.noiseSeed(303)
  window.tree_height_sample_multiplier = 0.1
  window.tree_max_height = 30
  window.tree_min_height = 10

  // rocks
  var rock_resolution = 3
  rock_placement_perlin.noiseSeed(303)
  rock_placement_perlin.noiseDetail(10, 0.65)
  window.rock_placement_sample_multiplier = 0.1
  window.rock_placement_noise_threshold = 1.15

  // terrain
  window.sample_multiplier = 0.003
  window.sample_offset_x = 0.00
  window.sample_offset_y = 0.00
  window.sample_multiplier_x = 1
  window.sample_multiplier_y = 1
  window.time = 'off'
  window.height = 100
  window.height_offset = 0
  window.noise_threshold = 0
  window.radius = 500

  window._wireframe = false

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

  // gui.add(window, 'height', 1, 300)
  // gui.add(window, 'sample_multiplier', 0, 0.5)
  // gui.add(window, 'sample_offset_x', 0, 1.5).step(0.001)
  // gui.add(window, 'sample_offset_y', 0, 1.5).step(0.001)
  // gui.add(window, 'sample_multiplier_x', 0, 10.5)
  // gui.add(window, 'sample_multiplier_y', 0, 10.5)
  // gui.add(window, 'octaves', 1, 10).step(1)
  // gui.add(window, 'falloff', 0, 1)
  // gui.add(window, 'time', ['on', 'off'])
  // gui.add(window, 'time_speed', 0, 1)
  // gui.add(window, 'height_offset', 0, 300)
  // gui.add(window, 'noise_threshold', 0, 1)
  gui.add(window, 'radius', 100, 3000)

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2500);
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
  // renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

  document.body.appendChild(renderer.domElement);

  var ambientLight = new THREE.AmbientLight(0xaaaaaa);
  // scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 0.5, 1500);
  lights[0].castShadow = true
  lights[0].shadow.mapSize.width = 4096;
  lights[0].shadow.mapSize.height = 4096;
  lights[0].lookAt(scene.position)

  lights[1] = new THREE.DirectionalLight(0xffffff, 0.5);
  lights[1].position.x = 1
  lights[1].castShadow = true
  lights[1].shadow.mapSize.width = 4096;
  lights[1].shadow.mapSize.height = 4096;


  scene.add(lights[0]);
  scene.add(lights[1]);

  var plane_size_x = 1000
  var plane_size_y = 1000

  var geometry = new THREE.PlaneGeometry( 1000, 1000, 256, 256 );
  geometry.dynamic = true
  var mesh = new THREE.Mesh(geometry);
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.rotation.x = -Math.PI*0.5

  window.mesh = mesh

  mesh.material = new THREE.MeshStandardMaterial({
      shading: THREE.FlatShading,
      wireframe: _wireframe,
      side: THREE.DoubleSide,
      roughness: 1.0,
      metalness: 0.0,
      vertexColors: THREE.VertexColors
  });
  scene.add(mesh);

  var grassShape = new THREE.Shape()
  grassShape.moveTo(0,0)
  grassShape.lineTo(1.5, 0)
  grassShape.lineTo(0, 1.5)
  grassShape.lineTo(-1.5, 0)
  grassShape.lineTo(0, 0)

  var tree_trunk_material = new THREE.MeshPhongMaterial( { color: 0xf4a460,  side: THREE.DoubleSide, shading: THREE.FlatShading, } );
  var tree_leaf_material = new THREE.MeshPhongMaterial( { color: 0x00f100, side: THREE.DoubleSide, wireframe: false, shading: THREE.FlatShading, } );

  function tree_blade(x,y,z){

    var o = new THREE.Object3D()
    o.position.x = x
    o.position.y = y - 2
    o.position.z = z

    var tree_geometry = new THREE.ShapeGeometry( grassShape );
    var tree_mesh = new THREE.Mesh( tree_geometry, tree_trunk_material ) ;
    tree_mesh.castShadow = true
    tree_mesh.receiveShadow = true

    var cone_geometry = new THREE.ConeGeometry(5,1,4)
    var cone_mesh = new THREE.Mesh(cone_geometry, tree_leaf_material)
    cone_mesh.castShadow = true
    cone_mesh.receiveShadow = true
    cone_mesh.position.y = 1
    cone_mesh.rotation.y = Math.random() * 10

    o.add(cone_mesh)
    o.add(tree_mesh)
    o.scale.y = window.tree_min_height + (tree_height_perlin.noise(x * window.tree_height_sample_multiplier, y * window.tree_height_sample_multiplier) * window.tree_max_height)
    scene.add(o)
  }


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
    console.log('setting terrain heights')
    mesh.geometry.vertices.forEach(function(v,i){
      var noise_result = noise((v.x * sample_multiplier * sample_multiplier_x) + offset_x, (v.y * sample_multiplier * sample_multiplier_y) + offset_y, time * window.time_speed)
      v.z = (window.height * noise_result) - window.height_offset
    })

    console.log('placing trees')
    for(var tree_x = -1* (plane_size_x*0.5); tree_x < plane_size_x * 0.5; tree_x += tree_resolution){
      for(var tree_y = -1 * (plane_size_y*0.5); tree_y < plane_size_y * 0.5; tree_y += tree_resolution){
        if(tree_placement_perlin.noise(tree_x * window.tree_placement_sample_multiplier, tree_y * window.tree_placement_sample_multiplier) > window.tree_placement_noise_threshold){
          console.log('.')
          var noise_result = noise((tree_x * sample_multiplier * sample_multiplier_x) + offset_x, (tree_y * sample_multiplier * sample_multiplier_y) + offset_y, time * window.time_speed)
          tree_blade(tree_x, (window.height * noise_result) - window.height_offset, tree_y )
        }
      }
    }

    console.log('placing rocks')
    // for(var rock_x = -1* (plane_size_x*0.5); rock_x < plane_size_x * 0.5; rock_x += rock_resolution){
    //   for(var rock_y = -1 * (plane_size_y*0.5); rock_y < plane_size_y * 0.5; rock_y += rock_resolution){
    //     if(rock_placement_perlin.noise(rock_x * window.rock_placement_sample_multiplier, rock_y * window.rock_placement_sample_multiplier) > window.rock_placement_noise_threshold){
    //       var noise_result = noise((rock_x * sample_multiplier * sample_multiplier_x) + offset_x, (rock_y * sample_multiplier * sample_multiplier_y) + offset_y, time * window.time_speed)
    //       var _mesh = require('./make-rock.js')(rock_x, rock_y)
    //       console.log('.')
    //       var noise_result = noise((rock_x * sample_multiplier * sample_multiplier_x) + offset_x, (rock_y * sample_multiplier * sample_multiplier_y) + offset_y, time * window.time_speed)
    //       _mesh.position.x = rock_x
    //       _mesh.position.y = (window.height * noise_result) - window.height_offset
    //       _mesh.position.z = rock_y
    //       _mesh.scale.x = _mesh.scale.y = _mesh.scale.z = 0.1
    //       scene.add(_mesh)
    //     }
    //   }
    // }

    ;(function(){
      var noise_result = noise((plane_size_x * 0.5 * sample_multiplier * sample_multiplier_x) + offset_x, (plane_size_x * 0.5 * sample_multiplier * sample_multiplier_y) + offset_y, time * window.time_speed)
      var _mesh = require('./make-rock.js')(plane_size_x * 0.5, plane_size_y * 0.5)
      _mesh.position.x = 0
      _mesh.position.y = (window.height * noise_result) - window.height_offset
      _mesh.position.z = 0
      _mesh.scale.y = 1.5
      _mesh.castShadow = true
      _mesh.receiveShadow = true
      // _mesh.scale.x = _mesh.scale.y = _mesh.scale.z = 0.1
      scene.add(_mesh)
    })()

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
      var time2 = time * 2
      var time5 = time * 5
      var time10 = time * 10

      var r = window.radius

      lights[0].position.set( 300 * Math.sin(time5), 400, 300 * Math.cos(time5));
      // lights[0].lookAt(scene.position)

      camera.position.y = (r * 0.25)
      camera.position.z = -r * Math.sin(time * 0.5)
      camera.position.x = -r * Math.cos(time * 0.5)
      // camera.position.z = -r * Math.cos(time*4)

      camera.lookAt(scene.position.clone().add(new THREE.Vector3(0,100,0)))
      renderer.render(scene, camera);

  };

  window.addEventListener('resize', function() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

  }, false);
  update_mesh()
  render();
}
