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
const PANE_SPEED = 0.15;
const Z_SPEED = 2.5;
var lastMouseX = 0, lastMouseY = 0;


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
            case PANE_RIGHT:
                console.log("right");
                CAMERA_X += PANE_SPEED;
                drawScene();
                break;
            case PANE_LEFT:
                console.log("left");
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
                Z_ANGLE -= Z_SPEED;
                drawScene();s
                break;
            case Z_DOWN:
                Z_ANGLE += Z_SPEED;
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


    function onDocumentMouseDown( event ) {
         event.preventDefault();
         document.addEventListener( 'mousemove', onDocumentMouseMove, false );
         document.addEventListener( 'mouseup', onDocumentMouseUp, false );
         document.addEventListener( 'mouseout', onDocumentMouseOut, false );
         var mouseX = event.clientX;
         var mouseY = event.clientY;

         lastMouseX = mouseX;
         lastMouseY = mouseY;

     }

    function onDocumentMouseMove( event ) {
         var mouseX = event.clientX;
         var mouseY = event.ClientY;

         var diffX = mouseX - lastMouseX;
         var diffY = mouseY - lastMouseY;

         Z_ANGLE = Z_ANGLE + diffX/5;

         lastMouseX = mouseX;
         lastMouseY = mouseY;

         drawScene();
    }

    function onDocumentMouseUp( event ) {
         document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
         document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
         document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

    function onDocumentMouseOut( event ) {
         document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
         document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
         document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }
