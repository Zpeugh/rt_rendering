/**
 * Date: 2/23/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 3
 * Description: Main file containing all of the public facing
 *              function definitions for lab 2.
 **/

// Initialize all global variables
var gl;
var shaderProgram;
var draw_type = 2;
var cube_vertex_position_buffer, cube_vertex_color_buffer, cube_vertex_index_buffer;
var cube_vertices = [], cube_indices = [], cube_colors = [];
var num_cube_vertices = 0, num_cube_indices = 0, num_cube_colors = 0;
var mv_cube_matrix = mat4.create();
var vMatrix = mat4.create();    // view matrix
var mMatrix = mat4.create();    // model matrix
var mvMatrix = mat4.create();   // modelview matrix
var pMatrix = mat4.create();    //projection matrix
var Z_ANGLE = 45.0;
var FOV_ANGLE = 60.0;
var CAMERA_X = 0;
var CAMERA_Y = 0;

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
    cube_vertices = [];
    cube_indices = [];
    cube_colors = [];
    cube_vertex_position_buffer = {};
    cube_vertex_color_buffer = {};
    cube_vertex_index_buffer = {};
    initBuffers();
}

/////////////////////////  Initialize VBO  /////////////////////////
function initBuffers() {

    // Initialize cube
    cube_vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);
    cube_vertex_position_buffer.itemSize = 3;
    cube_vertex_position_buffer.numItems = num_cube_vertices;

    cube_vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube_vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_indices), gl.STATIC_DRAW);
    cube_vertex_index_buffer.itemsize = 1;
    cube_vertex_index_buffer.numItems = num_cube_indices;

    cube_vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_colors), gl.STATIC_DRAW);
    cube_vertex_color_buffer.itemSize = 4;
    cube_vertex_color_buffer.numItems = num_cube_colors;

}

function drawCube() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cube_vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube_vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cube_vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube_vertex_index_buffer);
    gl.drawElements(gl.TRIANGLES, num_cube_indices, gl.UNSIGNED_SHORT, 0);
}

function webGLStart() {
    var canvas = document.getElementById("lab3-canvas");
    initGL(canvas);
    initShaders();

    gl.enable(gl.DEPTH_TEST);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

    initializeCube();
    initBuffers();

    $(document).keydown(keypressHandler);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    drawScene();
}

//Draws the scene a single time
function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(FOV_ANGLE, 1.0, 0.1, 100, pMatrix); // set up the projection matrix

    vMatrix = mat4.lookAt([0, 0, 5], [CAMERA_X, CAMERA_Y, 0], [0, 1, 0], mvMatrix); // set up the view matrix, multiply into the modelview matrix

    mat4.identity(mMatrix);

    console.log('Z angle = ' + Z_ANGLE);
    mMatrix = mat4.rotate(mMatrix, degToRad(Z_ANGLE), [0, 1, 1]); // now set up the model matrix

    mat4.multiply(vMatrix, mMatrix, mvMatrix); // mvMatrix = vMatrix * mMatrix and is the modelview Matrix

    setMatrixUniforms();

    drawCube();
}
