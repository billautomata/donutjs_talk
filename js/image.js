var d3 = require('d3')
var $ = require('jquery')
var jpeg = require('jpeg-js')
module.exports = function(){
  var d = require('fs').readFileSync('./cat.jpg')
  var f = jpeg.decode(new Buffer(d))
  console.log(f)

  window.x = 100
  window.y = 100

  var dat = require('dat-gui')
	var gui = new dat.GUI();

  gui.add(window, 'x', 0, Number(window.x)).step(1)
  gui.add(window, 'y', 0, Number(window.y)).step(1)

  var svg = d3.select('body').append('svg')
    .attr('width', '100%')
    .attr('viewBox', [0,0,x,y].join(' '))
    .attr('preserveAspectRatio', 'xMidYMid')
    .style('background-color', 'rgb(244,244,244)')

  var boxes = []

  // random numbers
  for(var i = 0; i < x; i++){
    for(var j = 0; j < y; j++){
      (function(){
        var value = Math.random() * 255
        boxes.push(svg.append('rect')
          .attr('x',i).attr('y',j)
          .attr('width', 1.0).attr('height', 1.0)
          .attr('fill', d3.rgb(value, value, value))
          .attr('stroke', 'none'))
      })()
    }
  }

  render()

  function render(){
    // console.log('render')
    svg.attr('viewBox', [0,0,window.x,window.y].join(' '))
    var boxes_idx = 0
    var img_idx = 0
    for(var i = 0; i < window.x; i++){
      for(var j = 0; j < window.y; j++){
        (function(){
          var value = f.data[img_idx]
          boxes[boxes_idx].attr('x',i).attr('y',j).attr('fill', d3.rgb(value, value, value))
          boxes_idx += 1
          img_idx += 4
          if(img_idx > f.data.length){
            img_idx -= f.data.length
          }
        })()
      }
    }
    window.requestAnimationFrame(render)
  }



}
