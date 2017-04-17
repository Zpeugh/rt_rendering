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
var FOV_ANGLE = 80.0;
var CAMERA_X = 0;
var CAMERA_Y = -21;
var CAMERA_Z = 0;
var LIGHT_X = 0;
var LIGHT_Y = 5;
var LIGHT_Z = 0;
const LIGHTGREY = [0.9, 0.9, 0.9, 1];
const WHITE = [1, 1, 1, 1];
var gl;
var shader_program;
var cube_map_shader_program;
var texture_map_shader_program;
var draw_type = 2;
var square = {};
var env_neg_y = {};
var env_pos_y = {};
var env_neg_x = {};
var env_pos_x = {};
var env_pos_z = {};
var env_neg_z = {};
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
var center_of_interest = [-10,-30,-12];
var cube_map_texture = {};
var movement_matrix = mat4.create();

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
    var num_images = locations.length;
    var images = [];

    var onLoad = function(){
        num_images--;

        if (num_images == 0){
            callback(images);
        }
    };

    for (var i = 0; i < num_images; ++i) {
        var img = loadImage(locations[i], onLoad);
        images.push(img);
    }
}

function handleImagesLoaded(images){
    var num_images = images.length;
    for (var i = 0; i < num_images; i++){
        var texture = gl.createTexture();
        texture.image = images[i];
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        textures.push(texture);
    }

    drawScene();

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
        mat4.perspective(FOV_ANGLE, 1.0, 0.1, 500, pMatrix); // set up the projection matrix
        vMatrix = mat4.lookAt([CAMERA_X, CAMERA_Y, CAMERA_Z], center_of_interest, [0, 1, 0], mvMatrix); // set up the view matrix, multiply into the modelview matrix

        mat4.identity(mMatrix);
        mMatrix = mat4.rotate(mMatrix, degToRad(Z_ANGLE), [0, 0, 1]); // now set up the model matrix

        mat4.multiply(vMatrix, mMatrix, mvMatrix); // mvMatrix = vMatrix * mMatrix and is the modelview Matrix
        return mvMatrix;
}

function drawObject(object, triangle_type, draw_type) {

    mat4.multiply(mvMatrix, object.matrix, mvMatrix);
    setMatrixUniforms();

    gl.uniform4f(shader_program.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]);
    gl.uniform4f(shader_program.ambient_coefUniform, object.ambient_coef, object.ambient_coef, object.ambient_coef, 1.0);
    gl.uniform4f(shader_program.diffuse_coefUniform, object.diffuse_coef, object.diffuse_coef, object.diffuse_coef, 1.0);
    gl.uniform4f(shader_program.specular_coefUniform, object.specular_coef, object.specular_coef, object.specular_coef, 1.0);
    gl.uniform1f(shader_program.shininessUniform, object.shininess);
    gl.uniform1f(shader_program.light_intensityUniform, light_intensity);
    gl.uniform4f(shader_program.ambient_colorUniform, ambient_color[0], ambient_color[1], ambient_color[2], 1.0);
    gl.uniform4f(shader_program.diffuse_colorUniform, diffuse_color[0], diffuse_color[1], diffuse_color[2], 1.0);
    gl.uniform4f(shader_program.specular_colorUniform, specular_color[0], specular_color[1], specular_color[2], 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_position_buffer);
    gl.vertexAttribPointer(shader_program.vertexPositionAttribute, object.vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_normal_buffer);
    gl.vertexAttribPointer(shader_program.vertexNormalAttribute, object.vertex_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

    if (draw_type == 0){
        console.log("Draw type: 0");
        gl.uniform1i(shader_program.use_textureUniform, draw_type);
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_color_buffer);
        gl.vertexAttribPointer(shader_program.vertexColorAttribute, object.vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    } else if (draw_type == 1) {
        console.log("Draw type: 1");
        gl.uniform1i(shader_program.use_textureUniform, draw_type);
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertex_texture_coord_buffer);
        gl.vertexAttribPointer(shader_program.vertexTextureCoordAttribute, object.vertex_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);
    } else if (draw_type == 2){
        console.log("Draw type: 2");
        gl.uniform1i(shader_program.use_textureUniform, draw_type);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cube_map_texture);  // bind the texture object to the texture unit
    }

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
    var x = 0;
    var y = 0
    var z = 0;
    side_length = 30;
    env_pos_x = createEnvironmentCubeFace(x, y, z, side_length, "RIGHT");
    env_neg_x = createEnvironmentCubeFace(x, y, z, side_length, "LEFT");
    env_pos_y = createEnvironmentCubeFace(x, y, z, side_length, "TOP");
    env_neg_y = createEnvironmentCubeFace(x, y, z, side_length, "BOTTOM");
    env_pos_z = createEnvironmentCubeFace(x, y, z, side_length, "BACK");
    env_neg_z = createEnvironmentCubeFace(x, y, z, side_length, "FRONT");
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

function switchShader(newShader){
    gl.useProgram(newShader);
    shader_program = newShader;
    initializeShaderVariables();
}

