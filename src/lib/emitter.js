// var vector = require('./vector.js')
var particle = require('./particle.js')

module.exports = function emitter (_svg) {
  var host
  var particles
  var params
  var force_fns = []

  var svg = _svg

  function init () {
    host = particle()

    host.set_position(256, 128)

    particles = []

    params = {}
    params.min_particles = 3
    params.max_particles = 200

    // add particles
    while (particles.length < params.min_particles) {
      particles.push(particle(svg))
      particles[particles.length - 1].set_position(host.get_position().val.x, host.get_position().val.y)
    }
  }
  init()

  function tick () {
    // apply each force
    particles.forEach(function (p) {
      force_fns.forEach(function (f) {
        f(p, host)
      })
    })

    // tick each particle
    particles.forEach(function (p) {
      p.tick()
    })
  }

  function set_color (c) {
    particles.forEach(function (p) {
      p.get_circle().attr('fill', c)
    })
  }

  return {
    tick: tick,
    set_color: set_color,
    get_particles: function () { return particles },
    get_params: function () { return params },
    get_host: function () { return host },
    add_force: function (f) { force_fns.push(f) }
  }
}
