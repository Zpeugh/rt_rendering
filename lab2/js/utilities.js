/**
 * Date: 2/12/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 2
 * Description: Extra utility functions used in the backend.
 **/

const PADDLE_COLOR = [0.274,0.533,0.7725,1];
const PAD_COLOR = [1,0,0,1];
const PADDLE_XR = 1.0;
const PADDLE_XL = 0.965;
const PADDLE_YT = 0.2;
const PADDLE_YB = -0.2;
const PAD_XR = 0.965;
const PAD_XL = 0.95;
const PAD_YT = 0.1;
const PAD_YB = -0.1;
const STEM_WIDTH = 0.02;
const PAD_STEM_XR = PAD_XR + STEM_WIDTH;
const PAD_STEM_XL = PAD_XR;
const PAD_STEM_YT = STEM_WIDTH / 2.0;
const PAD_STEM_YB = -STEM_WIDTH / 2.0;
var PADDLE_EXTENDED = false;
var mvMatrixStack = [];


function pushMatrix(stack, matrix) {
    var copy = mat4.create();
    mat4.set(matrix, copy);
    stack.push(copy);
}

function popMatrix(stack, copy) {
    if (stack.length == 0) {
        throw "Invalid popMatrix!";
    }
    copy = stack.pop();
}

function setMatrixUniforms(matrix) {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
}

function initializePaddle(){
    mv_paddle_matrix = mat4.create();
    mat4.identity(mv_paddle_matrix);

    paddle_vertices.push(PADDLE_XR);   //x- top right
    paddle_vertices.push(PADDLE_YT);   //y- top right
    paddle_vertices.push(0.0);         //z- top right

    paddle_vertices.push(PADDLE_XL);    //x- top left
    paddle_vertices.push(PADDLE_YT);    //y- top left
    paddle_vertices.push(0.0);          //z- top left

    paddle_vertices.push(PADDLE_XR);    //x- bottom right
    paddle_vertices.push(PADDLE_YB);   //y- bottom right
    paddle_vertices.push(0.0);     //z- bottom right

    paddle_vertices.push(PADDLE_XL);     //x- bottom left
    paddle_vertices.push(PADDLE_YB);   //y- bottom left
    paddle_vertices.push(0.0);     //z-bottom left

    paddle_indices.push(0);
    paddle_indices.push(1);
    paddle_indices.push(2);
    paddle_indices.push(1);
    paddle_indices.push(2);
    paddle_indices.push(3);

    for (var i = 0; i < 4; i++){
        paddle_colors = paddle_colors.concat(PADDLE_COLOR);
    }
}

function initializePad(){
    mv_pad_matrix = mat4.create();
    mat4.identity(mv_pad_matrix);

    //Main pad
    pad_vertices.push(PAD_XR);    //x- top right
    pad_vertices.push(PAD_YT);    //y- top right
    pad_vertices.push(0.0);     //z- top right

    pad_vertices.push(PAD_XL);     //x- top left
    pad_vertices.push(PAD_YT);    //y- top left
    pad_vertices.push(0.0);     //z- top left

    pad_vertices.push(PAD_XR);    //x- bottom right
    pad_vertices.push(PAD_YB);   //y- bottom right
    pad_vertices.push(0.0);     //z- bottom right

    pad_vertices.push(PAD_XL);     //x- bottom left
    pad_vertices.push(PAD_YB);   //y- bottom left
    pad_vertices.push(0.0);     //z-bottom left

    pad_indices.push(0);
    pad_indices.push(1);
    pad_indices.push(2);
    pad_indices.push(1);
    pad_indices.push(2);
    pad_indices.push(3);

    for (var i = 0; i < 4; i++){
        pad_colors = pad_colors.concat(PAD_COLOR);
    }

    //Extending lever
    pad_vertices.push(PAD_STEM_XR);    //x- top right
    pad_vertices.push(PAD_STEM_YT);    //y- top right
    pad_vertices.push(0.0);     //z- top right

    pad_vertices.push(PAD_STEM_XL);     //x- top left
    pad_vertices.push(PAD_STEM_YT);    //y- top left
    pad_vertices.push(0.0);     //z- top left

    pad_vertices.push(PAD_STEM_XR);    //x- bottom right
    pad_vertices.push(PAD_STEM_YB);   //y- bottom right
    pad_vertices.push(0.0);     //z- bottom right

    pad_vertices.push(PAD_STEM_XL);     //x- bottom left
    pad_vertices.push(PAD_STEM_YB);   //y- bottom left
    pad_vertices.push(0.0);     //z-bottom left

    pad_indices.push(4);
    pad_indices.push(5);
    pad_indices.push(6);
    pad_indices.push(5);
    pad_indices.push(6);
    pad_indices.push(7);

    for (var i = 0; i < 4; i++){
        pad_colors = pad_colors.concat(PADDLE_COLOR);
    }

}

function padExtendAnimation(){
    if (!PADDLE_EXTENDED){
        PADDLE_EXTENDED = true;
        mv_pad_matrix = mat4.translate(mv_pad_matrix, [-STEM_WIDTH, 0, 0]);
        drawScene();
        setTimeout(function(){
            mv_pad_matrix = mat4.translate(mv_pad_matrix, [STEM_WIDTH, 0, 0]);
            drawScene();
            PADDLE_EXTENDED = false;
        }, 750);
    }
}

function checkForWall(direction){
    var x_trans = mv_paddle_matrix[12] + X_SPEED;
    var y_trans = mv_paddle_matrix[13] + Y_SPEED;

    if (direction == LEFT && PADDLE_XL + x_trans <= -.85){
        mv_paddle_matrix[12] = -1 - PADDLE_XL;
        return true;
    } else if (direction == RIGHT && PADDLE_XR + x_trans >= 1){
        mv_paddle_matrix[12] = 1 - PADDLE_XR;
        return true;
    } else if (direction == UP && PADDLE_YT + y_trans >= 1){
        mv_paddle_matrix[13] = 1 - PADDLE_YT;
        return true;
    } else if (direction == DOWN && PADDLE_YB + y_trans <= -.9){
        mv_paddle_matrix[13] = -1 - PADDLE_YB;
        return true;
    } else {
        return false;
    }
}

function keypressHandler(key) {
    switch (key.which) {
        case LEFT:
            if (!checkForWall(LEFT)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [-X_SPEED, 0, 0]);
            }
            drawScene();
            break;
        case RIGHT:
            if (!checkForWall(RIGHT)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [X_SPEED, 0, 0]);
            }
            drawScene();
            break;
        case DOWN:
            if (!checkForWall(DOWN)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, -Y_SPEED, 0]);
            }
            drawScene();
            break;
        case UP:
            if (!checkForWall(UP)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, Y_SPEED, 0]);
            }
            drawScene();
            break;
        case ENTER:
            padExtendAnimation();
            console.log("enter or space");
            break;

        default: return;
    }
    key.preventDefault();

}
