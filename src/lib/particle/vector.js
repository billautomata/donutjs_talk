module.exports = function vector (ox, oy) {
  var val = { x: 0, y: 0 }

  function set (ox, oy) {
    val.x = ox
    val.y = oy
  }
  if (ox !== undefined && oy !== undefined) {
    set(ox, oy)
  }

  function add (ox, oy) {
    if (typeof ox === 'object') {
      return addv(ox)
    }
    val.x += ox
    val.y += oy
  }

  function addv (o) {
    return add(o.val.x, o.val.y)
  }

  function mult (s) {
    val.x *= s
    val.y *= s
  }

  function distance (ox, oy) {
    return Math.sqrt(Math.pow(ox - val.x, 2) + Math.pow(oy - val.y, 2))
  }
  function distancev (o) {
    return distance(o.val.x, o.val.y)
  }

  function normalize () {
    var l = distance(0, 0)
    if (l > 0 || l < 0) {
      return mult(1.0 / l)
    } else {
      return
    }
  }

  function clamp (v) {
    if (distance(0, 0) > Math.abs(v)) {
      normalize()
      return mult(Math.abs(v))
    } else {
      return
    }
  }

  return {
    val: val,
    set: set,
    add: add,
    addv: addv,
    clamp: clamp,
    distance: distance,
    distancev: distancev,
    normalize: normalize,
    mult: mult
  }
}
