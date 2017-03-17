# donutjs_talk

## links
* https://v8project.blogspot.com/2015/12/theres-mathrandom-and-then-theres.html
* https://tonejs.github.io/docs/#Sequence

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
* https://en.wikipedia.org/wiki/Simplex_noise

## thesis




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
function (){
 return Math.abs(Math.sin(Date.now()*0.0001) * Math.sin(Date.now()*0.001))
}
function (){
 return Math.abs(Math.sin(Date.now()*0.0001))
}
function (){
 return Math.abs(Math.tan(Date.now()*0.0001))
}

```
