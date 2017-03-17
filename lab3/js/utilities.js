/**
 * Date: 2/23/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 3
 * Description: Extra utility functions used by other main functions
 **/
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const UP = 38;
const PANE_LEFT = 65;
const PANE_RIGHT = 68;
const PANE_DOWN = 83;
const PANE_UP = 87;
const Z_UP = 88;
const Z_DOWN = 90;
const PANE_SPEED = 0.07;
const Z_SPEED = 2.5;
const SHIFT = 16;
const ENTER = 13;
const PAUSE = 80;

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function keypressHandler(key) {
    switch (key.which) {
        case LEFT:
            console.log("Left");
            break;
        case RIGHT:
            console.log("Right");
            break;
        case DOWN:
            console.log("Down");
            break;
        case UP:
            console.log("Up");
            break;
        case PANE_RIGHT:
            CAMERA_X -= PANE_SPEED;
            drawScene();
            break;
        case PANE_LEFT:
            CAMERA_X += PANE_SPEED;
            drawScene();
            break;
        case PANE_UP:
            CAMERA_Y -= PANE_SPEED;
            drawScene();
            break;
        case PANE_DOWN:
            CAMERA_Y += PANE_SPEED;
            drawScene();
            break;
        case Z_UP:
            Z_ANGLE += Z_SPEED;
            drawScene();
            break;
        case Z_DOWN:
            Z_ANGLE -= Z_SPEED;
            drawScene();
            break;
        case ENTER:
            console.log("Enter");
            break;
        default:
            console.log("Invalid keypress: " + key.which);
            return;
    }
    key.preventDefault();
}
