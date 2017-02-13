/**
 * Date: 2/12/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 2
 * Description: Extra utility functions used in the backend.
 **/

const PADDLE_COLOR = [0.274,0.533,0.7725,1];

function minimum(arr){
    var min = arr[0];
    for (var i = 1; i < arr.length; i++) {
        temp = arr[i];
        if (temp < min) min = temp;
    }
    return min;
}

function maximum(arr){
    var max = arr[0];
    for (var i = 1; i < arr.length; i++) {
        temp = arr[i];
        if (temp > max) max = temp;
    }
    return max;
}

function average(arr){
    var mean = arr[0];
    for (var i = 1; i < arr.length; i++) {
        mean += arr[i];
    }
    return mean / arr.length;
}

function setMatrixUniforms(matrix) {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
}


function initializePaddle(){
    mv_paddle_matrix = mat4.create();
    mat4.identity(mv_paddle_matrix);
    vertices = [];
    colors = [];
    indices = [];
    num_vertices = 4;
    num_indices = 6;
    num_colors = 4;

    vertices.push(0.95);    //x- top right
    vertices.push(0.25);    //y- top right
    vertices.push(0.0);     //z- top right

    vertices.push(0.9);     //x- top left
    vertices.push(0.25);    //y- top left
    vertices.push(0.0);     //z- top left

    vertices.push(0.95);    //x- bottom right
    vertices.push(-0.25);   //y- bottom right
    vertices.push(0.0);     //z- bottom right

    vertices.push(0.9);     //x- bottom left
    vertices.push(-0.25);   //y- bottom left
    vertices.push(0.0);     //z-bottom left

    indices.push(0);
    indices.push(1);
    indices.push(2);
    indices.push(1);
    indices.push(2);
    indices.push(3);

    for (var i = 0; i < 4; i++){
        colors = colors.concat(PADDLE_COLOR);
    }
}

function checkForWall(direction){

}

function keypressHandler(key) {
    switch (key.which) {
        case LEFT:
            mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [-X_TRANSLATION, 0, 0]);
            break;
        case RIGHT:
            mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [X_TRANSLATION, 0, 0]);
            break;
        case DOWN:
            mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, -Y_TRANSLATION, 0]);
            break;
        case UP:
            mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, Y_TRANSLATION, 0]);
            break;
        default: return;
    }
    key.preventDefault();
    drawScene();
}
