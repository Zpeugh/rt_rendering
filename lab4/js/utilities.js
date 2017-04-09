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

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    mat4.identity(nMatrix);
    nMatrix = mat4.multiply(nMatrix, vMatrix);
    nMatrix = mat4.multiply(nMatrix, mMatrix);
    nMatrix = mat4.inverse(nMatrix);
    nMatrix = mat4.transpose(nMatrix);
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);

}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


function changeLightIntensity(up_or_down){
    switch (up_or_down){
        case "UP":
            if (light_intensity < 3){
                light_intensity += 0.01;
            }
            break;
        case "DOWN":
            if (light_intensity > 0.51){
                light_intensity -= 0.01;
            }
            break;
    }
}

function updateLightPosition(pos, light_change) {
    switch (pos) {
        case "X":
            light_pos[0] += light_change;
            light_bulb.matrix = mat4.translate(light_bulb.matrix, [light_change, 0, 0])
            break;
        case "Y":
            light_pos[1] += light_change;
            light_bulb.matrix = mat4.translate(light_bulb.matrix, [0, light_change, 0])
            break;
        case "Z":
            light_pos[2] += light_change;
            light_bulb.matrix = mat4.translate(light_bulb.matrix, [0, 0, light_change])
            break;
        default:
            console.log("here");
            break;
    }
}
    function keypressHandler(key) {
        switch (key.which) {
            case LIGHT_RIGHT:
                updateLightPosition("X", LIGHT_SPEED)
                drawScene();
                break;
            case LIGHT_LEFT:
                updateLightPosition("X", -LIGHT_SPEED)
                drawScene();
                break;
            case LIGHT_UP:
                updateLightPosition("Y", LIGHT_SPEED)
                drawScene();
                break;
            case LIGHT_DOWN:
                updateLightPosition("Y", -LIGHT_SPEED)
                drawScene();
                break;
            case LIGHT_FORWARD:
                updateLightPosition("Z", LIGHT_SPEED)
                drawScene();
                break;
            case LIGHT_BACKWARD:
                updateLightPosition("Z", -LIGHT_SPEED)
                drawScene();
                break;
            case UP:
                changeLightIntensity("UP");
                drawScene();
                break;
            case DOWN:
                changeLightIntensity("DOWN");
                drawScene();
                break;
            default:
                console.log("Invalid keypress: " + key.which);
                return;
        }
        key.preventDefault();
    }
