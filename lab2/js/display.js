/**
 * Date: 2/23/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 2
 * Description: Main file containing all of the public facing
 *              function definitions for the pong program.
 **/

// Initialize all global variables
var gl;
var shaderProgram;
var draw_type = 2;
var t_last = 0;
var paddle_vertex_position_buffer, paddle_vertex_color_buffer, paddle_vertex_index_buffer;
var pad_vertex_position_buffer, pad_vertex_color_buffer, pad_vertex_index_buffer;
var ball_vertex_position_buffer, ball_vertex_color_buffer, ball_vertex_index_buffer;
var wall_vertex_position_buffer, wall_vertex_color_buffer, wall_vertex_index_buffer;
var paddle_vertices = [], paddle_indices = [], paddle_colors = [];
var pad_vertices = [], pad_indices = [], pad_colors = [];
var ball_vertices = [], ball_colors = [];
var wall_vertices = [], wall_indices = [], wall_colors = [];
var num_paddle_vertices = 0, num_paddle_indices = 0, num_paddle_colors = 0;
var num_pad_vertices = 0, num_pad_indices = 0, num_pad_colors = 0;
var num_ball_vertices = 0, num_ball_colors = 0;
var num_wall_vertices = 0, num_wall_indices = 0, num_wall_colors = 0;
var mv_paddle_matrix;
var mv_pad_matrix;
var mv_ball_matrix;
var mv_wall_matrix;
const FRAMES_PER_SECOND = 120;
var paused = false;
var restart = false;

//////////// Init OpenGL Context etc. ///////////////
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialize WebGL, sorry");
    }
}

function clearCanvas() {
    paddle_vertices = [];
    paddle_indices = [];
    paddle_colors = [];
    pad_vertices = [];
    pad_indices = [];
    pad_colors = [];
    ball_vertices = [];
    ball_colors = [];
    wall_vertices = [];
    wall_indices = [];
    wall_colors = [];
    paddle_vertex_position_buffer = {};
    paddle_vertex_color_buffer = {};
    paddle_vertex_index_buffer = {};
    pad_vertex_position_buffer = {};
    pad_vertex_color_buffer = {};
    pad_vertex_index_buffer = {};
    ball_vertex_position_buffer = {};
    ball_vertex_color_buffer = {};
    ball_vertex_index_buffer = {};
    wall_vertex_position_buffer = {};
    wall_vertex_color_buffer = {};
    wall_vertex_index_buffer = {};
    initBuffers();
}

/////////////////////////  Initialize VBO  /////////////////////////
function initBuffers() {

    // Initialize Paddle
    paddle_vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paddle_vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paddle_vertices), gl.STATIC_DRAW);
    paddle_vertex_position_buffer.itemSize = 3;
    paddle_vertex_position_buffer.numItems = num_paddle_vertices;

    paddle_vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, paddle_vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(paddle_indices), gl.STATIC_DRAW);
    paddle_vertex_index_buffer.itemsize = 1;
    paddle_vertex_index_buffer.numItems = num_paddle_indices;

    paddle_vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paddle_vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paddle_colors), gl.STATIC_DRAW);
    paddle_vertex_color_buffer.itemSize = 4;
    paddle_vertex_color_buffer.numItems = num_paddle_colors;

    // Initialize Pad
    pad_vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pad_vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pad_vertices), gl.STATIC_DRAW);
    pad_vertex_position_buffer.itemSize = 3;
    pad_vertex_position_buffer.numItems = num_pad_vertices;

    pad_vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pad_vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pad_indices), gl.STATIC_DRAW);
    pad_vertex_index_buffer.itemsize = 1;
    pad_vertex_index_buffer.numItems = num_pad_indices;

    pad_vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pad_vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pad_colors), gl.STATIC_DRAW);
    pad_vertex_color_buffer.itemSize = 4;
    pad_vertex_color_buffer.numItems = num_pad_colors;

    // Initialize Ball
    ball_vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ball_vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ball_vertices), gl.STATIC_DRAW);
    ball_vertex_position_buffer.itemSize = 3;
    ball_vertex_position_buffer.numItems = num_ball_vertices;

    ball_vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ball_vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ball_colors), gl.STATIC_DRAW);
    ball_vertex_color_buffer.itemSize = 4;
    ball_vertex_color_buffer.numItems = num_ball_colors;

    // Initialize Paddle
    wall_vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wall_vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wall_vertices), gl.STATIC_DRAW);
    wall_vertex_position_buffer.itemSize = 3;
    wall_vertex_position_buffer.numItems = num_wall_vertices;

    wall_vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wall_vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(wall_indices), gl.STATIC_DRAW);
    wall_vertex_index_buffer.itemsize = 1;
    wall_vertex_index_buffer.numItems = num_wall_indices;

    wall_vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wall_vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wall_colors), gl.STATIC_DRAW);
    wall_vertex_color_buffer.itemSize = 4;
    wall_vertex_color_buffer.numItems = num_wall_colors;

}

