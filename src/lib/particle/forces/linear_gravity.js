var vector = require('../vector.js')

module.exports = function linear_gravity_maker (_mag, _clamp, _direction, min_distance) {
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
