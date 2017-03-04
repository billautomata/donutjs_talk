var d3 = require('d3')
var emitter = require('./emitter.js')

module.exports = function world () {
  var svg
  var emitters

  var params = {
    size_x: 512,
    size_y: 256
  }

  function init (worldname) {
    if (worldname === undefined) {
      worldname = 'default'
    }
    svg = d3.select('body').append('svg').attr('id', worldname)

    svg.params = params

    svg.attr('preserveAspectRatio', 'xMidYMid')
    svg.attr('viewBox', '0 0 ' + params.size_x + ' ' + params.size_y)

    svg.style('background-color', 'rgba(0,0,255,0.1)')
      .style('width', '100%')

    emitters = []
  }

  function create_emitter (force_fn) {
    var e = emitter(svg)
    emitters.push(e)
    return e
  }

  function tick () {
    emitters.forEach(function (emitter) {
      emitter.tick()
    })
  }

  return {
    create_emitter: create_emitter,
    get_svg: function () { return svg },
    get_emitters: function () { return emitters },
    init: init,
    tick: tick
  }
}
