## New Shiny Camera in Javascript

## Synopsis
nsc.js is a minimal camera for viewing 3D objects in webgl applications. The framework independent camera provides a very simple maya like camera for viewing objects.

## Code Example
```js
var mat4 = require('gl-matrix').mat4;
var canvas = document.body.appendChild( document.createElement( 'canvas' ) );
// this will create a camera 5 units back in the z-direction
var cam = require('nsc')( canvas, { position: [ 0.0, 0.0, -5.0 ] } );

var view = mat4.create();
cam.update(); // update the camera in your update loop
cam.view( view ); // to get the camera's current view matrix do this
```

## Motivation
This library is part of a larger project / series of libraries that aspires to bring computational and parametric design to the web. This library aspires to eventually be a collection of cameras for viewing and navigating applications for computational design, 3d printing, g-code generation, cnc milling tool path creation, laser cutting paths, robotic motion planning, and more.

## Build Requirements
node.js (4.4.0+) & npm

## Installation
You can add this library to your project by running:
```
npm install --save https://github.com/YCAMInterlab/nsc.js.git
```

or via npm:
```
npm install --save nsc
```

## Examples
See https://github.com/rezaali/webgl-sketches/

## Contribution
Copyright 2015-2016 [Reza Ali](http://www.syedrezaali.com) co-developed by [YCAMInterLab](http://interlab.ycam.jp/en/) during the [Guest Research Project v.3](http://interlab.ycam.jp/en/projects/guestresearch/vol3)

## License
Apache-2.0
