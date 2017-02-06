/**
 * Date: 1/31/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 1
 * Desciption: Main file for lab
 **/

const SETOSA = "setosa";
const VERSI = "versicolor";
const VIRG = "virginica";
const ALL = "all";
const TUFTS_BLUE = [0.274,0.533,0.7725,1];
const CARMINE_PINK = [0.9137,0.3098,0.2156,1];
const VERDIGRIS = [0.267,0.733,0.6431,1];
var gl;
var shaderProgram;
var draw_type = 2;
var square_vertex_position_buffer;
var square_vertex_color_buffer;
var square_vertex_index_buffer;
var vertices = [];
var indices = [];
var colors = [];
var num_vertices;
var num_indices;
var num_colors;

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


///////////////////////////////////////////////////////////////

function clearCanvas(){
    vertices = [];
    indices = [];
    colors = [];
    square_vertex_position_buffer = {};
    square_vertex_color_buffer = {};
    square_vertex_index_buffer = {};
    initBuffers();
}

function addBar(h_offset, bottom, scaled_value, width, bar_num, color_arr){
    vertices.push(-1 + h_offset + width);  //x- top right
    vertices.push(scaled_value);  //y- top right
    vertices.push(0.0); //z- top right
    vertices.push(-1 + h_offset);  //x- top left
    vertices.push(scaled_value);  //y- top left
    vertices.push(0.0); //z- top left
    vertices.push(-1 + h_offset);  //x- bottom right
    vertices.push(bottom);  //y- bottom right
    vertices.push(0.0); //z- bottom right
    vertices.push(-1 + h_offset + width);  //x- bottom left
    vertices.push(bottom);  //y- bottom left
    vertices.push(0.0); //z-bottom left

    indices.push(0 + bar_num * 4);
    indices.push(1 + bar_num * 4);
    indices.push(2 + bar_num * 4);
    indices.push(0 + bar_num * 4);
    indices.push(2 + bar_num * 4);
    indices.push(3 + bar_num * 4);

    for (var i = 0; i < 4; i++){
        colors = colors.concat(color_arr);
    }
}

function createBarChart(key) {
    var avgs = data[key + "_avgs"];
    var color = getColorFromKey(key);
    var num_bars = avgs.length;
    num_vertices = num_bars * 4;
    num_indices = num_bars * 6;
    num_colors = num_vertices;
    var x_start = 0;
    var y_start = -1;
    var bar_width = 0.2;
    var left_margin = 0.25;
    var spacing = (2 - left_margin - num_bars * bar_width) / num_bars;
    var min = minimum(avgs);
    var max = maximum(avgs);
    scaled_avgs = scaleValues(avgs, min, max);

    for (var i = 0; i < num_bars; i++) {
        x_start = i * (bar_width + spacing) + left_margin;
        addBar(x_start, y_start, scaled_avgs[i], bar_width, i, color);
    }

    initBuffers();
    drawScene();
}

function createAllBarCharts(){
    var combined = data.setosa_avgs.concat(data.versicolor_avgs.concat(data.virginica_avgs));
    var max = maximum(combined);
    var min = minimum(combined);
    scaled_setosa = scaleValues(data.setosa_avgs, min, max);
    scaled_versicolor = scaleValues(data.versicolor_avgs, min, max);
    scaled_virginica = scaleValues(data.virginica_avgs, min, max);
    var num_bars = combined.length;
    num_vertices = num_bars * 4;
    num_indices = num_bars * 6;
    num_colors = num_vertices;
    var y_start = -1;
    var bar_width = 0.2 / 3;
    var left_margin = 0.25;
    var spacing = (2 - left_margin - num_bars * bar_width) / num_bars;
    var x_start = left_margin;
    var category_spacing = (2 - left_margin) / 4;

    for (var i = 0; i < 4; i++){
        addBar(x_start, y_start, scaled_setosa[i], bar_width, i*3, getColorFromKey(SETOSA));
        addBar(x_start + bar_width, y_start, scaled_versicolor[i], bar_width, i*3 + 1, getColorFromKey(VERSI));
        addBar(x_start + 2 * bar_width, y_start, scaled_virginica[i], bar_width, i*3 + 2, getColorFromKey(VIRG));
        x_start += category_spacing;
    }

    initBuffers();
    drawScene();
}

function chartTitle(title){
    $('#chart-title').text(title);
}

function drawChart(type){
    clearCanvas();
    if (type.toLowerCase() === ALL){
        console.log("drawing All");
        calculateAverages(SETOSA);
        calculateAverages(VERSI);
        calculateAverages(VIRG);
        createAllBarCharts();
    } else {
        calculateAverages(type);
        createBarChart(type);
    }
    chartTitle(type.charAt(0).toUpperCase() + type.slice(1) + " Averages");
}

function drawSetosaAverages() {
    drawChart(SETOSA);
}

function drawVersicolorAverages() {
    drawChart(VERSI);
}

function drawVirginicaAverages() {
    drawChart(VIRG);
}

function drawAllAverages() {
    drawChart(ALL);
}

function clearScreen(){
    clearCanvas();
    drawScene();
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


function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, square_vertex_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, square_vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, square_vertex_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, square_vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_vertex_index_buffer);

    gl.drawElements(gl.TRIANGLES, num_indices, gl.UNSIGNED_SHORT, 0);

}


function webGLStart() {
    var canvas = document.getElementById("lab1-canvas");
    initGL(canvas);
    initShaders();

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
}
