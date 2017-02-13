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
var X_TRANSLATION = 0.05;
var Y_TRANSLATION = 0.07;
var gl;
var shaderProgram;
var draw_type = 2;
var square_vertex_position_buffer;
var square_vertex_color_buffer;
var square_vertex_index_buffer;
var vertices = [];
var indices = [];
var colors = [];
var num_vertices = 0;
var num_indices = 0;
var num_colors = 0;
var mv_paddle_matrix;

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
    vertices = [];
    indices = [];
    colors = [];
    square_vertex_position_buffer = {};
    square_vertex_color_buffer = {};
    square_vertex_index_buffer = {};
    initBuffers();
}

////////////////    Initialize VBO  ////////////////////////
function initBuffers() {

    square_vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square_vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    square_vertex_position_buffer.itemSize = 3;
    square_vertex_position_buffer.numItems = num_vertices;

    square_vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    square_vertex_index_buffer.itemsize = 1;
    square_vertex_index_buffer.numItems = num_indices;

    square_vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square_vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    square_vertex_color_buffer.itemSize = 4;
    square_vertex_color_buffer.numItems = num_colors;
}

function drawPaddle(matrix) {

    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, square_vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, square_vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, square_vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, square_vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_vertex_index_buffer);
    gl.drawElements(gl.TRIANGLES, num_indices, gl.UNSIGNED_SHORT, 0);
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

    initializePaddle();

    drawScene();
}

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var model = mat4.create();
    mat4.identity(model);

    model = mat4.multiply(model, mv_paddle_matrix);

    initBuffers();

    drawPaddle(model);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}


// Start moving the pong ball
function begin() {
    console.log("beginning");
}
