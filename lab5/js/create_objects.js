/**
 * Date: 3/15/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 3
 * Description: Javascript file used to create objects for lab 3.
 **/
const GREEN = [0.329, 0.686, 0.196, 1];
const BLUE = [0.274, 0.533, 0.7725, 1];



// Takes data from input and returns a object with position. index, normal,
// and textureCoord data.  ambient, diffuse specular and shininess values are
// assigned standard values, and color buffer is empty.
function buildLoadedObject(objectData){

    var obj = {
        matrix: mat,
        vertex_position_buffer: {},
        vertex_index_buffer: {},
        vertex_normal_buffer: {},
        vertex_color_buffer: {},
        vertex_texture_buffer: {},
        ambient_coef: 0.2,
        diffuse_coef: 0.6,
        specular_coef: 0.1,
        shininess: 64
    };

    console.log(" in hand LoadedTeapot");
    obj.vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(objectData.vertexPositions),gl.STATIC_DRAW);
    obj.vertex_position_buffer.itemSize=3;
    obj.vertex_position_buffer.numItems=objectData.vertexPositions.length/3;

    obj.vertex_normal_buffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  obj.vertex_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectData.vertexNormals), gl.STATIC_DRAW);
    obj.vertex_normal_buffer.itemSize=3;
    obj.vertex_normal_buffer.numItems= objectData.vertexNormals.length/3;

    // obj.vertex_texture_coord_buffer=gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertex_texture_coord_buffer);
    // gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(objectData.vertexTextureCoords),
	// 	  gl.STATIC_DRAW);
    // obj.vertex_texture_coord_buffer.itemSize=2;
    // obj.vertex_texture_coord_buffer.numItems=objectData.vertexTextureCoords.length/2;

    obj.vertex_index_buffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(objectData.indices), gl.STATIC_DRAW);
    obj.vertex_index_buffer.itemSize=1;
    obj.vertex_index_buffer.numItems=objectData.indices.length;

    obj.vertex_index_buffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(objectData.indices), gl.STATIC_DRAW);
    obj.vertex_index_buffer.itemSize=1;
    obj.vertex_index_buffer.numItems=objectData.indices.length;

    return obj
}



