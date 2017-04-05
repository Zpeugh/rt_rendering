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
const SPHERE_COLOR = [0.86, 0.12, 0.196, 1];
const SPHERE_RADIUS = 0.5;
const SPHERE_CENTER_Y = 0;
const SPHERE_CENTER_Z = -6;
const DEG_IN_CIRCLE = 360;


function createSquare(size) {
  mat = mat4.create();
  mat4.identity(mat);

  var square = {
    matrix: mat,
    vertex_position_buffer: {},
    vertex_index_buffer: {},
    vertex_normal_buffer: {},
    vertex_color_buffer: {}
  };

  var vertices = [
    size, size, 0, -size, size, 0, -size, -size, 0,
    size, -size, 0 ];
  var indices = [0, 1, 2, 0, 2, 3];
  var normals = [
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0
  ];
  var colors = [
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0
  ];

  square.vertex_position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, square.vertex_position_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  square.vertex_position_buffer.itemSize = 3;
  square.vertex_position_buffer.numItems = 4;

  square.vertex_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, square.vertex_normal_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  square.vertex_normal_buffer.itemSize = 3;
  square.vertex_normal_buffer.numItems = 4;

  square.vertex_index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square.vertex_index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  square.vertex_index_buffer.itemSize = 1;
  square.vertex_index_buffer.numItems = 6;

  square.vertex_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, square.vertex_color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  square.vertex_color_buffer.itemSize = 4;
  square.vertex_color_buffer.numItems = 4;

  return square;

}




function createPlane(x, y, z, length, width, thickness, color) {
  mat = mat4.create();
  mat4.identity(mat);

  var plane = {
    matrix: mat,
    vertex_position_buffer: {},
    vertex_index_buffer: {},
    vertex_normal_buffer: {},
    vertex_color_buffer: {}
  };

  var vertices = [];
  var indices = [];
  var normals = [];
  var colors = [];
  var num_vertices = 8;
  var num_indices = 36;
  var num_colors = 8;

  // Draw the vertices
  vertices.push(x + width); //x
  vertices.push(y + thickness); //y
  vertices.push(z + -length); //z

  vertices.push(x + -width); //x
  vertices.push(y + thickness); //y
  vertices.push(z + -length); //z

  vertices.push(x + -width); //x
  vertices.push(y + -thickness); //y
  vertices.push(z + -length); //z

  vertices.push(x + width); //x
  vertices.push(y + -thickness); //y
  vertices.push(z + -length); //z

  vertices.push(x + width); //x
  vertices.push(y + thickness); //y
  vertices.push(z + length); //z

  vertices.push(x + -width); //x
  vertices.push(y + thickness); //y
  vertices.push(z + length); //z

  vertices.push(x + -width); //x
  vertices.push(y + -thickness); //y
  vertices.push(z + length); //z

  vertices.push(x + width); //x
  vertices.push(y + -thickness); //y
  vertices.push(z + length); //z

  // Add the vertex indices
  indices = [0, 1, 2, 0, 2, 3, 0, 3, 7, 0, 7, 4, 6, 2, 3, 6, 3, 7,
    5, 1, 2, 5, 2, 6, 5, 1, 0, 5, 0, 4, 5, 6, 7, 5, 7, 4
  ];
  // Add the vertex colors
  for (var i = 0; i < 8; i++) {
    normals.push(0.0);
    normals.push(0.0);
    normals.push(-1.0);
    colors = colors.concat(color);
  }

  // Create Buffer Objects
  plane.vertex_position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertex_position_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  plane.vertex_position_buffer.itemSize = 3;
  plane.vertex_position_buffer.numItems = num_vertices;

  plane.vertex_index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.vertex_index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  plane.vertex_index_buffer.itemSize = 1;
  plane.vertex_index_buffer.numItems = num_indices;

  plane.vertex_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.vertex_normal_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  plane.vertex_normal_buffer.itemSize = 3;
  plane.vertex_normal_buffer.numItems = num_vertices;

  plane.vertex_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertex_color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  plane.vertex_color_buffer.itemSize = 4;
  plane.vertex_color_buffer.numItems = num_colors;


  return plane;
}



