/**
 * Date: 3/15/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 3
 * Description: Javascript file used to create objects for lab 3.
 **/
const GREEN = [0.329, 0.686, 0.196, 1];
const BLUE = [0.274, 0.533, 0.7725, 1];
var CUBE_COLOR_1 = [0.274, 0.533, 0.9, 1];
var CUBE_COLOR_2 = [0.274, 0.533, 0.65, 1];
const color = [0.329, 0.686, 0.196, 1];
const num_stacks = 100;
const num_slices = 120;
const SPHERE_COLOR = [0.86, 0.12, 0.196, 1];
const SPHERE_RADIUS = 0.5;
const SPHERE_CENTER_Y = 0;
const SPHERE_CENTER_Z = -6;
// const num_slices = 100;
// const num_stacks = 25;
const DEG_IN_CIRCLE = 360;


function createCube(x, y, z, rad, color){
    mat = mat4.create();
    mat4.identity(mat);

    var cube = {
        matrix : mat,
        vertex_position_buffer : {},
        vertex_index_buffer : {},
        vertex_color_buffer : {}
    };

    var vertices = [];
    var indices = [];
    var colors = [];
    var num_vertices = 8;
    var num_indices = 36;
    var num_colors = 8;

    // Draw the vertices
    vertices.push(x + rad);    //x
    vertices.push(y + rad);    //y
    vertices.push(z + -rad);   //z

    vertices.push(x + -rad);   //x
    vertices.push(y + rad);    //y
    vertices.push(z + -rad);   //z

    vertices.push(x + -rad);   //x
    vertices.push(y + -rad);   //y
    vertices.push(z + -rad);   //z

    vertices.push(x + rad);    //x
    vertices.push(y + -rad);   //y
    vertices.push(z + -rad);   //z

    vertices.push(x + rad);    //x
    vertices.push(y + rad);    //y
    vertices.push(z + rad);    //z

    vertices.push(x + -rad);   //x
    vertices.push(y + rad);    //y
    vertices.push(z + rad);    //z

    vertices.push(x + -rad);   //x
    vertices.push(y + -rad);   //y
    vertices.push(z + rad);    //z

    vertices.push(x + rad);    //x
    vertices.push(y + -rad);   //y
    vertices.push(z + rad);    //z

    // Add the vertex indices
    indices = [0, 1, 2, 0, 2, 3, 0, 3, 7, 0, 7, 4, 6, 2, 3, 6, 3, 7,
                    5, 1, 2, 5, 2, 6, 5, 1, 0, 5, 0, 4, 5, 6, 7, 5, 7, 4];
    // Add the vertex colors
    for (var i = 0; i < 8; i++) {
        colors = colors.concat(color);
    }

    // Create Buffer Objects
    cube.vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cube.vertex_position_buffer.itemSize = 3;
    cube.vertex_position_buffer.numItems = num_vertices;

    cube.vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    cube.vertex_index_buffer.itemsize = 1;
    cube.vertex_index_buffer.numItems = num_indices;

    cube.vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cube.vertex_color_buffer.itemSize = 4;
    cube.vertex_color_buffer.numItems = num_colors;


    return cube;
}

// Return a cylinder with the bottom centered at x,y,z
// num_stacks : the resolution of circles
function createCylinder(x, y, z, rad, height, color, num_stacks, num_slices) {
    // Initialize the tranformation matrix
    mat = mat4.create();
    mat4.identity(mat);

    var cylinder = {
        matrix : mat,
        vertex_position_buffer : {},
        vertex_color_buffer : {}
    };

    var vertices = [];
    var colors = [];
    var num_vertices = num_stacks * ((num_slices + 1) * 2);
    var num_colors = num_vertices;

    var slice_increment = DEG_IN_CIRCLE / num_slices;
    var stack_increment = height / num_stacks;
    var vertex_x = x;
    var vertex_y = y;
    var vertex_z = z;
    var index_num = 0;
    var deg = 0;

    for (var j = 0; j < num_stacks; j++) {
        for (var i = 0; i < num_slices + 1; i++) {
            // Using TRIANGLE_STRIP techinique, push outer vertex and center vertex each time.
            vertices.push(vertex_x + rad * Math.cos(degToRad(deg)));
            vertices.push(vertex_y);
            vertices.push(vertex_z + rad * Math.sin(degToRad(deg)));

            vertices.push(x);
            vertices.push(y + stack_increment);
            vertices.push(z);

            colors = colors.concat(color);
            colors = colors.concat(color);
            deg += slice_increment;
        }
        vertex_y += stack_increment;
        deg = 0;
    }

    // Initialize the cylinders vertex and color buffer objects
    cylinder.vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cylinder.vertex_position_buffer.itemSize = 3;
    cylinder.vertex_position_buffer.numItems = num_vertices;

    cylinder.vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cylinder.vertex_color_buffer.itemSize = 4;
    cylinder.vertex_color_buffer.numItems = num_colors;

    return cylinder;
}

function createSphere(x, y, z, rad, color, num_stacks, num_slices) {
    mv_sphere_matrix = mat4.create();
    mat4.identity(mv_sphere_matrix);

    var sphere = {
        matrix : mat,
        vertex_position_buffer : {},
        vertex_index_buffer : {},
        vertex_color_buffer : {},
    };

    var vertices = [];
    var indices = [];
    var colors = [];
    var num_vertices = num_slices + 1;
    var num_indices = num_slices * num_stacks * 6;
    var num_colors = num_slices + 1;

    for (var horizontal_num = 0; horizontal_num <= num_stacks; horizontal_num++) {
        var horizontal_rad = horizontal_num * Math.PI / num_stacks;

        for (var vertical_num = 0; vertical_num <= num_slices; vertical_num++) {
            var vertical_rad = vertical_num * 2 * Math.PI / num_slices;
            var x1 = Math.cos(vertical_rad) * Math.sin(horizontal_rad);
            var y1 = Math.cos(horizontal_rad);
            var z1 = Math.sin(vertical_rad) * Math.sin(horizontal_rad);

            vertices.push(x + rad * x1);
            vertices.push(y + rad * y1);
            vertices.push(z + rad * z1);
            colors = colors.concat(color);
        }
    }

    for (var horizontal_num = 0; horizontal_num < num_stacks; horizontal_num++) {
        for (var vertical_num = 0; vertical_num < num_slices; vertical_num++) {
            var v1 = (horizontal_num * (num_slices + 1)) + vertical_num;
            var v2 = v1 + num_slices + 1;
            indices.push(v1);
            indices.push(v2);
            indices.push(v1 + 1);

            indices.push(v2);
            indices.push(v2 + 1);
            indices.push(v1 + 1);
        }
    }

    sphere.vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    sphere.vertex_position_buffer.itemSize = 3;
    sphere.vertex_position_buffer.numItems = num_vertices;

    sphere.vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    sphere.vertex_index_buffer.itemsize = 1;
    sphere.vertex_index_buffer.numItems = num_indices;

    sphere.vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    sphere.vertex_color_buffer.itemSize = 4;
    sphere.vertex_color_buffer.numItems = num_colors;

    return sphere;
}