function createPlane(x, y, z, length, width, thickness, color, ambient_coef, diffuse_coef, specular_coef, shininess){
    mat = mat4.create();
    mat4.identity(mat);

    var plane = {
        matrix: mat,
        vertex_position_buffer: {},
        vertex_index_buffer: {},
        vertex_normal_buffer: {},
        vertex_color_buffer: {},
        ambient_coef: ambient_coef,
        diffuse_coef: diffuse_coef,
        specular_coef: specular_coef,
        shininess: shininess
    };

    var vertices = [];
    var indices = [];
    var normals = [];
    var colors = [];

    // Draw the vertices
    // Front Face
    vertices.push(x - length); //x
    vertices.push(y - width); //y
    vertices.push(z + thickness); //z

    vertices.push(x + length); //x
    vertices.push(y - width); //y
    vertices.push(z + thickness); //z

    vertices.push(x + length); //x
    vertices.push(y + width); //y
    vertices.push(z + thickness); //z

    vertices.push(x - length); //x
    vertices.push(y + width); //y
    vertices.push(z + thickness); //z

    // Back Face
    vertices.push(x - length); //x
    vertices.push(y - width); //y
    vertices.push(z - thickness); //z

    vertices.push(x - length); //x
    vertices.push(y + width); //y
    vertices.push(z - thickness); //z

    vertices.push(x + length); //x
    vertices.push(y + width); //y
    vertices.push(z - thickness); //z

    vertices.push(x + length); //x
    vertices.push(y - width); //y
    vertices.push(z - thickness); //z

    // Top Face
    vertices.push(x - length); //x
    vertices.push(y + width); //y
    vertices.push(z - thickness); //z

    vertices.push(x - length); //x
    vertices.push(y + width); //y
    vertices.push(z + thickness); //z

    vertices.push(x + length); //x
    vertices.push(y + width); //y
    vertices.push(z + thickness); //z

    vertices.push(x + length); //x
    vertices.push(y + width); //y
    vertices.push(z - thickness); //z

    // Bottom Face
    vertices.push(x - length); //x
    vertices.push(y - width); //y
    vertices.push(z - thickness); //z

    vertices.push(x + length); //x
    vertices.push(y - width); //y
    vertices.push(z - thickness); //z

    vertices.push(x + length); //x
    vertices.push(y - width); //y
    vertices.push(z + thickness); //z

    vertices.push(x - length); //x
    vertices.push(y - width); //y
    vertices.push(z + thickness); //z

    // Right Face
    vertices.push(x + length); //x
    vertices.push(y - width); //y
    vertices.push(z - thickness); //z

    vertices.push(x + length); //x
    vertices.push(y + width); //y
    vertices.push(z - thickness); //z

    vertices.push(x + length); //x
    vertices.push(y + width); //y
    vertices.push(z + thickness); //z

    vertices.push(x + length); //x
    vertices.push(y - width); //y
    vertices.push(z + thickness); //z

    // Left Face
    vertices.push(x - length); //x
    vertices.push(y - width); //y
    vertices.push(z - thickness); //z

    vertices.push(x - length); //x
    vertices.push(y - width); //y
    vertices.push(z + thickness); //z

    vertices.push(x - length); //x
    vertices.push(y + width); //y
    vertices.push(z + thickness); //z

    vertices.push(x - length); //x
    vertices.push(y + width); //y
    vertices.push(z - thickness); //z

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
    indices = [ 0, 1, 2, 0, 2, 3,       // Front face
                4, 5, 6, 4, 6, 7,       // Back face
                8, 9, 10, 8, 10, 11,    // Top face
                12, 13, 14, 12, 14, 15, // Bottom face
                16, 17, 18, 16, 18, 19, // Right face
                20, 21, 22, 20, 22, 23  // Left face
    ];
    // Add the vertex colors
    for (var i = 0; i < 24; i++) {
        colors = colors.concat(color);
    }

    // Create Buffer Objects
    plane.vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    plane.vertex_position_buffer.itemSize = 3;
    plane.vertex_position_buffer.numItems = 24;

    plane.vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    plane.vertex_index_buffer.itemSize = 1;
    plane.vertex_index_buffer.numItems = 36;

    plane.vertex_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.vertex_normal_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    plane.vertex_normal_buffer.itemSize = 3;
    plane.vertex_normal_buffer.numItems = 24;

    plane.vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertex_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    plane.vertex_color_buffer.itemSize = 4;
    plane.vertex_color_buffer.numItems = 24;

    return plane;
}

