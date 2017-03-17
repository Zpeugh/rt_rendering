/**
 * Date: 3/15/2017
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
var body = {};
var head = {};
var left_arm = {};
var right_arm = {};
var bottom = {};
var vMatrix = mat4.create();    // view matrix
var mMatrix = mat4.create();    // model matrix
var mvMatrix = mat4.create();   // modelview matrix
var pMatrix = mat4.create();    //projection matrix
var Z_ANGLE = 0.0;
var FOV_ANGLE = 45.0;
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


function drawObject(object, triangle_type) {
    mat4.perspective(FOV_ANGLE, 1.0, 0.1, 100, pMatrix); // set up the projection matrix
    vMatrix = mat4.lookAt([CAMERA_X, CAMERA_Y, 8], [0, 0, 0], [0, 1, 0], mvMatrix); // set up the view matrix, multiply into the modelview matrix

    mat4.identity(mMatrix);
    mMatrix = mat4.rotate(mMatrix, degToRad(Z_ANGLE), [0, 0, 1]); // now set up the model matrix

    mat4.multiply(vMatrix, mMatrix, mvMatrix); // mvMatrix = vMatrix * mMatrix and is the modelview Matrix
    mat4.multiply(mvMatrix, object.matrix, mvMatrix);

    setMatrixUniforms();

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, object.vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    switch (triangle_type){
        case "TRIANGLE_STRIP":
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, object.vertex_position_buffer.numItems);
            break;
        case "TRIANGLES":
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.vertex_index_buffer);
            gl.drawElements(gl.TRIANGLES, object.vertex_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
            break;
        case "TRIANGLE_FAN":
            gl.drawArrays(gl.TRIANGLE_FAN, 0, object.vertex_position_buffer.numItems);
            break;
        default:
            console.log("Invalid triangle_type. Options are TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN");
    }
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

    body = createCube(0,0,0,0.5,BLUE);
    left_arm = createCylinder(0, 0, 0, 0.125, 0.75, GREEN, 50, 100);
    left_arm.matrix = mat4.rotate(left_arm.matrix, degToRad(90), [1, 0, 0]);
    left_arm.matrix = mat4.translate(left_arm.matrix, [0.25, 0.5, -0.2]);

    right_arm = createCylinder(0, 0, 0, 0.125, 0.75, GREEN, 50, 100);
    right_arm.matrix = mat4.rotate(right_arm.matrix, degToRad(90), [1, 0, 0]);
    right_arm.matrix = mat4.translate(right_arm.matrix, [-0.25, 0.5, -0.2]);

    head = createCube(0,0.75,0,0.25,[1,0,0,1]);

    bottom = createSphere(0, -1, 0, 0.5, [1,0,0,1], 50, 100);

    $(document).keydown(keypressHandler);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    drawScene();
}

//Draws the scene a single time
function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawObject(left_arm, "TRIANGLE_STRIP");
    drawObject(right_arm, "TRIANGLE_STRIP");
    drawObject(body, "TRIANGLES");
    drawObject(head, "TRIANGLES");
    drawObject(bottom, "TRIANGLES");
}
