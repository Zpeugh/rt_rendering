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
const PANE_SPEED = 0.15;
const Z_SPEED = 2.5;
const SHIFT = 16;
const ENTER = 13;
const PAUSE = 80;

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


function changeDirection(dir){
    switch (dir.toLowerCase()){
        case "left":
            if (DIRECTION == POS_X){
                DIRECTION = NEG_Z;
            } else if (DIRECTION == NEG_Z){
                DIRECTION = NEG_X;
            } else if (DIRECTION == NEG_X){
                DIRECTION = POS_Z;
            } else if (DIRECTION == POS_Z){
                DIRECTION = POS_X;
            }
            movementMatrix = mat4.rotate(movementMatrix, degToRad(90), [0, 1, 0]);
            console.log(DIRECTION);
            break;
        case "right":
            if (DIRECTION == POS_X){
                DIRECTION = POS_Z;
            } else if (DIRECTION == NEG_Z){
                DIRECTION = POS_X;
            } else if (DIRECTION == NEG_X){
                DIRECTION = NEG_Z;
            } else if (DIRECTION == POS_Z){
                DIRECTION = NEG_X;
            }
            movementMatrix = mat4.rotate(movementMatrix, degToRad(-90), [0, 1, 0]);
            console.log(DIRECTION);
            break;
        default:
            console.log("Invalid direction");
            return;
    }
}


function moveRobot(direction){
    switch (direction.toLowerCase()){
        case "back":
            changeDirection("left");
            changeDirection("left");
            break;
        case "forward":
            movementMatrix = mat4.translate(movementMatrix, [0, 0, .15]);
            break;
        case "left":
            changeDirection("left");
            break;
        case "right":
            changeDirection("right");
            break;
        default:
            console.log("Invalid direction");
            return;
    }
    drawScene();
}

function armDance1(){
    var up_axis = [1,0,0];
    var side_axis = [0,0,1];

    left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(-45), up_axis);
    right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(-45), up_axis);
    drawScene();

    window.setTimeout(function(){
        console.log("move down");
        left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(45), up_axis);
        right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(45), up_axis);
        drawScene();
    }, 400);

    window.setTimeout(function(){
        console.log("move out");
        right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(45), side_axis);
        left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(-45), side_axis);
        drawScene();
    }, 700);

    window.setTimeout(function(){
        console.log("move back together");
        right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(-45), side_axis);
        left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(45), side_axis);
        drawScene();
    }, 1100);
}

function armDance2(){
    var up_axis = [1,0,0];

    left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(-45), up_axis);
    right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(45), up_axis);
    drawScene();

    window.setTimeout(function(){
        console.log("move down");
        left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(45), up_axis);
        right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(-45), up_axis);
        drawScene();
    }, 400);

    window.setTimeout(function(){
        console.log("move out");
        right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(45), up_axis);
        left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(-45), up_axis);
        drawScene();
    }, 700);

    window.setTimeout(function(){
        console.log("move back together");
        right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(-45), up_axis);
        left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(45), up_axis);
        drawScene();
    }, 1100);
}


function keypressHandler(key) {
    switch (key.which) {
        case LEFT:
            moveRobot("left");
            break;
        case RIGHT:
            moveRobot("right");
            break;
        case DOWN:
            moveRobot("back");
            break;
        case UP:
            moveRobot("forward");
            break;
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
            Z_ANGLE -= Z_SPEED;
            drawScene();
            break;
        case Z_DOWN:
            Z_ANGLE += Z_SPEED;
            drawScene();
            break;
        case ENTER:
            if (key.shiftKey){
                armDance1();
            } else {
                armDance2();
            }
            break;
        case SHIFT:
            break;
        default:
            console.log("Invalid keypress: " + key.which);
            return;
    }
    key.preventDefault();
}
