# donutjs_talk

## links
* https://v8project.blogspot.com/2015/12/theres-mathrandom-and-then-theres.html
* https://tonejs.github.io/docs/#Sequence

* https://apod.nasa.gov/apod/ap160720.html
* https://www.youtube.com/watch?v=RvAwB7ogkik

* http://flafla2.github.io/2014/08/09/perlinnoise.html

# things to show
* different sources of random numbers
  * math.random
  * physical inputs
  * crowd sourced inputs
  * tuned generators (neural networks)
* applications
  * donutjs website
  * random grid
  * drive particle systems
  * maze generation /\/\/ and square type mazes

* vector fields
* tune a neural network to act as a vector fields input(x,y) output (x,y)

* octaves in random numbers
* threejs scene pushing grass on a field with trees and birds
* signed distance function

* generate a function that generates long strings of cos and sin operations to create complex waveforms
* compare random numbers, complex sinusoidal waveforms, perlin noise
* noise is useful because you can sample it at different zoom levels and offsets

* rolling ocean waves by using a high y sample multiplier and constantly increase the y offset

* https://en.wikipedia.org/wiki/Timeline_of_computer_animation_in_film_and_television

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# lint all *.js and *.vue files
npm run lint

# run unit tests
npm test
```

```javascript
Math.random = function (){
 return 0.25
}
Math.random = function (){
 return Math.abs(Math.sin(Date.now()*0.0001))
}
Math.random = function (){
 return Math.abs(Math.sin(Date.now()*0.0001) * Math.cos(Date.now()*0.0001))
}
Math.random = function (){
 return Math.abs(Math.sin(Date.now()*0.0001) * Math.cos(Date.now()*0.001))
}
Math.random = function (){
 return Math.abs(Math.sin(Date.now()*0.0001) * Math.cos(Date.now()*0.01))
}
```