function drawPaddle(matrix) {
    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, paddle_vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, paddle_vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, paddle_vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, paddle_vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, paddle_vertex_index_buffer);
    gl.drawElements(gl.TRIANGLES, num_paddle_indices, gl.UNSIGNED_SHORT, 0);
}

function drawPad(matrix) {
    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, pad_vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pad_vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pad_vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pad_vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pad_vertex_index_buffer);
    gl.drawElements(gl.TRIANGLES, num_pad_indices, gl.UNSIGNED_SHORT, 0);
}

function drawBall(matrix) {
    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, ball_vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, ball_vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ball_vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, ball_vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw arrays - triangle Fan
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ball_vertex_index_buffer);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, ball_vertex_position_buffer.numItems);
}

function drawWall(matrix) {
    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, wall_vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, wall_vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, wall_vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, wall_vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wall_vertex_index_buffer);
    gl.drawElements(gl.TRIANGLES, num_wall_indices, gl.UNSIGNED_SHORT, 0);
}

function webGLStart() {
    var canvas = document.getElementById("lab2-canvas");
    initGL(canvas);
    initShaders();

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    $(document).keydown(keypressHandler);

    initializePad();
    initializePaddle();
    initializeBall();
    initializeWall();
    drawScene();
    updateScore(score);
}

//Draws the scene a single time
function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initBuffers();

    var model_1 = mat4.create();
    mat4.identity(model_1);
    model_1 = mat4.multiply(model_1, mv_paddle_matrix);
    drawPaddle(model_1);

    model_2 = mat4.multiply(model_1, mv_pad_matrix);
    drawPad(model_2);

    var model_3 = mat4.create();
    mat4.identity(model_3);

    model_3 = mat4.multiply(model_3, mv_ball_matrix);
    drawBall(model_3);

    var model_4 = mat4.create();
    mat4.identity(model_4);
    model_4 = mat4.multiply(model_4, mv_wall_matrix);
    drawWall(model_4);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

// Draws the scene at the given FRAMES_PER_SECOND rate.
function drawSceneRecursive(t_now) {

    t_now = t_now * 0.001;
    var t_elapsed = t_now - t_last;
    if (t_elapsed > 1 / FRAMES_PER_SECOND){
        t_last = t_now;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        initBuffers();

        var model_1 = mat4.create();
        mat4.identity(model_1);
        model_1 = mat4.multiply(model_1, mv_paddle_matrix);
        drawPaddle(model_1);

        model_2 = mat4.multiply(model_1, mv_pad_matrix);
        drawPad(model_2);

        var model_3 = mat4.create();
        mat4.identity(model_3);

        calculateBallPosition();
        model_3 = mat4.multiply(model_3, mv_ball_matrix);
        drawBall(model_3);

        var model_4 = mat4.create();
        mat4.identity(model_4);
        model_4 = mat4.multiply(model_4, mv_wall_matrix);
        drawWall(model_4);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

    }
    requestAnimationFrame(drawSceneRecursive);
}
