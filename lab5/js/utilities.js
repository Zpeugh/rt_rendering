/**
 * Date: 4/9/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 4
 * Description: Extra utility functions used by other main functions
 **/
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const UP = 38;
const LIGHT_LEFT = 65;
const LIGHT_RIGHT = 68;
const LIGHT_DOWN = 83;
const LIGHT_UP = 87;
const LIGHT_FORWARD = 88;
const LIGHT_BACKWARD = 90;
const LIGHT_SPEED = 1;
const SHIFT = 16;
const ENTER = 13;
const PAUSE = 80;
const PANE_LEFT = 65;
const PANE_RIGHT = 68;
const PANE_DOWN = 83;
const PANE_UP = 87;
const Z_UP = 88;
const Z_DOWN = 90;
const PANE_SPEED = 0.5;
const Z_SPEED = 2.5;
var lastMouseX = 0,
    lastMouseY = 0;


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shader_program.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shader_program.vMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(shader_program.mMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(shader_program.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shader_program.v2wMatrixUniform, false, v2wMatrix);

    mat4.identity(nMatrix);
    nMatrix = mat4.multiply(nMatrix, vMatrix);
    nMatrix = mat4.multiply(nMatrix, mMatrix);
    nMatrix = mat4.inverse(nMatrix);
    nMatrix = mat4.transpose(nMatrix);
    gl.uniformMatrix4fv(shader_program.nMatrixUniform, false, nMatrix);

}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function keypressHandler(key) {
    switch (key.which) {
        case PANE_RIGHT:
            CAMERA_X += PANE_SPEED;
            drawScene();
            break;
        case PANE_LEFT:
            CAMERA_X -= PANE_SPEED;
            drawScene();
            break;
        case PANE_UP:
            CAMERA_Y += PANE_SPEED;
            drawScene();
            break;
        case PANE_DOWN:
            CAMERA_Y -= PANE_SPEED;
            drawScene();
            break;
        case Z_UP:
            CAMERA_Z += PANE_SPEED;
            drawScene();
            break;
        case Z_DOWN:
            CAMERA_Z -= PANE_SPEED;
            drawScene();
            break;
        case UP:
            COI[1] += PANE_SPEED;
            drawScene();
            break;
        case DOWN:
            COI[1] -= PANE_SPEED;
            drawScene();
            break;
        case RIGHT:
            COI[0] += PANE_SPEED;
            drawScene();
            break;
        case LEFT:
            COI[0] -= PANE_SPEED;
            drawScene();
            break;
        default:
            console.log("Invalid keypress: " + key.which);
            return;
    }
    key.preventDefault();
}