function createCube(x, y, z, rad, color, ambient_coef, diffuse_coef, specular_coef, shininess) {
    mat = mat4.create();
    mat4.identity(mat);

    var cube = {
        matrix: mat,
        vertex_position_buffer: {},
        vertex_index_buffer: {},
        vertex_normal_buffer: {},
        vertex_texture_coord_buffer: {},
        ambient_coef: ambient_coef,
        diffuse_coef: diffuse_coef,
        specular_coef: specular_coef,
        shininess: shininess
    };

    var vertices = [];
    var indices = [];
    var normals = [];
    var colors = [];

    // Draw the vertices
    // Front Face
    vertices.push(x - rad); //x
    vertices.push(y - rad); //y
    vertices.push(z + rad); //z

    vertices.push(x + rad); //x
    vertices.push(y - rad); //y
    vertices.push(z + rad); //z

    vertices.push(x + rad); //x
    vertices.push(y + rad); //y
    vertices.push(z + rad); //z

    vertices.push(x - rad); //x
    vertices.push(y + rad); //y
    vertices.push(z + rad); //z

    // Back Face
    vertices.push(x - rad); //x
    vertices.push(y - rad); //y
    vertices.push(z - rad); //z

    vertices.push(x - rad); //x
    vertices.push(y + rad); //y
    vertices.push(z - rad); //z

    vertices.push(x + rad); //x
    vertices.push(y + rad); //y
    vertices.push(z - rad); //z

    vertices.push(x + rad); //x
    vertices.push(y - rad); //y
    vertices.push(z - rad); //z

    // Top Face
    vertices.push(x - rad); //x
    vertices.push(y + rad); //y
    vertices.push(z - rad); //z

    vertices.push(x - rad); //x
    vertices.push(y + rad); //y
    vertices.push(z + rad); //z

    vertices.push(x + rad); //x
    vertices.push(y + rad); //y
    vertices.push(z + rad); //z

    vertices.push(x + rad); //x
    vertices.push(y + rad); //y
    vertices.push(z - rad); //z

    // Bottom Face
    vertices.push(x - rad); //x
    vertices.push(y - rad); //y
    vertices.push(z - rad); //z

    vertices.push(x + rad); //x
    vertices.push(y - rad); //y
    vertices.push(z - rad); //z

    vertices.push(x + rad); //x
    vertices.push(y - rad); //y
    vertices.push(z + rad); //z

    vertices.push(x - rad); //x
    vertices.push(y - rad); //y
    vertices.push(z + rad); //z

    // Right Face
    vertices.push(x + rad); //x
    vertices.push(y - rad); //y
    vertices.push(z - rad); //z

    vertices.push(x + rad); //x
    vertices.push(y + rad); //y
    vertices.push(z - rad); //z

    vertices.push(x + rad); //x
    vertices.push(y + rad); //y
    vertices.push(z + rad); //z

    vertices.push(x + rad); //x
    vertices.push(y - rad); //y
    vertices.push(z + rad); //z

    // Left Face
    vertices.push(x - rad); //x
    vertices.push(y - rad); //y
    vertices.push(z - rad); //z

    vertices.push(x - rad); //x
    vertices.push(y - rad); //y
    vertices.push(z + rad); //z

    vertices.push(x - rad); //x
    vertices.push(y + rad); //y
    vertices.push(z + rad); //z

    vertices.push(x - rad); //x
    vertices.push(y + rad); //y
    vertices.push(z - rad); //z

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
    indices = [ 0, 1, 2, 0, 2, 3,       // Front face
                4, 5, 6, 4, 6, 7,       // Back face
                8, 9, 10, 8, 10, 11,    // Top face
                12, 13, 14, 12, 14, 15, // Bottom face
                16, 17, 18, 16, 18, 19, // Right face
                20, 21, 22, 20, 22, 23  // Left face
    ];

    var texture_coords = [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0
  ];

    // // Add the vertex colors
    // for (var i = 0; i < 24; i++) {
    //     colors = colors.concat(color);
    // }

    // Create Buffer Objects
    cube.vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cube.vertex_position_buffer.itemSize = 3;
    cube.vertex_position_buffer.numItems = 24;

    cube.vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    cube.vertex_index_buffer.itemSize = 1;
    cube.vertex_index_buffer.numItems = 36;

    cube.vertex_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertex_normal_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    cube.vertex_normal_buffer.itemSize = 3;
    cube.vertex_normal_buffer.numItems = 24;

    cube.vertex_texture_coord_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_texture_coord_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coords), gl.STATIC_DRAW);
    cube.vertex_texture_coord_buffer.itemSize = 2;
    cube.vertex_texture_coord_buffer.numItems = 24;

    return cube;
}

// Return a cylinder with the bottom centered at x,y,z
// num_stacks : the resolution of circles
function createCylinder(x, y, z, rad, height, color, num_stacks, num_slices, ambient_coef, diffuse_coef, specular_coef, shininess) {
    // Initialize the tranformation matrix
    mat = mat4.create();
    mat4.identity(mat);

    var cylinder = {
        matrix: mat,
        vertex_position_buffer: {},
        vertex_index_buffer: {},
        vertex_normal_buffer: {},
        vertex_color_buffer: {},
        ambient_coef: ambient_coef,
        diffuse_coef: diffuse_coef,
        specular_coef: specular_coef,
        shininess: shininess
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

    for (j = 0; j < num_stacks - 1; j++) {
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

function createSphere(x, y, z, rad, color, num_stacks, num_slices, ambient_coef, diffuse_coef, specular_coef, shininess) {
    mat = mat4.create();
    mat4.identity(mat);

    var sphere = {
        matrix: mat,
        vertex_position_buffer: {},
        vertex_index_buffer: {},
        // vertex_color_buffer: {},
        ambient_coef: ambient_coef,
        diffuse_coef: diffuse_coef,
        specular_coef: specular_coef,
        shininess: shininess
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
            normals.push(x1);
            normals.push(y1);
            normals.push(z1);
            // colors = colors.concat(color);
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

    // sphere.vertex_color_buffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertex_color_buffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // sphere.vertex_color_buffer.itemSize = 4;
    // sphere.vertex_color_buffer.numItems = num_colors;

    return sphere;
}
