/**
 * Date: 2/12/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 2
 * Description: Main file containing all of the public facing
 *              function definitions for the bar chart WebGL program
 **/
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const UP = 38;
const SPACE = 19;
const ENTER = 13;
var X_SPEED = 0.08;
var Y_SPEED = 0.07;
var gl;
var shaderProgram;
var draw_type = 2;
var paddle_vertex_position_buffer;
var paddle_vertex_color_buffer;
var paddle_vertex_index_buffer;
var pad_vertex_position_buffer;
var pad_vertex_color_buffer;
var pad_vertex_index_buffer;
var paddle_vertices = [];
var paddle_indices = [];
var paddle_colors = [];
var pad_vertices = [];
var pad_indices = [];
var pad_colors = [];
var num_paddle_vertices = 0;
var num_paddle_indices = 0;
var num_paddle_colors = 0;
var num_pad_vertices = 0;
var num_pad_indices = 0;
var num_pad_colors = 0;
var mv_paddle_matrix;
var mv_pad_matrix;

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
    paddle_vertex_position_buffer = {};
    paddle_vertex_color_buffer = {};
    paddle_vertex_index_buffer = {};
    pad_vertex_position_buffer = {};
    pad_vertex_color_buffer = {};
    pad_vertex_index_buffer = {};
    initBuffers();
}

////////////////    Initialize VBO  ////////////////////////
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

    num_paddle_vertices = 4;
    num_paddle_indices = 6;
    num_paddle_colors = 4;
    num_pad_vertices = 8;
    num_pad_indices = 12;
    num_pad_colors = 8;
    initializePad();
    initializePaddle();
    drawScene();
}

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initBuffers();

    var Mstack = [];

    var model_1 = mat4.create();
    mat4.identity(model_1);
    model_1 = mat4.multiply(model_1, mv_paddle_matrix);
    drawPaddle(model_1);

    // Mstack.push(model);
    model_2 = mat4.multiply(model_1, mv_pad_matrix);
    drawPad(model_2);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}


// Start moving the pong ball
function begin() {
    console.log("beginning");
}
