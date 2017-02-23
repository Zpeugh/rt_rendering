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
const VELOCITY_MULTIPLIER = 1.05;
var PADDLE_EXTENDED = false;
var HIT_PADDLE_LAST = false;
var ball_velocity = 1;
var score = 0;
var multiplier = 1;



function setMatrixUniforms(matrix) {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function padExtendAnimation() {
    if (!PADDLE_EXTENDED) {
        PADDLE_EXTENDED = true;
        mv_pad_matrix = mat4.translate(mv_pad_matrix, [-STEM_WIDTH, 0, 0]);
        setTimeout(function() {
            mv_pad_matrix = mat4.translate(mv_pad_matrix, [STEM_WIDTH, 0, 0]);
            PADDLE_EXTENDED = false;
        }, 500);
    }
}

function checkForWall(direction) {
    var x_trans = mv_paddle_matrix[12] + PADDLE_X_SPEED;
    var y_trans = mv_paddle_matrix[13] + PADDLE_Y_SPEED;

    if (direction == LEFT && (PADDLE_XL + x_trans - PAD_WIDTH - WALL_WIDTH) <= -.829) {
        mv_paddle_matrix[12] = -1 - PADDLE_XL + PAD_WIDTH + WALL_WIDTH;
        updateScore(score + multiplier);
        return true;
    } else if (direction == RIGHT && PADDLE_XR + x_trans >= 1) {
        mv_paddle_matrix[12] = 1 - PADDLE_XR;
        return true;
    } else if (direction == UP && PADDLE_YT + y_trans >= 1) {
        mv_paddle_matrix[13] = 1 - PADDLE_YT;
        return true;
    } else if (direction == DOWN && PADDLE_YB + y_trans <= -.9) {
        mv_paddle_matrix[13] = -1 - PADDLE_YB;
        return true;
    } else {
        return false;
    }
}

function increaseVelocity() {
    BALL_X_VELOCITY *= VELOCITY_MULTIPLIER;
    BALL_Y_VELOCITY *= VELOCITY_MULTIPLIER;
    ball_velocity *= VELOCITY_MULTIPLIER;
    $('span#velocity').text(" " + ball_velocity.toFixed(2));
    $('span#multiplier').text(" " + multiplier);
}


function checkForBounce() {
    var x = mv_ball_matrix[12] + BALL_X_VELOCITY;
    var y = mv_ball_matrix[13] + BALL_Y_VELOCITY;
    var paddle_x = mv_paddle_matrix[12] + PAD_XL - PAD_WIDTH;
    var paddle_y_top = mv_paddle_matrix[13] + PAD_YT;
    var paddle_y_bottom = mv_paddle_matrix[13] + PAD_YB;
    var pad_x = paddle_x - STEM_WIDTH;
    if (PADDLE_EXTENDED && !HIT_PADDLE_LAST && x >= pad_x && (x <= paddle_x + PADDLE_WIDTH) && y < paddle_y_top && y > paddle_y_bottom) {
        HIT_PADDLE_LAST = true;
        BALL_X_VELOCITY = -BALL_X_VELOCITY;
        multiplier += 1;
        increaseVelocity();
    } else if (!HIT_PADDLE_LAST && x >= paddle_x && (x <= paddle_x + PADDLE_WIDTH) && y < paddle_y_top && y > paddle_y_bottom) {
        HIT_PADDLE_LAST = true;
        BALL_X_VELOCITY = -BALL_X_VELOCITY;
    } else if (x >= 1) {
        HIT_PADDLE_LAST = false;
        gameOver();
    } else if (x <= -1) {
        greenWallColor();
        score = score + multiplier;
        updateScore(score);
        HIT_PADDLE_LAST = false;
        BALL_X_VELOCITY = -BALL_X_VELOCITY;
    } else if (y >= 1 || y <= -1) {
        restoreWallColor();
        console.log("changing this");
        BALL_Y_VELOCITY = -BALL_Y_VELOCITY;
        HIT_PADDLE_LAST = false;
    }
}

function calculateBallPosition() {
    checkForBounce();
    mv_ball_matrix = mat4.translate(mv_ball_matrix, [BALL_X_VELOCITY, BALL_Y_VELOCITY, 0]);
}

function keypressHandler(key) {
    switch (key.which) {
        case LEFT:
        case L:
            if (!checkForWall(LEFT) && !paused) {
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [-PADDLE_X_SPEED, 0, 0]);
            } else if (!paused) {
                score = score + multiplier;
                greenWallColor();
            }
            break;
        case RIGHT:
        case R:
            if (!checkForWall(RIGHT)&& !paused) {
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [PADDLE_X_SPEED, 0, 0]);
                restoreWallColor();
            }
            break;
        case DOWN:
        case B:
            if (!checkForWall(DOWN) && !paused) {
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, -PADDLE_Y_SPEED, 0]);
            }
            break;
        case UP:
        case F:
            if (!checkForWall(UP) && !paused) {
                mv_paddle_matrix = mat4.translate(mv_paddle_matrix, [0, PADDLE_Y_SPEED, 0]);
            }
            break;
        case ENTER:
            if (!paused){
                padExtendAnimation();
            }
            break;
        case SPACE:
            if (!paused){
                padExtendAnimation();
            }
            break;
        case PAUSE:
            pause();
            break;
        default:
            console.log("Invalid keypress: " + key.which);
            return;
    }
    key.preventDefault();

}

function pause() {
    if (paused) {
        $('#button').text("Pause");
        paused = false;
        resumeBall();
    } else {
        $('#button').text("Resume");
        paused = true;
        pauseBall();
    }
}

function greenWallColor(){
    if (WALL_COLOR == GREEN){
        return true;
    } else {
        console.log("Making wall to green");
        wall_colors = [];
        for (var i = 0; i < 4; i++){
            wall_colors = wall_colors.concat(GREEN);
        }
    }
}

function restoreWallColor(){
    console.log("Restoring wall to blue");
    wall_colors = [];
    for (var i = 0; i < 4; i++){
        wall_colors = wall_colors.concat(BLUE);
    }
}

function pauseBall() {
    PAST_BALL_X_VELOCITY = BALL_X_VELOCITY;
    PAST_BALL_Y_VELOCITY = BALL_Y_VELOCITY;
    BALL_X_VELOCITY = 0;
    BALL_Y_VELOCITY = 0;
}

function resumeBall() {
    BALL_X_VELOCITY = PAST_BALL_X_VELOCITY;
    BALL_Y_VELOCITY = PAST_BALL_Y_VELOCITY;
}

function gameOver() {
    pauseBall();
    $('#button').text("Restart");
    $("#button").attr('onclick', 'begin()');
    restart = true;
}

function updateScore(scr) {
    score = scr;
    $('span#score').text(" " + score);
}

// Start moving the pong ball
function begin() {
    if (restart) {
        location.reload();
    }
    requestAnimationFrame(drawSceneRecursive);
    $('#button').text("Pause");
    $("#button").attr('onclick', 'pause()');
}
