/**
 * Date: 2/12/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 2
 * Description: Extra utility functions used in the backend.
 **/
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const UP = 38;
const SPACE = 32;
const ENTER = 13;
const FRAMES_PER_SECOND = 10;
var PADDLE_EXTENDED = false;
var score = 0;
var multiplier = 1;



function setMatrixUniforms(matrix) {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function padExtendAnimation(){
    if (!PADDLE_EXTENDED){
        PADDLE_EXTENDED = true;
        mv_pad_matrix = mat4.translate(mv_pad_matrix, [-STEM_WIDTH, 0, 0]);
        setTimeout(function(){
            mv_pad_matrix = mat4.translate(mv_pad_matrix, [STEM_WIDTH, 0, 0]);
            PADDLE_EXTENDED = false;
        }, 500);
    }
}

function checkForWall(direction){
    var x_trans = mv_paddle_matrix[12] + PADDLE_X_SPEED;
    var y_trans = mv_paddle_matrix[13] + PADDLE_Y_SPEED;

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

function increaseVelocity(){
    BALL_X_VELOCITY = BALL_X_VELOCITY * 1.05;
    BALL_Y_VELOCITY = BALL_Y_VELOCITY * 1.05;
}


function checkForBounce(){
    var x = mv_ball_matrix[12] + BALL_X_VELOCITY;
    var y = mv_ball_matrix[13] + BALL_Y_VELOCITY;
    paddle_x = mv_paddle_matrix[12] + PAD_XL;
    paddle_y_top = mv_paddle_matrix[13] + PAD_YT;
    paddle_y_bottom = mv_paddle_matrix[13] + PAD_YB;

    if (PADDLE_EXTENDED){
        x = x + STEM_WIDTH + PAD_WIDTH;
        multiplier += 1;
    }

    if (x >= paddle_x && y < paddle_y_top && y > paddle_y_bottom){
        score = score + multiplier;
        console.log("Multiplier: " + multiplier);
        console.log("Score: " + score);
        updateScore(score);
        increaseVelocity();
        BALL_X_VELOCITY = -BALL_X_VELOCITY;
    } else if (x >= 1){
        console.log("Game over");
        gameOver();
    } else if(x <= -1){
        BALL_X_VELOCITY = -BALL_X_VELOCITY;
    } else if (y >= 1 || y <= -1){
        BALL_Y_VELOCITY = -BALL_Y_VELOCITY;
    }
}

function calculateBallPosition(){
    checkForBounce();
    mv_ball_matrix = mat4.translate(mv_ball_matrix, [BALL_X_VELOCITY, BALL_Y_VELOCITY, 0]);
}



function keypressHandler(key) {
    switch (key.which) {
        case LEFT:
            if (!checkForWall(LEFT)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [-PADDLE_X_SPEED, 0, 0]);
            }
            break;
        case RIGHT:
            if (!checkForWall(RIGHT)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [PADDLE_X_SPEED, 0, 0]);
            }
            break;
        case DOWN:
            if (!checkForWall(DOWN)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, -PADDLE_Y_SPEED, 0]);
            }
            break;
        case UP:
            if (!checkForWall(UP)){
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, PADDLE_Y_SPEED, 0]);
            }
            break;
        case ENTER:
            padExtendAnimation();
            console.log("enter or space");
            break;
        case SPACE:
            padExtendAnimation();
            break;
        default:
            console.log(key.which)
            return;
    }
    key.preventDefault();

}
