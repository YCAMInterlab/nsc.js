var now = require("performance-now");
var vec3 = require('gl-matrix').vec3;
var mat4 = require('gl-matrix').mat4;
var quat = require('gl-matrix').quat;
var scrollWheel = require('scroll-speed');
var mousePosition = require('mouse-position');
var mouseButton = require('mouse-pressed');
var key = require('key-pressed');

module.exports = Camera;

function Camera( canvas, opts ) {
  if ( ! ( this instanceof Camera ) ) {
    return new Camera( canvas, opts )
  }

  //Options
  opts = opts || {};

  //Parent Element
  this.canvas = canvas;

  //Events
  this.mw = scrollWheel( canvas, true );
  this.mb = mouseButton( canvas );
  this.mp = mousePosition( canvas );

  //Camera Reset
  this.lastTime = now();
  this.currentTime = this.lastTime;
  this.deltaTime = 200;

  //Interaction
  this.mouseDown = false;
  this.scratchQuat = quat.create();
  this.rotation = quat.create();

  this.defaultPosition = opts.position !== undefined ? opts.position : vec3.fromValues( 0.0, 0.0, -2.0 );
  this.position = vec3.clone( this.defaultPosition );
  this.theta = 0.0;
  this.damping = opts.damping || 0.9;
  this.calculateCache = false;

  this.size = vec3.create();
  this.axis = vec3.fromValues( 0.0, 0.0, 0.0 );
  this.t1 = vec3.fromValues( 0.0, 0.0, 0.0 );
  this.pt1 = vec3.fromValues( 0.0, 0.0, 0.0 );

  this.matrix = mat4.create();
  this.rotmat = mat4.create();
  this.cache = mat4.create();

  this.mb.on( "down", ( function() {
    this.mouseDown = true;
    this.resetCheck();
    this.mousePressed();
  } ).bind( this ) );

  this.mp.on( "move", ( function() {
    if( this.mouseDown ) {
      this.mouseDragged();
    }
  } ).bind( this ) );

  this.mb.on( "up", ( function() {
    this.mouseDown = false;
  } ).bind( this ) );

  this.mw.on( "scroll", ( function() {
    this.mouseWheel();
  } ).bind( this ) );

  this.updateMatrix();
}

Camera.prototype.view = function ( out ) {
  mat4.copy( out, this.matrix );
}

Camera.prototype.update = function() {
  this.updateSize();
  this.updateEasing();
  this.updateMatrix();
}

Camera.prototype.resetCheck = function() {
  this.currentTime = now();
  if( this.currentTime - this.lastTime < this.deltaTime ) {
    this.reset();
  }
  this.lastTime = this.currentTime;
}

Camera.prototype.reset = function()
{
  vec3.copy( this.position, this.defaultPosition );
  quat.identity( this.scratchQuat );
  quat.identity( this.rotation );
  mat4.identity( this.cache );
  mat4.identity( this.rotmat );
}

Camera.prototype.mousePressed = function() {
  if( this.calculateCache ) {
    this.cacheRotation();
  }

  this.theta = 0.0;
  quat.identity( this.scratchQuat );
  this.setArcBallVector( this.mp[ 0 ], this.mp[ 1 ] );
}

Camera.prototype.mouseDragged = function() {
  this.setArcBallVector( this.mp[ 0 ], this.mp[ 1 ] );
  this.updateArcBallRotation();
  this.mp.flush();
}

Camera.prototype.mouseWheel = function() {
  this.position[ 2 ] += this.mw[ 1 ] * 0.01;
  this.mw.flush();
}

Camera.prototype.updateArcBallRotation = function( theta )
{
  vec3.normalize( this.t1, this.t1 );
  vec3.normalize( this.pt1, this.pt1 ); //might not be needed..
  this.theta = theta || -Math.acos( Math.min( 1.0, vec3.dot( this.t1, this.pt1 ) ) );
  vec3.cross( this.axis, this.t1, this.pt1 );
  vec3.normalize( this.axis, this.axis );
  quat.setAxisAngle( this.scratchQuat, this.axis, this.theta );
  quat.multiply( this.rotation, this.rotation, this.scratchQuat );
};

Camera.prototype.setArcBallVector = function( x, y )
{
  vec3.copy( this.pt1, this.t1 );
  this.t1[ 0 ] = 2.0 * ( x / this.size[ 0 ] ) - 1.0;
  this.t1[ 1 ] = 2.0 * ( y / this.size[ 1 ] ) - 1.0;
  this.t1[ 1 ] *= -1.0;

  var r = this.t1[ 0 ] * this.t1[ 0 ] + this.t1[ 1 ] * this.t1[ 1 ];
  if( r > 1.000001 ) {
      vec3.normalize( this.t1, this.t1 );
  } else {
      this.t1[ 2 ] = Math.sqrt( 1.0 - r );
  }
};

Camera.prototype.updateSize = function() {
  var canvas = this.canvas;
  var cws = canvas.style.width;
  var found = cws.search( "px" );
  var fw = parseFloat( cws.substring( 0, found ) );
  var dpri = 1.0 / ( canvas.width / fw );
  var width = dpri * canvas.width;
  var height = dpri * canvas.height;
  vec3.set( this.size, width, height, 0.0 );
}

Camera.prototype.updateEasing = function() {
  if( Math.abs( this.theta ) > 0.0001 ) {
    this.theta *= this.damping;
    this.updateArcBallRotation( this.theta );
    this.calculateCache = true;
  }
  else if( this.calculateCache ) {
    this.cacheRotation();
  }
}

Camera.prototype.updateMatrix = function() {
  mat4.fromTranslation( this.matrix, this.position );
  mat4.fromQuat( this.rotmat, this.rotation );
  mat4.multiply( this.rotmat, this.rotmat, this.cache );
  mat4.multiply( this.matrix, this.matrix, this.rotmat );
}

Camera.prototype.cacheRotation = function() {
  mat4.copy( this.cache, this.rotmat );
  mat4.identity( this.rotmat );
  quat.identity( this.rotation );
  this.calculateCache = false;
}
