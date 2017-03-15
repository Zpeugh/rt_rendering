/**
 * Date: 2/23/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 2
 * Description: Extra utility functions used by other main functions
 **/
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const UP = 38;
const L = 76;
const R = 82;
const F = 70;
const B = 66;
const SPACE = 32;
const ENTER = 13;
const PAUSE = 80;

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
