var fs = require('fs')

module.exports = function(){
  // require('../tests/all_tests.js')
  var world = require('./world.js')()

  world.init()

  function render () {
    world.tick()
    window.requestAnimationFrame(render)
  }
  render()

  // code itself
  // var color = 'rgba(0,0,255,0.1)'
  // console.log(color)
  // console.log('how does this know')

  // forces
  var gravity_maker = require('./forces/gravity.js')
  var linear_gravity_maker = require('./forces/linear_gravity.js')

  var emitter_a = world.create_emitter()
  emitter_a.set_color('rgba(255,0,0,0.5)')
  emitter_a.add_force(gravity_maker(10000, 1, -1, 10))
  emitter_a.add_force(p5noise({ sample_multiplier: 0.01, amount: 1.0 }))
  emitter_a.add_force(dampen(0.999))

  // emitter_a.add_force(noise(0.1))
  // emitter_a.add_force(static_noise(0.0))


  var emitter_b = world.create_emitter()
  emitter_b.set_color('rgba(0,255,0,0.5)')
  emitter_b.add_force(gravity_maker(10000, 1, -1, 10))
  emitter_b.add_force(noise(1.0))
  emitter_b.add_force(dampen(0.99))

  // var emitter_c = world.create_emitter()
  // emitter_c.set_color('rgba(0,0,255,0.3)')
  // emitter_c.add_force(gravity_maker(10, 0.1, 1, 1))
  // emitter_c.add_force(gravity_maker(1000, 10, -1, 100))
  // emitter_c.add_force(static_noise(0.1))
  // emitter_c.add_force(dampen(1))

  // emitter_a.set_color(color)
  // emitter_b.set_color(color)
  // emitter_c.set_color(color)

  // different force functions
  var vector = require('./vector.js') // static methods will be used with calculating forces
  var perlinx = require('../../../js/perlin_noise.js')()
  var perliny = require('../../../js/perlin_noise.js')()

  var noisex = perlinx.noise
  var noisey = perliny.noise
  window.perlin = perlinx
  window.noise = noisex
  // perlinx.noiseDetail(4,0.65)
  // perliny.noiseDetail(4,0.65)

  perlinx.noiseSeed(100)
  perliny.noiseSeed(465165)

  function noise (amnt) {
    return function _noise (particle, host) {
      var v = particle.get_velocity()
      var noise_amount = amnt

      v.val.x += (Math.random() * noise_amount) - (noise_amount * 0.5)
      v.val.y += (Math.random() * noise_amount) - (noise_amount * 0.5)
    }
  }

  var static_random = ring_buffer(1024)

  function p5noise(options){
    // options.sample_multiplier
    // options.amount
    return function _p5nose (particle, host){
      var t = Date.now() * 0.01
      var p = particle.get_position()
      var v = particle.get_velocity()
      v.val.x += options.amount * (noisex(p.val.x * options.sample_multiplier, p.val.y * options.sample_multiplier, t) - 0.5)
      v.val.y += options.amount * (noisey(p.val.x * options.sample_multiplier, p.val.y * options.sample_multiplier, t) - 0.5)
    }
  }

  function static_noise (amnt) {
    return function _noise (particle, host) {
      var v = particle.get_velocity()
      var noise_amount = amnt

      v.val.x += (static_random() * noise_amount) - (noise_amount * 0.5)
      v.val.y += (static_random() * noise_amount) - (noise_amount * 0.5)
    }
  }

  function ring_buffer (len) {
    // var ring_buffer = JSON.parse(fs.readFileSync(__dirname + '/512.json', 'utf8'))
    var ring_buffer = []
    for (var i = 0; i < len; i++) {
      ring_buffer.push(Math.random())
    }
    var idx = 0
    return function () {
      idx += 1
      if (idx >= ring_buffer.length) {
        idx = 0
      }
      return ring_buffer[idx]
    }
  }

  function dampen (value) {
    return function (particle) {
      var v = particle.get_velocity()
      // add noise to velocity
      v.mult(value)
    }
  }

  // function wrap (particle, host) {
  //   var host_p = host.get_position()
  //   var p = particle.get_position()
  //
  //   var d = p.distancev(host_p)
  //   if (d > 200) {
  //     p.set(host_p.val.x, host_p.val.y)
  //   }
  // }
}
