/**
 * Date: 2/23/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 2
 * Description: Javascript file used to initialize objects for Pong game.
 **/
const GREEN = [0.329,0.686,0.196,1];
const BLUE = [0.274,0.533,0.7725,1];
const WALL_WIDTH = 0.02;
const PADDLE_XR = 1.0;
const PADDLE_XL = 0.965;
const PADDLE_YT = 0.2;
const PADDLE_YB = -0.2;
const PADDLE_WIDTH = PADDLE_XR - PADDLE_XL;
const PAD_COLOR = [0.878,0.282,0.218,1];
const PAD_XR = 0.965;
const PAD_XL = 0.95;
const PAD_WIDTH = PAD_XR - PAD_XL;
const PAD_YT = 0.2;
const PAD_YB = -0.2;
const STEM_WIDTH = 0.02;
const PAD_STEM_XR = PAD_XR + STEM_WIDTH;
const PAD_STEM_XL = PAD_XR;
const PAD_STEM_YT = STEM_WIDTH / 2.0;
const PAD_STEM_YB = -STEM_WIDTH / 2.0;
const BALL_COLOR = [1,1,1,1];
const BALL_X = 0.0;
const BALL_Y = 0.0;
const BALL_RADIUS = 0.025;
const DEG_IN_CIRCLE = 360;
var WALL_COLOR = BLUE;
var BALL_X_VELOCITY = -0.01243;
var BALL_Y_VELOCITY = 0.01446;
var PADDLE_X_SPEED = 0.15;
var PADDLE_Y_SPEED = 0.1;
var PAST_BALL_X_VELOCITY = BALL_X_VELOCITY;
var PAST_BALL_Y_VELOCITY = BALL_Y_VELOCITY;

function initializePaddle(){
    mv_paddle_matrix = mat4.create();
    mat4.identity(mv_paddle_matrix);

    num_paddle_vertices = 4;
    num_paddle_indices = 6;
    num_paddle_colors = 4;

    paddle_vertices.push(PADDLE_XR);    //x- top right
    paddle_vertices.push(PADDLE_YT);    //y- top right
    paddle_vertices.push(0.0);          //z- top right

    paddle_vertices.push(PADDLE_XL);    //x- top left
    paddle_vertices.push(PADDLE_YT);    //y- top left
    paddle_vertices.push(0.0);          //z- top left

    paddle_vertices.push(PADDLE_XR);    //x- bottom right
    paddle_vertices.push(PADDLE_YB);    //y- bottom right
    paddle_vertices.push(0.0);          //z- bottom right

    paddle_vertices.push(PADDLE_XL);    //x- bottom left
    paddle_vertices.push(PADDLE_YB);    //y- bottom left
    paddle_vertices.push(0.0);          //z-bottom left

    paddle_indices.push(0);
    paddle_indices.push(1);
    paddle_indices.push(2);
    paddle_indices.push(1);
    paddle_indices.push(2);
    paddle_indices.push(3);

    for (var i = 0; i < 4; i++){
        paddle_colors = paddle_colors.concat(BLUE);
    }
}

function initializePad(){
    mv_pad_matrix = mat4.create();
    mat4.identity(mv_pad_matrix);

    num_pad_vertices = 8;
    num_pad_indices = 12;
    num_pad_colors = 8;

    //Main pad
    pad_vertices.push(PAD_XR);      //x- top right
    pad_vertices.push(PAD_YT);      //y- top right
    pad_vertices.push(0.0);         //z- top right

    pad_vertices.push(PAD_XL);      //x- top left
    pad_vertices.push(PAD_YT);      //y- top left
    pad_vertices.push(0.0);         //z- top left

    pad_vertices.push(PAD_XR);      //x- bottom right
    pad_vertices.push(PAD_YB);      //y- bottom right
    pad_vertices.push(0.0);         //z- bottom right

    pad_vertices.push(PAD_XL);      //x- bottom left
    pad_vertices.push(PAD_YB);      //y- bottom left
    pad_vertices.push(0.0);         //z-bottom left

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
    pad_vertices.push(PAD_STEM_XR);     //x- top right
    pad_vertices.push(PAD_STEM_YT);     //y- top right
    pad_vertices.push(0.0);             //z- top right

    pad_vertices.push(PAD_STEM_XL);     //x- top left
    pad_vertices.push(PAD_STEM_YT);     //y- top left
    pad_vertices.push(0.0);             //z- top left

    pad_vertices.push(PAD_STEM_XR);     //x- bottom right
    pad_vertices.push(PAD_STEM_YB);     //y- bottom right
    pad_vertices.push(0.0);             //z- bottom right

    pad_vertices.push(PAD_STEM_XL);     //x- bottom left
    pad_vertices.push(PAD_STEM_YB);     //y- bottom left
    pad_vertices.push(0.0);             //z-bottom left

    pad_indices.push(4);
    pad_indices.push(5);
    pad_indices.push(6);
    pad_indices.push(5);
    pad_indices.push(6);
    pad_indices.push(7);

    for (var i = 0; i < 4; i++){
        pad_colors = pad_colors.concat(BLUE);
    }

}

function initializeBall(){
    mv_ball_matrix = mat4.create();
    mat4.identity(mv_ball_matrix);

    num_ball_vertices = DEG_IN_CIRCLE + 1;
    num_ball_colors = num_ball_vertices;

    ball_vertices.push(BALL_X);     //x
    ball_vertices.push(BALL_Y);     //y
    ball_vertices.push(0.0);        //z
    ball_colors = ball_colors.concat(BALL_COLOR);

    for (var i = 0; i < DEG_IN_CIRCLE; i++){
        ball_vertices.push(BALL_X + BALL_RADIUS * Math.cos( degToRad(i) ) );   //x
        ball_vertices.push(BALL_Y + BALL_RADIUS * Math.sin( degToRad(i) ) );   //y
        ball_vertices.push(0.0);                                               //z
        ball_colors = ball_colors.concat(BALL_COLOR);
    }
}



function initializeWall(){
    mv_wall_matrix = mat4.create();
    mat4.identity(mv_wall_matrix);

    num_wall_vertices = 4;
    num_wall_indices = 6;
    num_wall_colors = 4;

    wall_vertices.push(-1 + WALL_WIDTH);   //x- top right
    wall_vertices.push(1);      //y- top right
    wall_vertices.push(0.0);    //z- top right

    wall_vertices.push(-1);     //x- top left
    wall_vertices.push(1);      //y- top left
    wall_vertices.push(0.0);    //z- top left

    wall_vertices.push(-1 + WALL_WIDTH);   //x- bottom right
    wall_vertices.push(-1);     //y- bottom right
    wall_vertices.push(0.0);    //z- bottom right

    wall_vertices.push(-1);     //x- bottom left
    wall_vertices.push(-1);     //y- bottom left
    wall_vertices.push(0.0);    //z-bottom left

    wall_indices.push(0);
    wall_indices.push(1);
    wall_indices.push(2);
    wall_indices.push(1);
    wall_indices.push(2);
    wall_indices.push(3);

    for (var i = 0; i < 4; i++){
        wall_colors = wall_colors.concat(BLUE);
    }
}
