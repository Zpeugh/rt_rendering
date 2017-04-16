/**
 * Date: 4/9/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 4
 * Description: Main file containing all of the public facing
 *              function definitions for lab 4.
 **/

// Initialize all global variables
var Z_ANGLE = 0.0;
var FOV_ANGLE = 45.0;
var CAMERA_X = 0;
var CAMERA_Y = 0;
var CAMERA_Z = 5;
var LIGHT_X = 0;
var LIGHT_Y = 5;
var LIGHT_Z = 0;
const LIGHTGREY = [0.9, 0.9, 0.9, 1];
const WHITE = [1, 1, 1, 1];
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
var vMatrix = mat4.create();    // view matrix
var mMatrix = mat4.create();    // model matrixs
var mvMatrix = mat4.create();   // modelview matrix
var pMatrix = mat4.create();    // projection matrix
var nMatrix = mat4.create();    // normal matrix
var v2wMatrix = mat4.create();  // eye space to world space matrix
var light_pos = [LIGHT_X, LIGHT_Y, LIGHT_Z, 1]; // world space position
var ambient_color = WHITE;
var diffuse_color = WHITE;
var specular_color = WHITE;
var light_intensity = 1;
var rustyTexture;
var corrugatedTexture;
var textures = [];
var cube_map_texture = {};

const RESOURCE_LOCATION = "./resources/";

function initTextures() {
    rustyTexture = gl.createTexture();
    rustyTexture.image = new Image();
    rustyTexture.image.src = RESOURCE_LOCATION + "rusty_metal.png";
    rustyTexture.image.onload = function() { handleTextureLoaded(rustyTexture); }
}

function loadImage(location, callback){
    var image = new Image();
    image.src = location;
    image.onload = callback;
    return image;
}

function loadImages(locations, callback){
    var numImages = locations.length;
    var images = [];

    var onLoad = function(){
        numImages--;

        if (numImages == 0){
            callback(images);
        }
    };

    for (var i = 0; i < numImages; ++i) {
        var img = loadImage(locations[i], onLoad);
        images.push(img);
    }
}

function handleImagesLoaded(images){
    var numImages = images.length;
    for (var i = 0; i < numImages; i++){
        var texture = gl.createTexture();
        texture.image = images[i];
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        // gl.bindTexture(gl.TEXTURE_2D, null);
        textures.push(texture);
    }
}

function handleTextureLoaded(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log("Loaded rusty texture");
}

function handleCubeMapImagesLoaded(images){
    cube_map_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cube_map_texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		  images[0]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		  images[1]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		  images[2]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		  images[3]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		  images[4]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		  images[5]);

    drawScene();

    console.log("Loaded Cube Map", cube_map_texture);
}

function initJSON() {
    var request = new  XMLHttpRequest();
    request.open("GET", "resources/teapot.json");
    request.onreadystatechange =
      function () {
          if (request.readyState == 4) {
	      console.log("state ="+request.readyState);
              handleLoadedTeapot(JSON.parse(request.responseText));
        }
      }
    request.send();
}


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

    gl.uniform4f(shaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]);
    gl.uniform4f(shaderProgram.ambient_coefUniform, object.ambient_coef, object.ambient_coef, object.ambient_coef, 1.0);
    gl.uniform4f(shaderProgram.diffuse_coefUniform, object.diffuse_coef, object.diffuse_coef, object.diffuse_coef, 1.0);
    gl.uniform4f(shaderProgram.specular_coefUniform, object.specular_coef, object.specular_coef, object.specular_coef, 1.0);
    gl.uniform1f(shaderProgram.shininessUniform, object.shininess);
    gl.uniform1f(shaderProgram.light_intensityUniform, light_intensity);
    gl.uniform4f(shaderProgram.ambient_colorUniform, ambient_color[0], ambient_color[1], ambient_color[2], 1.0);
    gl.uniform4f(shaderProgram.diffuse_colorUniform, diffuse_color[0], diffuse_color[1], diffuse_color[2], 1.0);
    gl.uniform4f(shaderProgram.specular_colorUniform, specular_color[0], specular_color[1], specular_color[2], 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object.vertex_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

    if (object.vertex_color_buffer){
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_color_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, object.vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.uniform1i(shaderProgram.use_textureUniform, 0);

    } else if (object.vertex_texture_coord_buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexTextureCoordAttribute, object.vertex_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.uniform1i(shaderProgram.use_textureUniform, 1);
        shaderProgram.textureUniform = gl.getUniformLocation(shaderProgram, "texture");

    } else {
        console.log("Using cube map");
        gl.activeTexture(gl.TEXTURE0);                          // set texture unit 1 to use
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cube_map_texture);  // bind the texture object to the texture unit
        gl.uniform1i(shaderProgram.cube_mapUniform, 0);         // pass the textu
        gl.uniform1i(shaderProgram.use_textureUniform, 2);
    }

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
    var ambient = 0.4;
    var diffuse = 0.5;
    var spec = 0.5;
    var shine = 64;
    var color = LIGHTGREY;
    floor = createPlane(0,0,0,8,0.15,8,color,ambient,diffuse,spec,shine);
    // right_wall = createPlane(7.85,4,0,0.15,4,8,color,ambient,diffuse,spec,shine);
    // left_wall = createPlane(-7.85,4,0,0.15,4,8,color,ambient,diffuse,spec,shine);
    // back_wall = createPlane(0,4,-8,8,4,0.15,color,ambient,diffuse,spec,shine);
}

