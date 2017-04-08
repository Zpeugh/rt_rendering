/**
 * Date: 3/15/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 3
 * Description: Main file containing all of the public facing
 *              function definitions for lab 2.
 **/

// Initialize all global variables
var Z_ANGLE = 0.0;
var FOV_ANGLE = 45.0;
var CAMERA_X = 0;
var CAMERA_Y = 18;
var CAMERA_Z = 25;
var LIGHT_X = 0;
var LIGHT_Y = 5;
var LIGHT_Z = 0;
const LIGHTGREY = [0.9, 0.9, 0.9, 1];
const WHITE = [1, 1, 1, 1];
const POS_X = 1;
const POS_Z = 2;
const NEG_X = 3;
const NEG_Z = 4;
var DIRECTION = POS_X;
var gl;
var shaderProgram;
var draw_type = 2;
var square = {};
var floor = {};
var left_wall = {};
var right_wall = {};
var back_wall = {};
var body = {};
var head = {};
var left_arm = {};
var right_arm = {};
var bottom = {};
var light_bulb = {};
var movementMatrix = mat4.create();
var vMatrix = mat4.create();    // view matrix
var mMatrix = mat4.create();    // model matrixs
var mvMatrix = mat4.create();   // modelview matrix
var pMatrix = mat4.create();    // projection matrix
var nMatrix = mat4.create();    // normal matrix
var light_pos = [LIGHT_X, LIGHT_Y, LIGHT_Z, 1]; // world space position
var ambient_color = WHITE;
var diffuse_color = WHITE;
var specular_color = WHITE;
var mat_ambient = [0.4, 0.4, 0.4, 1];
var mat_diffuse = [0.4, 0.4, 0.4, 1];
var mat_specular = [.2, .2, .2, 1];
var shininess = 64;


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

function setMVmatrix(){
        mat4.perspective(FOV_ANGLE, 1.0, 0.1, 100, pMatrix); // set up the projection matrix
        vMatrix = mat4.lookAt([CAMERA_X, CAMERA_Y, CAMERA_Z], [0, 0, 0], [0, 1, 0], mvMatrix); // set up the view matrix, multiply into the modelview matrix

        mat4.identity(mMatrix);
        mMatrix = mat4.rotate(mMatrix, degToRad(Z_ANGLE), [0, 0, 1]); // now set up the model matrix

        mat4.multiply(vMatrix, mMatrix, mvMatrix); // mvMatrix = vMatrix * mMatrix and is the modelview Matrix
        return mvMatrix;
}

function drawObject(object, triangle_type) {

    mat4.multiply(mvMatrix, object.matrix, mvMatrix);

    // shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
    gl.uniform4f(shaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]);
    gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0);
    gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0);
    gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2], 1.0);
    gl.uniform1f(shaderProgram.shininessUniform, shininess);

    gl.uniform4f(shaderProgram.ambient_colorUniform, ambient_color[0], ambient_color[1], ambient_color[2], 1.0);
    gl.uniform4f(shaderProgram.diffuse_colorUniform, diffuse_color[0], diffuse_color[1], diffuse_color[2], 1.0);
    gl.uniform4f(shaderProgram.specular_colorUniform, specular_color[0], specular_color[1], specular_color[2], 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object.vertex_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, object.vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();

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

function initializeRoom(){
    floor = createPlane(0,0,0,8,0.15,8,LIGHTGREY);
    right_wall = createPlane(7.85,4,0,0.15,4,8,LIGHTGREY);
    left_wall = createPlane(-7.85,4,0,0.15,4,8,LIGHTGREY);
    back_wall = createPlane(0,4,-8,8,4,0.15,LIGHTGREY);
}

function initializeRobot(x, y, z){
    body = createCube(x+0,y+1.5,z,0.5,BLUE);
    left_arm = createCylinder(x+-0.25, y+1.5, z+0.45, 0.1, 0.75, GREEN, 50, 100);
    right_arm = createCylinder(x+0.25, y+1.5, z+0.45, 0.1, 0.75, GREEN, 50, 100);
    head = createCube(x+0,y+2.25,z,0.25,[1,0,0,1]);
    bottom = createSphere(x+0, y+0.5, z, 0.5, [1,0,0,1], 50, 100);
}


function webGLStart() {
    var canvas = document.getElementById("lab4-canvas");
    initGL(canvas);
    initShaders();

    gl.enable(gl.DEPTH_TEST);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
    shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");
    shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
    shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
    shaderProgram.shininessUniform = gl.getUniformLocation(shaderProgram, "shininess");
    shaderProgram.ambient_colorUniform = gl.getUniformLocation(shaderProgram, "ambient_color");
    shaderProgram.diffuse_colorUniform = gl.getUniformLocation(shaderProgram, "diffuse_color");
    shaderProgram.specular_colorUniform = gl.getUniformLocation(shaderProgram, "specular_color");

    mat4.identity(movementMatrix);

    light_bulb = createSphere(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.15, WHITE, 50, 100);
    initializeRoom();
    initializeRobot(-4,0,0);

    $(document).keydown(keypressHandler);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    drawScene();
    drawScene();
}

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mvMatrix = setMVmatrix();
    drawObject(light_bulb, "TRIANGLES");
    mvMatrix = setMVmatrix();
    drawObject(floor, "TRIANGLES");
    mvMatrix = setMVmatrix();
    drawObject(right_wall, "TRIANGLES");
    mvMatrix = setMVmatrix();
    drawObject(left_wall, "TRIANGLES");
    mvMatrix = setMVmatrix();
    drawObject(back_wall, "TRIANGLES");
    mvMatrix = setMVmatrix();
    drawObject(bottom, "TRIANGLES");
    drawObject(body, "TRIANGLES");
    drawObject(head, "TRIANGLES");
    drawObject(left_arm, "TRIANGLES");
    drawObject(right_arm, "TRIANGLES");
}