function createCube(x, y, z, rad, color) {
  mat = mat4.create();
  mat4.identity(mat);

  var cube = {
    matrix: mat,
    vertex_position_buffer: {},
    vertex_index_buffer: {},
    vertex_normal_buffer: {},
    vertex_color_buffer: {}
  };

  var vertices = [];
  var indices = [];
  var normals = [];
  var colors = [];
  var num_vertices = 8;
  var num_indices = 36;
  var num_colors = num_vertices;

  // Draw the vertices
  vertices.push(x + rad); //x
  vertices.push(y + rad); //y
  vertices.push(z + -rad); //z

  vertices.push(x + -rad); //x
  vertices.push(y + rad); //y
  vertices.push(z + -rad); //z

  vertices.push(x + -rad); //x
  vertices.push(y + -rad); //y
  vertices.push(z + -rad); //z

  vertices.push(x + rad); //x
  vertices.push(y + -rad); //y
  vertices.push(z + -rad); //z

  vertices.push(x + rad); //x
  vertices.push(y + rad); //y
  vertices.push(z + rad); //z

  vertices.push(x + -rad); //x
  vertices.push(y + rad); //y
  vertices.push(z + rad); //z

  vertices.push(x + -rad); //x
  vertices.push(y + -rad); //y
  vertices.push(z + rad); //z

  vertices.push(x + rad); //x
  vertices.push(y + -rad); //y
  vertices.push(z + rad); //z
  normals = [
    // Front face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back face
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top face
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom face
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right face
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left face
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
  ];
  // Add the vertex indices
  indices = [0, 1, 2, 0, 2, 3, 0, 3, 7, 0, 7, 4, 6, 2, 3, 6, 3, 7,
    5, 1, 2, 5, 2, 6, 5, 1, 0, 5, 0, 4, 5, 6, 7, 5, 7, 4
  ];
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
  cube.vertex_index_buffer.itemSize = 1;
  cube.vertex_index_buffer.numItems = num_indices;

  cube.vertex_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertex_normal_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  cube.vertex_normal_buffer.itemSize = 3;
  cube.vertex_normal_buffer.numItems = 24;

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
    matrix: mat,
    vertex_position_buffer: {},
    vertex_index_buffer: {},
    vertex_normal_buffer: {},
    vertex_color_buffer: {}
  };

  var vertices = [];
  var indices = [];
  var colors = [];
  var normals = [];
  var num_vertices = num_slices * num_stacks;

  var d_angle = 2 * Math.PI / (num_slices - 1);

  for (j = 0; j < num_stacks; j++)
    for (i = 0; i < num_slices; i++) {
      var idx = j * num_slices + i;
      var angle = d_angle * i;
      vertices.push(x + rad * Math.cos(angle));
      vertices.push(y + rad * Math.sin(angle));
      vertices.push(z + j * height / (num_stacks - 1));

      normals.push(Math.cos(angle));
      normals.push(Math.sin(angle));
      normals.push(0.0);

      colors = colors.concat(color);
    }
  // now create the index array

  num_indices = (num_stacks - 1) * 6 * (num_slices + 1);

  for (j = 0; j < num_stacks - 1; j++)
    for (i = 0; i <= num_slices; i++) {
      var mi = i % num_slices;
      var mi2 = (i + 1) % num_slices;
      indices.push((j + 1) * num_slices + mi);
      indices.push(j * num_slices + mi); // mesh[j][mi]
      indices.push((j) * num_slices + mi2);
      indices.push((j + 1) * num_slices + mi);
      indices.push((j) * num_slices + mi2);
      indices.push((j + 1) * num_slices + mi2);
    }

  // Initialize the cylinders vertex and color buffer objects
  cylinder.vertex_position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.vertex_position_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  cylinder.vertex_position_buffer.itemSize = 3;
  cylinder.vertex_position_buffer.numItems = num_vertices;

  cylinder.vertex_index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder.vertex_index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  cylinder.vertex_index_buffer.itemSize = 1;
  cylinder.vertex_index_buffer.numItems = num_indices;
  //
  cylinder.vertex_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder.vertex_normal_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  cylinder.vertex_normal_buffer.itemSize = 3;
  cylinder.vertex_normal_buffer.numItems = num_vertices;

  cylinder.vertex_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.vertex_color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  cylinder.vertex_color_buffer.itemSize = 4;
  cylinder.vertex_color_buffer.numItems = num_vertices;

  return cylinder;
}

function createSphere(x, y, z, rad, color, num_stacks, num_slices) {
  mat = mat4.create();
  mat4.identity(mat);

  var sphere = {
    matrix: mat,
    vertex_position_buffer: {},
    vertex_index_buffer: {},
    vertex_color_buffer: {},
  };

  var vertices = [];
  var indices = [];
  var normals = [];
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
      normals.push(-x1)
      normals.push(-y1)
      normals.push(-z1)
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
  sphere.vertex_index_buffer.itemSize = 1;
  sphere.vertex_index_buffer.numItems = num_indices;

  sphere.vertex_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.vertex_normal_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  sphere.vertex_normal_buffer.itemSize = 3;
  sphere.vertex_normal_buffer.numItems = num_vertices;

  sphere.vertex_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertex_color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  sphere.vertex_color_buffer.itemSize = 4;
  sphere.vertex_color_buffer.numItems = num_colors;

  return sphere;
}
