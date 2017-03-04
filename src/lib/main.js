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

  var emitter_a = world.create_emitter()
  emitter_a.set_color('red')
  emitter_a.add_force(gravity_maker(10, 1, -1))
  emitter_a.add_force(noise(0.1))
  emitter_a.add_force(dampen(0.99))

  var emitter_b = world.create_emitter()
  emitter_b.set_color('green')
  emitter_b.add_force(linear_gravity_maker(1, 1, -1))
  emitter_b.add_force(noise(0.1))
  emitter_b.add_force(dampen(0.99))

  var emitter_c = world.create_emitter()
  emitter_c.set_color('blue')
  // emitter_c.add_force(gravity_maker(10, 0.1, 1, 1))
  // emitter_c.add_force(gravity_maker(1000, 10, -1, 100))
  emitter_c.add_force(static_noise(0.1))
  // emitter_c.add_force(dampen(1))

  // emitter_a.set_color(color)
  // emitter_b.set_color(color)
  // emitter_c.set_color(color)

  // different force functions
  var vector = require('./vector.js') // static methods will be used with calculating forces
  function gravity_maker (_mag, _clamp, _direction, min_distance) {
    if (min_distance === undefined) {
      min_distance = 1
    }
    if (_direction === undefined) {
      _direction = -1
    }
    return function attract_gravity (particle, host) {
      var host_p = host.get_position()
      var p = vector(particle.get_position().val.x - host_p.val.x, particle.get_position().val.y - host_p.val.y)
      var v = particle.get_velocity()

      var d = particle.get_position().distancev(host_p)
      if (d >= min_distance) {
        p.normalize()
        // p.mult(-1)
        var add_force = p
        var mag = _mag / (d * d)

        add_force.mult(mag)
        add_force.mult(_direction)

        add_force.clamp(_clamp)
        v.addv(add_force)
      }
    }
  }

  function linear_gravity_maker (_mag, _clamp, _direction, min_distance) {
    if (min_distance === undefined) {
      min_distance = 1
    }
    if (_direction === undefined) {
      _direction = -1
    }
    return function attract_gravity (particle, host) {
      var host_p = host.get_position()
      var p = vector(particle.get_position().val.x - host_p.val.x, particle.get_position().val.y - host_p.val.y)
      var v = particle.get_velocity()

      var d = particle.get_position().distancev(host_p)
      if (d >= min_distance) {
        p.normalize()
        // p.mult(-1)
        var add_force = p
        var mag = _mag / (d)

        add_force.mult(mag)
        add_force.mult(_direction)

        add_force.clamp(_clamp)
        v.addv(add_force)
      }
    }
  }

  function noise (amnt) {
    return function _noise (particle, host) {
      var v = particle.get_velocity()
      var noise_amount = amnt

      v.val.x += (Math.random() * noise_amount) - (noise_amount * 0.5)
      v.val.y += (Math.random() * noise_amount) - (noise_amount * 0.5)
    }
  }

  var static_random = ring_buffer(1024)

  function static_noise (amnt) {
    return function _noise (particle, host) {
      var v = particle.get_velocity()
      var noise_amount = amnt

      v.val.x += (static_random() * noise_amount) - (noise_amount * 0.5)
      v.val.y += (static_random() * noise_amount) - (noise_amount * 0.5)
    }
  }

  function ring_buffer (len) {
    var ring_buffer = JSON.parse(fs.readFileSync(__dirname + '/512.json', 'utf8'))
    // for (var i = 0; i < n_elements; i++) {
    //   ring_buffer.push(Math.random())
    // }
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
