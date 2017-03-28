* intro slide
* gonna talk about: why and how you incorporate randomness in things, and then we'll build something
* using random numbers to do stuff
  * donutjs website uses math.random to distribute the sprinkles in the x dimension
  * math.random internals
* doing that same stuff with other techniques
  * trig functions are suitable math.random replacement internals
  * and they have the added feature of letting you control the frequency
  * replace Math.random on the donut js website
  * increase the frequency of the sprinkles position changes
  * how do you do that in more than just 1 dimension?
* math.random has a bunch of limitations
  * not repeatable, some random number generators are repeatable and seed-able but not Math.random
  * natural phenomena is not truly random, and even the stuff that does rely on a dice roll actually relies on a succession of dice rolls averaged out among a large sample size (ants, branch placement on a tree trunk)
  * no zoom
  * can't do frame shifting in x/y/z/time
* trig functions solve most of those problems
  * repeatable, sine of pi/2 is 1 every time
  * you can find it in nature, physics is crawling with trig - things like orbits and force calculations
  * you can zoom, sin of pi/2 + something really small is still valid
  * you can frame shift in one dimension
* use noise
  * zoom-able, shift-able, compress-able, repeat-able, seed-able
  * memory efficient
  * doesn't rely on prior state
* TODO // explanation of gradient fields
* demo of the noise input parameters using the cubes
* demo of particle system comparison using math.random vs noise field
  * photo of noise field
* demo of the noise input parameters using the simple terrain generator
* demo of extreme noise input parameters to generate ocean waves
* full demo of the noise input parameters using the terrain generator
  * ground level generator
  * trees, bushes, rocks
    * rocks are spheres modified by noise
* graph of all the interactions and sample parameters for the visualization   