function initializeRobot(x, y, z){
    var ambient = 0.4;
    var diffuse = 0.5;
    var spec = 0.5;
    var shine = 50;
    body = createCube(x+0,y+1.5,z,0.5,BLUE,ambient,diffuse,spec,shine);
    left_arm = createCylinder(x+-0.25, y+1.5, z+0.45, 0.1, 0.75, GREEN, 50, 100,ambient,diffuse,spec,shine);
    right_arm = createCylinder(x+0.25, y+1.5, z+0.45, 0.1, 0.75, GREEN, 50, 100,ambient,diffuse,spec,shine);
    head = createCube(x+0,y+2.25,z,0.25,[1,0,0,1],ambient,diffuse,spec,shine);
    bottom = createSphere(x+0, y+0.5, z, 0.5, [1,0,0,1], 50, 100,ambient,diffuse,spec,shine);
}


function webGLStart() {
    var canvas = document.getElementById("lab4-canvas");
    initGL(canvas);
    initShaders();
    // initTextures();

    loadImages([
        RESOURCE_LOCATION + "posx.jpg",
        RESOURCE_LOCATION + "negx.jpg",
        RESOURCE_LOCATION + "posy.jpg",
        RESOURCE_LOCATION + "negy.jpg",
        RESOURCE_LOCATION + "posz.jpg",
        RESOURCE_LOCATION + "negz.jpg",
    ], handleCubeMapImagesLoaded);


    gl.enable(gl.DEPTH_TEST);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.vertexTextureCoordAttribute = gl.getAttribLocation(shaderProgram, "aVertexTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.vertexTextureCoordAttribute);

    shaderProgram.use_textureUniform = gl.getUniformLocation(shaderProgram, "use_texture");
    shaderProgram.cube_mapUniform = gl.getUniformLocation(shaderProgram, "cube_map");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.v2wMatrixUniform = gl.getUniformLocation(shaderProgram, "uV2WMatrix");
    shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
    shaderProgram.light_intensityUniform = gl.getUniformLocation(shaderProgram, "light_intensity");
    shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");
    shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
    shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
    shaderProgram.shininessUniform = gl.getUniformLocation(shaderProgram, "shininess");
    shaderProgram.ambient_colorUniform = gl.getUniformLocation(shaderProgram, "ambient_color");
    shaderProgram.diffuse_colorUniform = gl.getUniformLocation(shaderProgram, "diffuse_color");
    shaderProgram.specular_colorUniform = gl.getUniformLocation(shaderProgram, "specular_color");

    light_bulb = createSphere(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.15, WHITE, 50, 100, 1, 1, 1, 1);
    initializeRoom();
    initializeRobot(0,0,0);

    // $(document).keydown(keypressHandler);
    // document.onkeydown(keypressHandler);
    document.addEventListener("keydown", keypressHandler, false);
    document.addEventListener('mousedown', onDocumentMouseDown,
          false);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // drawScene();
}

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // mvMatrix = setMVmatrix();
    // drawObject(light_bulb, "TRIANGLES");
    // mvMatrix = setMVmatrix();
    // drawObject(floor, "TRIANGLES");
    // mvMatrix = setMVmatrix();
    // drawObject(right_wall, "TRIANGLES");
    // mvMatrix = setMVmatrix();
    // drawObject(left_wall, "TRIANGLES");
    // mvMatrix = setMVmatrix();
    // drawObject(back_wall, "TRIANGLES");
    mvMatrix = setMVmatrix();

    mat4.identity(v2wMatrix);
    v2wMatrix = mat4.multiply(v2wMatrix, vMatrix);
    v2wMatrix = mat4.inverse(v2wMatrix);
    v2wMatrix = mat4.transpose(v2wMatrix);

    drawObject(bottom, "TRIANGLES");

    // gl.activeTexture(gl.TEXTURE0);   // set texture unit 0 to use
    // gl.bindTexture(gl.TEXTURE_2D, rustyTexture);    // bind the texture object to the texture unit
    // gl.uniform1i(gl.getUniformLocation(shaderProgram, 'texture'), 0);   // pass the texture unit to the shader
    // drawObject(body, "TRIANGLES");
    // drawObject(head, "TRIANGLES");
    // mvMatrix = setMVmatrix();
    // drawObject(left_arm, "TRIANGLES");
    // drawObject(right_arm, "TRIANGLES");
}