## New Shiny Camera in Javascript

## Synopsis
nsc.jsは、WebGLアプリケーションの中で3Dオブジェクトを見るためのミニマルなカメラ機能です。フレームワークにに依存しておらず、オブジェクトを見るための、mayaのようなシンプルなカメラ機能を備えています。

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
このライブラリは、コンピュテーショナル デザイン、及びパラメトリック デザインをウェブに広めようとする、大きなライブラリのプロジェクト/シリーズの一部です。
高度なコンピューテーショナル デザインや3Dモデルの出力、Gコード生成、CNCフライス加工ツール用のパスや、レーザー切断用のパスの生成、ロボット運動計画などを可能にする、全ての複雑な形態機能を備えた数学的頭脳になることを目的としています。

## Build Requirements
node.js (4.4.0+) & npm

## Installation
このライブラリをプロジェクトに追加するためには、以下の操作を行って下さい:
```
npm install --save https://github.com/YCAMInterlab/nsc.js.git
```

もしく以下の方法でも追加できます:
```
npm install --save nsc
```

## Examples
See https://github.com/rezaali/webgl-sketches/

## Contribution
Copyright 2015-2016 [Reza Ali](http://www.syedrezaali.com) co-developed by [YCAMInterLab](http://interlab.ycam.jp/en/) during the [Guest Research Project v.3](http://interlab.ycam.jp/en/projects/guestresearch/vol3)

## License
Apache-2.0