function webGLStart() {
    var canvas = document.getElementById("lab4-canvas");
    initGL(canvas);
    initShaders();
    gl.useProgram(texture_map_shader_program);
    shader_program = texture_map_shader_program;
    initializeShaderVariables();
    // initTextures();

    loadImages([
        RESOURCE_LOCATION + "cubemap1/posx.png",
        RESOURCE_LOCATION + "cubemap1/negx.png",
        RESOURCE_LOCATION + "cubemap1/posy.png",
        RESOURCE_LOCATION + "cubemap1/negy.png",
        RESOURCE_LOCATION + "cubemap1/posz.png",
        RESOURCE_LOCATION + "cubemap1/negz.png",
    ], handleCubeMapImagesLoaded);


    loadImages([
        RESOURCE_LOCATION + "cubemap1/posx.png",
        RESOURCE_LOCATION + "cubemap1/negx.png",
        RESOURCE_LOCATION + "cubemap1/posy.png",
        RESOURCE_LOCATION + "cubemap1/negy.png",
        RESOURCE_LOCATION + "cubemap1/posz.png",
        RESOURCE_LOCATION + "cubemap1/negz.png",
        RESOURCE_LOCATION + "rusty_metal.png",
        RESOURCE_LOCATION + "metal_spiral.png"
    ], handleImagesLoaded);

    mat4.identity(movement_matrix);

    gl.enable(gl.DEPTH_TEST);

    light_bulb = createSphere(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.15, WHITE, 50, 100, 1, 1, 1, 1);
    initializeRoom();
    initializeRobot(center_of_interest[0], center_of_interest[1], center_of_interest[2]);


    document.addEventListener('keydown', keypressHandler, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

}

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // mvMatrix = setMVmatrix();
    // drawObject(light_bulb, "TRIANGLES");
    switchShader(texture_map_shader_program);

    mvMatrix = setMVmatrix();

    gl.activeTexture(gl.TEXTURE0);                      // set texture unit 0 to use
    gl.uniform1i(shader_program.textureUniform, 0);      // pass the texture unit to the shader
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);        // bind the texture object to the texture unit

    drawObject(env_pos_x, "TRIANGLES", 1);

    gl.activeTexture(gl.TEXTURE1);                      // set texture unit 0 to use
    gl.uniform1i(shader_program.textureUniform, 1);      // pass the texture unit to the shader
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);        // bind the texture object to the texture unit

    drawObject(env_neg_x, "TRIANGLES", 1);

    gl.activeTexture(gl.TEXTURE2);                      // set texture unit 0 to use
    gl.uniform1i(shader_program.textureUniform, 2);      // pass the texture unit to the shader
    gl.bindTexture(gl.TEXTURE_2D, textures[2]);        // bind the texture object to the texture unit

    drawObject(env_pos_y, "TRIANGLES", 1);

    gl.activeTexture(gl.TEXTURE3);                      // set texture unit 0 to use
    gl.uniform1i(shader_program.textureUniform, 3);      // pass the texture unit to the shader
    gl.bindTexture(gl.TEXTURE_2D, textures[3]);        // bind the texture object to the texture unit

    drawObject(env_neg_y, "TRIANGLES", 1);

    gl.activeTexture(gl.TEXTURE4);                      // set texture unit 0 to use
    gl.uniform1i(shader_program.textureUniform, 4);      // pass the texture unit to the shader
    gl.bindTexture(gl.TEXTURE_2D, textures[4]);        // bind the texture object to the texture unit

    drawObject(env_pos_z, "TRIANGLES", 1);

    gl.activeTexture(gl.TEXTURE5);                      // set texture unit 0 to use
    gl.uniform1i(shader_program.textureUniform, 5);      // pass the texture unit to the shader
    gl.bindTexture(gl.TEXTURE_2D, textures[5]);        // bind the texture object to the texture unit

    drawObject(env_neg_z, "TRIANGLES", 1);

    gl.activeTexture(gl.TEXTURE6);                      // set texture unit 0 to use
    gl.bindTexture(gl.TEXTURE_2D, textures[6]);        // bind the texture object to the texture unit
    gl.uniform1i(shader_program.textureUniform, 6);      // pass the texture unit to the shader
    drawObject(body, "TRIANGLES", 1);
    drawObject(head, "TRIANGLES", 1);
    // drawObject(body, "TRIANGLES", 1);
    //
    // gl.activeTexture(gl.TEXTURE7);                      // set texture unit 0 to use
    // gl.bindTexture(gl.TEXTURE_2D, textures[7]);        // bind the texture object to the texture unit
    // gl.uniform1i(shader_program.textureUniform, 7);      // pass the texture unit to the shader
    //
    // drawObject(head, "TRIANGLES", 1);
    // mvMatrix = setMVmatrix();



    switchShader(cube_map_shader_program);
    mvMatrix = mat4.multiply(mvMatrix, movement_matrix);

    mat4.identity(v2wMatrix);
    v2wMatrix = mat4.multiply(v2wMatrix, vMatrix);
    v2wMatrix = mat4.multiply(v2wMatrix, movement_matrix);
    v2wMatrix = mat4.inverse(v2wMatrix);
    v2wMatrix = mat4.transpose(v2wMatrix);
    //
    gl.activeTexture(gl.TEXTURE1);   // set texture unit 0 to use
    gl.bindTexture(gl.TEXTURE_2D, cube_map_texture);    // bind the texture object to the texture unit
    gl.uniform1i(shader_program.cube_mapUniform, 1);         // pass the textu

    // mvMatrix = mat4.rotate(mvMatrix, degToRad(90), [0, 1, 0]);
    drawObject(bottom, "TRIANGLES", 2);
    // drawObject(body, "TRIANGLES", 2);
    // drawObject(head, "TRIANGLES", 2);
    drawObject(left_arm, "TRIANGLES", 2);
    drawObject(right_arm, "TRIANGLES", 2);

}
